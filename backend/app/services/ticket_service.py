
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TicketBase(BaseModel):
  requester_name: str
  requester_type: str = "Faculty"
  category: str = "Other"
  priority: str = "Medium"
  location: str
  issue_title: str
  issue_description: str


class TicketCreate(TicketBase):
  pass


class TicketUpdate(BaseModel):
  status: Optional[str] = None
  priority: Optional[str] = None
  assigned_technician_id: Optional[int] = None
  resolution_notes: Optional[str] = None


# Ticket History Serialization Item
class TicketHistoryItem(BaseModel):
  id: Optional[int] = None
  ticket_id: Optional[int] = None
  old_status: Optional[str] = None
  new_status: Optional[str] = None
  changed_by: Optional[str] = None
  notes: Optional[str] = None
  created_at: Optional[datetime] = None

  model_config = ConfigDict(from_attributes=True, extra="ignore")


# Full Ticket Response with Serialized History
class TicketResponse(BaseModel):
  id: int
  ticket_id: str
  requester_name: str
  requester_type: str = "Faculty"
  category: str = "Other"
  priority: str = "Medium"
  status: str = "Open"
  location: str = ""
  issue_title: str = ""
  issue_description: str = ""
  assigned_technician_id: Optional[int] = None
  resolution_notes: Optional[str] = None
  history: List[TicketHistoryItem] = []
  created_at: Optional[datetime] = None
  updated_at: Optional[datetime] = None

  model_config = ConfigDict(from_attributes=True, extra="ignore")


class TicketListResponse(BaseModel):
  tickets: List[TicketResponse] = []
  total: int = 0
  page: int = 1
  limit: int = 10
  total_pages: int = 1

  model_config = ConfigDict(from_attributes=True, extra="ignore")