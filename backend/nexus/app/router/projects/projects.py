"""
Projects endpoint
"""
import uuid
from datetime import datetime
from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.database.schemas.department_data import EPCData, CORData, FOSCData
from app.database.schemas.project import TargetProject, Project, NewProject, ProjectInfo, ProjectMetaInfo, ContractInfo, \
    TecLabProjectData, SalesProjectData
from app.database.schemas.user import User
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


@router.post('/new')
def create_new_project(project_details: NewProject, current_user_data: Annotated[User, Depends(get_current_user_data)]):
    # + 1: make sure that there is no duplicates
    duplicate_project = None
    for doc in projects_coll.find():
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if (
                project["project_info"]["community"] == project_details.community and
                project["project_info"]["section"] == project_details.section and
                project["project_info"]["lot_number"] == project_details.lot_number
        ):
            duplicate_project = project
    print("duplicate_project=", duplicate_project)
    if duplicate_project:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{project_details.community}-{project_details.section}-{project_details.lot_number} already exists"
        )

    print("given project", project_details.model_dump())

    # + 2. create the project_id
    s = project_details.section
    l = project_details.lot_number

    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    community_codes = communities_doc["community_codes"]
    c1 = project_details.community
    c = next((item[1] for item in community_codes if item[0] == c1), "")

    new_project_id = c + "-" + s + "-" + l

    # + 3. add the project to database
    new_project = Project(
        project_info=ProjectInfo(
            project_uid=str(uuid.uuid4()),
            project_id=new_project_id,
            community=project_details.community,
            section=project_details.section,
            lot_number=project_details.lot_number
        ),
        meta_info=ProjectMetaInfo(
            created_at=datetime.now(),
            created_by=current_user_data.username
        ),
        contract_info=ContractInfo(),
        teclab_data=TecLabProjectData(
            epc_data=EPCData(),
            cor_data=CORData(),
            fosc_data=FOSCData()
        ),
        sales_data=SalesProjectData()
    )
    # print("✅ This is the new project-object", new_project)

    projects_coll.insert_one(new_project.model_dump())

    # return success result
    return {"result": "Success", "new_project": new_project.model_dump()}


@router.post('/search', dependencies=[Depends(get_current_user_data)])
def query_projects(target_project: TargetProject):
    print("given details to search for projects", target_project.model_dump())

    # search for projects in mongodb
    result = []

    # nothing is selected, get all projects
    if not target_project.community and not target_project.section and not target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            result.append({
                "project_id": project["project_info"]["project_id"],
                "project_uid": project["project_info"]["project_uid"]
            })
        return result

    # only community is selected
    if target_project.community and not target_project.section and not target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target community
            if project["project_info"]["community"] == target_project.community:
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
        return result

    # only section is selected
    if not target_project.community and target_project.section and not target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target section
            if project["project_info"]["section_number"] == target_project.section:
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
        return result

    # only lot_number is selected
    if not target_project.community and not target_project.section and target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target lot_number
            if project["project_info"]["lot_number"] == target_project.community:
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
        return result

    # community and section is selected
    if target_project.community and target_project.section and not target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target community & section
            if (
                    project["project_info"]["community"] == target_project.community and
                    project["project_info"]["section"] == target_project.section
            ):
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
        return result

    # community and lot_number is selected
    if target_project.community and target_project.lot_number and not target_project.section:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target community & section
            if (
                    project["project_info"]["community"] == target_project.community and
                    project["project_info"]["lot_number"] == target_project.lot_number
            ):
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
        return result

    # all are selected
    if target_project.community and target_project.section and target_project.lot_number:
        for doc in projects_coll.find():
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            # filter for target lot_number
            if (
                    project["project_info"]["community"] == target_project.community and
                    project["project_info"]["section"] == target_project.section and
                    project["project_info"]["lot_number"] == target_project.lot_number
            ):
                result.append({
                    "project_id": project["project_info"]["project_id"],
                    "project_uid": project["project_info"]["project_uid"]
                })
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
