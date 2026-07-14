from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.models import CriterioValoracion

router = APIRouter()


class CriterioCreate(BaseModel):
    indicador_id: Optional[int] = None
    tipo: str
    nivel: str
    valor: int
    descripcion: Optional[str] = ""
    referencia: Optional[str] = ""


class CriterioOut(BaseModel):
    id: int
    indicador_id: Optional[int]
    tipo: str
    nivel: str
    valor: int
    descripcion: str
    referencia: str

    class Config:
        from_attributes = True


CRITERIOS_PREDETERMINADOS = {
    "PROBABILIDAD": [
        ("1 - Muy Baja", 1, "Es poco probable que ocurra. Ocurre en casos excepcionales", "0% - 20%"),
        ("2 - Baja", 2, "Podria ocurrir en ciertas circunstancias. Ocurre esporadicamente", "21% - 40%"),
        ("3 - Media", 3, "Es probable que ocurra. Ha ocurrido antes con alguna frecuencia", "41% - 60%"),
        ("4 - Alta", 4, "Es muy probable que ocurra. Ocurre con frecuencia", "61% - 80%"),
        ("5 - Muy Alta", 5, "Casi con certeza ocurrira. Ocurre de forma habitual", "81% - 100%"),
    ],
    "IMPACTO": [
        ("1 - Insignificante", 1, "Impacto minimo en la operacion", "No afecta el cumplimiento del indicador (<5% desviacion)"),
        ("2 - Menor", 2, "Impacto menor en la operacion", "Afecta ligeramente el indicador (5%-15% desviacion)"),
        ("3 - Moderado", 3, "Impacto moderado en los resultados", "Afecta significativamente el indicador (16%-30% desviacion)"),
        ("4 - Mayor", 4, "Impacto mayor en los resultados", "Afecta gravemente el indicador (31%-50% desviacion)"),
        ("5 - Catastrofico", 5, "Impacto critico en la operacion", "Imposibilidad de cumplir el indicador (>50% desviacion)"),
    ],
    "DETECTABILIDAD": [
        ("1 - Muy Alta", 1, "El error es facilmente detectable con los controles actuales", "Se detecta de forma inmediata antes de enviar"),
        ("2 - Alta", 2, "El error es detectable con controles existentes", "Se detecta en el corto plazo, antes del envio"),
        ("3 - Media", 3, "El error es moderadamente detectable", "Se detecta despues de un tiempo"),
        ("4 - Baja", 4, "El error es dificil de detectar", "Se detecta cuando ya ha ocurrido el dano (reporte enviado)"),
        ("5 - Muy Baja", 5, "El error es muy dificil o imposible de detectar", "No se detecta hasta que el cliente externo lo reporta"),
    ],
}


@router.get("/criterios", response_model=List[CriterioOut])
def listar_criterios(tipo: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(CriterioValoracion).filter(CriterioValoracion.indicador_id.is_(None))
    if tipo:
        q = q.filter(CriterioValoracion.tipo == tipo)
    return q.all()


@router.post("/criterios/inicializar")
def inicializar_criterios(db: Session = Depends(get_db)):
    existing = db.query(CriterioValoracion).first()
    if existing:
        return {"message": "Los criterios ya estan inicializados"}
    count = 0
    for tipo, niveles in CRITERIOS_PREDETERMINADOS.items():
        for nivel, valor, desc, ref in niveles:
            c = CriterioValoracion(
                tipo=tipo, nivel=nivel, valor=valor,
                descripcion=desc, referencia=ref
            )
            db.add(c)
            count += 1
    db.commit()
    return {"message": f"{count} criterios creados"}


@router.get("/criterios/npr-info")
def info_npr():
    return {
        "formula": "NPR = Probabilidad x Impacto x Detectabilidad",
        "rango_min": 1,
        "rango_max": 125,
        "clasificacion": {
            "Bajo": {"min": 1, "max": 27, "accion": "No se requiere accion inmediata. Monitoreo periodico"},
            "Moderado": {"min": 28, "max": 64, "accion": "Se requiere evaluacion y establecer medidas de control"},
            "Alto": {"min": 65, "max": 125, "accion": "Se requiere accion inmediata. Implementar planes de mitigacion urgentes"},
        }
    }
