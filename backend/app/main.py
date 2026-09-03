from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.routes.auth import router as auth_router
from app.routes.tickets import router as tickets_router
from app.routes.assets import router as assets_router
from app.routes.analytics import router as analytics_router
import app.models


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    print(f"[*] Database online & seeded: {settings.DATABASE_URL}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="RESTful API for the IT Helpdesk and Asset Management System.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Comprehensive CORS Configuration for Vercel & Localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://it-helpdesk-system-2m9r.vercel.app",
        "https://it-helpdesk-system-sigma.vercel.app",
        "https://it-helpdesk-system-3xy4.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(tickets_router, prefix=settings.API_V1_STR)
app.include_router(assets_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }


@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": "IT Helpdesk API is running"
    }