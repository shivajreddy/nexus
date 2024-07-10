from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel

from app.database.schemas.common.schema import Note
from app.database.schemas.department_data import EPCData, CORData
from app.database.schemas.teclab.schema import BuildByPlans, Drafting, Engineering, HomeSiting, LotInfo, Permitting, Plat

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
    community: str
    section: str
    lot_number: str


class ProjectMetaInfo(BaseModel):
    created_at: datetime
    created_by: str


class ContractInfo(BaseModel):
    # eagle-wide-data
    contract_type: Optional[Literal["SPEC", "Permit & Hold", "Contract"]] = None
    contract_date: Optional[datetime] = None


'''
All data of a project that is created/used/modified
by TEC-LAB department
'''
class TecLabProjectData(BaseModel):
    lot_info: LotInfo
    home_siting: HomeSiting
    drafting: Drafting
    engineering: Engineering
    plat_engineering: Plat
    permitting: Permitting
    build_by_plants: BuildByPlans
    # Department specific notes
    project_notes: List[Note] = []


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
