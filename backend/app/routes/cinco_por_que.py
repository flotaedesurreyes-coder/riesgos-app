from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import CincoPorQue, CincoPorQuePregunta

router = APIRouter()


class PreguntaCreate(BaseModel):
    nivel: int
    pregunta: str
    respuesta: str


class AnalisisCreate(BaseModel):
    indicador_id: int
    riesgo_id: Optional[int] = None
    titulo: str
    causa_raiz: Optional[str] = ""
    preguntas: List[PreguntaCreate]


class PreguntaOut(BaseModel):
    id: int
    nivel: int
    pregunta: str
    respuesta: str

    class Config:
        from_attributes = True


class AnalisisOut(BaseModel):
    id: int
    indicador_id: int
    riesgo_id: Optional[int]
    titulo: str
    causa_raiz: str
    preguntas: List[PreguntaOut] = []

    class Config:
        from_attributes = True


@router.get("/5pq", response_model=List[AnalisisOut])
def listar_analisis(indicador_id: int, db: Session = Depends(get_db)):
    analisis = db.query(CincoPorQue).filter(CincoPorQue.indicador_id == indicador_id).all()
    for a in analisis:
        a.preguntas = db.query(CincoPorQuePregunta).filter(
            CincoPorQuePregunta.analisis_id == a.id
        ).order_by(CincoPorQuePregunta.nivel).all()
    return analisis


@router.post("/5pq", response_model=AnalisisOut)
def crear_analisis(data: AnalisisCreate, db: Session = Depends(get_db)):
    a = CincoPorQue(
        indicador_id=data.indicador_id,
        riesgo_id=data.riesgo_id,
        titulo=data.titulo,
        causa_raiz=data.causa_raiz,
    )
    db.add(a)
    db.flush()
    for p in data.preguntas:
        db.add(CincoPorQuePregunta(
            analisis_id=a.id, nivel=p.nivel,
            pregunta=p.pregunta, respuesta=p.respuesta
        ))
    db.commit()
    db.refresh(a)
    a.preguntas = db.query(CincoPorQuePregunta).filter(
        CincoPorQuePregunta.analisis_id == a.id
    ).order_by(CincoPorQuePregunta.nivel).all()
    return a


@router.put("/5pq/{id}", response_model=AnalisisOut)
def actualizar_analisis(id: int, data: AnalisisCreate, db: Session = Depends(get_db)):
    a = db.query(CincoPorQue).get(id)
    if not a:
        raise HTTPException(404, "Analisis no encontrado")
    a.titulo = data.titulo
    a.causa_raiz = data.causa_raiz
    db.query(CincoPorQuePregunta).filter(CincoPorQuePregunta.analisis_id == id).delete()
    for p in data.preguntas:
        db.add(CincoPorQuePregunta(
            analisis_id=id, nivel=p.nivel,
            pregunta=p.pregunta, respuesta=p.respuesta
        ))
    db.commit()
    db.refresh(a)
    a.preguntas = db.query(CincoPorQuePregunta).filter(
        CincoPorQuePregunta.analisis_id == a.id
    ).order_by(CincoPorQuePregunta.nivel).all()
    return a


@router.delete("/5pq/{id}")
def eliminar_analisis(id: int, db: Session = Depends(get_db)):
    a = db.query(CincoPorQue).get(id)
    if not a:
        raise HTTPException(404, "Analisis no encontrado")
    db.delete(a)
    db.commit()
    return {"ok": True}
