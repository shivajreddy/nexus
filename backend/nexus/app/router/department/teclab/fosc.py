import csv
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Annotated 
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll
from app.database.schemas.department_data import FOSCData, UpdateFOSCData
from app.database.schemas.user import User
from app.email.utils import send_email_with_given_message_and_attachment
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data


"""
TECLAB/FOSC endpoint
"""

router = APIRouter(prefix="/department/teclab/fosc")

# @router.get('/')
# def get():
#     print("inside fosc")
#     return "inside fosc"


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

                # NOTE: the boolean fields on docs must have a boolean value, not None, the following fixes it
                # TODO: make sure that the new/update api endpoints ensure that its a boolean
                def transform_data(data: dict) -> dict:
                    # Replace None with False for boolean fields
                    boolean_fields = [
                        'foundation_scan_status', 'foundation_report_status', 'foundation_uploaded',
                        'foundation_needed', 'slab_scan_status', 'slab_report_status', 'slab_uploaded',
                        'slab_needed', 'frame_scan_status', 'frame_report_status', 'frame_uploaded',
                        'frame_needed', 'mep_scan_status', 'mep_report_status', 'mep_uploaded', 'mep_needed',
                        'misc_scan_status', 'misc_report_status'
                    ]
                    for field in boolean_fields:
                        if data.get(field) is None:
                            data[field] = False
                    return data
                def update_documents_with_defaults():
                    # Define the boolean fields you want to check
                    boolean_fields = [
                        'foundation_needed', 'foundation_scan_status', 'foundation_report_status', 'foundation_uploaded',
                        'slab_scan_status', 'slab_report_status', 'slab_uploaded', 'slab_needed',
                        'frame_scan_status', 'frame_report_status', 'frame_uploaded', 'frame_needed',
                        'mep_scan_status', 'mep_report_status', 'mep_uploaded', 'mep_needed',
                        'misc_scan_status', 'misc_report_status'
                    ]

                    for field in boolean_fields:
                        # Update documents where the field is None and set it to False
                        projects_coll.update_many(
                            {field: None},  # Check for None value
                            {"$set": {field: False}}  # Set it to False
                        )
                # update_documents_with_defaults()

                # Assuming `raw_data` is the data you receive (e.g., from the API)
                transformed_data = transform_data(project["teclab_data"]["fosc_data"])
                fosc_data = FOSCData(**transformed_data)
                final_object.update(fosc_data)

                result.append(final_object)
        # print(result)
        return result
    except Exception as e:
        # print("error: ", e)
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

                date_format = "%m/%d/%Y"

                def parse_date(date_str):
                    if date_str is not None and isinstance(date_str, str):
                        return datetime.strptime(date_str, date_format)
                    return date_str

                foundation_date = parse_date(foundation_date)
                slab_date = parse_date(slab_date)
                frame_date = parse_date(frame_date)
                mep_date = parse_date(mep_date)

                beforeTime = datetime.now() - timedelta(days=14)
                afterTime = datetime.now() + timedelta(days=21)

                # beforeTime_str = beforeTime.strftime("%m/%d/%Y")
                # afterTime_str = afterTime.strftime("%m/%d/%Y")

                if foundation_date is not None:
                    if beforeTime <= foundation_date <= afterTime and not foundation_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)

                if slab_date is not None:
                    if beforeTime <= slab_date <= afterTime and not slab_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)

                if frame_date is not None:
                    if beforeTime <= frame_date <= afterTime and not frame_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)

                if mep_date is not None:
                    if beforeTime <= mep_date <= afterTime and not mep_status:
                        final_object.update(project["teclab_data"]["fosc_data"])
                        result.append(final_object)

        return result
    except Exception as e:
        # print("error: ", e)
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
# Updating project data when given a specific project UID
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
# Updating project data
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
        update_community_directors(new_data.fosc_data.assigned_director, existing_project["project_info"]["community"])

    # Update the project in the database
    projects_coll.update_one(
        {"project_info.project_uid": new_data.project_uid},
        {"$set": {"teclab_data.fosc_data": new_data.fosc_data.model_dump()}}
    )

    return {"message": f"Project {new_data.project_uid} updated successfully"}

# """


