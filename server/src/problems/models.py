from typing import Literal
from sqlalchemy import (
    Integer,
    String,
    Float,
    ForeignKey,
    Index,
    func)
from sqlalchemy.orm import (
    relationship,
    joinedload,
    Mapped,
    mapped_column)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select
from db import Base, PublicIDMixin, TimestampMixin, with_session


class ProblemTags(Base, TimestampMixin):
    """
    Represents the association between problems and tags in the database.

    Attributes:
        problem_id (int): The ID of the problem associated with the tag.
        tag_id (int): The ID of the tag associated with the problem.
    """
    __tablename__ = 'problem_tags'
    problem_id: Mapped[int] = mapped_column(
        ForeignKey('problems.id'), primary_key=True)
    tag_id: Mapped[int] = mapped_column(
        ForeignKey('tags.id'), primary_key=True)


class Problem(Base, PublicIDMixin, TimestampMixin):
    """
    Represents a coding problem in the database.

    Attributes:
        name (str): The name of the problem.
        difficulty (str): The difficulty level of the problem (e.g., Easy, Medium, Hard).
        acceptance_rate (float): The acceptance rate of the problem.
        description (str): A detailed description of the problem.
        tags (list[Tag]): A list of tags associated with the problem.
        code_generated (list[ProblemCodeGenerated]): A list of generated code solutions for the problem.
    """
    __tablename__ = 'problems'
    __table_args__ = (
        Index('ix_problems_name', 'name'),
    )

    name: Mapped[str] = mapped_column(String, nullable=False)
    difficulty: Mapped[str] = mapped_column(String, nullable=False)
    acceptance_rate: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    link: Mapped[str] = mapped_column(String, nullable=False)

    tags: Mapped[list["Tag"]] = relationship(
        'Tag', secondary='problem_tags',
        back_populates='problems')
    code_generated: Mapped[list["ProblemCodeGenerated"]] = relationship(
        'ProblemCodeGenerated', back_populates='problem')

    @classmethod
    @with_session()
    async def get_all_problems(cls, session: AsyncSession):
        """
        Retrieves all problems from the database, including their associated tags.

        Args:
            session (AsyncSession): The database session to use for the query.

        Returns:
            list[Problem]: A list of all problems with their associated tags.
        """
        result = await session.execute(
            select(Problem).options(joinedload(Problem.tags))
        )
        problems = result.unique().scalars().all()
        for problem in problems:
            _ = [tag.name for tag in problem.tags]
        return problems

    @classmethod
    @with_session()
    async def find_problem_by_name(cls, session: AsyncSession, name: str):
        """
        Finds a problem by its name.

        Args:
            session (AsyncSession): The database session to use for the query.
            name (str): The name of the problem to search for.

        Returns:
            Problem | None: The problem if found, otherwise None.
        """
        result = await session.execute(
            select(Problem).filter(Problem.name == name).options(
                joinedload(Problem.tags)
            )
        )
        return result.unique().scalar_one_or_none()

    @classmethod
    @with_session()
    async def search_problems_with_name(cls, session: AsyncSession, name: str, limit: int = 10):
        """
        Searches for problems that contain the specified name.

        Args:
            session (AsyncSession): The database session to use for the query.
            name (str): The name to search for within problem names.
            limit (int): The maximum number of problems to return.

        Returns:
            list[Problem]: A list of problems that match the search criteria.
        """
        result = await session.execute(
            select(Problem).filter(Problem.name.like(f"%{name}%")).options(
                joinedload(Problem.tags)
            ).limit(limit)
        )
        return result.unique().scalars().all()

    @classmethod
    @with_session()
    async def get_problems_by_tags(cls, session: AsyncSession, tags: list[str]):
        """
        Retrieves problems that are associated with the specified tags.

        Args:
            session (AsyncSession): The database session to use for the query.
            tags (list[str]): A list of tag names to filter problems by.

        Returns:
            list[Problem]: A list of problems associated with the specified tags.
        """
        result = await session.execute(
            select(Problem).join(Problem.tags).filter(Tag.name.in_(tags)).options(
                joinedload(Problem.tags)
            )
        )
        return result.unique().scalars().all()

    @classmethod
    @with_session()
    async def get_problems_by_filter(
            cls,
            session: AsyncSession,
            tags: list[str] = None,
            difficulty: list[str] = None,
            acceptance_sort: Literal['asc', 'desc', 'none'] = 'none',
            limit: int = 10,
            page: int = 1):
        """
        Retrieves problems filtered by various criteria with pagination support.

        This method allows filtering problems by tags and difficulty levels, sorting
        by acceptance rate, and paginating the results.

        Args:
            session (AsyncSession): The database session to use for the query.
            tags (list[str], optional): List of tag names to filter problems by.
            difficulty (list[str], optional): List of difficulty levels to filter by.
            acceptance_sort (Literal['asc', 'desc', 'none'], optional): Sort direction for 
                acceptance rate or 'none' for no sorting. Defaults to 'none'.
            limit (int, optional): Maximum number of problems to return per page. Defaults to 10.
            page (int, optional): Page number to retrieve (1-indexed). Defaults to 1.

        Returns:
            tuple[list[Problem], int]: A tuple containing:
                - List of Problem objects for the requested page
                - Total count of problems matching the filter criteria (before pagination)

        Raises:
            ValueError: If invalid pagination parameters are provided.
        """
        if limit < 1 or page < 1:
            raise ValueError("Limit and page must be positive integers")

        query = select(Problem).options(joinedload(Problem.tags))

        if tags:
            query = query.join(Problem.tags).filter(
                Tag.name.in_(tags)).distinct()

        if difficulty:
            query = query.filter(Problem.difficulty.in_(difficulty))

        if acceptance_sort != 'none':
            if acceptance_sort == 'asc':
                query = query.order_by(Problem.acceptance_rate.asc())
            else:
                query = query.order_by(Problem.acceptance_rate.desc())

        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await session.execute(count_query)
        total_count = total_count_result.scalar_one()

        query = query.limit(limit).offset((page - 1) * limit)

        result = await session.execute(query)
        problems = result.unique().scalars().all()

        return problems, total_count


class Tag(Base, PublicIDMixin, TimestampMixin):
    """
    Represents a tag that can be associated with multiple problems.

    Attributes:
        name (str): The name of the tag.
        problems (list[Problem]): A list of problems associated with the tag.
    """
    __tablename__ = 'tags'
    name: Mapped[str] = mapped_column(String, nullable=False)
    problems: Mapped[list["Problem"]] = relationship(
        'Problem', secondary='problem_tags',
        back_populates='tags')

    @classmethod
    @with_session()
    async def get_all_tags(cls, session: AsyncSession):
        """
        Retrieves all tags from the database.
        """
        return await session.execute(select(Tag))


class ProblemCodeGenerated(Base, PublicIDMixin, TimestampMixin):
    """
    Represents a generated code solution for a problem.

    Attributes:
        solution (str): The generated code solution.
        model (str): The model used to generate the solution.
        language (str): The programming language of the generated solution.
        problem_id (int): The ID of the problem associated with this generated code.
        problem (Problem): The problem associated with this generated code.
    """
    __tablename__ = 'problem_code_generated'

    solution: Mapped[str] = mapped_column(String, nullable=False)
    model: Mapped[str] = mapped_column(String, nullable=False)
    language: Mapped[str] = mapped_column(String, nullable=False)

    problem_id: Mapped[int] = mapped_column(Integer, ForeignKey('problems.id'))
    problem: Mapped["Problem"] = relationship(
        'Problem', back_populates='code_generated')
