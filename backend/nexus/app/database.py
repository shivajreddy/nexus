import certifi
from pymongo import MongoClient

from app.config import settings

client = MongoClient(settings.MONGODB_URL, tlsCAFile=certifi.where())

# use the database dedicated to the environment
database_name = settings.DATABASE_NAME

db = client[database_name]

# :: name of collections
eagle_data_coll = db["eagle-data"]
users_coll = db["users"]


def connect_mongodb():
    try:
        client.admin.command("ping")
        print("Database Connection: ✅")
    except Exception as e:
        print("Database Connection: ❌", e)
