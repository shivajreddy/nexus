import datetime
from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import projects_coll, department_data_coll
from app.database.schemas.project import Project, DepartmentSpecificTecLab, DepartmentSpecificSales
from app.router.department.teclab.teclab import router
from app.security.oauth2 import get_current_user_data
from app.database.schemas.user import User

"""
TECLAB/EPC endpoint
"""

router.prefix += '/epc'


@router.get('/')
async def test_epc(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    return {"testing epc route ok"}


# :: Setup database (delete after setup)
sample_dept_specific_teclab = DepartmentSpecificTecLab(
    contract_type="Contract",
    drafter="shiva",
    assigned_on=datetime.datetime.utcnow().isoformat(),
    finished_on=datetime.datetime.utcnow().isoformat(),
)

sample_dept_specific_sales = DepartmentSpecificSales(
    salesman="emp-121",
    # selections_finished_on=datetime.datetime.utcnow().isoformat(),
    selections_finished_on=datetime.datetime.now(tz=datetime.timezone.utc)
)

sample_project = Project(
    project_uid="PV-05-1",

    # company-wide-data
    contract_date=datetime.datetime.utcnow().isoformat(),

    # department-specific-data
    dept_pvt_teclab=sample_dept_specific_teclab,
    dept_pvt_sales=sample_dept_specific_sales,
)


@router.get('/get')
def get_collection():
    result = []
    for doc in list(projects_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(data)
    return {"all": result}



@router.get('/setup')
def set_up_projects_collection():
    department_data_coll.insert_one()
    # projects_coll.insert_one(sample_project.model_dump())

    return {"done"}
