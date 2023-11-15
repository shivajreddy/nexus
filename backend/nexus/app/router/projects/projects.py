"""
Projects endpoint
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.schemas.project import TargetProject, Project, NewProject
from app.security.oauth2 import get_current_user_data
from app.database.database import projects_coll, client, eagle_data_coll, db

router = APIRouter(prefix="/projects")


@router.get('/temp')
def temp_func():
    # projects_coll = client["nexus"]["projects"]
    for doc in projects_coll.find():
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if "project_info" not in project or "project_id" not in project["project_info"]:
            print(project)


@router.post('/new', dependencies=[Depends(get_current_user_data)])
def new_project(project_details: NewProject):
    print("given project", project_details.model_dump())
    # find duplicates
    # create the project_id
    # eagle_data_coll = client["nexus"]["eagle-data"]
    # projects_coll = client["nexus"]["projects"]
    s = project_details.section
    l = project_details.lot_number

    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    community_codes = communities_doc["community_codes"]
    c1 = project_details.community
    c = next((item[1] for item in community_codes if item[0] == c1), "")

    new_project_id = c + "-" + s + "-" + l

    for doc in projects_coll.find():
        # project: Project = {k: v for (k, v) in doc.items() if k != "_id"}
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if project["project_info"]["project_id"] == new_project_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"{new_project_id} already exist"
            )

    # TODO: add new project

    # return success result
    return {"result": "Success",
            "new_project_id": new_project_id,
            "community_code": c,
            "section_number": s,
            "lot_number": l
            }


@router.post('/', dependencies=[Depends(get_current_user_data)])
def get_all_projects(target_project: TargetProject):
    print("given project", target_project.model_dump())

    # search for projects in mongodb
    result = []

    # nothing is selected
    if not target_project.community and not target_project.section and not target_project.lot_number:
        # get all projects
        for doc in projects_coll.find():
            # project: Project = {k: v for (k, v) in doc.items() if k != "_id"}
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            result.append(project["project_id"])

            # final_object = {"project_uid": doc["project_uid"]}
            # if "teclab_data" in project and "epc_data" in project["teclab_data"]:
            #     final_object.update(project["teclab_data"]["epc_data"])
            #     result.append(final_object)
            # else:
            #     print("doc without epc_data", project)
        return result

    return result


@router.get("/find")
def find_dup_id():
    all_ids = set()
    all_ids_full = []
    # db = client["nexus"]
    # projects_coll = db["projects"]
    for doc in projects_coll.find():
        pid = doc["project_id"]
        all_ids_full.append(pid)
        all_ids.add(pid)
    return [len(all_ids_full), len(all_ids)]
