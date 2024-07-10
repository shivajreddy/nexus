import csv
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Annotated

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll, users_coll, client
from app.database.schemas.department_data import UpdateTECLabData, EPCData
from app.database.schemas.user import UserInfo, User
from app.email.utils import send_email_with_given_message_and_attachment
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data

"""
TECLAB/EPC endpoint
"""

router = APIRouter(prefix="/department/teclab/epc")


# """
# Filter out all finished and released lots
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if not doc["teclab_data"]["epc_data"]["lot_status_finished"] and\
                    not doc["teclab_data"]["epc_data"]["lot_status_released"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                final_object.update(project["teclab_data"]["epc_data"])
                result.append(final_object)
        return result
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# """

@router.get('/update-db')
def update_db():
    # db = client["nexus"]
    # projects_coll = db["projects"]

    # projects_coll.update_many({'project_info.project_uid': '826a5f29-ab9f-4d44-aa84-5659ffe9b948'},
    # ! update all projects with new fields
    projects_coll.update_many({},
                              {'$set': {'teclab_data.epc_data.homesiting_completed_by': None,
                                        'teclab_data.epc_data.homesiting_completed_on': None}
                               })

    # ! update all projects that are 2018,19,20,21,22 as finished
    start_date = datetime(2018, 1, 1)
    end_date = datetime(2022, 12, 31, 23, 59, 59)
    date_query = {'$gte': start_date, '$lt': end_date}
    query = {'contract_info.contract_date': date_query}

    update_query = {
        '$set': {'teclab_data.epc_data.lot_status_finished': True}
    }
    projects_coll.update_many(query, update_query)

    # res = projects_coll.find(query)
    res = projects_coll.find()
    result = []
    for doc in res:
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(project)

    return result
    # return "updated db"


# """
@router.get('/all', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            final_object = {
                "project_uid": doc["project_info"]["project_uid"],
                "community": doc["project_info"]["community"],
                "section_number": doc["project_info"]["section"],
                "lot_number": doc["project_info"]["lot_number"]
            }
            final_object.update(project["teclab_data"]["epc_data"])
            result.append(final_object)
        return result
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# """


@router.get(
    path='/get/{project_uid}',
    # response_model=
    dependencies=[Depends(get_current_user_data)])
def get_epc_data_with_project_uid(project_uid: str):
    target_project = find_project(project_uid)

    # return target_project["teclab_data"]["epc_data"]
    result_project = {
        "project_info": target_project["project_info"],
        "epc_data": target_project["teclab_data"]["epc_data"]
    }
    return result_project


@router.post('/edit', dependencies=[Depends(get_current_user_data)])
def update_teclab_data_for_project(new_data: UpdateTECLabData):
    # print("given new_data", new_data)
    # Check if the project exists
    existing_project = projects_coll.find_one({"project_info.project_uid": new_data.project_uid})

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{new_data.project_uid} doesn't exist in Projects"
        )

    # print("existing_project=", existing_project)

    # Update the project in the database
    projects_coll.update_one(
        {"project_info.project_uid": new_data.project_uid},
        {"$set": {"teclab_data.epc_data": new_data.epc_data.model_dump()}}
    )

    return {"message": f"Project {new_data.project_uid} updated successfully"}


# :: Feature: email EPC data
def query_tracker_data():
    # puid | community | contract           |           spec+permit_hold |
    #                       /\                               /\
    #         to-be-drafted   under-process     to-be-drafted  under-process

    # Filtered out -> not-finished (and) not-released (and) not-permitted
    all_docs = list(projects_coll.find())

    filtered_lots = []
    for doc in all_docs:
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        p_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])
        if (
                not p_epc_data.lot_status_finished and
                not p_epc_data.lot_status_released and
                not p_epc_data.permitting_received
        ):
            # filtered_lots.append(p_epc_data)
            filtered_lots.append(project)

    # contract_waiting_drafting = []
    # contract_waiting_eng_or_plat = []
    # contract_waiting_to_send_permit = []
    # pm_waiting_drafting = []
    # pm_waiting_eng_or_plat = []
    # pm_waiting_to_send_permit = []

    # print("filtered_lots ::", filtered_lots)

    result_data = {}
    """
    format of the each item
        "community_name": (c_draft, c_eng, c_permit, pm_draft, pm_eng, pm_permit)
    """
    for p in filtered_lots:
        p_community = p["project_info"]["community"]
        if p_community not in result_data:
            result_data[p_community] = [0, 0, 0, 0, 0, 0]

        if p["contract_info"]["contract_type"] == 'Contract':
            if not p['teclab_data']['epc_data']['drafting_finished']:
                # contract_waiting_drafting.append(p)
                result_data[p_community][0] += 1
            elif not p['teclab_data']['epc_data']['engineering_received'] or not p['teclab_data']['epc_data'][
                'plat_received']:
                # contract_waiting_eng_or_plat.append(p)
                result_data[p_community][1] += 1
            elif not p['teclab_data']['epc_data']['permitting_submitted']:
                # contract_waiting_to_send_permit.append(p)
                result_data[p_community][2] += 1
        else:
            if not p['teclab_data']['epc_data']['drafting_finished']:
                # pm_waiting_drafting.append(p)
                result_data[p_community][3] += 1
            elif not p['teclab_data']['epc_data']['engineering_received'] or not p['teclab_data']['epc_data'][
                'plat_received']:
                # pm_waiting_eng_or_plat.append(p)
                result_data[p_community][4] += 1
            elif not p['teclab_data']['epc_data']['permitting_submitted']:
                # pm_waiting_to_send_permit.append(p)
                result_data[p_community][5] += 1

    # sum the totals in each community
    for k, v in result_data.items():
        v.append(sum(v))

    return filtered_lots, result_data


