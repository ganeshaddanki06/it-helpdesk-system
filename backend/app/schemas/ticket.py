from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.enums import RequesterType, TicketCategory, TicketPriority, TicketStatus
from app.schemas.technician import TechnicianResponse
from app.schemas.history import TicketHistoryResponse


class TicketBase(BaseModel):
    requester_name: str = Field(..., min_length=2, max_length=100, description="Name of the person reporting the issue")
    requester_type: RequesterType = Field(default=RequesterType.STUDENT, description="Student, Faculty, or Staff")
    category: TicketCategory = Field(default=TicketCategory.OTHER, description="Category of the problem")
    issue_title: str = Field(..., min_length=3, max_length=200, description="Brief summary of the issue")
    issue_description: str = Field(..., min_length=5, description="Detailed explanation of the problem")
    location: str = Field(..., min_length=2, max_length=100, description="Campus room, lab, or office location")
    priority: TicketPriority = Field(default=TicketPriority.MEDIUM, description="Low, Medium, High, or Critical")


class TicketCreate(TicketBase):
    assigned_technician_id: Optional[int] = Field(default=None, description="Optional ID of assigned technician")


class TicketUpdate(BaseModel):
    requester_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    requester_type: Optional[RequesterType] = None
    category: Optional[TicketCategory] = None
    issue_title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    issue_description: Optional[str] = Field(default=None, min_length=5)
    location: Optional[str] = Field(default=None, min_length=2, max_length=100)
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    assigned_technician_id: Optional[int] = None
    resolution_notes: Optional[str] = None


class TicketResponse(TicketBase):
    id: int
    ticket_id: str
    status: TicketStatus
    assigned_technician_id: Optional[int] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    technician: Optional[TechnicianResponse] = None
    history: List[TicketHistoryResponse] = []

    model_config = ConfigDict(from_attributes=True)


class PaginatedTicketResponse(BaseModel):
    items: List[TicketResponse] = Field(..., description="List of tickets matching the query")
    total: int = Field(..., description="Total count of tickets matching the filter criteria")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Maximum items per page")
    total_pages: int = Field(..., description="Total pages available")

    model_config = ConfigDict(from_attributes=True)