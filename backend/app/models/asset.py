from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base
from app.models.enums import AssetType, AssetStatus


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. AST-1001
    asset_name = Column(String(150), nullable=False)
    asset_type = Column(String(50), default=AssetType.OTHER.value, nullable=False)
    serial_number = Column(String(100), unique=True, nullable=True, index=True)
    location = Column(String(100), nullable=False)
    department = Column(String(100), nullable=True)
    purchase_date = Column(String(20), nullable=True)
    status = Column(String(50), default=AssetStatus.WORKING.value, nullable=False)
    assigned_person = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)