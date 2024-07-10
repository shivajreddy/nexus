from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from app.database.schemas.common.schema import Note

""" 
:: TEC-LAB ::
This schema file represents schema of every data that is
related to teclab for a project
"""
class Product(BaseModel):
    product_name: str


class UpdateProduct(BaseModel):
    target_product_name: str
    new_product_name: str


class CoreModel(BaseModel):
    core_model_name: str


class UpdateCoreModel(BaseModel):
    target_core_model_name: str
    new_core_model_name: str


class Elevation(BaseModel):
    elevation_name: str


class UpdateElevation(BaseModel):
    target_elevation_name: str
    new_elevation_name: str

class TaskHomeSiting(BaseModel):
    timeline_id: int
    # HomeSiting
    homesiting_completed_by: Optional[str] = None
    homesiting_completed_on: Optional[str] = None

class TaskDrafting(BaseModel):
    timeline_id: int
    # Drafting
    drafting_drafter: Optional[str] = None
    drafting_assigned_on: Optional[datetime] = None
    drafting_finished: Optional[datetime] = None

class TaskEngineering(BaseModel):
    timeline_id: int
    # Engineering
    engineering_engineer: Optional[str] = None
    engineering_sent: Optional[datetime] = None
    engineering_received: Optional[datetime] = None

class TaskPlat(BaseModel):
    timeline_id: int
    # Plat
    plat_engineer: Optional[str] = None
    plat_sent: Optional[datetime] = None
    plat_received: Optional[datetime] = None

class TaskPermitting(BaseModel):
    timeline_id: int
    # Permitting
    permitting_county_name: Optional[str] = None
    permitting_submitted: Optional[datetime] = None
    permitting_received: Optional[datetime] = None

class TaskBuildByPlans(BaseModel):
    timeline_id: int
    # Build By Plans
    bbp_posted: Optional[datetime] = None

class LotInfo(BaseModel):
    # :: lot-info ::
    # status
    lot_status_finished: bool = False
    lot_status_released: bool = False
    # these 3 are moved to project_info now
    # community: Optional[str] = None
    # section_number: Optional[str] = None
    # lot_number: Optional[str] = None
    contract_date: Optional[datetime] = None
    contract_type: Optional[str] = None
    product_name: Optional[str] = None
    elevation_name: Optional[str] = None


class HomeSiting(BaseModel):
    # team specific notes, not department specific notes
    notes: List[Note] = []  
    all_tasks: List[TaskHomeSiting]

class Drafting(BaseModel):
    notes: List[Note] = []  
    all_tasks: List[TaskDrafting]

class Engineering(BaseModel):
    notes: List[Note] = []
    all_tasks: List[TaskEngineering]

class Plat(BaseModel):
    notes: List[Note] = []
    all_tasks: List[TaskPlat] = []

class Permitting(BaseModel):
    notes: List[Note] = []
    all_tasks: List[TaskPermitting] = []

class BuildByPlans(BaseModel):
    notes: List[Note] = []
    all_tasks: List[TaskBuildByPlans] = []



class EPCData(BaseModel):
    # Notes
    notes: Optional[str] = None


class NewEPCLot(BaseModel):
    # project_uid: str
    epc_data: EPCData


class UpdateTECLabData(BaseModel):
    project_uid: str
    epc_data: EPCData


class CORData(BaseModel):
    product: str = ''
    elevation: str = ''
    locations: Optional[List[str]] = []
    categories: Optional[List[str]] = []
    custom_notes: Optional[str] = ''


class UpdateCORData(BaseModel):
    project_id: str
    project_uid: str
    cor_data: 'CORData'


class QueryCOR(BaseModel):
    products: List[str] = []
    elevations: List[str] = []
    locations: List[str] = []
    categories: List[str] = []
