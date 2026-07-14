from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import AMFECRow

router = APIRouter()


class AMFECCreate(BaseModel):
    indicador_id: int
    siete_m: str
    componente: str
    funcion: str
    modo_fallo: str
    efecto: str
    causa: str
    controles: Optional[str] = ""
    probabilidad: int
    impacto: int
    detectabilidad: int
    clasificacion: Optional[str] = ""
    tratamiento: Optional[str] = "Mitigar"
    accion: Optional[str] = ""
    responsable: Optional[str] = ""
    actividades: Optional[str] = ""


class AMFECOut(BaseModel):
    id: int
    indicador_id: int
    siete_m: str
    componente: str
    funcion: str
    modo_fallo: str
    efecto: str
    causa: str
    controles: str
    probabilidad: int
    impacto: int
    detectabilidad: int
    npr: int
    clasificacion: str
    tratamiento: str
    accion: str
    responsable: str
    actividades: str

    class Config:
        from_attributes = True


def calcular_clasificacion(npr: int) -> str:
    if npr <= 27:
        return "Bajo"
    if npr <= 64:
        return "Moderado"
    return "Alto"


@router.get("/amfec", response_model=List[AMFECOut])
def listar_amfec(indicador_id: int, db: Session = Depends(get_db)):
    rows = db.query(AMFECRow).filter(AMFECRow.indicador_id == indicador_id).all()
    for r in rows:
        if not r.clasificacion:
            r.clasificacion = calcular_clasificacion(r.npr)
    return rows


@router.post("/amfec", response_model=AMFECOut)
def crear_amfec(data: AMFECCreate, db: Session = Depends(get_db)):
    npr = data.probabilidad * data.impacto * data.detectabilidad
    clasif = data.clasificacion or calcular_clasificacion(npr)
    row = AMFECRow(**data.model_dump(exclude={"clasificacion"}), clasificacion=clasif)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/amfec/{id}", response_model=AMFECOut)
def actualizar_amfec(id: int, data: AMFECCreate, db: Session = Depends(get_db)):
    row = db.query(AMFECRow).get(id)
    if not row:
        raise HTTPException(404, "Fila AMFEC no encontrada")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    row.clasificacion = calcular_clasificacion(row.npr)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/amfec/{id}")
def eliminar_amfec(id: int, db: Session = Depends(get_db)):
    row = db.query(AMFECRow).get(id)
    if not row:
        raise HTTPException(404, "Fila AMFEC no encontrada")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/amfec/calcular-npr/{id}")
def calcular_npr(id: int, db: Session = Depends(get_db)):
    row = db.query(AMFECRow).get(id)
    if not row:
        raise HTTPException(404, "Fila AMFEC no encontrada")
    row.clasificacion = calcular_clasificacion(row.npr)
    db.commit()
    return {"npr": row.npr, "clasificacion": row.clasificacion}
