from app.auth.security import get_password_hash
from app.config import settings
from app.models.asset import Asset
from app.models.enums import (
    AssetStatus,
    AssetType,
    RequesterType,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    UserRole,
)
from app.models.history import TicketHistory
from app.models.technician import Technician
from app.models.ticket import Ticket
from app.models.user import User
from sqlalchemy.orm import Session


def seed_database(db: Session):
  """Inserts Master Faculty Directory, Admin, Technicians and Demo Assets."""
  # 1. GUARANTEE ADMIN PASSWORD IS ALWAYS admin123
  admin_user = (
      db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
  )
  if not admin_user:
    admin_user = User(
        username=settings.ADMIN_USERNAME,
        email=settings.ADMIN_EMAIL,
        full_name="System Administrator",
        hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
        role=UserRole.ADMIN.value,
        is_active=True,
    )
    db.add(admin_user)
    db.commit()
  else:
    admin_user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
    admin_user.is_active = True
    db.commit()

  # 2. GUARANTEE FACULTY YDP (faculty123)
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

  # 3. GUARANTEE FACULTY ALAN (faculty123)
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

  # 4. Tech and Student
  if not db.query(User).filter(User.username == "tech_rahul").first():
    tech_user = User(
        username="tech_rahul",
        email="rahul.kumar@demo.org",
        full_name="Rahul Kumar (Hardware Technician)",
        hashed_password=get_password_hash("tech123"),
        role=UserRole.TECHNICIAN.value,
        is_active=True,
    )
    db.add(tech_user)
    db.commit()

  if not db.query(User).filter(User.username == "student_user").first():
    std_user = User(
        username="student_user",
        email="student@demo.org",
        full_name="Ganesh Addanki (Student - 21P31A05xx)",
        hashed_password=get_password_hash("user123"),
        role=UserRole.USER.value,
        is_active=True,
    )
    db.add(std_user)
    db.commit()