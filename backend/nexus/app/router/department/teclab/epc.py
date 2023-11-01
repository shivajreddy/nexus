import csv
import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll
from app.database.schemas.department_data import NewEPCLot, UpdateEPCLot, EPCData
from app.database.schemas.project import Project, TecLabProjectData, SalesProjectData
from app.security.oauth2 import get_current_user_data
from app.database.schemas.user import User

"""
TECLAB/EPC endpoint
"""

router = APIRouter(prefix="/department/teclab/epc")

# TODO
# Define the keys for the dictionary
keys = [
    'finished',
    'community',
    'section_number',
    'lot_number',
    'contract_date',
    'product',
    'elevation',
    'assigned_to',
    'draft_deadline',
    'actual_time',
    'engineering_engineer',
    'eng_sent',
    'eng_planned_receipt',
    'eng_actual_receipt',
    'plat_engineer',
    'plat_sent',
    'plat_planned_receipt',
    'plat_actual_receipt',
    'permit_jurisdiction',
    'permit_planned_submit',
    'permit_actual_submit',
    'permit_received',
    'bbp_planned_posted',
    'bbp_actual_posted',
    'notes'
]


# Function to convert string to datetime, handle empty strings and invalid dates
def parse_datetime(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d') if date_str else None
    except ValueError:
        return None


# Function to convert 'True' or 'False' to boolean
def parse_bool(value):
    return True if value.lower() == '✔' else False


# Read CSV file and create a list of dictionaries
@router.post('/migrate')
def migrate_epc():
    data_list = []

    filename = "test1.csv"
    with open(filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, quotechar='"', delimiter=',', quoting=csv.QUOTE_MINIMAL)
        for row in reader:
            data = dict(zip(keys, row))
            print("data=", data)
            new_lot_x = EPCData(
                lot_status_finished=parse_bool(row[0]),
                lot_status_released=False,
                community=row[1],
                section_number=row[2],
                lot_number=row[3],
                contract_date=parse_datetime(row[4]),
                contract_type=None,
                product_name=row[5],
                elevation_name=row[6],
                drafting_drafter=row[7],
                drafting_assigned_on=parse_datetime(row[8]),
                drafting_finished=parse_datetime(row[9]),
                engineering_engineer=row[11],
                engineering_sent=parse_datetime(row[12]),
                engineering_received=parse_datetime(row[14]),
                plat_engineer=row[15],
                plat_sent=parse_datetime(row[16]),
                plat_received=parse_datetime(row[18]),
                permitting_county_name=row[19],
                permitting_submitted=parse_datetime(row[21]),
                permitting_received=parse_datetime(row[22]),
                bbp_posted=parse_datetime(row[24]),
                notes=row[25]
            )
            print("row = ", row)
            print("new__lot_x= ", new_lot_x)
            data_list.append(new_lot_x)

    print("data_list[0]=", data_list[0])

    # Print the list of dictionaries
    result = []
    for item in data_list:
        temp_project_id = str(uuid.uuid4())
        # temp_project_id = item.community + "-" + item.section_number + "-" + item.lot_number + "-" + str(
        #     item.contract_date)

        project = Project(project_uid=temp_project_id,
                          created_at=datetime.now(),
                          contract_type=item.contract_type,
                          contract_date=item.contract_date,
                          teclab_data=TecLabProjectData(epc_data=item),
                          sales_data=SalesProjectData())
        result.append(project)

    for every_item in result:
        projects_coll.insert_one(every_item.model_dump())

    return {"FINISHED MIGRATING"}


@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            final_object = {"project_uid": doc["project_uid"]}
            if "teclab_data" in project and "epc_data" in project["teclab_data"]:
                final_object.update(project["teclab_data"]["epc_data"])
                result.append(final_object)
            else:
                print("doc without epc_data", project)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.get('/get/{project_uid}', dependencies=[Depends(get_current_user_data)])
def get_lot_with_project_uid(project_uid: str):
    target_project = None
    for doc in list(projects_coll.find()):
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if project["project_uid"] == project_uid:
            target_project = project
            continue

    if not target_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"{project_uid} not found"
        )

    return target_project["teclab_data"]["epc_data"]


@router.post('/new', dependencies=[Depends(get_current_user_data)])
def new_lot_to_epc(lot_data: NewEPCLot):
    # 1. create project_uid
    new_project_uid = uuid.uuid4()
    new_project: Project = Project(project_uid=str(new_project_uid),
                                   created_at=datetime.now(),
                                   contract_type=lot_data.epc_data.contract_type,
                                   contract_date=lot_data.epc_data.contract_date,
                                   teclab_data=TecLabProjectData(epc_data=lot_data.epc_data),
                                   sales_data=SalesProjectData())

    # 2. Add to database
    doc_id = projects_coll.insert_one(new_project.model_dump())
    print(doc_id)

    return {"successfully added new project": new_project}


@router.patch('/edit', dependencies=[Depends(get_current_user_data)])
def update_lot(lot_data: UpdateEPCLot):
    # Check if the project exists
    existing_project = projects_coll.find_one({"project_uid": lot_data.project_uid})

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{lot_data.project_uid} doesn't exist"
        )

    # update the content in DB
    # Create an update query based on non-null fields in lot_data
    # update_fields = {}
    # for key, value in lot_data.epc_data.model_dump(exclude_unset=True).items():
    #     update_fields[f"teclab.epc_data.{key}"] = value
    # print("update_fields=", update_fields)

    # Update the project in the database
    result = projects_coll.update_one(
        {"project_uid": lot_data.project_uid},
        {"$set": {"teclab.epc_data": lot_data.epc_data.model_dump()}}
    )

    print("result=", result)
    print("Matched Count:", result.matched_count)
    print("Modified Count:", result.modified_count)

    return {"message": f"Project {lot_data.project_uid} updated successfully"}
