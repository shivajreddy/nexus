import csv
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Annotated, Dict, Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll, users_coll, client
from app.database.schemas.department_data import UpdateFOSCData, FOSCData
from app.database.schemas.user import UserInfo, User
from app.email.utils import send_email_with_given_message_and_attachment
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data


"""
TECLAB/FOSC endpoint
"""

router = APIRouter(prefix="/department/teclab/fosc")


# """
# Filter out all finished and released lots
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_live_lots():
    # print("inside fosc/live")
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if doc["teclab_data"]["fosc_data"]["lot_status_started"] and\
                    not doc["teclab_data"]["fosc_data"]["lot_status_finished"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                final_object.update(project["teclab_data"]["fosc_data"])
                result.append(final_object)
        return result
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# """


# """
# Filter out all lots that are currently in progress
@router.get('/current', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_current_lots():
    # print("inside fosc/live")
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if doc["teclab_data"]["fosc_data"]["lot_status_started"] and\
                    not doc["teclab_data"]["fosc_data"]["lot_status_finished"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                foundation_date = doc["teclab_data"]["fosc_data"]["foundation_scan_date"]
                slab_date = doc["teclab_data"]["fosc_data"]["slab_scan_date"]
                frame_date = doc["teclab_data"]["fosc_data"]["frame_scan_date"]
                mep_date = doc["teclab_data"]["fosc_data"]["mep_scan_date"]

                foundation_status = doc["teclab_data"]["fosc_data"]["foundation_report_status"]
                slab_status = doc["teclab_data"]["fosc_data"]["slab_report_status"]
                frame_status = doc["teclab_data"]["fosc_data"]["frame_report_status"]
                mep_status = doc["teclab_data"]["fosc_data"]["mep_report_status"]

                if foundation_date is not None:
                    timeLimit = datetime.now() - timedelta(days=21)

                    if foundation_date >= timeLimit and not foundation_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)
                    elif slab_date >= timeLimit and not slab_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)
                    elif frame_date >= timeLimit and not frame_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)
                    elif mep_date >= timeLimit and not mep_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)

        return result
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# """


# """
# gets every lot without filter
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
            final_object.update(project["teclab_data"]["fosc_data"])
            result.append(final_object)
        return result
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# """


