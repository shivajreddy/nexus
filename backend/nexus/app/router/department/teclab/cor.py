"""
TECLAB/cor endpoint
"""
from fastapi import APIRouter, HTTPException, status
from app.database.database import projects_coll
from app.router.utils.find_project import find_project

router = APIRouter(prefix="/department/teclab/cor")


@router.get('/{project_uid}')
def get_the_cor_data(project_uid: str):
    project = find_project(project_uid)
    print("Project :: ", project)
    return "found it"

