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


import logging
logging.basicConfig(
    level=logging.INFO,  # Adjust the log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def connect_mongodb():

    print("TRYING TO CONNECT TO MONGODB")
    logger.info("TRYING TO CONNECT TO MONGODB")
    try:
        client.admin.command("ping")
        print("Database Connection: ✅")
        logger.info("Database Connection: ✅")
        print(f"Database Name: {database_name}")
        logger.info(f"Database Name: {database_name}")
    except Exception as e:
        print("Database Connection FAILED: ❌", e)
        logger.error("Database Connection FAILED: ❌", e)
