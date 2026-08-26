from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from app.models.enums import RequesterType, TicketCategory, TicketPriority, TicketStatus


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. TCK-1001
    requester_name = Column(String(100), nullable=False)
    requester_type = Column(String(50), default=RequesterType.STUDENT.value, nullable=False)
    category = Column(String(50), default=TicketCategory.OTHER.value, nullable=False)
    issue_title = Column(String(200), nullable=False)
    issue_description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    priority = Column(String(50), default=TicketPriority.MEDIUM.value, nullable=False)
    status = Column(String(50), default=TicketStatus.OPEN.value, nullable=False)
    
    assigned_technician_id = Column(Integer, ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    technician = relationship("Technician", back_populates="tickets")
    history = relationship("TicketHistory", back_populates="ticket", cascade="all, delete-orphan")