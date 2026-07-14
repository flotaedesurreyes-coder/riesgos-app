from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import CostoBeneficio

router = APIRouter()


class CBCreate(BaseModel):
    indicador_id: int
    accion: str
    riesgo_asociado: Optional[str] = ""
    presupuesto: Optional[int] = 0
    disminucion_impacto: Optional[int] = 0
    disminucion_probabilidad: Optional[int] = 0
    tiempo_implementacion: Optional[int] = 0
    personal_propio: Optional[int] = 0
    impacto_imagen: Optional[int] = 0
    impacto_resultados: Optional[int] = 0
    impacto_equipos: Optional[int] = 0
    impacto_legales: Optional[int] = 0
    probabilidad_antes: Optional[int] = 0


class CBOut(BaseModel):
    id: int
    indicador_id: int
    accion: str
    riesgo_asociado: str
    presupuesto: int
    disminucion_impacto: int
    disminucion_probabilidad: int
    tiempo_implementacion: int
    personal_propio: int
    total_beneficios: int
    impacto_imagen: int
    impacto_resultados: int
    impacto_equipos: int
    impacto_legales: int
    probabilidad_antes: int
    total_consecuencias: int
    relacion_bc: Optional[float]
    decision: str

    class Config:
        from_attributes = True


@router.get("/cb", response_model=List[CBOut])
def listar_cb(indicador_id: int, db: Session = Depends(get_db)):
    return db.query(CostoBeneficio).filter(CostoBeneficio.indicador_id == indicador_id).all()


@router.post("/cb", response_model=CBOut)
def crear_cb(data: CBCreate, db: Session = Depends(get_db)):
    cb = CostoBeneficio(**data.model_dump())
    db.add(cb)
    db.commit()
    db.refresh(cb)
    return cb


@router.put("/cb/{id}", response_model=CBOut)
def actualizar_cb(id: int, data: CBCreate, db: Session = Depends(get_db)):
    cb = db.query(CostoBeneficio).get(id)
    if not cb:
        raise HTTPException(404, "Accion CB no encontrada")
    for k, v in data.model_dump().items():
        setattr(cb, k, v)
    db.commit()
    db.refresh(cb)
    return cb


@router.delete("/cb/{id}")
def eliminar_cb(id: int, db: Session = Depends(get_db)):
    cb = db.query(CostoBeneficio).get(id)
    if not cb:
        raise HTTPException(404, "Accion CB no encontrada")
    db.delete(cb)
    db.commit()
    return {"ok": True}
