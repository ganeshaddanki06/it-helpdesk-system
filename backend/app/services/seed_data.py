from sqlalchemy.orm import Session
from app.models.user import User
from app.models.technician import Technician
from app.models.asset import Asset
from app.models.ticket import Ticket
from app.models.history import TicketHistory
from app.models.enums import UserRole, RequesterType, TicketCategory, TicketPriority, TicketStatus, AssetType, AssetStatus
from app.auth.security import get_password_hash
from app.config import settings


def seed_database(db: Session):
    """Inserts default Admin, Faculty, Technician and demo records if empty."""
    # 1. Seed Accounts
    if not db.query(User).filter(User.username == settings.ADMIN_USERNAME).first():
        print(f"[*] Seeding default Admin user: {settings.ADMIN_USERNAME}")
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            full_name="System Administrator",
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            role=UserRole.ADMIN.value,
            is_active=True,
        )
        # Direct Faculty Accounts (No registration required)
        faculty_alan = User(
            username="faculty_alan",
            email="alan.cse@acet.ac.in",
            full_name="Dr. Alan Turing (Professor & HOD, CSE)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        faculty_ananya = User(
            username="faculty_ananya",
            email="ananya.cse@acet.ac.in",
            full_name="Prof. Ananya Rao (Assistant Professor)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        tech_user = User(
            username="tech_rahul",
            email="rahul.kumar@demo.org",
            full_name="Rahul Kumar (IT Technician)",
            hashed_password=get_password_hash("tech123"),
            role=UserRole.TECHNICIAN.value,
            is_active=True,
        )
        std_user = User(
            username="student_user",
            email="student@demo.org",
            full_name="Standard Student User",
            hashed_password=get_password_hash("user123"),
            role=UserRole.USER.value,
            is_active=True,
        )
        db.add_all([admin_user, faculty_alan, faculty_ananya, tech_user, std_user])
        db.commit()

    if db.query(Technician).count() > 0:
        return

    print("[*] Seeding demo technicians, assets, and tickets...")

    # Technicians
    tech1 = Technician(name="Rahul Kumar", email="rahul.kumar@demo.org", department="IT Support", phone="555-0101", is_active=True)
    tech2 = Technician(name="Priya Sharma", email="priya.sharma@demo.org", department="Network Ops", phone="555-0102", is_active=True)
    tech3 = Technician(name="Amit Patel", email="amit.patel@demo.org", department="Hardware Support", phone="555-0103", is_active=False)
    db.add_all([tech1, tech2, tech3])
    db.commit()

    # Assets
    asset1 = Asset(
        asset_id="AST-1001",
        asset_name="Dell OptiPlex 7090 Desktop",
        asset_type=AssetType.DESKTOP.value,
        serial_number="DL-7090-9912",
        location="Lab 2, Room 204",
        department="Computer Science",
        purchase_date="2024-01-10",
        status=AssetStatus.WORKING.value,
        assigned_person="Lab Assistant",
        notes="Preloaded with Ubuntu and programming tools."
    )
    asset2 = Asset(
        asset_id="AST-1002",
        asset_name="Epson EB-X49 Projector",
        asset_type=AssetType.PROJECTOR.value,
        serial_number="EP-X49-3321",
        location="Seminar Hall A",
        department="Academic Affairs",
        purchase_date="2023-08-15",
        status=AssetStatus.UNDER_MAINTENANCE.value,
        assigned_person="AV Team",
        notes="Lamp replacement scheduled."
    )
    db.add_all([asset1, asset2])
    db.commit()

    # Tickets
    ticket1 = Ticket(
        ticket_id="TCK-1001",
        requester_name="Dr. Alan Turing",
        requester_type=RequesterType.FACULTY.value,
        category=TicketCategory.NETWORK.value,
        issue_title="Wi-Fi disconnecting in Lab 3",
        issue_description="Students and faculty in Lab 3 are experiencing dropped wireless connections.",
        location="Lab 3, 2nd Floor",
        priority=TicketPriority.HIGH.value,
        status=TicketStatus.IN_PROGRESS.value,
        assigned_technician_id=tech2.id,
        resolution_notes="Technician investigating AP firmware and signal channel interference."
    )
    ticket2 = Ticket(
        ticket_id="TCK-1002",
        requester_name="Vikas Reddy",
        requester_type=RequesterType.STUDENT.value,
        category=TicketCategory.PROJECTOR.value,
        issue_title="Projector flickering in Seminar Hall A",
        issue_description="Projector displays flickering purple screen when connected via HDMI cable.",
        location="Seminar Hall A",
        priority=TicketPriority.CRITICAL.value,
        status=TicketStatus.OPEN.value,
        assigned_technician_id=tech1.id,
        resolution_notes=None
    )
    db.add_all([ticket1, ticket2])
    db.commit()

    # History
    hist1 = TicketHistory(ticket_id=ticket1.id, old_status=None, new_status=TicketStatus.OPEN.value, changed_by="Dr. Alan Turing", notes="Ticket created.")
    hist2 = TicketHistory(ticket_id=ticket1.id, old_status=TicketStatus.OPEN.value, new_status=TicketStatus.IN_PROGRESS.value, changed_by="Rahul Kumar", notes="Assigned to Priya Sharma.")
    db.add_all([hist1, hist2])
    db.commit()
    print("[*] Demo seeding complete.")