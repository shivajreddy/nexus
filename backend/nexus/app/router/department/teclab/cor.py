"""
TECLAB/cor endpoint
"""
from fastapi import APIRouter

from app.database.database import projects_coll
from app.database.schemas.department_data import CORData
from app.router.utils.find_project import find_project

router = APIRouter(prefix="/department/teclab/cor")


@router.get('/{project_uid}')
def get_the_cor_data(project_uid: str):
    project = find_project(project_uid)
    # print("Project :: ", project)

    cor_data = project["teclab_data"]["cor_data"]
    print("cor_data :: ", cor_data)

    return cor_data
    # return "Found it"


@router.patch('/db')
def temp_to_modify_the_db():
    # {'project_info.project_uid': '826a5f29-ab9f-4d44-aa84-5659ffe9b948'}
    target_project_uid = '826a5f29-ab9f-4d44-aa84-5659ffe9b948'
    p = find_project(target_project_uid)
    print(p)
    cor_data = CORData(
        product="Acton",
        elevation="",
        # locations=[""],
        # categories=[""],
        custom_notes=""
    )
    print("going to set this", cor_data.model_dump())
    projects_coll.update_one({"project_info.project_uid": target_project_uid}, {"$set": {"teclab_data.cor_data": cor_data.model_dump()}})
    # projects_coll.update_many({}, )
    return "DB MODIFIED"
