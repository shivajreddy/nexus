from fastapi import APIRouter
from app.database import eagle_data_coll

"""
All public end points
"""

router = APIRouter(prefix="/public")


@router.get('/departments')
def get_all_departments_unprotected():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    all_departments = departments_doc["data"]
    all_department_names = []
    for item in all_departments:
        all_department_names.append(item["department_name"])
    return all_department_names
