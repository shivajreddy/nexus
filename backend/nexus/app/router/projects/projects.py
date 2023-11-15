"""
Projects endpoint
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.schemas.project import TargetProject, Project, NewProject
from app.security.oauth2 import get_current_user_data
from app.database.database import projects_coll, client, eagle_data_coll, db

router = APIRouter(prefix="/projects")


@router.post('/new', dependencies=[Depends(get_current_user_data)])
def new_project(project_details: NewProject):
    print("given project", project_details.model_dump())
    # find duplicates
    # create the project_id
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
        if project["project_id"] == new_project_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"{new_project_id} already exist"
            )

    # add new project
    # return success result
    return {"result": "Success",
            "new_project_id": new_project_id,
            "community_code": c,
            "section_number": s,
            "lot_number": l
            }


# :: TODO :: reshape the project documents in db with the updated schema
@router.get('/update-project-shape')
def update_project_shape():
    # move to creation info to meta_info and create created by
    # move to contract data to contract info
    return "DONE"


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


@router.get('/update-database')
def update_database():
    # dummy_col = db["dummy"]
    # dummy_col.update_many({}, {"$set": {"new_field_2": "hi"}})

    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]
    community_codes = communities_doc["community_codes"]

    all_ids = set()
    # db = client["nexus"]
    # projects_coll = db["projects"]
    for doc in projects_coll.find():
        c_1 = doc["teclab_data"]["epc_data"]["community"]
        # c = ""
        # for item in community_codes:
        #     if item[0] == c_1:
        #         c = item[1]
        c = next((item[1] for item in community_codes if item[0] == c_1), "")
        s = doc["teclab_data"]["epc_data"]["section_number"]
        l = doc["teclab_data"]["epc_data"]["lot_number"]
        # 1. create the project_id
        unique_id = c + "-" + s + "-" + l
        if unique_id in all_ids:
            print("DUP:", unique_id)
        else:
            all_ids.add(unique_id)

        # 2. set the project_id
        projects_coll.update_one({"_id": doc["_id"]}, {"$set": {"project_id": unique_id}})
    return "DONE"


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
