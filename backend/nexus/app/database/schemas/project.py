from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel

from app.database.schemas.department_data import EPCData

"""
Schema for `project`
Each of the document is the giant data structure that will hold every data point related to a house(i.e., project)
"""


class Project(BaseModel):
    project_info: 'ProjectInfo'

    meta_info: 'ProjectMetaInfo'

    contract_info: 'ContractInfo'

    # department-specific-data
    teclab_data: 'TecLabProjectData'
    sales_data: 'SalesProjectData'


class ProjectInfo(BaseModel):
    project_uid: str
    project_id: str


class ProjectMetaInfo(BaseModel):
    created_at: datetime
    created_by: str


class ContractInfo(BaseModel):
    # eagle-wide-data
    contract_type: Optional[Literal["SPEC", "Permit & Hold", "Contract"]] = None
    contract_date: Optional[datetime] = None


class TecLabProjectData(BaseModel):
    epc_data: 'EPCData'


class SalesProjectData(BaseModel):
    salesman: Optional[str] = None
    selections_finished_on: Optional[datetime] = None


class TargetProject(BaseModel):
    community: Optional[str] = None
    section: Optional[str] = None
    lot_number: Optional[str] = None


class NewProject(BaseModel):
    community: str
    section: str
    lot_number: str
