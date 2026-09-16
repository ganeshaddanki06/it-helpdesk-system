import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.services.seed_data import seed_database

from app.routes.auth import router as auth_router
from app.routes.tickets import router as tickets_router
from app.routes.assets import router as assets_router
from app.routes.analytics import router as analytics_router


def run_seed_background():
    """Runs student seeding in background so the server port opens instantly."""
    db = SessionLocal()
    try:
        seed_database(db)
        print("[DATABASE] Student and Faculty seeding completed successfully!", flush=True)
    except Exception as e:
        print(f"[DATABASE ERROR] Seeding failed: {e}", flush=True)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create tables instantly
    Base.metadata.create_all(bind=engine)
    
    # 2. Run heavy student seeding in background thread (port binds in 1 second!)
    threading.Thread(target=run_seed_background, daemon=True).start()
    
    print("[SERVER] Uvicorn bound to port instantly. Ready for incoming traffic!", flush=True)
    yield


app = FastAPI(
    title="ACET IT Helpdesk & Asset Management System",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://it-helpdesk-system-2m9r.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api/v1
API_PREFIX = "/api/v1"
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(tickets_router, prefix=API_PREFIX)
app.include_router(assets_router, prefix=API_PREFIX)
app.include_router(analytics_router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ACET IT Helpdesk Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }