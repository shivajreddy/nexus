"""
TECLAB/cor endpoint
"""
from fastapi import APIRouter

from app.database.database import projects_coll
from app.database.schemas.department_data import CORData, UpdateCORData, QueryCOR
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


@router.post('/')
def update_the_cor_data(project_cor_data: UpdateCORData):
    project = find_project(project_cor_data.project_uid)
    print("Project :: ", project)

    projects_coll.update_one({"project_info.project_uid": project_cor_data.project_uid},
                             {"$set": {"teclab_data.cor_data": project_cor_data.cor_data.model_dump()}})

    return "success"


@router.post('/find')
def query_projects(search_data: QueryCOR):
    print("given searchData :::::", search_data)

    all_projects = projects_coll.find()
    result = []

    for project in all_projects:
        if (
                project["teclab_data"]["cor_data"]["product"] in search_data.products or
                project["teclab_data"]["cor_data"]["elevation"] in search_data.elevations or
                any(location in search_data.locations for location in
                    project["teclab_data"]["cor_data"]["locations"]) or
                any(category in search_data.categories for category in project["teclab_data"]["cor_data"]["categories"])
        ):
            result.append({"cor_data": project["teclab_data"]["cor_data"], "project_info": project["project_info"]})

    print("result =", list(result))
    return list(result)


@router.patch('/db')
def temp_to_modify_the_db():
    empty_cor_data = CORData(
        product="",
        elevation="",
        locations=[],
        categories=[],
        custom_notes=""
    )
    projects_coll.update_many({}, {
        "$set": {"teclab_data.cor_data": empty_cor_data.model_dump()}
    })

    # # {'project_info.project_uid': '826a5f29-ab9f-4d44-aa84-5659ffe9b948'}
    # target_project_uid = '826a5f29-ab9f-4d44-aa84-5659ffe9b948'
    # p = find_project(target_project_uid)
    # print(p)
    # cor_data = CORData(
    #     product="Acton",
    #     elevation="",
    #     # locations=[""],
    #     # categories=[""],
    #     custom_notes=""
    # )
    # print("going to set this", cor_data.model_dump())
    # projects_coll.update_one({"project_info.project_uid": target_project_uid},
    #                          {"$set": {"teclab_data.cor_data": cor_data.model_dump()}})
    # projects_coll.update_many({}, )
    return "DB MODIFIED"
