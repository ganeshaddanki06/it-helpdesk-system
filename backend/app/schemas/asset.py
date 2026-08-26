from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.enums import AssetType, AssetStatus


class AssetBase(BaseModel):
    asset_name: str = Field(..., min_length=2, max_length=150, description="Name or model of the asset")
    asset_type: AssetType = Field(default=AssetType.OTHER, description="Hardware equipment category")
    serial_number: Optional[str] = Field(default=None, max_length=100, description="Unique manufacturer serial number")
    location: str = Field(..., min_length=2, max_length=100, description="Room, lab, or office location")
    department: Optional[str] = Field(default=None, max_length=100, description="Department responsible for the asset")
    purchase_date: Optional[str] = Field(default=None, max_length=20, description="Purchase date in YYYY-MM-DD format")
    status: AssetStatus = Field(default=AssetStatus.WORKING, description="Working, Under Maintenance, or Out of Service")
    assigned_person: Optional[str] = Field(default=None, max_length=100, description="Person or lab in-charge")
    notes: Optional[str] = Field(default=None, description="Additional notes or specifications")


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    asset_name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    asset_type: Optional[AssetType] = None
    serial_number: Optional[str] = Field(default=None, max_length=100)
    location: Optional[str] = Field(default=None, min_length=2, max_length=100)
    department: Optional[str] = Field(default=None, max_length=100)
    purchase_date: Optional[str] = Field(default=None, max_length=20)
    status: Optional[AssetStatus] = None
    assigned_person: Optional[str] = Field(default=None, max_length=100)
    notes: Optional[str] = None


class AssetResponse(AssetBase):
    id: int
    asset_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedAssetResponse(BaseModel):
    items: List[AssetResponse] = Field(..., description="List of assets matching query")
    total: int = Field(..., description="Total matching assets")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Maximum items per page")
    total_pages: int = Field(..., description="Total pages available")

    model_config = ConfigDict(from_attributes=True)