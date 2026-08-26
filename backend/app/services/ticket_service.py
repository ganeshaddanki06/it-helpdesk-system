import math
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
from datetime import datetime

from app.models.ticket import Ticket
from app.models.history import TicketHistory
from app.models.technician import Technician
from app.models.enums import RequesterType, TicketCategory, TicketPriority, TicketStatus
from app.schemas.ticket import TicketCreate, TicketUpdate


def generate_ticket_id(db: Session) -> str:
    """Generates a sequential ticket ID in the format IT-YYYY-XXXX (e.g. IT-2026-0001)."""
    current_year = datetime.utcnow().year
    prefix = f"IT-{current_year}-"

    total_count = db.query(Ticket).filter(Ticket.ticket_id.like(f"{prefix}%")).count()
    next_num = total_count + 1

    while True:
        candidate_id = f"{prefix}{next_num:04d}"
        if not db.query(Ticket).filter(Ticket.ticket_id == candidate_id).first():
            return candidate_id
        next_num += 1


def create_ticket(db: Session, ticket_in: TicketCreate) -> Ticket:
    """Creates a new ticket and logs initial creation history."""
    if ticket_in.assigned_technician_id is not None:
        tech = db.query(Technician).filter(Technician.id == ticket_in.assigned_technician_id).first()
        if not tech:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Technician with ID {ticket_in.assigned_technician_id} does not exist."
            )

    new_ticket_id = generate_ticket_id(db)

    db_ticket = Ticket(
        ticket_id=new_ticket_id,
        requester_name=ticket_in.requester_name,
        requester_type=ticket_in.requester_type.value,
        category=ticket_in.category.value,
        issue_title=ticket_in.issue_title,
        issue_description=ticket_in.issue_description,
        location=ticket_in.location,
        priority=ticket_in.priority.value,
        status=TicketStatus.OPEN.value,
        assigned_technician_id=ticket_in.assigned_technician_id,
        resolution_notes=None,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    # Initial history log
    initial_history = TicketHistory(
        ticket_id=db_ticket.id,
        old_status=None,
        new_status=TicketStatus.OPEN.value,
        changed_by=db_ticket.requester_name,
        notes="Ticket created."
    )
    db.add(initial_history)
    db.commit()
    db.refresh(db_ticket)

    return db_ticket


def get_all_tickets(
    db: Session,
    search: Optional[str] = None,
    status_filter: Optional[TicketStatus] = None,
    priority_filter: Optional[TicketPriority] = None,
    category_filter: Optional[TicketCategory] = None,
    requester_type_filter: Optional[RequesterType] = None,
    location: Optional[str] = None,
    assigned_technician_id: Optional[int] = None,
    is_assigned: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
) -> Dict[str, Any]:
    """Retrieves filtered, sorted, and paginated tickets with total count metadata."""
    query = db.query(Ticket)

    # 1. Global Multi-Field Search
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(search_term),
                Ticket.requester_name.ilike(search_term),
                Ticket.issue_title.ilike(search_term),
                Ticket.issue_description.ilike(search_term),
                Ticket.location.ilike(search_term),
            )
        )

    # 2. Strict Enum Filters
    if status_filter:
        query = query.filter(Ticket.status == status_filter.value)
    if priority_filter:
        query = query.filter(Ticket.priority == priority_filter.value)
    if category_filter:
        query = query.filter(Ticket.category == category_filter.value)
    if requester_type_filter:
        query = query.filter(Ticket.requester_type == requester_type_filter.value)

    # 3. Location Filter (Partial matching)
    if location and location.strip():
        query = query.filter(Ticket.location.ilike(f"%{location.strip()}%"))

    # 4. Technician Assignment Filter
    if assigned_technician_id is not None:
        query = query.filter(Ticket.assigned_technician_id == assigned_technician_id)
    elif is_assigned is not None:
        if is_assigned:
            query = query.filter(Ticket.assigned_technician_id.isnot(None))
        else:
            query = query.filter(Ticket.assigned_technician_id.is_(None))

    # Total matching records before pagination
    total = query.count()

    # 5. Safe Sorting with Whitelist
    sortable_columns = {
        "created_at": Ticket.created_at,
        "updated_at": Ticket.updated_at,
        "priority": Ticket.priority,
        "status": Ticket.status,
        "issue_title": Ticket.issue_title,
    }
    target_column = sortable_columns.get(sort_by, Ticket.created_at)
    order_func = desc if sort_order.lower() == "desc" else asc
    query = query.order_by(order_func(target_column))

    # 6. Pagination
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    total_pages = math.ceil(total / limit) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


def get_ticket_by_id(db: Session, identifier: str) -> Ticket:
    """Retrieves a single ticket by its string ticket_id or database ID."""
    if identifier.isdigit():
        ticket = db.query(Ticket).filter(Ticket.id == int(identifier)).first()
    else:
        ticket = db.query(Ticket).filter(Ticket.ticket_id == identifier).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    return ticket


def update_ticket(db: Session, identifier: str, ticket_in: TicketUpdate) -> Ticket:
    """Updates a ticket and records a history log when status changes."""
    db_ticket = get_ticket_by_id(db, identifier)
    old_status = db_ticket.status

    update_data = ticket_in.model_dump(exclude_unset=True)

    if "assigned_technician_id" in update_data and update_data["assigned_technician_id"] is not None:
        tech = db.query(Technician).filter(Technician.id == update_data["assigned_technician_id"]).first()
        if not tech:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Technician with ID {update_data['assigned_technician_id']} does not exist."
            )

    for field, value in update_data.items():
        if hasattr(value, "value"):
            setattr(db_ticket, field, value.value)
        else:
            setattr(db_ticket, field, value)

    db_ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_ticket)

    # History audit on status change
    if "status" in update_data and update_data["status"] and update_data["status"].value != old_status:
        history_entry = TicketHistory(
            ticket_id=db_ticket.id,
            old_status=old_status,
            new_status=db_ticket.status,
            changed_by="IT Support / Admin",
            notes=ticket_in.resolution_notes or f"Status changed from {old_status} to {db_ticket.status}"
        )
        db.add(history_entry)
        db.commit()
        db.refresh(db_ticket)

    return db_ticket


def delete_ticket(db: Session, identifier: str) -> dict:
    """Deletes a ticket."""
    db_ticket = get_ticket_by_id(db, identifier)
    deleted_id = db_ticket.ticket_id
    db.delete(db_ticket)
    db.commit()
    return {"status": "success", "message": f"Ticket '{deleted_id}' deleted successfully."}