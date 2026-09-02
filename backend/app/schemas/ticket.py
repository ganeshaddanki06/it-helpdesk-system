from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

from app.models.enums import RequesterType, TicketCategory, TicketPriority, TicketStatus
from app.schemas.technician import TechnicianResponse

try:
    from app.schemas.history import TicketHistoryResponse
except ImportError:
    from app.schemas.history import HistoryResponse as TicketHistoryResponse


class TicketBase(BaseModel):
    requester_name: str = Field(..., min_length=2, max_length=100)
    requester_type: RequesterType = RequesterType.STUDENT
    category: TicketCategory = TicketCategory.OTHER
    priority: TicketPriority = TicketPriority.MEDIUM
    location: str = Field(..., min_length=2, max_length=100)
    issue_title: str = Field(..., min_length=3, max_length=200)
    issue_description: str = Field(..., min_length=5)


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_technician_id: Optional[int] = None
    resolution_notes: Optional[str] = None


class TicketResponse(TicketBase):
    id: int
    ticket_id: str
    status: TicketStatus
    assigned_technician_id: Optional[int] = None
    assigned_technician: Optional[TechnicianResponse] = None
    resolution_notes: Optional[str] = None
    history: List[TicketHistoryResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Pagination & Filtered Tickets List Response
class TicketListResponse(BaseModel):
    tickets: List[TicketResponse]
    total: int
    page: int
    limit: int
    total_pages: int