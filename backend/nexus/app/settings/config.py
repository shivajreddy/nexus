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

    class Config:
        env_file: str


# Determine the environment and set the appropriate .env.prod file
env = os.getenv("APP_ENV", "development")
print("Environment is :APP_ENV=", env)
if env == "production":
    settings = Settings(_env_file="./.env.prod")
elif env == "test":
    settings = Settings(_env_file="./.env.test")
elif env == "dev":
    settings = Settings(_env_file="./.env.dev")
else:
    settings = Settings(_env_file="./.env.dev")
