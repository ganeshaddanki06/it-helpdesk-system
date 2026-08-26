from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.enums import RequesterType, TicketCategory, TicketPriority, TicketStatus
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, PaginatedTicketResponse
from app.services import ticket_service

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new support ticket"
)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db)):
    """Accepts ticket details, automatically generates a unique Ticket ID, and sets status to 'Open'."""
    return ticket_service.create_ticket(db=db, ticket_in=ticket_in)


@router.get(
    "",
    response_model=PaginatedTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Search, filter, sort, and paginate support tickets"
)
def get_all_tickets(
    search: Optional[str] = Query(default=None, description="Search across ticket ID, requester, title, description, and location"),
    status: Optional[TicketStatus] = Query(default=None, description="Filter by status (Open, In Progress, Resolved, Closed)"),
    priority: Optional[TicketPriority] = Query(default=None, description="Filter by priority (Low, Medium, High, Critical)"),
    category: Optional[TicketCategory] = Query(default=None, description="Filter by category"),
    requester_type: Optional[RequesterType] = Query(default=None, description="Filter by requester type (Student, Faculty, Staff)"),
    location: Optional[str] = Query(default=None, description="Filter by location keyword (e.g., 'Lab 3')"),
    assigned_technician_id: Optional[int] = Query(default=None, description="Filter by assigned technician ID"),
    is_assigned: Optional[bool] = Query(default=None, description="Filter by assignment status (true for assigned, false for unassigned)"),
    sort_by: str = Query(default="created_at", pattern="^(created_at|updated_at|priority|status|issue_title)$", description="Field to sort by"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$", description="Sort order ('asc' or 'desc')"),
    page: int = Query(default=1, ge=1, description="Page number (>= 1)"),
    limit: int = Query(default=10, ge=1, le=100, description="Page size (1 to 100)"),
    db: Session = Depends(get_db),
):
    """Returns a paginated list of tickets matching all specified query filters."""
    return ticket_service.get_all_tickets(
        db=db,
        search=search,
        status_filter=status,
        priority_filter=priority,
        category_filter=category,
        requester_type_filter=requester_type,
        location=location,
        assigned_technician_id=assigned_technician_id,
        is_assigned=is_assigned,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single ticket by ID"
)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Fetches full ticket details including technician information and audit history."""
    return ticket_service.get_ticket_by_id(db=db, identifier=ticket_id)


@router.put(
    "/{ticket_id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing ticket"
)
def update_ticket(ticket_id: str, ticket_in: TicketUpdate, db: Session = Depends(get_db)):
    """Updates ticket status, priority, assigned technician, or resolution notes."""
    return ticket_service.update_ticket(db=db, identifier=ticket_id, ticket_in=ticket_in)


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a ticket"
)
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Permanently removes a ticket and its associated history."""
    return ticket_service.delete_ticket(db=db, identifier=ticket_id)