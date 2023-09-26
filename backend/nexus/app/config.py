from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str

    SERVER_ADDRESS: str

    MONGODB_URL: str

    ACCESS_TOKEN_EXPIRES_IN: int
    REFRESH_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str

    CLIENT_ORIGIN: str

    ACCESS_TOKEN_SECRET: str
    REFRESH_TOKEN_SECRET: str

    SMTP_SERVER_ADDRESS: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SENDER_EMAIL: str

    OFFICE_CLIENT_ID: str
    OFFICE_CLIENT_SECRET: str
    OFFICE_TENANT_ID: str
    OFFICE_RESOURCE_URI: str

    class Config:
        env_file = "./.env"


settings = Settings()
