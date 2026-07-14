from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
from app.routes import indicadores, matriz_7m, criterios, cinco_por_que, amfec, costo_beneficio, exportar

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RiesgosApp API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(indicadores.router, prefix="/api", tags=["Indicadores"])
app.include_router(matriz_7m.router, prefix="/api", tags=["Matriz 7M"])
app.include_router(criterios.router, prefix="/api", tags=["Criterios"])
app.include_router(cinco_por_que.router, prefix="/api", tags=["5 Por Que"])
app.include_router(amfec.router, prefix="/api", tags=["AMFEC"])
app.include_router(costo_beneficio.router, prefix="/api", tags=["Costo Beneficio"])
app.include_router(exportar.router, prefix="/api", tags=["Exportar"])


@app.get("/")
def root():
    return {
        "message": "RiesgosApp API",
        "version": "1.0.0",
        "author": "Isaac Reyes",
        "course": "Gestion de Riesgos"
    }