# """
# Filters all lots into relevant data for each community regarding scans
@router.get('/summary', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_communities(temp: Optional[bool] = False):
    try:
        result_data = {}
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            p_community = doc["project_info"]["community"]
            # if community hasn't been added, other checks can be done here if needed
            """
                format of the each item
                    "community_name": (s/r_foundation, s/r_slab, s/r_frame, s/r_mep, total, finished)
                """
            if p_community not in result_data:
                result_data[p_community] = [0, 0, 0, 0, 0, 0, 0, 0, 0, -1]

            # creates a Dict with the required information for the summary
            final_object = {
                "community": p_community,
                "s_foundation": doc["teclab_data"]["fosc_data"]["foundation_scan_status"],
                "r_foundation": doc["teclab_data"]["fosc_data"]["foundation_report_status"],
                "s_slab": doc["teclab_data"]["fosc_data"]["slab_scan_status"],
                "r_slab": doc["teclab_data"]["fosc_data"]["slab_report_status"],
                "s_frame": doc["teclab_data"]["fosc_data"]["frame_scan_status"],
                "r_frame": doc["teclab_data"]["fosc_data"]["frame_report_status"],
                "s_mep": doc["teclab_data"]["fosc_data"]["mep_scan_status"],
                "r_mep": doc["teclab_data"]["fosc_data"]["mep_report_status"],
                "finished": doc["teclab_data"]["fosc_data"]["lot_status_finished"]
            }

            # if the community was correctly put into result_data increment the list for the corresponding value
            if final_object["community"] in result_data:
                if final_object["r_foundation"]:
                    result_data[p_community][1] += 1
                    result_data[p_community][0] += 1
                elif final_object["s_foundation"]:
                    result_data[p_community][0] += 1

                if final_object["r_slab"]:
                    result_data[p_community][3] += 1
                    result_data[p_community][2] += 1
                elif final_object["s_slab"]:
                    result_data[p_community][2] += 1

                if final_object["r_frame"]:
                    result_data[p_community][5] += 1
                    result_data[p_community][4] += 1
                elif final_object["s_frame"]:
                    result_data[p_community][4] += 1

                if final_object["r_mep"]:
                    result_data[p_community][7] += 1
                    result_data[p_community][6] += 1
                elif final_object["s_mep"]:
                    result_data[p_community][6] += 1

                # running counter to have a number for total homes
                result_data[p_community][8] += 1
                # will not show communities that are 100% finished
                if not final_object["finished"] and result_data[p_community][9] != 1:
                    result_data[p_community][9] = 1

        # creates result which transforms result_data into a list of dicts
        result = [{"community_name": community, "values": values} for community, values in result_data.items()
                  if result_data[community][9] == 1]
        # print(result_data)
        if temp:
            return result_data
        else:
            return result

    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# """


# """
@router.get(
    path='/get/{project_uid}',
    # response_model=
    dependencies=[Depends(get_current_user_data)])
def get_fosc_data_with_project_uid(project_uid: str):
    target_project = find_project(project_uid)

    result_project = {
        "project_info": target_project["project_info"],
        "fosc_data": target_project["teclab_data"]["fosc_data"]
    }
    return result_project

# """


# """
# filters
def update_community_directors(new_data: str, other_communty: str):
    try:
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            if doc["project_info"]["community"] == other_communty:
                projects_coll.update_many(
                    {"project_info.project_uid": doc["project_info"]["project_uid"]},
                    {"$set": {"teclab_data.fosc_data.assigned_director": new_data}}
                )
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.post('/edit', dependencies=[Depends(get_current_user_data)])
def update_teclab_data_for_project(new_data: UpdateFOSCData):
    # print("given new_data", new_data)
    # Check if the project exists
    existing_project = projects_coll.find_one({"project_info.project_uid": new_data.project_uid})

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{new_data.project_uid} doesn't exist in Projects"
        )

    if new_data.fosc_data.assigned_director != existing_project["teclab_data"]["fosc_data"]["assigned_director"]:
        print(existing_project["teclab_data"]["fosc_data"]["assigned_director"])
        print(new_data.fosc_data.assigned_director)
        update_community_directors(new_data.fosc_data.assigned_director, existing_project["project_info"]["community"])
    # Update the project in the database
    projects_coll.update_one(
        {"project_info.project_uid": new_data.project_uid},
        {"$set": {"teclab_data.fosc_data": new_data.fosc_data.model_dump()}}
    )

    return {"message": f"Project {new_data.project_uid} updated successfully"}

# """


# """
# :: Feature: email FOSC data
@router.get('/fosc-summary-tracker')
def generate_send_csv(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    # query the data
    result_data = get_all_communities(temp = True)

    # create the csv file
    today_date = datetime.now().strftime("%d-%m-%y")
    csv_filename = os.path.join("./app/files/fosc", f"{today_date}-FieldOpsSummaryTracker.csv")
    print("filename=", csv_filename)
    with open(csv_filename, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow([
            "Community",
            "s_foundation",
            "r_foundation",
            "s_slab",
            "r_slab",
            "s_frame",
            "r_frame",
            "s_mep",
            "r_mep",
            "Total",
        ])
        for k, v in result_data.items():
            csv_writer.writerow([k] + v[:-1])

    # create email with attachment
    message = MIMEMultipart()
    message['Subject'] = 'Field Ops Summary Tracker'
    message['From'] = 'nexus@tecofva.com'
    message['To'] = current_user_data.username
    message.attach(MIMEText('FOSC Summary Tracker as of today', 'plain'))

    # attach the csv file to message
    with open(csv_filename, 'r') as file:
        attachment = MIMEText(file.read())
        attachment.add_header('Content-Disposition', 'attachment', filename=(today_date + "-FieldOpsSummaryTracker.csv"))
        message.attach(attachment)

    send_email_with_given_message_and_attachment(
        current_user_data.username,
        message
    )

    return {
        # "total": len(filtered_lots),
        "email_data": result_data,
    }

# """


# """
@router.get('/update-db')
def update_db():
    # ! update all projects with new fields
    projects_coll.update_many({},
                                # $set $unset
                                {'$unset': {
                                    'project_info.fosc_data': None,


                                }})
    res = projects_coll.find()
    result = []
    for doc in res:
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(project)

    return result

# """
