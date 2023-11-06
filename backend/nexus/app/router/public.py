from fastapi import APIRouter

from app.database.database import eagle_data_coll

"""
All public end points - visible to out of eagle
"""

router = APIRouter(prefix="/public")


@router.get('/test')
def test_public():
    return {"Public testing route works"}


@router.get(path='/departments')
def get_all_departments():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    all_departments = departments_doc["departments_names"]
    return all_departments
