from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import Empresa, Indicador

router = APIRouter()


class EmpresaCreate(BaseModel):
    nombre: str


class EmpresaOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class IndicadorCreate(BaseModel):
    empresa_id: int
    nombre: str
    descripcion: Optional[str] = ""


class IndicadorOut(BaseModel):
    id: int
    empresa_id: int
    nombre: str
    descripcion: str

    class Config:
        from_attributes = True


@router.get("/empresas", response_model=List[EmpresaOut])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(Empresa).all()


@router.post("/empresas", response_model=EmpresaOut)
def crear_empresa(data: EmpresaCreate, db: Session = Depends(get_db)):
    emp = Empresa(nombre=data.nombre)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.delete("/empresas/{id}")
def eliminar_empresa(id: int, db: Session = Depends(get_db)):
    emp = db.query(Empresa).get(id)
    if not emp:
        raise HTTPException(404, "Empresa no encontrada")
    db.delete(emp)
    db.commit()
    return {"ok": True}


@router.get("/indicadores", response_model=List[IndicadorOut])
def listar_indicadores(empresa_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Indicador)
    if empresa_id:
        q = q.filter(Indicador.empresa_id == empresa_id)
    return q.all()


@router.post("/indicadores", response_model=IndicadorOut)
def crear_indicador(data: IndicadorCreate, db: Session = Depends(get_db)):
    emp = db.query(Empresa).get(data.empresa_id)
    if not emp:
        raise HTTPException(404, "Empresa no encontrada")
    ind = Indicador(empresa_id=data.empresa_id, nombre=data.nombre, descripcion=data.descripcion)
    db.add(ind)
    db.commit()
    db.refresh(ind)
    return ind


@router.get("/indicadores/{id}", response_model=IndicadorOut)
def obtener_indicador(id: int, db: Session = Depends(get_db)):
    ind = db.query(Indicador).get(id)
    if not ind:
        raise HTTPException(404, "Indicador no encontrado")
    return ind


@router.put("/indicadores/{id}", response_model=IndicadorOut)
def actualizar_indicador(id: int, data: IndicadorCreate, db: Session = Depends(get_db)):
    ind = db.query(Indicador).get(id)
    if not ind:
        raise HTTPException(404, "Indicador no encontrado")
    ind.nombre = data.nombre
    ind.descripcion = data.descripcion
    db.commit()
    db.refresh(ind)
    return ind


@router.delete("/indicadores/{id}")
def eliminar_indicador(id: int, db: Session = Depends(get_db)):
    ind = db.query(Indicador).get(id)
    if not ind:
        raise HTTPException(404, "Indicador no encontrado")
    db.delete(ind)
    db.commit()
    return {"ok": True}
