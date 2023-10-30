import csv
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll
from app.database.schemas.department_data import NewEPCLot, UpdateEPCLot, EPCData
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
        epc_lot = NewEPCLot(project_uid=temp_project_id, epc_data=item)
        result.append(epc_lot)

    for every_item in result:
        projects_coll.insert_one(every_item.model_dump())

    return {"FINISHED MIGRATING"}


@router.get('/live', dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    result = []
    for doc in list(projects_coll.find()):
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        final_object = {"project_uid": doc["project_uid"]}
        final_object.update(project["epc_data"])
        result.append(final_object)
        # result.append(project["epc_data"])
    return result


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

    return target_project["epc_data"]


@router.post('/new')
def new_lot_to_epc(lot_data: NewEPCLot):
    # check for duplicate project-codes
    for doc in list(projects_coll.find()):
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if project["project_uid"] == lot_data.project_uid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"{lot_data.project_uid} already exists"
            )

    projects_coll.insert_one(lot_data.model_dump())

    return {"successfully added new lot"}


@router.patch('/edit')
def update_lot(lot_data: UpdateEPCLot):
    # Check if the project exists
    project_query = {"project_uid": lot_data.project_uid}
    existing_project = projects_coll.find_one(project_query)

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{lot_data.project_uid} doesn't exist"
        )

    # update the content in DB
    # Create an update query based on non-null fields in lot_data
    update_fields = {}
    for key, value in lot_data.epc_data.dict(exclude_unset=True).items():
        update_fields[f"epc_data.{key}"] = value

    # Update the project in the database
    projects_coll.update_one(
        project_query,
        {"$set": update_fields}
    )

    return {"message": f"Project {lot_data.project_uid} updated successfully"}
