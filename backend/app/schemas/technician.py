from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime


class TechnicianBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(default="IT Support", max_length=100)
    phone: Optional[str] = Field(default=None, max_length=20)
    is_active: bool = True


class TechnicianCreate(TechnicianBase):
    pass


class TechnicianUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=20)
    is_active: Optional[bool] = None


class TechnicianResponse(TechnicianBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)