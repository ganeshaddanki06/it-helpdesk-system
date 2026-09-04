from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketListResponse,
)
from app.services import ticket_service

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new support ticket"
)
def create_ticket(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
):
    return ticket_service.create_ticket(db=db, ticket_in=ticket_in)


@router.get(
    "",
    response_model=TicketListResponse,
    status_code=status.HTTP_200_OK,
    summary="Search, filter, and paginate tickets"
)
def list_tickets(
    search: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    priority: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    location: Optional[str] = Query(default=None),
    assigned_technician_id: Optional[int] = Query(default=None),
    sort_by: Optional[str] = Query(default="created_at"),
    sort_order: Optional[str] = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return ticket_service.list_tickets(
        db=db,
        search=search,
        status=status,
        priority=priority,
        category=category,
        location=location,
        assigned_technician_id=assigned_technician_id,
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
    return ticket_service.get_ticket_by_id(db=db, identifier=ticket_id)


@router.put(
    "/{ticket_id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a ticket status"
)
def update_ticket(
    ticket_id: str,
    ticket_in: TicketUpdate,
    db: Session = Depends(get_db),
):
    return ticket_service.update_ticket(db=db, identifier=ticket_id, ticket_in=ticket_in)


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a ticket"
)
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    return ticket_service.delete_ticket(db=db, identifier=ticket_id)