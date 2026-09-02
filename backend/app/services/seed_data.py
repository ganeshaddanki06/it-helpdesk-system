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
    """Inserts Master Faculty Directory, Admin, Technicians and Demo Assets."""
    
    # 1. Master Faculty List
    faculty_members = [
        {"username": "ydp", "full_name": "Prof. Y.D.P (Faculty, CSE)", "email": "ydp.cse@acet.ac.in"},
        {"username": "hod_cse", "full_name": "Dr. T. Neelakantam (HOD, CSE)", "email": "hod_cse@acet.ac.in"},
        {"username": "k_ramesh", "full_name": "Prof. K. Ramesh (Lab 3 In-Charge)", "email": "ramesh.cse@acet.ac.in"},
        {"username": "ananya_cse", "full_name": "Prof. Ananya Rao (Assistant Professor)", "email": "ananya.cse@acet.ac.in"},
        {"username": "suresh_cse", "full_name": "Prof. M. Suresh (Associate Professor)", "email": "suresh.cse@acet.ac.in"},
    ]

    for f in faculty_members:
        if not db.query(User).filter(User.username == f["username"]).first():
            print(f"[*] Seeding faculty: {f['username']}")
            faculty_user = User(
                username=f["username"],
                email=f["email"],
                full_name=f["full_name"],
                hashed_password=get_password_hash("faculty123"),
                role=UserRole.FACULTY.value,
                is_active=True,
            )
            db.add(faculty_user)
    db.commit()

    # 2. Seed Admin & Student
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

    if db.query(Technician).count() > 0:
        return

    # Seed Technicians
    tech1 = Technician(name="Rahul Kumar", email="rahul.kumar@demo.org", department="IT Hardware Support", phone="555-0101", is_active=True)
    tech2 = Technician(name="Priya Sharma", email="priya.sharma@demo.org", department="Network Operations", phone="555-0102", is_active=True)
    db.add_all([tech1, tech2])
    db.commit()