
- Moving one field into a new/other field in a document, and removing the old field
```python
result = projects_coll.aggregate([
        # {'$match': filter_query},
        {
            '$set': {
                'project_info': {
                    'project_uid': '$project_uid',
                    'project_id': '$project_id'
                },
                'meta_info': {
                    'created_at': '$created_at',
                    'created_by': ''
                },
                'contract_info': {
                    'contract_type': '$contract_type',
                    'contract_date': '$contract_date'
                }
            },
        },
        # {'$project': {'created_at': 0, 'contract_type': 0, 'contract_date': 0}},  # Exclude the 'created_at' field
        {'$merge': {'into': 'projects', 'whenMatched': 'merge'}},
    ])

projects_coll.update_many(
    {},
    # filter_query,
    {
        '$unset': {'created_at': '', 'contract_type': '', 'contract_date': '', 'project_uid': '', 'project_id': ''}
    }
)
```

- Add a new field 'project-id' based on other fields
```python
communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
all_communities_names = communities_doc["all_communities_names"]
community_codes = communities_doc["community_codes"]

all_ids = set()
for doc in projects_coll.find():
    c_1 = doc["teclab_data"]["epc_data"]["community"]
    # get the community_code for this community
    c = next((item[1] for item in community_codes if item[0] == c_1), "")
    s = doc["teclab_data"]["epc_data"]["section_number"]
    l = doc["teclab_data"]["epc_data"]["lot_number"]
    # 1. create the project_id
    unique_id = c + "-" + s + "-" + l
    if unique_id in all_ids:
        print("DUP:", unique_id)
    else:
        all_ids.add(unique_id)

    # 2. set the project_id
    projects_coll.update_one({"_id": doc["_id"]}, {"$set": {"project_id": unique_id}})
```

> How to Backup the production database into another database under a collection with name "nexus-<date-of-backup>"
```python
@router.get('/backup-database')
def backup_production_database():
    # Get current date for backup name
    current_date = datetime.now().strftime("%Y-%m-%d")
    backup_db_name = f"nexus-{current_date}"
    
    # Source database
    production_db = client["nexus"]
    
    # Target database
    backup_db = client[backup_db_name]
    
    # Get all collection names from the production database
    collection_names = production_db.list_collection_names()
    
    # Track statistics
    backup_status_production = {}  # Changed from a single value to a dictionary
    backup_stats_backedup = {}     # Fixed variable name from backup_stats to backup_stats_backedup
    
    # Iterate through all collections
    for collection_name in collection_names:
        # Source collection
        production_collection = production_db[collection_name]
        
        # Target collection
        backup_collection = backup_db[collection_name]
        
        # Get all documents from the source collection
        all_documents = list(production_collection.find())
        backup_status_production[collection_name] = len(all_documents)  # Save count to dictionary with collection name as key
        
        # Insert documents into the target collection if there are any
        if all_documents:
            backup_collection.insert_many(all_documents)
            
        # Track stats
        backup_stats_backedup[collection_name] = len(list(backup_collection.find()))
    
    return {
        "status": "success",
        "message": f"Backed up {len(collection_names)} collections to {backup_db_name} database",
        "collections_in_production": backup_status_production,  # Added missing comma
        "collections_backed_up": backup_stats_backedup
    }
```

> How to create a clone a database (i.e., copy all collections from one database to another)
```python
@router.get('/backup-database')
def backup_database():
    # Source database
    production_db = client["nexus"]
    
    # Target database
    backup_db = client["nexus-dev"]
    # backup_db = client["nexus-backup"]
    
    # Get all collection names from the production database
    collection_names = production_db.list_collection_names()
    
    # Track statistics
    backup_stats = {}
    
    # Iterate through all collections
    for collection_name in collection_names:
        # Source collection
        production_collection = production_db[collection_name]
        
        # Target collection
        backup_collection = backup_db[collection_name]
        
        # Drop the target collection if it exists
        backup_collection.drop()
        
        # Get all documents from the source collection
        all_documents = list(production_collection.find())
        
        # Insert documents into the target collection if there are any
        if all_documents:
            backup_collection.insert_many(all_documents)
            
        # Track stats
        backup_stats[collection_name] = len(all_documents)
    
    return {
        "status": "success",
        "message": f"Backed up {len(collection_names)} collections to nexus-backup database",
        "collections_backed_up": backup_stats
    }
```

> How to copy a collection from one database to another
- (backup)
```python
@router.get('/backup-projects')
def backupdb():
  production_db = client["nexus"]
  production_projects_coll = production_db["projects"]
  all_production_projects = production_projects_coll.find()

  backup_db = client["nexus-backup"]
  backup_projects_coll = backup_db["projects"]
  backup_projects_coll.drop()
  backup_projects_coll.insert_many(all_production_projects)

  return "ALL projects imported"
```
```python
@router.get('/import-projects')
def import_projects():
    production_db = client["nexus"]
    production_projects_coll = production_db["projects"]
    all_production_projects = production_projects_coll.find()
    
    projects_coll.insert_many(all_production_projects)
    
    return "ALL projects imported"

@router.get('/import-users')
def import_projects():
    production_db = client["nexus"]
    production_users_coll = production_db["users"]
    all_users_projects = production_users_coll.find()

    users_coll.insert_many(all_users_projects)

    return "ALL users imported"
```

- add user_info ppty to the user's doc in DB
```python
@router.get('/add-userinfo-field')
def make_db_changes_for_users():
# add the 'info' object to all users
user_info = UserInfo(first_name="",
last_name="",
work_phone="",
personal_phone="",
department="",
teams=[],
job_title="")
users_coll.update_many({}, {'$set': {'user_info': user_info.model_dump()}})

    # get the users collection
    result = []
    for doc in users_coll.find():
        u = {k: v for (k, v) in doc.items() if k != "_id"}
        # user = User()
        result.append(u)
    return result
```
