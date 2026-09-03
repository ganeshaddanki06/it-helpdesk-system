from sqlalchemy.orm import Session
from app.models.user import User
from app.models.technician import Technician
from app.models.asset import Asset
from app.models.ticket import Ticket
from app.models.history import TicketHistory
from app.models.enums import (
    UserRole,
    RequesterType,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    AssetType,
    AssetStatus,
)
from app.auth.security import get_password_hash
from app.config import settings


def seed_database(db: Session):
    """Inserts Master Faculty Directory, Admin, Technicians and Demo Assets."""
    # 1. Guarantee YDP faculty account exists with faculty123 password
    ydp_user = db.query(User).filter(User.username == "ydp").first()
    if not ydp_user:
        ydp_user = User(
            username="ydp",
            email="ydp.cse@acet.ac.in",
            full_name="Prof. Y.D.P (Faculty, CSE)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        db.add(ydp_user)
        db.commit()
    else:
        ydp_user.hashed_password = get_password_hash("faculty123")
        db.commit()

    # 2. Guarantee faculty_alan exists with faculty123 password
    alan_user = db.query(User).filter(User.username == "faculty_alan").first()
    if not alan_user:
        alan_user = User(
            username="faculty_alan",
            email="alan.cse@acet.ac.in",
            full_name="Dr. Alan Turing (Faculty, CSE)",
            hashed_password=get_password_hash("faculty123"),
            role=UserRole.FACULTY.value,
            is_active=True,
        )
        db.add(alan_user)
        db.commit()
    else:
        alan_user.hashed_password = get_password_hash("faculty123")
        db.commit()

    # 3. Seed Admin & Technicians & Student if not exist
    if not db.query(User).filter(User.username == settings.ADMIN_USERNAME).first():
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            full_name="System Administrator",
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            role=UserRole.ADMIN.value,
            is_active=True,
        )
        tech_user = User(
            username="tech_rahul",
            email="rahul.kumar@demo.org",
            full_name="Rahul Kumar (Hardware Technician)",
            hashed_password=get_password_hash("tech123"),
            role=UserRole.TECHNICIAN.value,
            is_active=True,
        )
        std_user = User(
            username="student_user",
            email="student@demo.org",
            full_name="Ganesh Addanki (Student - 21P31A05xx)",
            hashed_password=get_password_hash("user123"),
            role=UserRole.USER.value,
            is_active=True,
        )
        db.add_all([admin_user, tech_user, std_user])
        db.commit()

    # 4. Seed Technicians table if empty
    if db.query(Technician).count() == 0:
        tech1 = Technician(
            name="Rahul Kumar",
            email="rahul.kumar@demo.org",
            department="IT Hardware Support",
            phone="555-0101",
            is_active=True,
        )
        tech2 = Technician(
            name="Priya Sharma",
            email="priya.sharma@demo.org",
            department="Network Operations",
            phone="555-0102",
            is_active=True,
        )
        db.add_all([tech1, tech2])
        db.commit()

    # 5. Seed Assets table if empty
    if db.query(Asset).count() == 0:
        asset1 = Asset(
            asset_id="AST-1001",
            asset_name="Dell OptiPlex 7090 Workstation",
            asset_type=AssetType.DESKTOP.value,
            serial_number="DL-7090-9912",
            location="Cotton Bhavan - CS Lab 3, System #14",
            department="Computer Science & Engineering",
            purchase_date="2024-01-10",
            status=AssetStatus.WORKING.value,
            assigned_person="Prof. Y.D.P (Faculty, CSE)",
            notes="Core i7, 16GB RAM, Dual OS Ubuntu/Windows",
        )
        asset2 = Asset(
            asset_id="AST-1002",
            asset_name="Epson EB-X49 Ceiling Projector",
            asset_type=AssetType.PROJECTOR.value,
            serial_number="EP-X49-3321",
            location="Seminar Hall A, 1st Floor",
            department="Academic Affairs",
            purchase_date="2023-08-15",
            status=AssetStatus.UNDER_MAINTENANCE.value,
            assigned_person="AV Team",
            notes="HDMI port testing and lamp replacement scheduled.",
        )
        db.add_all([asset1, asset2])
        db.commit()