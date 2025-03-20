import os
import json
from loguru import logger
from pathlib import Path
import asyncio
from db.config import db_session, init_db
from problems.models import Problem, Tag
from sqlalchemy import select


DATA_DIR = Path(__file__).parent.parent.parent.parent / "data"
PROBLEMS_FILE = DATA_DIR / "leetcode_problems.json"
PROBLEMS_DIR = DATA_DIR / "leetcode_problems"


def get_all_problems():
    problems = []
    with open(PROBLEMS_FILE, "r") as f:
        problems = json.load(f)

    for problem in problems:
        problem = Problem(
            name=problem["problem"].split(".")[1],
            difficulty=problem["difficulty"],
            acceptance_rate=float(problem["acceptance_rate"].split("%")[0]),
            link=problem["link"],
        )

    print(len(problems))


async def add_problems_to_db():
    """
    Reads problems from the JSON file and adds them to the database in one operation.
    Creates any missing tags as needed and reads additional problem details from individual files.
    """
    try:
        # Initialize the database tables first
        logger.info("Initializing database...")
        await init_db()

        logger.info(f"Reading problems from {PROBLEMS_FILE}...")
        if not PROBLEMS_FILE.exists():
            logger.error(f"Problems file not found: {PROBLEMS_FILE}")
            return

        with open(PROBLEMS_FILE, "r") as f:
            problem_data = json.load(f)

        logger.info(f"Found {len(problem_data)} problems in JSON file")

        if not PROBLEMS_DIR.exists():
            logger.error(f"Problems directory not found: {PROBLEMS_DIR}")
            return

        async with db_session() as session:
            # First, collect all unique tags from individual problem files
            all_tags = set()
            problem_details = {}

            logger.info("Processing problem detail files...")
            for p_data in problem_data:
                try:
                    # Format the filename correctly
                    problem_number = p_data["problem"].split(".")[0].strip()
                    problem_filename = f"{problem_number}_{p_data['problem'].replace(' ', '_')}.json"
                    problem_file_path = PROBLEMS_DIR / problem_filename

                    problem_name = p_data["problem"].split(".")[1].strip()

                    # Skip if problem file doesn't exist
                    if not problem_file_path.exists():
                        logger.warning(
                            f"Problem file not found: {problem_file_path}")
                        continue

                    # Read problem details from individual file
                    with open(problem_file_path, "r") as detail_file:
                        details = json.load(detail_file)
                        problem_details[problem_name] = details

                        # Extract tags from the problem file
                        if "tags" in details:
                            for tag_info in details["tags"]:
                                all_tags.add(tag_info["name"])
                except Exception as e:
                    logger.error(
                        f"Error processing problem {p_data.get('problem', 'unknown')}: {str(e)}")

            logger.info(f"Found {len(all_tags)} unique tags")

            # Get existing tags or create new ones
            existing_tags = {}
            for tag_name in all_tags:
                try:
                    result = await session.execute(select(Tag).filter(Tag.name == tag_name))
                    tag = result.scalar_one_or_none()
                    if not tag:
                        logger.info(f"Creating new tag: {tag_name}")
                        tag = Tag(name=tag_name)
                        session.add(tag)
                    existing_tags[tag_name] = tag
                except Exception as e:
                    logger.error(f"Error processing tag {tag_name}: {str(e)}")

            # Ensure tags are saved before associating with problems
            logger.info("Saving tags to database...")
            await session.flush()

            # Create problem objects with associated tags
            problems_added = 0
            logger.info("Adding problems to database...")
            for p_data in problem_data:
                try:
                    problem_name = p_data["problem"].split(".")[1].strip()

                    # Skip if problem details not found
                    if problem_name not in problem_details:
                        logger.warning(
                            f"No details found for problem: {problem_name}")
                        continue

                    # Check if problem already exists
                    result = await session.execute(
                        select(Problem).filter(Problem.name == problem_name)
                    )
                    if result.scalar_one_or_none():
                        logger.info(f"Problem already exists: {problem_name}")
                        continue  # Skip if problem already exists

                    details = problem_details[problem_name]

                    # Get tags for this problem
                    problem_tags = []
                    if "tags" in details:
                        for tag_info in details["tags"]:
                            if tag_info["name"] in existing_tags:
                                problem_tags.append(
                                    existing_tags[tag_info["name"]])

                    # Parse acceptance rate (remove % sign and convert to float)
                    acceptance_rate = float(
                        p_data["acceptance_rate"].replace("%", ""))

                    # Create new problem with associated tags
                    problem = Problem(
                        name=problem_name,
                        difficulty=p_data["difficulty"],
                        acceptance_rate=acceptance_rate,
                        description=details.get("description", ""),
                        link=p_data["link"],
                        tags=problem_tags
                    )
                    session.add(problem)
                    problems_added += 1

                    if problems_added % 100 == 0:
                        logger.info(
                            f"Added {problems_added} problems so far...")
                except Exception as e:
                    logger.error(
                        f"Error adding problem {p_data.get('problem', 'unknown')}: {str(e)}")

            logger.info(
                f"Successfully added {problems_added} problems to the database")

            await session.commit()

    except Exception as e:
        logger.error(f"Error in add_problems_to_db: {str(e)}")
        raise

# For command-line execution
if __name__ == "__main__":
    asyncio.run(add_problems_to_db())
