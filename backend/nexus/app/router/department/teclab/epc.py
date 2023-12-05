from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll, users_coll
from app.database.schemas.department_data import UpdateTECLabData
from app.database.schemas.user import UserInfo
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data

"""
TECLAB/EPC endpoint
"""

router = APIRouter(prefix="/department/teclab/epc")


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
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# """


@router.get(
    path='/get/{project_uid}',
    # response_model=
    dependencies=[Depends(get_current_user_data)])
def get_epc_data_with_project_uid(project_uid: str):
    target_project = find_project(project_uid)

    # return target_project["teclab_data"]["epc_data"]
    result_project = {
        "project_info": target_project["project_info"],
        "epc_data": target_project["teclab_data"]["epc_data"]
    }
    return result_project


@router.post('/edit', dependencies=[Depends(get_current_user_data)])
def update_teclab_data_for_project(new_data: UpdateTECLabData):
    # print("given new_data", new_data)
    # Check if the project exists
    existing_project = projects_coll.find_one({"project_info.project_uid": new_data.project_uid})

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{new_data.project_uid} doesn't exist in Projects"
        )

    # print("existing_project=", existing_project)

    # Update the project in the database
    projects_coll.update_one(
        {"project_info.project_uid": new_data.project_uid},
        {"$set": {"teclab_data.epc_data": new_data.epc_data.model_dump()}}
    )

    return {"message": f"Project {new_data.project_uid} updated successfully"}