# Send Eagle back tracking email
@router.get('/epc-backlog-tracker')
def generate_send_csv(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    # query the data
    filtered_lots, result_data = query_tracker_data()

    # create the csv file
    today_date = datetime.now().strftime("%d-%m-%y")
    csv_filename = os.path.join("./app/files/epc", f"{today_date}-EagleBacklogTracker.csv")
    print("filename=", csv_filename)
    with open(csv_filename, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow([
            "Community",
            "Contract-Waiting_Drafting",
            "Contract-Waiting_Eng_or_Plat",
            "Contract-Waiting_Permit",
            "Permit&Hold-Waiting_Drafting",
            "Permit&Hold-Waiting_Eng_or_Plat",
            "Permit&Hold-Waiting_Permit",
            "Community Totals"
        ])
        for k, v in result_data.items():
            csv_writer.writerow([k] + v)

    # create email with attachment
    message = MIMEMultipart()
    message['Subject'] = 'Eagle Backlog Tracker'
    message['From'] = 'nexus@tecofva.com'
    # message['To'] = 'sreddy@tecofva.com'
    message['To'] = current_user_data.username
    message.attach(MIMEText('EPC Backlog Tracker as of today', 'plain'))

    # attach the csv file to message
    with open(csv_filename, 'r') as file:
        attachment = MIMEText(file.read())
        attachment.add_header('Content-Disposition', 'attachment', filename=(today_date + "-EagleBacklogTracker.csv"))
        message.attach(attachment)

    send_email_with_given_message_and_attachment(
        current_user_data.username,
        # "sreddy@tecofva.com",
        message
    )

    return {
        "total": len(filtered_lots),
        "email_data": result_data,
        # f"contract_waiting_drafting: + {len(contract_waiting_drafting)}": contract_waiting_drafting,
        # f"contract_waiting_eng_or_plat: + {len(contract_waiting_eng_or_plat)}": contract_waiting_eng_or_plat,
        # f"contract_waiting_to_send_permit: + {len(contract_waiting_to_send_permit)}": contract_waiting_to_send_permit,
        # f"pm_waiting_drafting: + {len(pm_waiting_drafting)}": pm_waiting_drafting,
        # f"pm_waiting_eng_or_plat: + {len(pm_waiting_eng_or_plat)}": pm_waiting_eng_or_plat,
        # f"pm_waiting_to_send_permit: + {len(pm_waiting_to_send_permit)}": pm_waiting_to_send_permit
    }
