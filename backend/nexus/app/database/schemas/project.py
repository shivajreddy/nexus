from datetime import datetime
from typing import Literal

from pydantic import BaseModel

"""
Schema for `project`
Each of the document is the giant data structure that will hold every data point related to a house(i.e., project)
"""


class Project(BaseModel):
    project_uid: str

    # company-wide-data
    contract_date: str

    # department-specific-data
    dept_pvt_teclab: 'DepartmentSpecificTecLab'
    dept_pvt_sales: 'DepartmentSpecificSales'


class DepartmentSpecificTecLab(BaseModel):
    contract_type: Literal["SPEC", "Permit Hold", "Contract"]
    drafter: str
    assigned_on: str
    finished_on: str


class DepartmentSpecificSales(BaseModel):
    salesman: str
    selections_finished_on: datetime

