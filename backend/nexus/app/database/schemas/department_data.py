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


# Shape of IHMS entire house data
class IHMSHouseData(BaseModel):
    company_code: Optional[str] = Field(None, alias="COMPANYCODE")
    development_code: Optional[str] = Field(None, alias="DEVELOPMENTCODE")
    house_number: Optional[str] = Field(None, alias="HOUSENUMBER")
    model_code: Optional[str] = Field(None, alias="MODELCODE")
    elevation_code: Optional[str] = Field(None, alias="ELEVATIONCODE")
    remarks: Optional[str] = Field(None, alias="REMARKS")
    block_number: Optional[str] = Field(None, alias="BLOCKNUMBER")
    lot_number: Optional[str] = Field(None, alias="LOTNUMBER")
    comments: Optional[str] = Field(None, alias="COMMENTS")
    jio_number: Optional[str] = Field(None, alias="JIONUMBER")
    unused: Optional[str] = Field(None, alias="UNUSED")
    current_job_start: Optional[str] = Field(None, alias="CURRENTJOBSTART")
    last_job_start: Optional[str] = Field(None, alias="LASTJOBSTART")
    buyer_name: Optional[str] = Field(None, alias="BUYERNAME")
    unused_2: Optional[str] = Field(None, alias="UNUSED_2")
    financing_type: Optional[str] = Field(None, alias="FINANCING_TYPE")
    cost_flag: Optional[str] = Field(None, alias="COSTFLAG")
    building_num: Optional[str] = Field(None, alias="BUILDING_NUM")
    home_phone: Optional[str] = Field(None, alias="HOMEPHONE")
    work_phone: Optional[str] = Field(None, alias="WORKPHONE")
    option_incv_amt: Optional[float] = Field(None, alias="OPTION_INCV_AMT")
    closing_incv_amt: Optional[float] = Field(None, alias="CLOSING_INCV_AMT")
    points_incv_amt: Optional[float] = Field(None, alias="POINTS_INCV_AMT")
    coop_amount: Optional[float] = Field(None, alias="COOP_AMOUNT")
    permit_number: Optional[str] = Field(None, alias="PERMITNUMBER")
    coop_yn: Optional[str] = Field(None, alias="COOP_YN")
    unused_3: Optional[str] = Field(None, alias="UNUSED_3")
    orientation: Optional[str] = Field(None, alias="ORIENTATION")
    loan_num: Optional[str] = Field(None, alias="LOAN_NUM")
    warranty_policy: Optional[str] = Field(None, alias="WARRANTYPOLICY")
    address1: Optional[str] = Field(None, alias="ADDRESS1")
    address2: Optional[str] = Field(None, alias="ADDRESS2")
    address3: Optional[str] = Field(None, alias="ADDRESS3")
    unpacked_house_num: Optional[str] = Field(None, alias="UNPACKEDHOUSENUM")
    broker_amount: Optional[float] = Field(None, alias="BROKER_AMOUNT")
    unused2: Optional[str] = Field(None, alias="UNUSED2")
    upgrade_price: Optional[float] = Field(None, alias="UPGRADEPRICE")
    agent_code: Optional[str] = Field(None, alias="AGENTCODE")
    broker_code: Optional[str] = Field(None, alias="BROKERCODE")
    coop_name: Optional[str] = Field(None, alias="COOP_NAME")
    house_type: Optional[str] = Field(None, alias="HOUSE_TYPE")
    broker_pct: Optional[float] = Field(None, alias="BROKER_PCT")
    lst_chgord_num: Optional[str] = Field(None, alias="LST_CHGORD_NUM")
    pvc8: Optional[str] = Field(None, alias="PVC8")
    deposit_due: Optional[float] = Field(None, alias="DEPOSIT_DUE")
    est_base_price: Optional[float] = Field(None, alias="EST_BASE_PRICE")
    est_options_prc: Optional[float] = Field(None, alias="EST_OPTIONS_PRC")
    est_lot_premium: Optional[float] = Field(None, alias="EST_LOT_PREMIUM")
    salesman_code: Optional[str] = Field(None, alias="SALESMANCODE")
    title_co: Optional[str] = Field(None, alias="TITLE_CO")
    aos_accepted_flag: Optional[str] = Field(None, alias="AOSACCEPTEDFLAG")
    est_upgrade_prc: Optional[float] = Field(None, alias="EST_UPGRADE_PRC")
    release_num: Optional[str] = Field(None, alias="RELEASENUM")
    coop_agent_addr1: Optional[str] = Field(None, alias="COOP_AGENT_ADDR1")
    coop_agent_addr2: Optional[str] = Field(None, alias="COOP_AGENT_ADDR2")
    not_used_2: Optional[str] = Field(None, alias="NOT_USED_2")
    postage: Optional[str] = Field(None, alias="POSTAGE")
    walk_thru_time: Optional[str] = Field(None, alias="WALK_THRU_TIME")
    am_pm: Optional[str] = Field(None, alias="AM_PM")
    unused4: Optional[str] = Field(None, alias="UNUSED4")
    lothold: Optional[str] = Field(None, alias="LOTHOLD")
    wostage: Optional[str] = Field(None, alias="WOSTAGE")
    misc1_field: Optional[str] = Field(None, alias="MISC1_FIELD")
    misc2_field: Optional[str] = Field(None, alias="MISC2_FIELD")
    buyers_name1: Optional[str] = Field(None, alias="BUYERSNAME1")
    buyers_name2: Optional[str] = Field(None, alias="BUYERSNAME2")
    buyers_name3: Optional[str] = Field(None, alias="BUYERSNAME3")
    previous_address1: Optional[str] = Field(None, alias="PREVIOUSADDRESS1")
    previous_address2: Optional[str] = Field(None, alias="PREVIOUSADDRESS2")
    promissory_note1: Optional[str] = Field(None, alias="PROMISSORYNOTE1")
    promissory_note2: Optional[str] = Field(None, alias="PROMISSORYNOTE2")
    promissory_amt1: Optional[float] = Field(None, alias="PROMISSORYAMT1")
    promissory_amt2: Optional[float] = Field(None, alias="PROMISSORYAMT2")
    pvc: Optional[str] = Field(None, alias="PVC")
    warranty_comments: Optional[str] = Field(None, alias="WARRANTYCOMMENTS")
    promissory_note3: Optional[str] = Field(None, alias="PROMISSORYNOTE3")
    promissory_amt3: Optional[float] = Field(None, alias="PROMISSORYAMT3")
    deposit_amt_paid: Optional[str] = Field(None, alias="DEPOSITAMTPAID")
    pct_compl: Optional[str] = Field(None, alias="PCTCOMPL")
    pvc1: Optional[str] = Field(None, alias="PVC1")
    case_number: Optional[str] = Field(None, alias="CASENUMBER")
    spec_flag: Optional[str] = Field(None, alias="SPECFLAG")
    house_tax_enable: Optional[str] = Field(None, alias="HOUSETAXENABLE")
    cellphone: Optional[str] = Field(None, alias="CELLPHONE")
    email: Optional[str] = Field(None, alias="EMAIL")
    super_user_id: Optional[str] = Field(None, alias="SUPERUSERID")
    sworn_statement: Optional[str] = Field(None, alias="SWORNSTATEMENT")
    terminator: Optional[str] = Field(None, alias="TERMINATOR")
    house_tax_percent: Optional[float] = Field(None, alias="HOUSETAXPERCENT")
    base_price: Optional[float] = Field(None, alias="BASEPRICE")
    options_price: Optional[float] = Field(None, alias="OPTIONSPRICE")
    lot_premium: Optional[float] = Field(None, alias="LOTPREMIUM")
    deposit_amount: Optional[float] = Field(None, alias="DEPOSITAMOUNT")
    mortgage_amount: Optional[float] = Field(None, alias="MORTGAGE_AMOUNT")
    fee_pct: Optional[float] = Field(None, alias="FEE_PCT")
    points_code: Optional[float] = Field(None, alias="POINTS_CODE")
    constr_loan_amt: Optional[float] = Field(None, alias="CONSTR_LOAN_AMT")
    pct_of_blding: Optional[float] = Field(None, alias="PCT_OF_BLDING")
    companycode_138: Optional[str] = Field(None, alias="COMPANYCODE_138")
    developmentcode_139: Optional[str] = Field(None, alias="DEVELOPMENTCODE_139")
    housenumber_140: Optional[str] = Field(None, alias="HOUSENUMBER_140")
    punchlist_survey: Optional[str] = Field(None, alias="PUNCHLISTSURVEY")
    taxid_no: Optional[str] = Field(None, alias="TAXIDNO")
    phase_num: Optional[str] = Field(None, alias="PHASENUM")
    spec: Optional[str] = Field(None, alias="SPEC")
    sf_finished: Optional[str] = Field(None, alias="SF_FINISHED")
    sf_unfinished: Optional[str] = Field(None, alias="SF_UNFINISHED")
    sf_porch: Optional[str] = Field(None, alias="SF_PORCH")
    drafted_by: Optional[str] = Field(None, alias="DRAFTEDBY")
    structural_co: Optional[str] = Field(None, alias="STRUCTURALCO")
    arb_submitted: Optional[str] = Field(None, alias="ARBSUMBITTED")
    notes: Optional[str] = Field(None, alias="NOTES")
    design: Optional[str] = Field(None, alias="DESIGN")
    sales: Optional[str] = Field(None, alias="SALES")
    mls: Optional[str] = Field(None, alias="MLS")
    promo_price: Optional[float] = Field(None, alias="PROMO_PRICE")
    incentive_notes: Optional[str] = Field(None, alias="INCENTIVE_NOTES")
    projected_cost: Optional[float] = Field(None, alias="PROJECTED_COST")
    estmemo: Optional[str] = Field(None, alias="ESTMEMO")
    budget_adjust: Optional[str] = Field(None, alias="BUDGETADJUST")
    aqt_used: Optional[str] = Field(None, alias="AQT_USED")
    aqt_final: Optional[str] = Field(None, alias="AQT_FINAL")
    mtg_approv_date: Optional[str] = Field(None, alias="MTG_APPROV_DATE")
    settlement_date: Optional[str] = Field(None, alias="SETTLEMENT_DATE")
    misc8_date: Optional[str] = Field(None, alias="MISC8_DATE")
    homesite_prt_date: Optional[str] = Field(None, alias="HOMESITERPRTDATE")
    misc2_date: Optional[str] = Field(None, alias="MISC2_DATE")
    aqtreport_f_date: Optional[str] = Field(None, alias="AQTREPORT_F_DATE")
    permit_date: Optional[str] = Field(None, alias="PERMIT_DATE")
    lslate_change_date: Optional[str] = Field(None, alias="LSLATECHANGEDATE")
    varfig_update: Optional[str] = Field(None, alias="VARFIGUPDATE")
    misc3_date: Optional[str] = Field(None, alias="MISC3_DATE")
    misc9_date: Optional[str] = Field(None, alias="MISC9_DATE")
    eng_recvd_date: Optional[str] = Field(None, alias="ENGRECVDDATE")
    mtg_prequal_date: Optional[str] = Field(None, alias="MTG_PREQUAL_DATE")
    plat_ordered_date: Optional[str] = Field(None, alias="PLATORDEREDDATE")
    floor_truss_date: Optional[str] = Field(None, alias="FLOORTRUSSDATE")
    ratified_date: Optional[str] = Field(None, alias="RATIFIED_DATE")
    evenflow_date: Optional[str] = Field(None, alias="EVENFLOW_DATE")
    pmrev_job_date: Optional[str] = Field(None, alias="PMREVJOBDATE")
    ins3_date: Optional[str] = Field(None, alias="INS3_DATE")
    mtg_applied_date: Optional[str] = Field(None, alias="MTG_APPLIED_DATE")
    initial_jca_date: Optional[str] = Field(None, alias="INITIALJCADATE")
    misc7_date: Optional[str] = Field(None, alias="MISC7_DATE")
    misc4_date: Optional[str] = Field(None, alias="MISC4_DATE")
    release_date: Optional[str] = Field(None, alias="RELEASE_DATE")
    eng_ordered_date: Optional[str] = Field(None, alias="ENGORDEREDDATE")
    misc12_date: Optional[str] = Field(None, alias="MISC12_DATE")
    final_jca_date: Optional[str] = Field(None, alias="FINALJCADATE")
    warranty_date: Optional[str] = Field(None, alias="WARRANTY_DATE")
    misc1_date: Optional[str] = Field(None, alias="MISC1_DATE")
    const_start_date: Optional[str] = Field(None, alias="CONSTSTART_DATE")
    varfig_sent_date: Optional[str] = Field(None, alias="VARFIGSENTDATE")
    misc10_date: Optional[str] = Field(None, alias="MISC10_DATE")
    misc5_date: Optional[str] = Field(None, alias="MISC5_DATE")
    promissory1_date: Optional[str] = Field(None, alias="PROMISSORY1DATE")
    walk_thru_date: Optional[str] = Field(None, alias="WALK_THRU_DATE")
    qal_load_date: Optional[str] = Field(None, alias="QALLOADDATE")
    lot_contract_date: Optional[str] = Field(None, alias="LOTCONTRACTDATE")
    contract_date: Optional[str] = Field(None, alias="CONTRACT_DATE")
    ins5_date: Optional[str] = Field(None, alias="INS5_DATE")
    est_settl_date: Optional[str] = Field(None, alias="ESTSETTL_DATE")
    plans_created_date: Optional[str] = Field(None, alias="PLANSCREATEDDATE")
    plat_rec_date: Optional[str] = Field(None, alias="PLATRECDATE")
    misc6_date: Optional[str] = Field(None, alias="MISC6_DATE")
    misc11_date: Optional[str] = Field(None, alias="MISC11_DATE")
    crelease_date: Optional[str] = Field(None, alias="CRELEASEDATE")
    lot_settle_date: Optional[str] = Field(None, alias="LOTSETTLEDATE")
    promissory3_date: Optional[str] = Field(None, alias="PROMISSORY3DATE")