# """
# Get all information for each lot and sorts it by the community
def communities_logic():
    try:
        result_data = {}
        total_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            p_community = doc["project_info"]["community"]
            # if community hasn't been added, other checks can be done here if needed
            """
                format of the each item
                    "community_name": (s/r_foundation, s/r_slab, s/r_frame, s/r_mep, total, finished)
                """
            if p_community not in result_data:
                result_data[p_community] = [0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0,]

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
                "finished": doc["teclab_data"]["fosc_data"]["lot_status_finished"],
                "f_needed": doc["teclab_data"]["fosc_data"]["foundation_needed"],
                "s_needed": doc["teclab_data"]["fosc_data"]["slab_needed"],
                "m_needed": doc["teclab_data"]["fosc_data"]["mep_needed"]
            }

            # if the community was correctly put into result_data increment the list for the corresponding value
            if final_object["community"] in result_data:

                if final_object["s_foundation"]:
                    result_data[p_community][0] += 1
                    total_data[1] += 1
                    if final_object["r_foundation"]:
                        result_data[p_community][1] += 1
                        total_data[2] += 1
                else:
                    total_data[0] += 1

                if final_object["s_slab"]:
                    result_data[p_community][2] += 1
                    total_data[4] += 1
                    if final_object["r_slab"]:
                        result_data[p_community][3] += 1
                        total_data[5] += 1
                else:
                    total_data[3] += 1

                if final_object["s_frame"]:
                    result_data[p_community][4] += 1
                    total_data[7] += 1
                    if final_object["r_frame"]:
                        result_data[p_community][5] += 1
                        total_data[8] += 1
                else:
                    total_data[6] += 1

                if final_object["s_mep"]:
                    result_data[p_community][6] += 1
                    total_data[10] += 1
                    if final_object["r_mep"]:
                        result_data[p_community][7] += 1
                        total_data[11] += 1
                else:
                    total_data[9] += 1

                if not final_object["f_needed"]:
                    result_data[p_community][10] += 1
                if not final_object["s_needed"]:
                    result_data[p_community][11] += 1
                if not final_object["m_needed"]:
                    result_data[p_community][12] += 1

                # running counter to have a number for total homes
                result_data[p_community][8] += 1
                # will not show communities that are 100% finished
                if result_data[p_community][9] != 1 and not final_object["finished"]:
                    result_data[p_community][9] = 1

        for community, data in result_data.items():
            result_data[community] = data + total_data
        result = {k: v for k, v in result_data.items() if v[9] == 1}
        return result

    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=501, detail=f"Internal Server Error: {str(e)}")

