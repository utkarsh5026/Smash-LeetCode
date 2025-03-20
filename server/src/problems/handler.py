from fastapi import APIRouter, Query
from typing import List
from .service import ProblemService, FilterForProblem, SortOrder


router = APIRouter(prefix="/leetcode", tags=["leetcode"])
problems_service = ProblemService()


@router.get("/tags")
async def get_tags():
    return await problems_service.get_all_tags()


@router.get("/problems")
async def get_problems(
    tags: List[str] = Query(default=[]),
    difficulty: List[str] = Query(default=[]),
    acceptance_sort: SortOrder = Query(default=SortOrder.NONE),
    limit: int = Query(default=40, ge=1),
    page: int = Query(default=1, ge=1),
    first_query: bool = Query(default=False)
):
    filter_params = FilterForProblem(
        tags=tags,
        difficulty=difficulty,
        acceptance_sort=acceptance_sort,
        limit=limit,
        page=page,
        first_query=first_query
    )
    problems, total_count = await problems_service.get_problems_by_filter(filter_params)
    return {"problems": problems, "total_count": total_count}


@router.get("/problem/{problem_name}")
async def get_problem(problem_name: str):
    name = " ".join(problem_name.split("_"))
    prob = await problems_service.get_problem_by_name(name)
    return prob


@router.get("/problems/{problem_id}")
async def get_problem_by_id(problem_id: str):
    prob = await problems_service.get_problem_by_public_id(problem_id)
    return prob