# Fields from IHMS House Data, that EPC cares about
class IHMSFilteredHouseData(BaseModel):
    ## Lot Info
    house_number: Optional[str] = Field(None, alias="HOUSENUMBER")
    # contract date
    contract_date: Optional[str] = Field(None, alias="CONTRACT_DATE")
    # community
    development_code: Optional[str] = Field(None, alias="DEVELOPMENTCODE")
    # section
    block_number: Optional[str] = Field(None, alias="BLOCKNUMBER")
    # lot number
    lot_number: Optional[str] = Field(None, alias="LOTNUMBER")
    # product
    model_code: Optional[str] = Field(None, alias="MODELCODE")
    # elevation
    elevation_code: Optional[str] = Field(None, alias="ELEVATIONCODE")
    # superintedant
    super_user_id: Optional[str] = Field(None, alias="SUPERUSERID")

    ## Drafting
    # Drafter
    drafted_by: Optional[str] = Field(None, alias="DRAFTEDBY")
    # Assigned On (just show the life style completed date)
    lslate_change_date: Optional[str] = Field(None, alias="LSLATECHANGEDATE")

    ## Engineering
    # Engineer
    structural_co: Optional[str] = Field(None, alias="STRUCTURALCO")
    # Sent On
    eng_ordered_date: Optional[str] = Field(None, alias="ENGORDEREDDATE")
    # Received On
    eng_recvd_date: Optional[str] = Field(None, alias="ENGRECVDDATE")

    ## Plat
    plat_ordered_date: Optional[str] = Field(None, alias="PLATORDEREDDATE")
    plat_rec_date: Optional[str] = Field(None, alias="PLATRECDATE")

    ## Permitting
    permit_number: Optional[str] = Field(None, alias="PERMITNUMBER")
    permit_date: Optional[str] = Field(None, alias="PERMIT_DATE")

    ## Notes
    remarks: Optional[str] = Field(None, alias="REMARKS")
    notes: Optional[str] = Field(None, alias="NOTES")
    comments: Optional[str] = Field(None, alias="COMMENTS")

    ## BuildByPlans
    const_start_date: Optional[str] = Field(None, alias="CONSTSTART_DATE")


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
    foundation_uploaded: bool = False
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
    product: str = ""
    elevation: str = ""
    locations: Optional[List[str]] = Field(default_factory=list)
    categories: Optional[List[str]] = Field(default_factory=list)
    custom_notes: Optional[str] = ""


class UpdateCORData(BaseModel):
    project_id: str
    project_uid: str
    cor_data: "CORData"


class QueryCOR(BaseModel):
    products: List[str] = Field(default_factory=list)
    elevations: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    categories: List[str] = Field(default_factory=list)


# :: SALES ::


class B(BaseModel):
    pass