# Filters all lots into relevant data for each community regarding scans
@router.get('/summary', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_communities():
    try:
        result_data = communities_logic()

        # creates result which transforms result_data into a list of dicts
        result = [{"community_name": community, "values": values} for community, values in result_data.items()
                  if result_data[community][9] == 1]

        return result

    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# """


# """
# :: Feature: email FOSC data
# Formats the dates to remove the time
def format_date(date_string):
    if date_string:
        # print(date_string)
        if isinstance(date_string, datetime):
            # print("shifter")
            return date_string.strftime("%m/%d/%Y")
        else:
            # print("keeper")
            return date_string


# create email with attachment
def generate_email(current_user_data, csv_filename, today_date, email):
    message = MIMEMultipart()
    message['Subject'] = 'Field Ops Backlog Tracker'
    message['From'] = 'nexus@tecofva.com'
    message['To'] = current_user_data.username
    if email == 1:
        message.attach(MIMEText('FOSC Summary Tracker as of today', 'plain'))
    elif email == 2:
        message.attach(MIMEText('FOSC Live Tracker as of today', 'plain'))
    elif email == 3:
        message.attach(MIMEText('FOSC All Tracker as of today', 'plain'))

    # attach the csv file to message
    with open(csv_filename, 'r') as file:
        attachment = MIMEText(file.read())
        if email == 1:
            attachment.add_header('Content-Disposition', 'attachment',
                                  filename=(today_date + "-FieldOpsSummaryTracker.csv"))
        elif email == 2:
            attachment.add_header('Content-Disposition', 'attachment',
                                  filename=(today_date + "-FieldOpsLiveTracker.csv"))
        elif email == 3:
            attachment.add_header('Content-Disposition', 'attachment',
                                  filename=(today_date + "-FieldOpsAllTracker.csv"))
        message.attach(attachment)

    send_email_with_given_message_and_attachment(
        current_user_data.username,
        message
    )

# Creates spreadsheet for the summary page
@router.get('/fosc-summary-tracker')
def generate_send_csv_summary(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    result_data = communities_logic()

    # create the csv file
    today_date = datetime.now().strftime("%m-%d-%Y")
    csv_filename = os.path.join("./app/files/fosc", f"{today_date}-FieldOpsSummaryTracker.csv")
    # print("filename=", csv_filename)
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
            csv_writer.writerow([k] + v[:-4])
    # create email with attachment
    generate_email(current_user_data, csv_filename, today_date, 1)

    return {
        # "total": len(filtered_lots),
        "email_data": result_data,
    }

# Creates a spreadsheet for the live page
@router.get('/fosc-live-tracker')
def generate_send_csv_live(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    result_data = get_live_lots()

    # create the csv file
    today_date = datetime.now().strftime("%m-%d-%Y")
    csv_filename = os.path.join("./app/files/fosc", f"{today_date}-FieldOpsLiveTracker.csv")
    # print("filename=", csv_filename)
    with open(csv_filename, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow([
            "Community", "Section", "Lot", "PM", "Director",

            "Foundation Scanned", "Date",
            "Slab Scanned", "Date",
            "Frame Scanned", "Date",
            "MEP Scanned", "Date",

            "Foundation Reported", "Date", "Reporter",
            "Slab Reported", "Date", "Reporter",
            "Frame Reported", "Date", "Reporter",
            "MEP Reported", "Date", "Reporter",
        ])
        for i in result_data:
            row = [
                i.get("community"),
                i.get("section_number"),
                i.get("lot_number"),
                i.get("assigned_pm"),
                i.get("assigned_director"),

                i.get("foundation_scan_status"), format_date(i.get("foundation_scan_date")),
                i.get("slab_scan_status"), format_date(i.get("slab_scan_date")),
                i.get("frame_scan_status"), format_date(i.get("frame_scan_date")),
                i.get("mep_scan_status"), format_date(i.get("mep_scan_date")),

                i.get("foundation_report_status"), format_date(i.get("foundation_report_date")), i.get("foundation_reporter"),
                i.get("slab_report_status"), format_date(i.get("slab_report_date")), i.get("slab_reporter"),
                i.get("frame_report_status"), format_date(i.get("frame_report_date")), i.get("frame_reporter"),
                i.get("mep_report_status"), format_date(i.get("mep_report_date")), i.get("mep_reporter"),
            ]
            csv_writer.writerow(row)
    # create email with attachment
    generate_email(current_user_data, csv_filename, today_date, 2)

    return {
        # "total": len(filtered_lots),
        "email_data": result_data,
    }

# Creates a spreadsheet for the all page
@router.get('/fosc-all-tracker')
def generate_send_csv_all(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    result_data = get_all_lots()

    # create the csv file
    today_date = datetime.now().strftime("%m-%d-%Y")
    csv_filename = os.path.join("./app/files/fosc", f"{today_date}-FieldOpsAllTracker.csv")
    # print("filename=", csv_filename)
    with open(csv_filename, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow([
            "Community", "Section", "Lot", "PM", "Director",

            "Foundation Scanned", "Foundation S-Date",
            "Slab Scanned", "Slab S-Date",
            "Frame Scanned", "Frame S-Date",
            "MEP Scanned", "MEP S-Date",

            "Foundation Reported", "Foundation R-Date", "Foundation Reporter",
            "Slab Reported", "Slab R-Date", "Slab Reporter",
            "Frame Reported", "Frame R-Date", "Frame Reporter",
            "MEP Reported", "MEP R-Date", "MEP Reporter",

            "Foundation Needed", "Slab Needed", "Frame Needed", "MEP Needed",
            "Lot Started", "Lot Finished",
        ])
        for j in result_data:
            row = [
                j.get("community"),
                j.get("section_number"),
                "'"+j.get("lot_number"),
                j.get("assigned_pm"),
                j.get("assigned_director"),

                j.get("foundation_scan_status"), format_date(j.get("foundation_scan_date")),
                j.get("slab_scan_status"), format_date(j.get("slab_scan_date")),
                j.get("frame_scan_status"), format_date(j.get("frame_scan_date")),
                j.get("mep_scan_status"), format_date(j.get("mep_scan_date")),

                j.get("foundation_report_status"), format_date(j.get("foundation_report_date")), j.get("foundation_reporter"),
                j.get("slab_report_status"), format_date(j.get("slab_report_date")), j.get("slab_reporter"),
                j.get("frame_report_status"), format_date(j.get("frame_report_date")), j.get("frame_reporter"),
                j.get("mep_report_status"), format_date(j.get("mep_report_date")), j.get("mep_reporter"),

                j.get("foundation_needed"), j.get("slab_needed"), j.get("frame_needed"), j.get("mep_needed"),
                j.get("lot_status_started"), j.get("lot_status_finished")
            ]
            csv_writer.writerow(row)

    # create email with attachment
    generate_email(current_user_data, csv_filename, today_date, 3)

    return {
        # "total": len(filtered_lots),
        "email_data": result_data,
    }
# """


# """
# Updates the director for each community change its changed
def update_community_directors(new_data: str | None, community: str):
    try:
        for doc in projects_coll.find({"project_info.community": community}).sort("project_info.meta_info.created_at", -1):
            if not doc["teclab_data"]["fosc_data"]["lot_status_finished"] and\
                    doc["teclab_data"]["fosc_data"]["assigned_director"] != new_data:

                projects_coll.update_many(
                    {"project_info.project_uid": doc["project_info"]["project_uid"]},
                    {"$set": {"teclab_data.fosc_data.assigned_director": new_data}}
                )
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


def update_project_fosc_data(new_data: list, header: list):
    new_data[2] = new_data[2][1:]
    this_project = projects_coll.find_one({
        "project_info.community": new_data[0],
        "project_info.section": new_data[1],
        "project_info.lot_number": new_data[2]
    })
    if this_project is None:
        raise ValueError(f"No project found for the given data: {new_data}")
    del new_data[:3]

    # print(this_project["project_info"])
    try:
        csv_map = {
            "PM": "teclab_data.fosc_data.assigned_pm",
            "Foundation Scanned": "teclab_data.fosc_data.foundation_scan_status",
            "Foundation S-Date": "teclab_data.fosc_data.foundation_scan_date",
            "Slab Scanned": "teclab_data.fosc_data.slab_scan_status",
            "Slab S-Date": "teclab_data.fosc_data.slab_scan_date",
            "Frame Scanned": "teclab_data.fosc_data.frame_scan_status",
            "Frame S-Date": "teclab_data.fosc_data.frame_scan_date",
            "MEP Scanned": "teclab_data.fosc_data.mep_scan_status",
            "MEP S-Date": "teclab_data.fosc_data.mep_scan_date",
            "Foundation Reported": "teclab_data.fosc_data.foundation_report_status",
            "Foundation R-Date": "teclab_data.fosc_data.foundation_report_date",
            "Foundation Reporter": "teclab_data.fosc_data.foundation_reporter",
            "Slab Reported": "teclab_data.fosc_data.slab_report_status",
            "Slab R-Date": "teclab_data.fosc_data.slab_report_date",
            "Slab Reporter": "teclab_data.fosc_data.slab_reporter",
            "Frame Reported": "teclab_data.fosc_data.frame_report_status",
            "Frame R-Date": "teclab_data.fosc_data.frame_report_date",
            "Frame Reporter": "teclab_data.fosc_data.frame_reporter",
            "MEP Reported": "teclab_data.fosc_data.mep_report_status",
            "MEP R-Date": "teclab_data.fosc_data.mep_report_date",
            "MEP Reporter": "teclab_data.fosc_data.mep_reporter",
            "Foundation Needed": "teclab_data.fosc_data.foundation_needed",
            "Slab Needed": "teclab_data.fosc_data.slab_needed",
            "Frame Needed": "teclab_data.fosc_data.frame_needed",
            "MEP Needed": "teclab_data.fosc_data.mep_needed",
            "Lot Started": "teclab_data.fosc_data.lot_status_started",
            "Lot Finished": "teclab_data.fosc_data.lot_status_finished"
        }

        # Function to perform the update
        def update_field(update_type, update):
            projects_coll.update_one(
                {"project_info.project_uid": this_project["project_info"]["project_uid"]},
                {"$set": {update_type: update}}
            )

        # print(">", this_project["project_info"]["project_id"])

        for count, i in enumerate(new_data):
            if i.strip():
                update_type = csv_map.get(header[count])

                if not update_type:
                    return None

                test = this_project["teclab_data"]["fosc_data"][update_type.rsplit(".", 1)[-1]]

                if update_type:
                    if i.strip() == test or i.strip()[0].upper() + i.strip()[1:].lower() == test:
                        update_type.rsplit(".", 1)[-1]
                        # print("Not Changed")
                    elif i.upper() == "TRUE":
                        update_field(update_type, True)
                    elif i.upper() == "FALSE":
                        update_field(update_type, False)
                    else:
                        update_field(update_type, i.strip())


    except Exception as e:
        # print("error: ", e)
        # print("lot: ", new_data)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# Used to import data from a csv file to update the db
@router.get('/csv-upload')
def csv_upload():
    csv_file_path = "./app/files/input/csv-upload.csv"
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader)

        if header[1] == "Director":
            # print("Director csv")
            for row in csv_reader:
                update_community_directors(row[1], row[0])

            return "Updated all Directors to given CSV file."
        elif header[1] == "Section":
            # print("All Lots csv")
            del header[:3]
            for row in csv_reader:
                update_project_fosc_data(row, header)

            return "Updated ALL-LOTS to given CSV file."

        else:
            raise HTTPException(status_code=422, detail=f"Unprocessable entity")


# """
# Used to update the database for needed changes
@router.get('/update-db')
def update_db():
    # ! update all projects with new fields
    projects_coll.update_many({},
                                {'$set': {
                                    # 'teclab_data.fosc_data.lot_status_started': False,
                                    # 'teclab_data.fosc_data.lot_status_finished': False,
                                    'teclab_data.fosc_data.assigned_pm': "",
                                    'teclab_data.fosc_data.assigned_director': "",

                                    'teclab_data.fosc_data.foundation_scan_status': False,
                                    'teclab_data.fosc_data.foundation_scan_date': None,
                                    'teclab_data.fosc_data.foundation_report_status': False,
                                    'teclab_data.fosc_data.foundation_reporter': "",
                                    'teclab_data.fosc_data.foundation_report_date': None,
                                    'teclab_data.fosc_data.foundation_uploaded': False,

                                    'teclab_data.fosc_data.slab_scan_status': False,
                                    'teclab_data.fosc_data.slab_scan_date': None,
                                    'teclab_data.fosc_data.slab_report_status': False,
                                    'teclab_data.fosc_data.slab_reporter': "",
                                    'teclab_data.fosc_data.slab_report_date': None,
                                    'teclab_data.fosc_data.slab_uploaded': False,

                                    'teclab_data.fosc_data.frame_scan_status': False,
                                    'teclab_data.fosc_data.frame_scan_date': None,
                                    'teclab_data.fosc_data.frame_report_status': False,
                                    'teclab_data.fosc_data.frame_reporter': "",
                                    'teclab_data.fosc_data.frame_report_date': None,
                                    'teclab_data.fosc_data.frame_uploaded': False,

                                    'teclab_data.fosc_data.mep_scan_status': False,
                                    'teclab_data.fosc_data.mep_scan_date': None,
                                    'teclab_data.fosc_data.mep_report_status': False,
                                    'teclab_data.fosc_data.mep_reporter': "",
                                    'teclab_data.fosc_data.mep_report_date': None,
                                    'teclab_data.fosc_data.mep_uploaded': False,

                                    'teclab_data.fosc_data.misc_scan_status': False,
                                    'teclab_data.fosc_data.misc_report_status': False,
                                    'teclab_data.fosc_data.notes': "",

                                    'teclab_data.fosc_data.foundation_needed': True,
                                    'teclab_data.fosc_data.slab_needed': True,
                                    'teclab_data.fosc_data.frame_needed': True,
                                    'teclab_data.fosc_data.mep_needed': False,

                                }}
                              )

    res = projects_coll.find()
    result = []
    for doc in res:
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(project)

    return result

# """


