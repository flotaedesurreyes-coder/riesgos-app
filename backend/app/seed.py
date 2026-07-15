from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Empresa, Indicador, Riesgo7M, CriterioValoracion, CincoPorQue, CincoPorQuePregunta, AMFECRow, CostoBeneficio


def seed_demo_data():
    db: Session = SessionLocal()
    try:
        if db.query(Empresa).count() > 0:
            return

        # === EMPRESA ===
        emp = Empresa(nombre="Empresa Ejemplo")
        db.add(emp)
        db.flush()

        # === INDICADOR 1: % de ventas con garantia reclamada ===
        ind1 = Indicador(empresa_id=emp.id, nombre="% de ventas con garantia reclamada")
        db.add(ind1)
        db.flush()

        riesgos_ind1 = [
            Riesgo7M(indicador_id=ind1.id, categoria="MANO DE OBRA",
                fuente="Personal de ventas sin capacitacion",
                riesgo="Personal no capacitado asesora mal al cliente",
                descripcion="Los vendedores no conocen las especificaciones tecnicas de los productos",
                efecto="Insatisfaccion del cliente y aumento de devoluciones",
                controles="Capacitacion trimestral al personal"),
            Riesgo7M(indicador_id=ind1.id, categoria="MATERIALES",
                fuente="Proveedores de baja calidad",
                riesgo="Componentes defectuosos en productos electronicos",
                descripcion="Los lotes recibidos no pasan los controles de calidad internos",
                efecto="Productos fallan prematuramente, aumentan reclamaciones",
                controles="Inspeccion de calidad al recibir cada lote"),
            Riesgo7M(indicador_id=ind1.id, categoria="METODO",
                fuente="Proceso de atencion al cliente no estandarizado",
                riesgo="No existe protocolo unificado para manejo de quejas",
                descripcion="Cada vendedor maneja las quejas de forma distinta, sin registro formal",
                efecto="Quejas no resueltas escalan a gerencia sin trazabilidad",
                controles="Formulario digital de registro de quejas"),
            Riesgo7M(indicador_id=ind1.id, categoria="MAQUINARIA",
                fuente="Sistema POS desactualizado",
                riesgo="El sistema de facturacion no registra correctamente las garantias",
                descripcion="El software actual no vincula la venta con el numero de serie del producto",
                efecto="Imposibilidad de rastrear que lotes estan fallando",
                controles="Actualizacion del sistema planificada para Q3"),
            Riesgo7M(indicador_id=ind1.id, categoria="MEDICION",
                fuente="Indicadores de calidad inexactos",
                riesgo="El calculo del % de garantias reclamadas es incorrecto",
                descripcion="El denominador del indicador no incluye todas las ventas del periodo",
                efecto="Decisiones basadas en datos erroneos",
                controles="Revision mensual de la formula del indicador"),
            Riesgo7M(indicador_id=ind1.id, categoria="MEDIO AMBIENTE",
                fuente="Condiciones climaticas adversas en almacenamiento",
                riesgo="Humedad y temperatura afectan la calidad de los productos almacenados",
                descripcion="El almacen no cuenta con control de clima en todas las areas",
                efecto="Productos electronicos se danan antes de ser vendidos",
                controles="Instalacion de deshumificadores y monitoreo de temperatura"),
            Riesgo7M(indicador_id=ind1.id, categoria="MANEJO ADMIN",
                fuente="Falta de supervision en gestion de calidad",
                riesgo="La gerencia no da seguimiento a los indicadores de calidad mensualmente",
                descripcion="No se realizan reuniones de revision de indicadores",
                efecto="Los problemas de calidad se acumulan sin correctivos a tiempo",
                controles="Reuniones semanales de revision de indicadores"),
            Riesgo7M(indicador_id=ind1.id, categoria="MANO DE OBRA",
                fuente="Alta rotacion del personal de ventas",
                riesgo="Curva de aprendizaje constante afecta calidad del servicio",
                descripcion="El personal nuevo comete errores en la captura de datos de garantia",
                efecto="Informacion incorrecta en el sistema de reclamaciones",
                controles="Programa de induccion de 2 semanas"),
            Riesgo7M(indicador_id=ind1.id, categoria="METODO",
                fuente="Politica de devoluciones poco clara",
                riesgo="Los criterios para aceptar una devolucion varian segun el vendedor",
                descripcion="No existe una matriz de decision para aprobar cambios o devoluciones",
                efecto="Inconsistencia en el registro de garantias, datos del indicador distorsionados",
                controles="Creacion de matriz de decision y checklist estandar"),
            Riesgo7M(indicador_id=ind1.id, categoria="MAQUINARIA",
                fuente="ERP sin modulo de garantias integrado",
                riesgo="El registro de garantias se hace manualmente en hojas de calculo paralelas",
                descripcion="No hay sincronizacion entre el sistema de ventas y el de servicio postventa",
                efecto="Duplicidad de registros y perdida de informacion de reclamaciones",
                controles="Plan de integracion de sistemas para el proximo semestre"),
        ]
        db.add_all(riesgos_ind1)
        db.flush()

        # === INDICADOR 2: Tiempo promedio de respuesta a quejas ===
        ind2 = Indicador(empresa_id=emp.id, nombre="Tiempo promedio de respuesta a quejas (horas)")
        db.add(ind2)
        db.flush()

        riesgos_ind2 = [
            Riesgo7M(indicador_id=ind2.id, categoria="MANO DE OBRA",
                fuente="Personal insuficiente en el call center",
                riesgo="Agentes sobrecargados no responden dentro del SLA de 4 horas",
                descripcion="La relacion actual es de 1 agente por cada 200 clientes activos",
                efecto="Clientes frustrados escalan quejas a redes sociales o entes reguladores",
                controles="Plan de contratacion de 3 agentes adicionales"),
            Riesgo7M(indicador_id=ind2.id, categoria="MATERIALES",
                fuente="Equipos de computo obsoletos",
                riesgo="Las estaciones de trabajo se traban al abrir el sistema de tickets",
                descripcion="Los agentes trabajan con equipos de mas de 5 anos de antiguedad",
                efecto="Cada respuesta toma el doble del tiempo estimado",
                controles="Renovacion de equipos priorizada para el area de servicio al cliente"),
            Riesgo7M(indicador_id=ind2.id, categoria="METODO",
                fuente="Flujo de escalamiento no definido",
                riesgo="Los agentes no saben a quien derivar quejas complejas",
                descripcion="No hay un arbol de decisiones ni niveles de escalamiento documentados",
                efecto="Las quejas se quedan sin resolver en la bandeja del primer agente",
                controles="Diseno e implementacion de matriz de escalamiento"),
            Riesgo7M(indicador_id=ind2.id, categoria="MAQUINARIA",
                fuente="Sistema de tickets inestable",
                riesgo="La plataforma de gestion de quejas se cae frecuentemente en horas pico",
                descripcion="El servidor no soporta mas de 50 usuarios concurrentes",
                efecto="Los agentes pierden tickets abiertos y deben reiniciar el proceso",
                controles="Migracion a infraestructura en la nube con autoescalado"),
            Riesgo7M(indicador_id=ind2.id, categoria="MEDICION",
                fuente="Forma de calcular el tiempo de respuesta incorrecta",
                riesgo="El sistema no descuenta el tiempo fuera de horario laboral",
                descripcion="Se calcula tiempo calendario en vez de tiempo habil",
                efecto="El indicador muestra tiempos mas altos de la realidad",
                controles="Ajuste de la formula para considerar solo horas laborales"),
            Riesgo7M(indicador_id=ind2.id, categoria="MEDIO AMBIENTE",
                fuente="Corte de energia electrica recurrente en la zona",
                riesgo="Apagones frecuentes interrumpen la atencion al cliente",
                descripcion="El edificio no cuenta con planta electrica propia",
                efecto="Durante los cortes no se pueden recibir ni responder quejas",
                controles="Adquisicion de generador electrico de respaldo"),
            Riesgo7M(indicador_id=ind2.id, categoria="MANEJO ADMIN",
                fuente="Falta de metricas de desempeno visibles",
                riesgo="Los agentes no conocen su tiempo de respuesta en tiempo real",
                descripcion="No hay dashboards ni alertas cuando un ticket esta por vencer el SLA",
                efecto="Los agentes priorizan otras tareas y descuidan la respuesta a quejas",
                controles="Implementacion de dashboard en tiempo real con semaforo de SLA"),
            Riesgo7M(indicador_id=ind2.id, categoria="MANO DE OBRA",
                fuente="Agentes no capacitados en el producto",
                riesgo="Los agentes tardan mas tiempo investigando respuestas tecnicas",
                descripcion="No hay una base de conocimiento actualizada con soluciones frecuentes",
                efecto="Cada queja requiere investigacion desde cero, duplica el tiempo de respuesta",
                controles="Creacion de base de conocimiento y capacitacion semanal"),
            Riesgo7M(indicador_id=ind2.id, categoria="METODO",
                fuente="Automatizacion de respuestas ausente",
                riesgo="Las quejas repetitivas se responden manualmente una por una",
                descripcion="No hay respuestas predefinidas ni chatbot de primer nivel",
                efecto="Los agentes dedican el 60% del tiempo a preguntas frecuentes",
                controles="Implementacion de chatbot y biblioteca de respuestas automaticas"),
            Riesgo7M(indicador_id=ind2.id, categoria="MAQUINARIA",
                fuente="Telefonia IP con problemas de calidad",
                riesgo="Llamadas se caen o tienen mala calidad de audio",
                descripcion="El ancho de banda contratado es insuficiente para el volumen de llamadas",
                efecto="Los clientes cuelgan y vuelven a llamar, reiniciando el tiempo de respuesta",
                controles="Actualizacion del plan de internet y optimizacion de ancho de banda"),
        ]
        db.add_all(riesgos_ind2)
        db.flush()

        # === INDICADOR 3: Indice de satisfaccion del cliente ===
        ind3 = Indicador(empresa_id=emp.id, nombre="Indice de satisfaccion del cliente (1-10)")
        db.add(ind3)
        db.flush()

        riesgos_ind3 = [
            Riesgo7M(indicador_id=ind3.id, categoria="MANO DE OBRA",
                fuente="Personal sin habilidades de servicio al cliente",
                riesgo="Los agentes carecen de empatia y habilidades de comunicacion",
                descripcion="El proceso de seleccion no evalua competencias blandas",
                efecto="Clientes insatisfechos con el trato recibido, calificaciones bajas en encuestas",
                controles="Programa de entrenamiento en servicio al cliente y empatia"),
            Riesgo7M(indicador_id=ind3.id, categoria="MATERIALES",
                fuente="Material de soporte desactualizado",
                riesgo="Los manuales y guias de producto estan desactualizados",
                descripcion="Los catalogos impresos tienen precios y especificaciones de hace 2 anos",
                efecto="Los clientes reciben informacion incorrecta, generando expectativas equivocadas",
                controles="Revision y actualizacion trimestral de todo el material de soporte"),
            Riesgo7M(indicador_id=ind3.id, categoria="METODO",
                fuente="Encuesta de satisfaccion mal disenada",
                riesgo="Las preguntas no reflejan la experiencia real del cliente",
                descripcion="La encuesta solo tiene 2 preguntas y se aplica solo al cierre de la queja",
                efecto="Los resultados no son representativos ni accionables",
                controles="Rediseno de la encuesta con preguntas NPS y CES, aplicacion a los 7 dias"),
            Riesgo7M(indicador_id=ind3.id, categoria="MAQUINARIA",
                fuente="Plataforma de encuestas con baja tasa de respuesta",
                riesgo="El sistema de envio de encuestas tiene problemas de entrega",
                descripcion="Los correos con la encuesta caen en spam o no llegan al cliente",
                efecto="Tasa de respuesta menor al 5%, muestra no representativa",
                controles="Implementacion de envio multicanal: correo, SMS y WhatsApp"),
            Riesgo7M(indicador_id=ind3.id, categoria="MEDICION",
                fuente="Indicador de satisfaccion sin segmentacion",
                riesgo="Se calcula un promedio global que oculta problemas especificos",
                descripcion="No se segmenta por tipo de queja, canal o agente",
                efecto="Areas con bajo desempeno quedan ocultas en el promedio general",
                controles="Implementacion de dashboards segmentados por dimension"),
            Riesgo7M(indicador_id=ind3.id, categoria="MEDIO AMBIENTE",
                fuente="Contexto economico adverso",
                riesgo="La insatisfaccion por factores externos (inflacion, desabasto) se atribuye a la empresa",
                descripcion="Los clientes estan molestos por la situacion economica general",
                efecto="Las calificaciones bajan por factores fuera del control de la empresa",
                controles="Estrategia de comunicacion proactiva y gestion de expectativas realistas"),
            Riesgo7M(indicador_id=ind3.id, categoria="MANEJO ADMIN",
                fuente="No hay incentivos vinculados a satisfaccion",
                riesgo="Los agentes no tienen motivacion para mejorar la experiencia del cliente",
                descripcion="Las bonificaciones solo miden cantidad de quejas cerradas, no calidad",
                efecto="Los agentes priorizan cerrar tickets rapido sobre resolver bien",
                controles="Rediseno del esquema de incentivos incluyendo puntuacion CSAT y NPS"),
            Riesgo7M(indicador_id=ind3.id, categoria="MANO DE OBRA",
                fuente="Desmotivacion del personal por salarios bajos",
                riesgo="Agentes descontentos transmiten su frustracion al cliente",
                descripcion="El salario del call center esta por debajo del promedio del mercado",
                efecto="Malas evaluaciones recurrentes y alta rotacion del personal",
                controles="Revision salarial y programa de reconocimiento al desempeno"),
            Riesgo7M(indicador_id=ind3.id, categoria="METODO",
                fuente="Seguimiento de quejas resueltas inexistente",
                riesgo="No se contacta al cliente para confirmar que quedo satisfecho",
                descripcion="Una vez cerrado el ticket no hay llamada de seguimiento",
                efecto="Problemas recurrentes no identificados, clientes sienten que no les importa",
                controles="Implementacion de llamada de seguimiento a las 48 horas post-cierre"),
            Riesgo7M(indicador_id=ind3.id, categoria="MANEJO ADMIN",
                fuente="Falta de empowerment a los agentes",
                riesgo="Los agentes no pueden resolver problemas sin autorizacion de supervisores",
                descripcion="Cualquier decision fuera de lo estandar requiere 2 niveles de aprobacion",
                efecto="Cliente espera horas por una respuesta que podria ser inmediata",
                controles="Programa de empowerment gradual con limites de autoridad definidos"),
        ]
        db.add_all(riesgos_ind3)
        db.flush()

        # === CRITERIOS DE VALORACION ===
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

        # === 5 POR QUE (Indicador 1) ===
        pq1 = CincoPorQue(
            indicador_id=ind1.id, riesgo_id=riesgos_ind1[0].id,
            titulo="Por que aumentaron las reclamaciones de garantia en el ultimo trimestre?",
            causa_raiz="El personal de ventas no recibe capacitacion tecnica continua sobre los productos que venden."
        )
        db.add(pq1)
        db.flush()
        db.add_all([
            CincoPorQuePregunta(analisis_id=pq1.id, nivel=1, pregunta="Por que aumentaron las reclamaciones de garantia?", respuesta="Porque los productos vendidos presentan fallas prematuras"),
            CincoPorQuePregunta(analisis_id=pq1.id, nivel=2, pregunta="Por que los productos presentan fallas prematuras?", respuesta="Porque los clientes no reciben informacion correcta sobre el uso y cuidado del producto"),
            CincoPorQuePregunta(analisis_id=pq1.id, nivel=3, pregunta="Por que los clientes reciben informacion incorrecta?", respuesta="Porque los vendedores no conocen a fondo las especificaciones tecnicas"),
            CincoPorQuePregunta(analisis_id=pq1.id, nivel=4, pregunta="Por que los vendedores no conocen las especificaciones?", respuesta="Porque no reciben capacitacion tecnica periodica"),
            CincoPorQuePregunta(analisis_id=pq1.id, nivel=5, pregunta="Por que no reciben capacitacion tecnica periodica?", respuesta="Porque la empresa no tiene un programa de capacitacion continua"),
        ])

        # 5PQ para Indicador 2
        pq2 = CincoPorQue(
            indicador_id=ind2.id, riesgo_id=riesgos_ind2[0].id,
            titulo="Por que el tiempo de respuesta a quejas supera las 8 horas?",
            causa_raiz="La cantidad de agentes en el call center es insuficiente para el volumen actual de quejas."
        )
        db.add(pq2)
        db.flush()
        db.add_all([
            CincoPorQuePregunta(analisis_id=pq2.id, nivel=1, pregunta="Por que el tiempo de respuesta supera las 8 horas?", respuesta="Porque los agentes estan saturados de trabajo"),
            CincoPorQuePregunta(analisis_id=pq2.id, nivel=2, pregunta="Por que los agentes estan saturados?", respuesta="Porque cada agente atiende mas de 50 quejas al dia"),
            CincoPorQuePregunta(analisis_id=pq2.id, nivel=3, pregunta="Por que cada agente atiende tantas quejas?", respuesta="Porque solo hay 3 agentes para todo el volumen"),
            CincoPorQuePregunta(analisis_id=pq2.id, nivel=4, pregunta="Por que solo hay 3 agentes?", respuesta="Porque la empresa congelo las contrataciones"),
            CincoPorQuePregunta(analisis_id=pq2.id, nivel=5, pregunta="Por que se congelaron las contrataciones?", respuesta="Porque no se presupuestaron mas plazas para servicio al cliente este ano"),
        ])

        # 5PQ para Indicador 3
        pq3 = CincoPorQue(
            indicador_id=ind3.id, riesgo_id=riesgos_ind3[0].id,
            titulo="Por que el indice de satisfaccion del cliente bajo a 6.2?",
            causa_raiz="Los agentes no tienen las habilidades de servicio al cliente necesarias para manejar quejas complejas."
        )
        db.add(pq3)
        db.flush()
        db.add_all([
            CincoPorQuePregunta(analisis_id=pq3.id, nivel=1, pregunta="Por que bajo la satisfaccion del cliente?", respuesta="Porque los clientes sienten que no los escuchan"),
            CincoPorQuePregunta(analisis_id=pq3.id, nivel=2, pregunta="Por que los clientes sienten que no los escuchan?", respuesta="Porque los agentes interrumpen y no validan emociones"),
            CincoPorQuePregunta(analisis_id=pq3.id, nivel=3, pregunta="Por que los agentes actuan asi?", respuesta="Porque no tienen entrenamiento en escucha activa"),
            CincoPorQuePregunta(analisis_id=pq3.id, nivel=4, pregunta="Por que no tienen entrenamiento?", respuesta="Porque el programa de capacitacion se enfoca solo en productos"),
            CincoPorQuePregunta(analisis_id=pq3.id, nivel=5, pregunta="Por que solo se capacita en productos?", respuesta="Porque disenaron el plan de capacitacion sin considerar habilidades blandas"),
        ])

        # === AMFEC (1 por indicador) ===
        amfec1 = AMFECRow(
            indicador_id=ind1.id, siete_m="MANO DE OBRA",
            componente="Proceso de ventas y asesoria al cliente",
            funcion="Asesorar al cliente en la compra del producto adecuado",
            modo_fallo="El vendedor recomienda un producto que no cumple con los requisitos del cliente",
            efecto="Cliente insatisfecho, solicita cambio, afecta indicador de garantias",
            causa="Desconocimiento tecnico del producto por parte del vendedor",
            controles="Capacitacion trimestral",
            probabilidad=4, impacto=4, detectabilidad=3,
            clasificacion="Moderado", tratamiento="Mitigar",
            accion="Programa de capacitacion tecnica mensual con evaluaciones",
            responsable="Departamento de Capacitacion",
            actividades="Disenar plan, ejecutar sesiones mensuales, evaluar resultados"
        )
        db.add(amfec1)

        amfec2 = AMFECRow(
            indicador_id=ind2.id, siete_m="MANO DE OBRA",
            componente="Proceso de atencion de quejas en call center",
            funcion="Responder quejas de clientes dentro del SLA de 4 horas",
            modo_fallo="Los agentes no responden dentro del tiempo establecido",
            efecto="Cliente frustrado, queja escalada a redes sociales",
            causa="Carga de trabajo excesiva por agente",
            controles="Monitoreo manual de colas",
            probabilidad=5, impacto=3, detectabilidad=2,
            clasificacion="Moderado", tratamiento="Mitigar",
            accion="Contratar 3 agentes adicionales y automatizar respuestas frecuentes",
            responsable="Gerencia de Servicio al Cliente",
            actividades="Aprobacion de presupuesto, reclutamiento, entrenamiento"
        )
        db.add(amfec2)

        amfec3 = AMFECRow(
            indicador_id=ind3.id, siete_m="MANO DE OBRA",
            componente="Interaccion directa con el cliente para resolucion de quejas",
            funcion="Resolver la queja del cliente dejandolo satisfecho con la solucion",
            modo_fallo="El agente resuelve el problema tecnico pero el cliente queda insatisfecho",
            efecto="Cliente califica mal la encuesta de satisfaccion, indicador baja",
            causa="Falta de habilidades de servicio y empatia en los agentes",
            controles="Supervision aleatoria de llamadas",
            probabilidad=4, impacto=4, detectabilidad=4,
            clasificacion="Alto", tratamiento="Mitigar",
            accion="Programa de capacitacion en habilidades blandas y servicio al cliente",
            responsable="Departamento de Capacitacion",
            actividades="Disenar modulo de habilidades blandas, talleres vivenciales, evaluacion 360"
        )
        db.add(amfec3)

        # === COSTO BENEFICIO (1 por indicador) ===
        db.add_all([
            CostoBeneficio(
                indicador_id=ind1.id,
                accion="Programa de capacitacion tecnica mensual para el personal de ventas",
                riesgo_asociado="Personal no capacitado asesora mal al cliente",
                presupuesto=2, disminucion_impacto=3, disminucion_probabilidad=3,
                tiempo_implementacion=2, personal_propio=2,
                impacto_imagen=1, impacto_resultados=2, impacto_equipos=0, impacto_legales=0, probabilidad_antes=1,
            ),
            CostoBeneficio(
                indicador_id=ind2.id,
                accion="Contratacion de 3 agentes adicionales para el call center",
                riesgo_asociado="Personal insuficiente en el call center",
                presupuesto=3, disminucion_impacto=3, disminucion_probabilidad=3,
                tiempo_implementacion=1, personal_propio=0,
                impacto_imagen=2, impacto_resultados=2, impacto_equipos=2, impacto_legales=0, probabilidad_antes=1,
            ),
            CostoBeneficio(
                indicador_id=ind3.id,
                accion="Programa de capacitacion en habilidades blandas para agentes",
                riesgo_asociado="Agentes carecen de empatia y habilidades de comunicacion",
                presupuesto=1, disminucion_impacto=3, disminucion_probabilidad=2,
                tiempo_implementacion=1, personal_propio=3,
                impacto_imagen=1, impacto_resultados=1, impacto_equipos=0, impacto_legales=0, probabilidad_antes=0,
            ),
        ])

        db.commit()
        print("Datos semilla creados exitosamente: 1 empresa, 3 indicadores, 27 riesgos 7M, 3 AMFEC, 3 CB, 3 analisis 5PQ.")
    except Exception as e:
        db.rollback()
        print(f"Error al sembrar datos: {e}")
    finally:
        db.close()
