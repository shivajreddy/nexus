import certifi
from pymongo import MongoClient

from app.settings.config import settings

client = MongoClient(settings.MONGODB_URL, tlsCAFile=certifi.where())

# use the database dedicated to the environment
database_name = settings.DATABASE_NAME

db = client[database_name]

# :: name of collections
users_coll = db["users"]
eagle_data_coll = db["eagle-data"]
department_data_coll = db["department_data"]
projects_coll = db["projects"]


def connect_mongodb():
    try:
        client.admin.command("ping")
        print("Database Connection: ✅")
        print(f"Database Name: {database_name}")
    except Exception as e:
        print("Database Connection FAILED: ❌", e)
