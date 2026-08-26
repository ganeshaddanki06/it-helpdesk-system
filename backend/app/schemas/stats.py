from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime


# 1. Summary Schema
class TicketSummary(BaseModel):
    total: int = 0
    open: int = 0
    in_progress: int = 0
    resolved: int = 0
    closed: int = 0


class AssetSummary(BaseModel):
    total: int = 0
    working: int = 0
    under_maintenance: int = 0
    out_of_service: int = 0


class DashboardSummary(BaseModel):
    tickets: TicketSummary
    assets: AssetSummary

    model_config = ConfigDict(from_attributes=True)


# 2. Ticket Status Analytics
class CountByStatusItem(BaseModel):
    status: str
    count: int


class CountByStatusResponse(BaseModel):
    data: List[CountByStatusItem]


# 3. Ticket Priority Analytics
class CountByPriorityItem(BaseModel):
    priority: str
    count: int


class CountByPriorityResponse(BaseModel):
    data: List[CountByPriorityItem]


# 4. Ticket Category Analytics
class CountByCategoryItem(BaseModel):
    category: str
    count: int


class CountByCategoryResponse(BaseModel):
    data: List[CountByCategoryItem]


# 5. Asset Status Analytics
class CountByAssetStatusItem(BaseModel):
    status: str
    count: int


class CountByAssetStatusResponse(BaseModel):
    data: List[CountByAssetStatusItem]


# 6. Asset Type Analytics
class CountByAssetTypeItem(BaseModel):
    asset_type: str
    count: int


class CountByAssetTypeResponse(BaseModel):
    data: List[CountByAssetTypeItem]


# 7. Technician Workload
class TechnicianWorkloadItem(BaseModel):
    technician_id: int
    technician_name: str
    assigned_tickets: int


class TechnicianWorkloadResponse(BaseModel):
    data: List[TechnicianWorkloadItem]


# 8. Recent Ticket Item
class RecentTicketItem(BaseModel):
    id: int
    ticket_id: str
    issue_title: str
    requester_name: str
    priority: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# 9. Recent Asset Item
class RecentAssetItem(BaseModel):
    id: int
    asset_id: str
    asset_name: str
    asset_type: str
    status: str
    location: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)