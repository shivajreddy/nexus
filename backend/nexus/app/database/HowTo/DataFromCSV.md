
This is the script for converting csv data into mongodb
```python
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
```
