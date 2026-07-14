from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import Riesgo7M

router = APIRouter()

CATEGORIAS_7M = [
    "MANO DE OBRA", "MATERIALES", "METODO",
    "MAQUINARIA", "MEDICION", "MEDIO AMBIENTE"
]


class Riesgo7MCreate(BaseModel):
    indicador_id: int
    categoria: str
    fuente: str
    riesgo: str
    descripcion: Optional[str] = ""
    efecto: Optional[str] = ""
    controles: Optional[str] = ""


class Riesgo7MOut(BaseModel):
    id: int
    indicador_id: int
    categoria: str
    fuente: str
    riesgo: str
    descripcion: str
    efecto: str
    controles: str

    class Config:
        from_attributes = True


@router.get("/7m", response_model=List[Riesgo7MOut])
def listar_riesgos(indicador_id: int, db: Session = Depends(get_db)):
    return db.query(Riesgo7M).filter(Riesgo7M.indicador_id == indicador_id).all()


@router.post("/7m", response_model=Riesgo7MOut)
def crear_riesgo(data: Riesgo7MCreate, db: Session = Depends(get_db)):
    if data.categoria not in CATEGORIAS_7M:
        raise HTTPException(400, f"Categoria invalida. Use: {', '.join(CATEGORIAS_7M)}")
    r = Riesgo7M(**data.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.put("/7m/{id}", response_model=Riesgo7MOut)
def actualizar_riesgo(id: int, data: Riesgo7MCreate, db: Session = Depends(get_db)):
    r = db.query(Riesgo7M).get(id)
    if not r:
        raise HTTPException(404, "Riesgo no encontrado")
    for k, v in data.model_dump().items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/7m/{id}")
def eliminar_riesgo(id: int, db: Session = Depends(get_db)):
    r = db.query(Riesgo7M).get(id)
    if not r:
        raise HTTPException(404, "Riesgo no encontrado")
    db.delete(r)
    db.commit()
    return {"ok": True}


@router.get("/7m/categorias")
def obtener_categorias():
    return CATEGORIAS_7M
