from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class TicketHistoryBase(BaseModel):
    old_status: Optional[str] = None
    new_status: str = Field(..., max_length=50)
    changed_by: str = Field(default="System", max_length=100)
    notes: Optional[str] = None


class TicketHistoryCreate(TicketHistoryBase):
    ticket_id: int


class TicketHistoryResponse(TicketHistoryBase):
    id: int
    ticket_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)