from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Empresa, Indicador, Riesgo7M, CriterioValoracion, CincoPorQue, CincoPorQuePregunta, AMFECRow, CostoBeneficio


def seed_demo_data():
    db: Session = SessionLocal()
    try:
        if db.query(Empresa).count() > 0:
            return

        # Empresa
        emp = Empresa(nombre="Electrodomesticos R&A S.A.")
        db.add(emp)
        db.flush()

        # Indicador
        ind = Indicador(empresa_id=emp.id, nombre="% de ventas con garantia reclamada")
        db.add(ind)
        db.flush()

        # 7 Riesgos 7M
        riesgos = [
            Riesgo7M(indicador_id=ind.id, categoria="MANO DE OBRA",
                     fuente="Personal de ventas sin capacitacion",
                     riesgo="Personal no capacitado asesora mal al cliente",
                     descripcion="Los vendedores no conocen las especificaciones tecnicas de los productos",
                     efecto="Insatisfaccion del cliente y aumento de devoluciones",
                     controles="Capacitacion trimestral al personal"),
            Riesgo7M(indicador_id=ind.id, categoria="MATERIALES",
                     fuente="Proveedores de baja calidad",
                     riesgo="Componentes defectuosos en productos electronicos",
                     descripcion="Los lotes recibidos no pasan los controles de calidad internos",
                     efecto="Productos fallan prematuramente, aumentan reclamaciones de garantia",
                     controles="Inspeccion de calidad al recibir cada lote"),
            Riesgo7M(indicador_id=ind.id, categoria="METODO",
                     fuente="Proceso de atencion al cliente no estandarizado",
                     riesgo="No existe protocolo unificado para manejo de quejas",
                     descripcion="Cada vendedor maneja las quejas de forma distinta, sin registro formal",
                     efecto="Quejas no resueltas escalan a gerencia sin trazabilidad",
                     controles="Formulario digital de registro de quejas"),
            Riesgo7M(indicador_id=ind.id, categoria="MAQUINARIA",
                     fuente="Sistema POS desactualizado",
                     riesgo="El sistema de facturacion no registra correctamente las garantias",
                     descripcion="El software actual no vincula la venta con el numero de serie del producto",
                     efecto="Imposibilidad de rastrear que lotes estan fallando",
                     controles="Actualizacion del sistema planificada para Q3"),
            Riesgo7M(indicador_id=ind.id, categoria="MEDICION",
                     fuente="Indicadores de calidad inexactos",
                     riesgo="El calculo del % de garantias reclamadas es incorrecto",
                     descripcion="El denominador del indicador no incluye todas las ventas del periodo",
                     efecto="Decisiones basadas en datos erroneos, subestimando la magnitud del problema",
                     controles="Revision mensual de la formula del indicador"),
            Riesgo7M(indicador_id=ind.id, categoria="MEDIO AMBIENTE",
                     fuente="Condiciones climaticas adversas en la zona de almacenamiento",
                     riesgo="Humedad y temperatura afectan la calidad de los productos almacenados",
                     descripcion="El almacen no cuenta con control de clima en todas las areas",
                     efecto="Productos electronicos se danan antes de ser vendidos, incrementando devoluciones",
                     controles="Instalacion de deshumificadores y monitoreo de temperatura"),
            Riesgo7M(indicador_id=ind.id, categoria="MANEJO ADMIN",
                     fuente="Falta de supervision en los procesos de gestion de calidad",
                     riesgo="La gerencia no da seguimiento a los indicadores de calidad mensualmente",
                     descripcion="No se realizan reuniones de revision de indicadores, las desviaciones pasan inadvertidas",
                     efecto="Los problemas de calidad se acumulan sin correctivos a tiempo, afectando la rentabilidad",
                     controles="Implementacion de reuniones semanales de revision de indicadores"),
        ]
        db.add_all(riesgos)
        db.flush()

        # Criterios de valoracion
        criterios_data = [
            CriterioValoracion(tipo="PROBABILIDAD", nivel="Muy Baja", valor=1, descripcion="Evento casi imposible"),
            CriterioValoracion(tipo="PROBABILIDAD", nivel="Baja", valor=2, descripcion="Evento poco probable"),
            CriterioValoracion(tipo="PROBABILIDAD", nivel="Media", valor=3, descripcion="Evento posible"),
            CriterioValoracion(tipo="PROBABILIDAD", nivel="Alta", valor=4, descripcion="Evento probable"),
            CriterioValoracion(tipo="PROBABILIDAD", nivel="Muy Alta", valor=5, descripcion="Evento casi seguro"),
            CriterioValoracion(tipo="IMPACTO", nivel="Muy Bajo", valor=1, descripcion="Impacto insignificante"),
            CriterioValoracion(tipo="IMPACTO", nivel="Bajo", valor=2, descripcion="Impacto menor"),
            CriterioValoracion(tipo="IMPACTO", nivel="Medio", valor=3, descripcion="Impacto moderado"),
            CriterioValoracion(tipo="IMPACTO", nivel="Alto", valor=4, descripcion="Impacto significativo"),
            CriterioValoracion(tipo="IMPACTO", nivel="Muy Alto", valor=5, descripcion="Impacto catastrofico"),
            CriterioValoracion(tipo="DETECTABILIDAD", nivel="Muy Alta", valor=1, descripcion="Se detecta inmediatamente"),
            CriterioValoracion(tipo="DETECTABILIDAD", nivel="Alta", valor=2, descripcion="Se detecta con revision"),
            CriterioValoracion(tipo="DETECTABILIDAD", nivel="Media", valor=3, descripcion="Se detecta con analisis"),
            CriterioValoracion(tipo="DETECTABILIDAD", nivel="Baja", valor=4, descripcion="Dificil de detectar"),
            CriterioValoracion(tipo="DETECTABILIDAD", nivel="Muy Baja", valor=5, descripcion="No se detecta hasta manifestarse"),
        ]
        db.add_all(criterios_data)
        db.flush()

        # 5 Por Que
        pq = CincoPorQue(
            indicador_id=ind.id, riesgo_id=riesgos[0].id,
            titulo="Por que aumentaron las reclamaciones de garantia en el ultimo trimestre?",
            causa_raiz="El personal de ventas no recibe capacitacion tecnica continua sobre los productos que venden."
        )
        db.add(pq)
        db.flush()
        preguntas = [
            CincoPorQuePregunta(analisis_id=pq.id, nivel=1, pregunta="Por que aumentaron las reclamaciones de garantia?", respuesta="Porque los productos vendidos presentan fallas prematuras"),
            CincoPorQuePregunta(analisis_id=pq.id, nivel=2, pregunta="Por que los productos presentan fallas prematuras?", respuesta="Porque los clientes no reciben informacion correcta sobre el uso y cuidado del producto"),
            CincoPorQuePregunta(analisis_id=pq.id, nivel=3, pregunta="Por que los clientes reciben informacion incorrecta?", respuesta="Porque los vendedores no conocen a fondo las especificaciones tecnicas"),
            CincoPorQuePregunta(analisis_id=pq.id, nivel=4, pregunta="Por que los vendedores no conocen las especificaciones?", respuesta="Porque no reciben capacitacion tecnica periodica"),
            CincoPorQuePregunta(analisis_id=pq.id, nivel=5, pregunta="Por que no reciben capacitacion tecnica periodica?", respuesta="Porque la empresa no tiene un programa de capacitacion continua"),
        ]
        db.add_all(preguntas)
        db.flush()

        # AMFEC
        amfec = AMFECRow(
            indicador_id=ind.id, siete_m="MANO DE OBRA",
            componente="Proceso de ventas y asesoria al cliente",
            funcion="Asesorar al cliente en la compra del producto adecuado",
            modo_fallo="El vendedor recomienda un producto que no cumple con los requisitos del cliente",
            efecto="Cliente insatisfecho, solicita cambio o devolucion, afecta indicador de garantias",
            causa="Desconocimiento tecnico del producto por parte del vendedor",
            controles="Capacitacion trimestral al personal",
            probabilidad=4, impacto=4, detectabilidad=3,
            clasificacion="Moderado", tratamiento="Mitigar",
            accion="Programa de capacitacion tecnica mensual con evaluaciones",
            responsable="Departamento de Capacitacion",
            actividades="Disenar plan, ejecutar sesiones mensuales, evaluar resultados"
        )
        db.add(amfec)
        db.flush()

        # Costo Beneficio
        cb = CostoBeneficio(
            indicador_id=ind.id,
            accion="Programa de capacitacion tecnica mensual para el personal de ventas",
            riesgo_asociado="Personal no capacitado asesora mal al cliente",
            presupuesto=2, disminucion_impacto=3, disminucion_probabilidad=3,
            tiempo_implementacion=2, personal_propio=2,
            impacto_imagen=1, impacto_resultados=2, impacto_equipos=0, impacto_legales=0,
            probabilidad_antes=1
        )
        db.add(cb)

        db.commit()
        print("Datos semilla creados exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"Error al sembrar datos: {e}")
    finally:
        db.close()
