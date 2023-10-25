from fastapi import APIRouter, Depends

from app.database.database import eagle_data_coll
from app.security.oauth2 import get_current_user_data

"""
API endpoint related to eagle data
"""

router = APIRouter(prefix="/eagle")


@router.get(path='/departments', dependencies=[Depends(get_current_user_data)])
def get_all_departments():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    all_departments = departments_doc["departments_names"]
    return all_departments


@router.get(path='/communities', dependencies=[Depends(get_current_user_data)])
def get_all_communities():
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities = communities_doc["all_communities"]
    return all_communities
