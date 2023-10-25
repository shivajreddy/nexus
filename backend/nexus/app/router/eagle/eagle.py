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


@router.get('/communities', dependencies=[Depends(get_current_user_data)])
def get_all_communities():
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    return communities_doc["all_communities"]


@router.get('/engineers', dependencies=[Depends(get_current_user_data)])
def get_all_engineers():
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    return engineers_doc["all_engineers"]


@router.get('/plat-engineers', dependencies=[Depends(get_current_user_data)])
def get_all_plat_engineers():
    plat_engineers_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    return plat_engineers_doc["all_plat_engineer_names"]


@router.get('/counties', dependencies=[Depends(get_current_user_data)])
def get_all_counties():
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    return counties_doc["all_counties"]


@router.get('/core-models', dependencies=[Depends(get_current_user_data)])
def get_all_core_models():
    core_models_doc = eagle_data_coll.find_one({"table_name": "core_models"})
    return core_models_doc["all_core_model_names"]
