
This is how you query the db and then email the data as csv
```python
# :: EMAIL
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
            filtered_lots.append(p_epc_data)

    # contract_waiting_drafting = []
    # contract_waiting_eng_or_plat = []
    # contract_waiting_to_send_permit = []
    # pm_waiting_drafting = []
    # pm_waiting_eng_or_plat = []
    # pm_waiting_to_send_permit = []

    result_data = {}
    """
    format of the each item
        "community_name": (c_draft, c_eng, c_permit, pm_draft, pm_eng, pm_permit)
    """
    for p in filtered_lots:
        if p.community not in result_data:
            result_data[p.community] = [0, 0, 0, 0, 0, 0]

        if p.contract_type == 'Contract':
            if not p.drafting_finished:
                # contract_waiting_drafting.append(p)
                result_data[p.community][0] += 1
            elif not p.engineering_received or not p.plat_received:
                # contract_waiting_eng_or_plat.append(p)
                result_data[p.community][1] += 1
            elif not p.permitting_submitted:
                # contract_waiting_to_send_permit.append(p)
                result_data[p.community][2] += 1
        else:
            if not p.drafting_finished:
                # pm_waiting_drafting.append(p)
                result_data[p.community][3] += 1
            elif not p.engineering_received or not p.plat_received:
                # pm_waiting_eng_or_plat.append(p)
                result_data[p.community][4] += 1
            elif not p.permitting_submitted:
                # pm_waiting_to_send_permit.append(p)
                result_data[p.community][5] += 1

    # sum the totals in each community
    for k, v in result_data.items():
        v.append(sum(v))

    return filtered_lots, result_data


# Send Eagle back tracking email
@router.get('/epc-status')
def generate_send_csv():
    # query the data
    filtered_lots, result_data = query_tracker_data()

    # create the csv file
    today_date = datetime.now().strftime("%d-%m-%y")
    csv_filename = os.path.join("./app/files/HowTo", f"{today_date}-EagleBacklogTracker.csv")
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
    message['To'] = 'sreddy@tecofva.com'
    message.attach(MIMEText('This is the body', 'plain'))

    # attach the csv file to message
    with open(csv_filename, 'r') as file:
        attachment = MIMEText(file.read())
        attachment.add_header('Content-Disposition', 'attachment', filename=(today_date + "-EagleBacklogTracker.csv"))
        message.attach(attachment)

    send_email_with_given_message_and_attachment(
        "sreddy@tecofva.com",
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


```
