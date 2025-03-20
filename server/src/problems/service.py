from enum import Enum
from pydantic import BaseModel, Field
from .models import Problem


class SortOrder(str, Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"
    NONE = "none"


class FilterForProblem(BaseModel):
    tags: list[str] = Field(default_factory=list)
    difficulty: list[str] = Field(default_factory=list)
    acceptance_sort: SortOrder = Field(default=SortOrder.NONE)
    limit: int = Field(default=40, ge=1)
    page: int = Field(default=1, ge=1)
    first_query: bool = Field(default=False)

    class Config:
        from_attributes = True
        frozen = True


class ProblemNotFoundError(Exception):
    def __init__(self, problem_id: str):
        self.problem_id = problem_id
        super().__init__(f"Problem with id {problem_id} not found")


class ProblemService:

    async def get_problems_by_filter(self, filter: FilterForProblem):
        return await Problem.get_problems_by_filter(
            tags=filter.tags,
            difficulty=filter.difficulty,
            acceptance_sort=filter.acceptance_sort,
            limit=filter.limit,
            page=filter.page
        )

    async def get_problem_by_public_id(self, problem_id: str):
        """
        Retrieves a problem by its public ID.

        Args:
            problem_id (str): The public ID of the problem to retrieve.

        Raises:
            ProblemNotFoundError: If no problem is found with the given public ID.

        Returns:
            Problem: The problem associated with the given public ID.
        """
        problem = await Problem.get_by_public_id(problem_id)
        if problem is None:
            raise ProblemNotFoundError(problem_id)
        return problem
