from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

"""
All schema for `department-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""


# :: TEC-LAB ::
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


class EPCData(BaseModel):
    # status
    lot_status_finished: bool = False
    lot_status_released: bool = False

    # lot-info
    # these 3 are moved to 'ProjectInfo' now
    # community: Optional[str] = None
    # section_number: Optional[str] = None
    # lot_number: Optional[str] = None

    # Contract Details
    contract_date: Optional[datetime] = None
    contract_type: Optional[str] = None
    product_name: Optional[str] = None
    elevation_name: Optional[str] = None

    # Drafting
    drafting_drafter: Optional[str] = None
    drafting_assigned_on: Optional[datetime] = None
    drafting_finished: Optional[datetime] = None
    drafting_notes: Optional[str] = None

    # Engineering
    engineering_engineer: Optional[str] = None
    engineering_sent: Optional[datetime] = None
    engineering_received: Optional[datetime] = None
    engineering_notes: Optional[str] = None

    # Plat
    plat_engineer: Optional[str] = None
    plat_sent: Optional[datetime] = None
    plat_received: Optional[datetime] = None
    plat_notes: Optional[str] = None

    # Permitting
    permitting_county_name: Optional[str] = None
    permitting_submitted: Optional[datetime] = None
    permitting_received: Optional[datetime] = None
    permitting_notes: Optional[str] = None
    permithold_start: Optional[datetime] = None

    # HomeSiting
    homesiting_requested_on: Optional[datetime] = None
    homesiting_completed_on: Optional[datetime] = None
    homesiting_completed_by: Optional[str] = None
    homesiting_feedback_received_date: Optional[datetime] = None
    homesiting_notes: Optional[str] = None

    # Build By Plans
    bbp_posted: Optional[datetime] = None

    # Notes
    notes: Optional[str] = None


class FOSCData(BaseModel):
    # Status
    lot_status_started: bool = False
    lot_status_finished: bool = False

    # Supervisors
    assigned_pm: Optional[str] = None
    assigned_director: Optional[str] = None

    # Foundation
    foundation_scan_status: bool = False
    foundation_scan_date: Optional[datetime] = None
    foundation_report_status: bool = False
    foundation_reporter: Optional[str] = None
    foundation_report_date: Optional[datetime] = None
    foundation_uploaded:bool = False 
    foundation_needed: bool = True

    # Slab
    slab_scan_status: bool = False 
    slab_scan_date: Optional[datetime] = None
    slab_report_status: bool = False 
    slab_reporter: Optional[str] = None
    slab_report_date: Optional[datetime] = None
    slab_uploaded: bool = False  
    slab_needed: bool = True

    # Frame
    frame_scan_status: bool = False  
    frame_scan_date: Optional[datetime] = None
    frame_report_status: bool = False  
    frame_reporter: Optional[str] = None
    frame_report_date: Optional[datetime] = None
    frame_uploaded: bool = False  
    frame_needed: bool = True

    # MEP
    mep_scan_status: bool = False  
    mep_scan_date: Optional[datetime] = None
    mep_report_status: bool = False  
    mep_reporter: Optional[str] = None
    mep_report_date: Optional[datetime] = None
    mep_uploaded: bool = False
    mep_needed: bool = True

    misc_report_status: bool = False  
    # Misc (warranty, extra)
    misc_scan_status: bool = False  

    # BOC related
    proposed_BOC: Optional[str] = None
    as_built_BOC: Optional[str] = None
    variance_BOC: Optional[str] = None
    field_feedback_notes: Optional[str] = None

    # Notes
    notes: Optional[str] = None


class NewEPCLot(BaseModel):
    # project_uid: str

    epc_data: EPCData


class UpdateTECLabData(BaseModel):
    project_uid: str
    epc_data: EPCData

class UpdateFOSCData(BaseModel):
    project_uid: str
    fosc_data: FOSCData
    homesiting_requested_on: Optional[datetime] = None
    homesiting_completed_on: Optional[datetime] = None
    homesiting_completed_by: Optional[str] = None
    homesiting_feedback_received_date: Optional[datetime] = None

class CORData(BaseModel):
    product: str = ''
    elevation: str = ''
    locations: Optional[List[str]] = Field(default_factory=list)
    categories: Optional[List[str]] = Field(default_factory=list)
    custom_notes: Optional[str] = ''


class UpdateCORData(BaseModel):
    project_id: str
    project_uid: str
    cor_data: 'CORData'


class QueryCOR(BaseModel):
    products: List[str] = Field(default_factory=list)
    elevations: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    categories: List[str] = Field(default_factory=list)


# :: SALES ::

class B(BaseModel):
    pass
