"""
Projects endpoint
"""

from typing import List

from fastapi import APIRouter, Depends

from app.database.schemas.project import TargetProject
from app.security.oauth2 import get_current_user_data

router = APIRouter(prefix="/projects")


@router.post('/', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_projects(target_project: TargetProject):
    print("given project", target_project.model_dump())
    # search for projects in mongodb
    return [{"hi": "there"}]
