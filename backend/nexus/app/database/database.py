import os
import certifi
import logging
from pymongo import MongoClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.settings.config import settings

# ===========================================
# LOGGING CONFIGURATION
# ===========================================
logging.basicConfig(
    level=logging.INFO,  # Adjust the log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ===========================================
# MONGODB CONFIGURATION
# ===========================================
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


# ===========================================
# IHMS MYSQL DATABASE CONFIGURATION
# ===========================================
# Build IHMS database URL
IHMS_DATABASE_URL = (
    f"mysql+aiomysql://{settings.IHMS_DB_USER}:{settings.IHMS_DB_PASS}"
    f"@{settings.IHMS_DB_HOST}:{settings.IHMS_DB_PORT}/{settings.IHMS_DB_NAME}"
)

# Create async engine for IHMS database
ihms_engine = create_async_engine(
    IHMS_DATABASE_URL,
    # Set to True for SQL query logging in development mode
    echo=True if os.getenv("APP_ENV", "dev") == "dev" else False,
    future=True,
    pool_pre_ping=True,  # Validate connections before use
    pool_recycle=3600,  # Recycle connections every hour
)

# Create session factory for IHMS database
IHMSAsyncSessionLocal = sessionmaker(  # pyright: ignore
    bind=ihms_engine, class_=AsyncSession, expire_on_commit=False  # pyright: ignore
)


async def get_ihms_session() -> AsyncSession:  # pyright: ignore
    """
    Dependency function to get IHMS database session.
    Use this in FastAPI route dependencies.
    """
    async with IHMSAsyncSessionLocal() as session:  # pyright: ignore
        yield session  # pyright: ignore


async def connect_ihms_db():
    """Test IHMS database connection"""
    print("TRYING TO CONNECT TO IHMS DATABASE")
    logger.info("TRYING TO CONNECT TO IHMS DATABASE")
    try:
        async with IHMSAsyncSessionLocal() as session:  # pyright: ignore
            # Test connection with a simple query
            result = await session.execute(text("SELECT 1"))
            result.fetchone()
            print("IHMS Database Connection: ✅")
            logger.info("IHMS Database Connection: ✅")
            print(f"IHMS Database Name: {settings.IHMS_DB_NAME}")
            logger.info(f"IHMS Database Name: {settings.IHMS_DB_NAME}")
    except Exception as e:
        print("IHMS Database Connection FAILED: ❌", e)
        logger.error(f"IHMS Database Connection FAILED: ❌ {e}")


def clean_ihms_data_row(row_dict: dict) -> dict:
    """
    Clean null bytes and whitespace from IHMS database row data.
    Use this helper function to clean data retrieved from IHMS database.
    """
    cleaned = {}
    for key, value in row_dict.items():
        if isinstance(value, str):
            # Remove null bytes and strip whitespace
            cleaned_value = value.replace("\x00", "").strip()
            # Convert empty strings to None for consistency
            cleaned[key] = cleaned_value if cleaned_value else None
        else:
            cleaned[key] = value
    return cleaned


# ===========================================
# CONNECTION TEST FUNCTION
# ===========================================
async def test_all_connections():
    """Test all database connections"""
    print("\n" + "=" * 50)
    print("TESTING ALL DATABASE CONNECTIONS")
    print("=" * 50)

    # Test MongoDB
    connect_mongodb()

    # Test IHMS MySQL
    await connect_ihms_db()

    print("=" * 50 + "\n")
