from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    APP_NAME: str = "IT Helpdesk & Asset Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "production"
    DATABASE_URL: str = "sqlite:///./it_helpdesk.db"
    
    # Comma-separated list or Array of allowed frontend domains
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://127.0.0.1:5173"

    # JWT Authentication
    SECRET_KEY: str = "it-helpdesk-super-secret-dev-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Default Seed Admin Credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "admin123"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parses comma-separated string from environment into a clean list."""
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()