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
    # these 3 are moved to project_info now
    # community: Optional[str] = None
    # section_number: Optional[str] = None
    # lot_number: Optional[str] = None
    contract_date: Optional[datetime] = None
    contract_type: Optional[str] = None
    product_name: Optional[str] = None
    elevation_name: Optional[str] = None

    # Drafting
    drafting_drafter: Optional[str] = None
    drafting_assigned_on: Optional[datetime] = None
    drafting_finished: Optional[datetime] = None

    # Engineering
    engineering_engineer: Optional[str] = None
    engineering_sent: Optional[datetime] = None
    engineering_received: Optional[datetime] = None

    # Plat
    plat_engineer: Optional[str] = None
    plat_sent: Optional[datetime] = None
    plat_received: Optional[datetime] = None

    # Permitting
    permitting_county_name: Optional[str] = None
    permitting_submitted: Optional[datetime] = None
    permitting_received: Optional[datetime] = None

    # HomeSiting
    homesiting_completed_by: Optional[str] = None
    homesiting_completed_on: Optional[str] = None
    homesiting_requested_on: Optional[str] = None

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
    foundation_scan_status: Optional[bool] = None
    foundation_scan_date: Optional[datetime] = None
    foundation_report_status: Optional[bool] = None
    foundation_reporter: Optional[str] = None
    foundation_report_date: Optional[datetime] = None
    foundation_uploaded: Optional[bool] = None
    foundation_needed: Optional[bool] = True

    # Slab
    slab_scan_status: Optional[bool] = None
    slab_scan_date: Optional[datetime] = None
    slab_report_status: Optional[bool] = None
    slab_reporter: Optional[str] = None
    slab_report_date: Optional[datetime] = None
    slab_uploaded: Optional[bool] = None
    slab_needed: Optional[bool] = True

    # Frame
    frame_scan_status: Optional[bool] = None
    frame_scan_date: Optional[datetime] = None
    frame_report_status: Optional[bool] = None
    frame_reporter: Optional[str] = None
    frame_report_date: Optional[datetime] = None
    frame_uploaded: Optional[bool] = None
    frame_needed: Optional[bool] = True

    # MEP
    mep_scan_status: Optional[bool] = None
    mep_scan_date: Optional[datetime] = None
    mep_report_status: Optional[bool] = None
    mep_reporter: Optional[str] = None
    mep_report_date: Optional[datetime] = None
    mep_uploaded: Optional[bool] = None
    mep_needed: Optional[bool] = True

    # Misc (warranty, extra)
    misc_scan_status: Optional[bool] = None
    misc_report_status: Optional[bool] = None

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
