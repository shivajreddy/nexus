import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # General
    ENVIRONMENT: str

    # Database
    MONGODB_URL: str
    DATABASE_NAME: str

    # Address
    SERVER_ORIGIN: str
    CLIENT_ORIGIN: str

    # OAuth2 Settings
    ACCESS_TOKEN_EXPIRES_IN: int
    REFRESH_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str
    ACCESS_TOKEN_SECRET: str
    REFRESH_TOKEN_SECRET: str

    # Email Account
    SMTP_SERVER_ADDRESS: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SENDER_EMAIL: str

    # IHMS Api
    CLIENT_ID: str
    CLIENT_SECRET: str

    # IHMS Database
    IHMS_DB_USER: str
    IHMS_DB_PASS: str
    IHMS_DB_HOST: str
    IHMS_DB_PORT: str
    IHMS_DB_NAME: str

    class Config:
        env_file: str


# In production, vars are injected by docker compose (env_file / environment:).
# In dev/test, load from a local .env file.
env = os.getenv("APP_ENV", "dev")
print("Environment is :APP_ENV=", env)
if env == "production":
    settings = Settings()
elif env == "test":
    settings = Settings(_env_file="./.env.test")
else:
    settings = Settings(_env_file="./.env.dev")
