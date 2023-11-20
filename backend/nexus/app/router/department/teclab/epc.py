import csv
import os
import uuid
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll
from app.database.schemas.department_data import NewEPCLot, UpdateEPCLot, EPCData
from app.database.schemas.project import Project, TecLabProjectData, SalesProjectData
from app.email.setup import send_email_with_given_message_and_attachment
from app.security.oauth2 import get_current_user_data

"""
TECLAB/EPC endpoint
"""

router = APIRouter(prefix="/department/teclab/epc")

"""
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if "project_uid" in project["project_info"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                if "teclab_data" in project and "epc_data" in project["teclab_data"]:
                    final_object.update(project["teclab_data"]["epc_data"])
                    result.append(final_object)
                else:
                    print("doc without epc_data", project)

            else:
                print(doc["_id"])
                print("doc without project_info or project_uid", project)
        return result
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
# """


# """
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            final_object = {
                "project_uid": doc["project_info"]["project_uid"],
                "community": doc["project_info"]["community"],
                "section_number": doc["project_info"]["section"],
                "lot_number": doc["project_info"]["lot_number"]
            }
            final_object.update(project["teclab_data"]["epc_data"])
            result.append(final_object)
        return result
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# """


@router.get(
    path='/get/{project_uid}',
    # response_model=
    dependencies=[Depends(get_current_user_data)])
def get_epc_data_with_project_uid(project_uid: str):
    target_project = None
    for doc in list(projects_coll.find()):
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if project["project_info"]["project_uid"] == project_uid:
            target_project = project
            continue

    if not target_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"{project_uid} not found"
        )

    # return target_project["teclab_data"]["epc_data"]
    result_project = {
        "project_info": target_project["project_info"],
        "epc_data": target_project["teclab_data"]["epc_data"]
    }
    return result_project


# @router.post('/new', dependencies=[Depends(get_current_user_data)])
# def add_teclab_data_to_project(lot_data: NewEPCLot):
#     # 1. create project_uid
#     new_project_uid = uuid.uuid4()
#     new_project: Project = Project(project_uid=str(new_project_uid),
#                                    created_at=datetime.now(),
#                                    contract_type=lot_data.epc_data.contract_type,
#                                    contract_date=lot_data.epc_data.contract_date,
#                                    teclab_data=TecLabProjectData(epc_data=lot_data.epc_data),
#                                    sales_data=SalesProjectData())
#
#     # 2. Add to database
#     doc_id = projects_coll.insert_one(new_project.model_dump())
#     print(doc_id)
#
#     return {"successfully added new project": new_project}


@router.patch('/edit', dependencies=[Depends(get_current_user_data)])
def update_lot(lot_data: UpdateEPCLot):
    # Check if the project exists
    existing_project = projects_coll.find_one({"project_uid": lot_data.project_uid})

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{lot_data.project_uid} doesn't exist"
        )

    # Update the project in the database
    result = projects_coll.update_one(
        {"project_uid": lot_data.project_uid},
        {"$set": {"teclab_data.epc_data": lot_data.epc_data.model_dump()}}
    )

    print("result=", result)
    print("Matched Count:", result.matched_count)
    print("Modified Count:", result.modified_count)

    return {"message": f"Project {lot_data.project_uid} updated successfully"}
