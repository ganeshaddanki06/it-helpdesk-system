from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.stats import (
    DashboardSummary,
    CountByStatusResponse,
    CountByPriorityResponse,
    CountByCategoryResponse,
    CountByAssetStatusResponse,
    CountByAssetTypeResponse,
    TechnicianWorkloadResponse,
    RecentTicketItem,
    RecentAssetItem,
)
from app.schemas.technician import TechnicianResponse
from app.services import analytics_service

router = APIRouter(tags=["Analytics & Technicians"])


@router.get(
    "/analytics/summary",
    response_model=DashboardSummary,
    status_code=status.HTTP_200_OK,
    summary="Get overall dashboard ticket and asset counters"
)
def get_dashboard_summary(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_summary(db)


@router.get(
    "/analytics/tickets/status",
    response_model=CountByStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ticket distribution by status"
)
def get_tickets_by_status(db: Session = Depends(get_db)):
    return analytics_service.get_tickets_by_status(db)


@router.get(
    "/analytics/tickets/priority",
    response_model=CountByPriorityResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ticket distribution by priority"
)
def get_tickets_by_priority(db: Session = Depends(get_db)):
    return analytics_service.get_tickets_by_priority(db)


@router.get(
    "/analytics/tickets/category",
    response_model=CountByCategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ticket distribution by category"
)
def get_tickets_by_category(db: Session = Depends(get_db)):
    return analytics_service.get_tickets_by_category(db)


@router.get(
    "/analytics/assets/status",
    response_model=CountByAssetStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get asset distribution by status"
)
def get_assets_by_status(db: Session = Depends(get_db)):
    return analytics_service.get_assets_by_status(db)


@router.get(
    "/analytics/assets/type",
    response_model=CountByAssetTypeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get asset distribution by hardware type"
)
def get_assets_by_type(db: Session = Depends(get_db)):
    return analytics_service.get_assets_by_type(db)


@router.get(
    "/analytics/technicians/workload",
    response_model=TechnicianWorkloadResponse,
    status_code=status.HTTP_200_OK,
    summary="Get technician ticket workload"
)
def get_technicians_workload(db: Session = Depends(get_db)):
    return analytics_service.get_technicians_workload(db)


@router.get(
    "/technicians",
    response_model=List[TechnicianResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all technicians list"
)
def get_technicians(db: Session = Depends(get_db)):
    return analytics_service.get_technicians_list(db)


@router.get(
    "/analytics/recent-tickets",
    response_model=List[RecentTicketItem],
    status_code=status.HTTP_200_OK,
    summary="Get recent tickets"
)
def get_recent_tickets(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return analytics_service.get_recent_tickets(db=db, limit=limit)


@router.get(
    "/analytics/recent-assets",
    response_model=List[RecentAssetItem],
    status_code=status.HTTP_200_OK,
    summary="Get recent assets"
)
def get_recent_assets(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return analytics_service.get_recent_assets(db=db, limit=limit)