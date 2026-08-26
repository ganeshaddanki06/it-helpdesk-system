from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.enums import AssetType, AssetStatus
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, PaginatedAssetResponse
from app.services import asset_service

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post(
    "",
    response_model=AssetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new IT asset"
)
def create_asset(asset_in: AssetCreate, db: Session = Depends(get_db)):
    """Creates a new hardware asset with an auto-generated Asset ID (e.g. AST-2026-0001)."""
    return asset_service.create_asset(db=db, asset_in=asset_in)


@router.get(
    "",
    response_model=PaginatedAssetResponse,
    status_code=status.HTTP_200_OK,
    summary="Search, filter, sort, and paginate IT assets"
)
def get_all_assets(
    search: Optional[str] = Query(default=None, description="Search across asset ID, name, serial number, location, department, or assigned person"),
    asset_type: Optional[AssetType] = Query(default=None, description="Filter by asset category"),
    status: Optional[AssetStatus] = Query(default=None, description="Filter by status (Working, Under Maintenance, Out of Service)"),
    department: Optional[str] = Query(default=None, description="Filter by department name"),
    location: Optional[str] = Query(default=None, description="Filter by location keyword"),
    sort_by: str = Query(default="created_at", pattern="^(asset_id|asset_name|asset_type|purchase_date|status|created_at|updated_at)$", description="Field to sort by"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$", description="Sort order ('asc' or 'desc')"),
    page: int = Query(default=1, ge=1, description="Page number (>= 1)"),
    limit: int = Query(default=10, ge=1, le=100, description="Items per page (1 to 100)"),
    db: Session = Depends(get_db),
):
    """Returns a paginated list of assets matching all specified query filters."""
    return asset_service.get_all_assets(
        db=db,
        search=search,
        asset_type=asset_type,
        status_filter=status,
        department=department,
        location=location,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{asset_id}",
    response_model=AssetResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single asset by ID"
)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    """Fetches complete asset details by string Asset ID (e.g. AST-2026-0001) or database integer ID."""
    return asset_service.get_asset_by_id(db=db, identifier=asset_id)


@router.put(
    "/{asset_id}",
    response_model=AssetResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing asset"
)
def update_asset(asset_id: str, asset_in: AssetUpdate, db: Session = Depends(get_db)):
    """Updates asset details like location, status, assigned person, or notes."""
    return asset_service.update_asset(db=db, identifier=asset_id, asset_in=asset_in)


@router.delete(
    "/{asset_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an asset"
)
def delete_asset(asset_id: str, db: Session = Depends(get_db)):
    """Permanently deletes an asset."""
    return asset_service.delete_asset(db=db, identifier=asset_id)