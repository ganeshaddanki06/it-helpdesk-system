from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Dict, Any, List

from app.models.ticket import Ticket
from app.models.asset import Asset
from app.models.technician import Technician
from app.models.enums import TicketStatus, TicketPriority, TicketCategory, AssetStatus, AssetType


def get_dashboard_summary(db: Session) -> Dict[str, Any]:
    """Calculates overall ticket and asset status counters dynamically."""
    total_tickets = db.query(Ticket).count()
    open_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.OPEN.value).count()
    in_prog_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.IN_PROGRESS.value).count()
    resolved_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.RESOLVED.value).count()
    closed_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.CLOSED.value).count()

    total_assets = db.query(Asset).count()
    working_assets = db.query(Asset).filter(Asset.status == AssetStatus.WORKING.value).count()
    maint_assets = db.query(Asset).filter(Asset.status == AssetStatus.UNDER_MAINTENANCE.value).count()
    oos_assets = db.query(Asset).filter(Asset.status == AssetStatus.OUT_OF_SERVICE.value).count()

    return {
        "tickets": {
            "total": total_tickets,
            "open": open_tickets,
            "in_progress": in_prog_tickets,
            "resolved": resolved_tickets,
            "closed": closed_tickets,
        },
        "assets": {
            "total": total_assets,
            "working": working_assets,
            "under_maintenance": maint_assets,
            "out_of_service": oos_assets,
        },
    }


def get_tickets_by_status(db: Session) -> Dict[str, Any]:
    """Returns ticket counts for all statuses (includes 0 for empty statuses)."""
    status_counts = {s.value: 0 for s in TicketStatus}
    results = db.query(Ticket.status, func.count(Ticket.id)).group_by(Ticket.status).all()
    for st, count in results:
        status_counts[st] = count
    return {"data": [{"status": k, "count": v} for k, v in status_counts.items()]}


def get_tickets_by_priority(db: Session) -> Dict[str, Any]:
    """Returns ticket counts for all priorities (includes 0 for empty priorities)."""
    priority_counts = {p.value: 0 for p in TicketPriority}
    results = db.query(Ticket.priority, func.count(Ticket.id)).group_by(Ticket.priority).all()
    for pr, count in results:
        priority_counts[pr] = count
    return {"data": [{"priority": k, "count": v} for k, v in priority_counts.items()]}


def get_tickets_by_category(db: Session) -> Dict[str, Any]:
    """Returns ticket counts for all categories (includes 0 for empty categories)."""
    category_counts = {c.value: 0 for c in TicketCategory}
    results = db.query(Ticket.category, func.count(Ticket.id)).group_by(Ticket.category).all()
    for cat, count in results:
        category_counts[cat] = count
    return {"data": [{"category": k, "count": v} for k, v in category_counts.items()]}


def get_assets_by_status(db: Session) -> Dict[str, Any]:
    """Returns asset counts for all asset statuses."""
    status_counts = {s.value: 0 for s in AssetStatus}
    results = db.query(Asset.status, func.count(Asset.id)).group_by(Asset.status).all()
    for st, count in results:
        status_counts[st] = count
    return {"data": [{"status": k, "count": v} for k, v in status_counts.items()]}


def get_assets_by_type(db: Session) -> Dict[str, Any]:
    """Returns asset counts for all hardware types."""
    type_counts = {t.value: 0 for t in AssetType}
    results = db.query(Asset.asset_type, func.count(Asset.id)).group_by(Asset.asset_type).all()
    for at, count in results:
        type_counts[at] = count
    return {"data": [{"asset_type": k, "count": v} for k, v in type_counts.items()]}


def get_technicians_workload(db: Session) -> Dict[str, Any]:
    """Returns assigned ticket count for every technician using an outer join."""
    results = (
        db.query(
            Technician.id.label("technician_id"),
            Technician.name.label("technician_name"),
            func.count(Ticket.id).label("assigned_tickets"),
        )
        .outerjoin(Ticket, Technician.id == Ticket.assigned_technician_id)
        .group_by(Technician.id, Technician.name)
        .order_by(desc("assigned_tickets"))
        .all()
    )
    data = [
        {
            "technician_id": r.technician_id,
            "technician_name": r.technician_name,
            "assigned_tickets": r.assigned_tickets,
        }
        for r in results
    ]
    return {"data": data}


def get_recent_tickets(db: Session, limit: int = 5) -> List[Ticket]:
    """Fetches the latest tickets sorted newest first."""
    return db.query(Ticket).order_by(desc(Ticket.created_at)).limit(limit).all()


def get_recent_assets(db: Session, limit: int = 5) -> List[Asset]:
    """Fetches the latest assets sorted newest first."""
    return db.query(Asset).order_by(desc(Asset.created_at)).limit(limit).all()
    