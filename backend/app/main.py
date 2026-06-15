from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logger import logger
from app.routes.dashboard import router as dashboard_router
from app.routes.games import router as games_router
from app.routes.analytics import router as analytics_router
from app.routes.recommendations import router as recommendations_router
from app.routes.reports import router as reports_router
from app.routes.executive import router as executive_router
from app.middlewares.error_handler import global_exception_handler
## configurações de logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"{settings.PROJECT_NAME} iniciado com sucesso")
    yield
    logger.info(f"{settings.PROJECT_NAME} encerrado")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="Plataforma de análise e inteligência de dados da Steam",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas principais
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(games_router, prefix="/api/games", tags=["Games"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(recommendations_router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
app.include_router(executive_router, prefix="/api/executive", tags=["Executive"])

app.add_exception_handler(Exception, global_exception_handler)


@app.get("/")
def home():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.API_VERSION,
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.API_VERSION,
    }
