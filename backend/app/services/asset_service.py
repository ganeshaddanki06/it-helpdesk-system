import math
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
from datetime import datetime

from app.models.asset import Asset
from app.models.enums import AssetType, AssetStatus
from app.schemas.asset import AssetCreate, AssetUpdate


def generate_asset_id(db: Session) -> str:
    """Generates a sequential Asset ID in the format AST-YYYY-XXXX (e.g., AST-2026-0001)."""
    current_year = datetime.utcnow().year
    prefix = f"AST-{current_year}-"

    total_count = db.query(Asset).filter(Asset.asset_id.like(f"{prefix}%")).count()
    next_num = total_count + 1

    while True:
        candidate_id = f"{prefix}{next_num:04d}"
        if not db.query(Asset).filter(Asset.asset_id == candidate_id).first():
            return candidate_id
        next_num += 1


def create_asset(db: Session, asset_in: AssetCreate) -> Asset:
    """Creates a new asset and verifies serial number uniqueness."""
    # Prevent duplicate serial numbers
    if asset_in.serial_number and asset_in.serial_number.strip():
        existing_serial = db.query(Asset).filter(Asset.serial_number == asset_in.serial_number.strip()).first()
        if existing_serial:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An asset with serial number '{asset_in.serial_number}' already exists (Asset ID: {existing_serial.asset_id})."
            )

    new_asset_id = generate_asset_id(db)

    db_asset = Asset(
        asset_id=new_asset_id,
        asset_name=asset_in.asset_name,
        asset_type=asset_in.asset_type.value,
        serial_number=asset_in.serial_number.strip() if asset_in.serial_number else None,
        location=asset_in.location,
        department=asset_in.department,
        purchase_date=asset_in.purchase_date,
        status=asset_in.status.value,
        assigned_person=asset_in.assigned_person,
        notes=asset_in.notes,
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset


def get_all_assets(
    db: Session,
    search: Optional[str] = None,
    asset_type: Optional[AssetType] = None,
    status_filter: Optional[AssetStatus] = None,
    department: Optional[str] = None,
    location: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
) -> Dict[str, Any]:
    """Retrieves filtered, sorted, and paginated assets."""
    query = db.query(Asset)

    # 1. Global Multi-Field Search
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Asset.asset_id.ilike(search_term),
                Asset.asset_name.ilike(search_term),
                Asset.serial_number.ilike(search_term),
                Asset.location.ilike(search_term),
                Asset.department.ilike(search_term),
                Asset.assigned_person.ilike(search_term),
            )
        )

    # 2. Strict Enum Filters
    if asset_type:
        query = query.filter(Asset.asset_type == asset_type.value)
    if status_filter:
        query = query.filter(Asset.status == status_filter.value)

    # 3. Partial Text Filters
    if department and department.strip():
        query = query.filter(Asset.department.ilike(f"%{department.strip()}%"))
    if location and location.strip():
        query = query.filter(Asset.location.ilike(f"%{location.strip()}%"))

    # Total matching records before pagination
    total = query.count()

    # 4. Safe Sorting Whitelist
    sortable_columns = {
        "asset_id": Asset.asset_id,
        "asset_name": Asset.asset_name,
        "asset_type": Asset.asset_type,
        "purchase_date": Asset.purchase_date,
        "status": Asset.status,
        "created_at": Asset.created_at,
        "updated_at": Asset.updated_at,
    }
    target_column = sortable_columns.get(sort_by, Asset.created_at)
    order_func = desc if sort_order.lower() == "desc" else asc
    query = query.order_by(order_func(target_column))

    # 5. Pagination
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


def get_asset_by_id(db: Session, identifier: str) -> Asset:
    """Finds an asset by database ID or string asset_id (e.g. AST-2026-0001)."""
    if identifier.isdigit():
        asset = db.query(Asset).filter(Asset.id == int(identifier)).first()
    else:
        asset = db.query(Asset).filter(Asset.asset_id == identifier).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    return asset


def update_asset(db: Session, identifier: str, asset_in: AssetUpdate) -> Asset:
    """Updates asset details and prevents duplicate serial numbers."""
    db_asset = get_asset_by_id(db, identifier)
    update_data = asset_in.model_dump(exclude_unset=True)

    # Check for duplicate serial number on another asset
    if "serial_number" in update_data and update_data["serial_number"]:
        sn = update_data["serial_number"].strip()
        existing = db.query(Asset).filter(Asset.serial_number == sn, Asset.id != db_asset.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Serial number '{sn}' is already assigned to asset '{existing.asset_id}'."
            )

    # Apply updates
    for field, value in update_data.items():
        if hasattr(value, "value"):
            setattr(db_asset, field, value.value)
        else:
            setattr(db_asset, field, value)

    db_asset.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_asset)
    return db_asset


def delete_asset(db: Session, identifier: str) -> dict:
    """Deletes an asset."""
    db_asset = get_asset_by_id(db, identifier)
    deleted_id = db_asset.asset_id
    db.delete(db_asset)
    db.commit()
    return {"status": "success", "message": f"Asset '{deleted_id}' deleted successfully."}