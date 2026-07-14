from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    indicadores = relationship("Indicador", back_populates="empresa", cascade="all, delete-orphan")


class Indicador(Base):
    __tablename__ = "indicadores"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    nombre = Column(String(500), nullable=False)
    descripcion = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    empresa = relationship("Empresa", back_populates="indicadores")
    riesgos = relationship("Riesgo7M", back_populates="indicador", cascade="all, delete-orphan")
    cinco_por_que = relationship("CincoPorQue", back_populates="indicador", cascade="all, delete-orphan")
    amfec_rows = relationship("AMFECRow", back_populates="indicador", cascade="all, delete-orphan")
    cb_acciones = relationship("CostoBeneficio", back_populates="indicador", cascade="all, delete-orphan")


class Riesgo7M(Base):
    __tablename__ = "riesgos_7m"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=False)
    categoria = Column(String(50), nullable=False)  # MANO DE OBRA, MATERIALES, METODO, MAQUINARIA, MEDICION, MEDIO AMBIENTE
    fuente = Column(String(255), nullable=False)
    riesgo = Column(String(500), nullable=False)
    descripcion = Column(Text, default="")
    efecto = Column(Text, default="")
    controles = Column(Text, default="")

    indicador = relationship("Indicador", back_populates="riesgos")


class CriterioValoracion(Base):
    __tablename__ = "criterios_valoracion"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=True)
    tipo = Column(String(50), nullable=False)  # PROBABILIDAD, IMPACTO, DETECTABILIDAD, NPR
    nivel = Column(String(50), nullable=False)  # 1 - Muy Baja, 2 - Baja, etc.
    valor = Column(Integer, nullable=False)  # 1-5
    descripcion = Column(Text, default="")
    referencia = Column(Text, default="")


class CincoPorQue(Base):
    __tablename__ = "cinco_por_que"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=False)
    riesgo_id = Column(Integer, ForeignKey("riesgos_7m.id"), nullable=True)
    titulo = Column(String(500), nullable=False)
    causa_raiz = Column(Text, default="")

    indicador = relationship("Indicador", back_populates="cinco_por_que")
    preguntas = relationship("CincoPorQuePregunta", back_populates="analisis", cascade="all, delete-orphan")


class CincoPorQuePregunta(Base):
    __tablename__ = "cinco_por_que_preguntas"

    id = Column(Integer, primary_key=True, index=True)
    analisis_id = Column(Integer, ForeignKey("cinco_por_que.id"), nullable=False)
    nivel = Column(Integer, nullable=False)
    pregunta = Column(Text, nullable=False)
    respuesta = Column(Text, nullable=False)

    analisis = relationship("CincoPorQue", back_populates="preguntas")


class AMFECRow(Base):
    __tablename__ = "amfec_rows"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=False)
    siete_m = Column(String(50), nullable=False)
    componente = Column(String(255), nullable=False)
    funcion = Column(Text, nullable=False)
    modo_fallo = Column(Text, nullable=False)
    efecto = Column(Text, nullable=False)
    causa = Column(Text, nullable=False)
    controles = Column(Text, default="")
    probabilidad = Column(Integer, nullable=False)
    impacto = Column(Integer, nullable=False)
    detectabilidad = Column(Integer, nullable=False)
    clasificacion = Column(String(50), default="")
    tratamiento = Column(String(50), default="Mitigar")
    accion = Column(Text, default="")
    responsable = Column(String(255), default="")
    actividades = Column(Text, default="")

    indicador = relationship("Indicador", back_populates="amfec_rows")

    @property
    def npr(self):
        return self.probabilidad * self.impacto * self.detectabilidad


class CostoBeneficio(Base):
    __tablename__ = "costo_beneficio"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=False)
    accion = Column(Text, nullable=False)
    riesgo_asociado = Column(Text, default="")
    presupuesto = Column(Integer, default=0)
    disminucion_impacto = Column(Integer, default=0)
    disminucion_probabilidad = Column(Integer, default=0)
    tiempo_implementacion = Column(Integer, default=0)
    personal_propio = Column(Integer, default=0)
    impacto_imagen = Column(Integer, default=0)
    impacto_resultados = Column(Integer, default=0)
    impacto_equipos = Column(Integer, default=0)
    impacto_legales = Column(Integer, default=0)
    probabilidad_antes = Column(Integer, default=0)

    indicador = relationship("Indicador", back_populates="cb_acciones")

    @property
    def total_beneficios(self):
        return (self.presupuesto + self.disminucion_impacto + self.disminucion_probabilidad
                + self.tiempo_implementacion + self.personal_propio)

    @property
    def total_consecuencias(self):
        return (self.impacto_imagen + self.impacto_resultados + self.impacto_equipos
                + self.impacto_legales + self.probabilidad_antes)

    @property
    def relacion_bc(self):
        if self.total_consecuencias == 0:
            return None
        return round(self.total_beneficios / self.total_consecuencias, 2)

    @property
    def decision(self):
        bc = self.relacion_bc
        if bc is None:
            return ""
        if bc < 1:
            return "NO IMPLEMENTAR. Desarrollar nueva solucion."
        if bc <= 1.5:
            return "Implementar en plazo maximo de 6 meses."
        if bc <= 2:
            return "Implementar en plazo maximo de 3 meses."
        if bc <= 2.5:
            return "Implementar en plazo maximo de 2 meses."
        return "Implementar en menos de 1 mes."
