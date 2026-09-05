import os
from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    APP_NAME: str = "IT Helpdesk & Asset Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "production"
    DATABASE_URL: str = "sqlite:///./it_helpdesk.db"
    FRONTEND_URL: str = "http://localhost:5173"
    
    CORS_ORIGINS: Union[str, List[str]] = "https://it-helpdesk-system-2m9r.vercel.app,http://localhost:5173,http://127.0.0.1:5173"

    SECRET_KEY: str = "it-helpdesk-jwt-secret-key-2026-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "admin123"

    # Live SMTP Email Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_NAME: str = "ACET IT Support"

    @property
    def effective_smtp_user(self) -> str:
        return self.SMTP_USER or os.getenv("MAIL_USERNAME") or os.getenv("SMTP_USER") or "ganeshaddanki06@gmail.com"

    @property
    def effective_smtp_password(self) -> str:
        pwd = self.SMTP_PASSWORD or os.getenv("MAIL_PASSWORD") or os.getenv("SMTP_PASSWORD") or ""
        return pwd.replace(" ", "")

    @property
    def effective_smtp_host(self) -> str:
        return os.getenv("MAIL_SERVER") or os.getenv("SMTP_HOST") or self.SMTP_HOST or "smtp.gmail.com"

    @property
    def effective_smtp_port(self) -> int:
        return int(os.getenv("MAIL_PORT") or os.getenv("SMTP_PORT") or self.SMTP_PORT or 587)

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]

    @property
    def cors_origins_list(self) -> List[str]:
        return self.cors_origins

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()