"""
- All the routes in here should not be accessible to any user of the application
- Can only aaccessed by the developer, for performing maintenance.
    - Allowed User roles: 
"""
from datetime import datetime


from fastapi import APIRouter, Depends

from app.database.database import client
from app.security.oauth2 import HasRequiredRoles


router = APIRouter(prefix="/admin")

# @router.get("/test")
@router.get('/test', dependencies=[Depends(HasRequiredRoles(required_roles=[999]))])
def test():
    return "TESTING WORKS FROM /maintenance router"

# Backup the production database into another database under a collection with name "nexus-<date-of-backup>"
@router.get('/backup-database', dependencies=[Depends(HasRequiredRoles(required_roles=[999]))])
def backup_production_database():
    # Get current date for backup name
    current_date = datetime.now().strftime("%Y-%m-%d")
    backup_db_name = f"nexus-backup-{current_date}"
    
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

# Create a clone a database (i.e., copy all collections from one database to another)
@router.get('/clone-database', dependencies=[Depends(HasRequiredRoles(required_roles=[999]))])
def backup_database():
    # Source database
    source_db_name = "nexus"
    production_db = client[source_db_name]
    
    # Target database
    target_db_name = "nexus-dev"
    dev_db = client[target_db_name]
    
    # Get all collection names from the production database
    collection_names = production_db.list_collection_names()
    
    # Track statistics
    cloning_stats = {}
    
    # Iterate through all collections
    for collection_name in collection_names:
        # Source collection
        production_collection = production_db[collection_name]
        
        # Target collection
        dev_collection = dev_db[collection_name]
        
        # Drop the target collection if it exists
        dev_collection.drop()
        
        # Get all documents from the source collection
        all_documents = list(production_collection.find())
        
        # Insert documents into the target collection if there are any
        if all_documents:
            dev_collection.insert_many(all_documents)
            
        # Track stats
        cloning_stats[collection_name] = len(all_documents)
    
    return {
        "status": "success",
        "message": f"Cloned up {len(collection_names)} collections to {target_db_name} database",
        "collections_backed_up": cloning_stats
    }


