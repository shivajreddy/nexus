import certifi
from pymongo import MongoClient

from app.config import settings

client = MongoClient(settings.MONGODB_URL, tlsCAFile=certifi.where())

database_name = "nexus"
db = client[database_name]

# :: name of collections
eagle_departments_coll = db["eagle-departments"]
users_coll = db["users"]


def connect_mongodb():
    try:
        client.admin.command("ping")
        print("Database Connection: ✅")
    except Exception as e:
        print("Database Connection: ❌", e)

