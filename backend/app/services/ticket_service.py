from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import Optional, Dict, Any
from datetime import datetime
from fastapi import HTTPException, status

from app.models.ticket import Ticket
from app.models.history import TicketHistory
from app.schemas.ticket import TicketCreate, TicketUpdate


def generate_ticket_id(db: Session) -> str:
    year = datetime.utcnow().year
    count = db.query(Ticket).count()
    return f"IT-{year}-{count + 1:04d}"


def create_ticket(db: Session, ticket_in: TicketCreate) -> Ticket:
    ticket_id = generate_ticket_id(db)
    req_type = str(ticket_in.requester_type.value if hasattr(ticket_in.requester_type, 'value') else ticket_in.requester_type)
    cat = str(ticket_in.category.value if hasattr(ticket_in.category, 'value') else ticket_in.category)
    prio = str(ticket_in.priority.value if hasattr(ticket_in.priority, 'value') else ticket_in.priority)

    db_ticket = Ticket(
        ticket_id=ticket_id,
        requester_name=ticket_in.requester_name,
        requester_type=req_type,
        category=cat,
        priority=prio,
        location=ticket_in.location,
        issue_title=ticket_in.issue_title,
        issue_description=ticket_in.issue_description,
        status="Open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    try:
        hist = TicketHistory(
            ticket_id=db_ticket.id,
            old_status=None,
            new_status="Open",
            changed_by=ticket_in.requester_name,
            notes="Ticket created."
        )
        db.add(hist)
        db.commit()
        db.refresh(db_ticket)
    except Exception:
        pass

    return db_ticket


def list_tickets(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    assigned_technician_id: Optional[int] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    page: int = 1,
    limit: int = 10,
) -> Dict[str, Any]:
    query = db.query(Ticket)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Ticket.issue_title.ilike(search_filter),
                Ticket.issue_description.ilike(search_filter),
                Ticket.requester_name.ilike(search_filter),
                Ticket.location.ilike(search_filter),
                Ticket.ticket_id.ilike(search_filter),
            )
        )

    if status:
        st_val = str(status.value if hasattr(status, 'value') else status)
        query = query.filter(Ticket.status == st_val)

    if priority:
        pr_val = str(priority.value if hasattr(priority, 'value') else priority)
        query = query.filter(Ticket.priority == pr_val)

    if category:
        cat_val = str(category.value if hasattr(category, 'value') else category)
        query = query.filter(Ticket.category == cat_val)

    if location:
        query = query.filter(Ticket.location.ilike(f"%{location.strip()}%"))

    if assigned_technician_id:
        query = query.filter(Ticket.assigned_technician_id == assigned_technician_id)

    total = query.count()
    total_pages = (total + limit - 1) // limit if limit > 0 else 1

    sort_col = getattr(Ticket, sort_by, Ticket.created_at) if hasattr(Ticket, sort_by) else Ticket.created_at
    if sort_order == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    offset = (page - 1) * limit
    tickets = query.offset(offset).limit(limit).all()

    return {
        "tickets": tickets,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }


def get_ticket_by_id(db: Session, identifier: str) -> Ticket:
    if identifier.isdigit():
        ticket = db.query(Ticket).filter(Ticket.id == int(identifier)).first()
    else:
        ticket = db.query(Ticket).filter(Ticket.ticket_id == identifier).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{identifier}' not found"
        )
    return ticket


def update_ticket(db: Session, identifier: str, ticket_in: TicketUpdate) -> Ticket:
    ticket = get_ticket_by_id(db, identifier)
    old_status = ticket.status

    if ticket_in.status:
        ticket.status = str(ticket_in.status.value if hasattr(ticket_in.status, 'value') else ticket_in.status)

    if ticket_in.priority:
        ticket.priority = str(ticket_in.priority.value if hasattr(ticket_in.priority, 'value') else ticket_in.priority)

    if ticket_in.assigned_technician_id is not None:
        ticket.assigned_technician_id = ticket_in.assigned_technician_id

    if ticket_in.resolution_notes:
        ticket.resolution_notes = ticket_in.resolution_notes

    ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ticket)

    if ticket_in.status and str(old_status) != str(ticket.status):
        try:
            hist = TicketHistory(
                ticket_id=ticket.id,
                old_status=old_status,
                new_status=ticket.status,
                changed_by="Support Staff",
                notes=ticket_in.resolution_notes or f"Status changed to {ticket.status}."
            )
            db.add(hist)
            db.commit()
            db.refresh(ticket)
        except Exception:
            pass

    return ticket


def delete_ticket(db: Session, identifier: str):
    ticket = get_ticket_by_id(db, identifier)
    db.delete(ticket)
    db.commit()
    return {"status": "success", "message": f"Ticket {identifier} deleted"}