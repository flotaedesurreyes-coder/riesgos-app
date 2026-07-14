# RiesgosApp

Aplicacion web gratuita para la gestion completa de riesgos empresariales basada en la metodologia POA.

**Cadena de analisis:** Matriz 7M → Criterios de Valoracion → 5 Por Que → AMFEC → Costo Beneficio

## Tecnologias

- **Frontend:** React 18 + Vite + Tailwind CSS (GitHub Pages)
- **Backend:** FastAPI + SQLAlchemy + SQLite/PostgreSQL (Render)
- **Exportacion:** Excel (openpyxl)

## Estructura del proyecto

```
riesgos-app/
├── frontend/            # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/       # Paginas de la aplicacion
│   │   ├── api/         # Cliente HTTP
│   │   └── App.jsx      # Router principal
│   └── package.json
├── backend/             # FastAPI
│   ├── app/
│   │   ├── models/      # Modelos SQLAlchemy
│   │   ├── routes/      # Endpoints REST
│   │   └── main.py      # Punto de entrada
│   └── requirements.txt
└── README.md
```

## Funcionalidades

1. **Empresas e Indicadores** - Gestion de multiples empresas y sus indicadores POA
2. **Matriz 7M** - Identificacion de riesgos con categorias (Mano de Obra, Materiales, Metodo, Maquinaria, Medicion, Medio Ambiente)
3. **Criterios de Valoracion** - Escalas Probabilidad (1-5), Impacto (1-5), Detectabilidad (1-5) con matriz NPR
4. **5 Por Que** - Analisis de causa raiz con 5 preguntas por riesgo
5. **AMFEC** - Calculo automatico de NPR = P x I x D, clasificacion Bajo/Moderado/Alto
6. **Costo Beneficio** - Metodologia VAR con relacion B/C y reglas de decision
7. **Exportacion a Excel** - Descarga de todo el analisis en un archivo .xlsx

## Despliegue gratis

### Frontend (GitHub Pages)

1. Crear un repositorio en GitHub
2. Subir el codigo
3. Ir a Settings → Pages → Source: GitHub Actions
4. Hacer push a main - el workflow deploy.yml construye y publica automaticamente
5. La app queda en `https://[usuario].github.io/riesgos-app`

### Backend (Render)

1. Crear cuenta en https://render.com
2. Conectar repositorio de GitHub
3. Crear Web Service con:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Agregar variable de entorno:
   - `CORS_ORIGINS`: `https://[usuario].github.io`

Opcional: Crear base de datos PostgreSQL gratis en Render y configurar `DATABASE_URL`.

## Desarrollo local

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API queda en http://localhost:8000. Documentacion en http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda en http://localhost:5173/riesgos-app/

## API REST

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/empresas | Listar empresas |
| POST | /api/empresas | Crear empresa |
| GET | /api/indicadores | Listar indicadores |
| POST | /api/indicadores | Crear indicador |
| GET | /api/7m | Listar riesgos 7M |
| POST | /api/7m | Crear riesgo 7M |
| GET/POST | /api/5pq | Listar/Crear analisis 5PQ |
| GET/POST | /api/amfec | Listar/Crear filas AMFEC |
| GET/POST | /api/cb | Listar/Crear acciones B/C |
| GET | /api/exportar/{id} | Exportar a Excel |
| GET | /api/criterios/npr-info | Obtener matriz NPR |

## Creditos

Creado por **Isaac Reyes** para la clase de **Gestion de Riesgos**.

## Licencia

MIT
