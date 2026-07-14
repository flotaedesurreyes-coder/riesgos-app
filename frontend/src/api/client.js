import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Empresas
export const getEmpresas = () => api.get('/empresas').then(r => r.data)
export const createEmpresa = (data) => api.post('/empresas', data).then(r => r.data)
export const deleteEmpresa = (id) => api.delete(`/empresas/${id}`).then(r => r.data)

// Indicadores
export const getIndicadores = (empresaId) =>
  api.get('/indicadores', { params: { empresa_id: empresaId } }).then(r => r.data)
export const getIndicador = (id) => api.get(`/indicadores/${id}`).then(r => r.data)
export const createIndicador = (data) => api.post('/indicadores', data).then(r => r.data)
export const updateIndicador = (id, data) => api.put(`/indicadores/${id}`, data).then(r => r.data)
export const deleteIndicador = (id) => api.delete(`/indicadores/${id}`).then(r => r.data)

// Matriz 7M
export const getRiesgos7M = (indicadorId) => api.get('/7m', { params: { indicador_id: indicadorId } }).then(r => r.data)
export const createRiesgo7M = (data) => api.post('/7m', data).then(r => r.data)
export const updateRiesgo7M = (id, data) => api.put(`/7m/${id}`, data).then(r => r.data)
export const deleteRiesgo7M = (id) => api.delete(`/7m/${id}`).then(r => r.data)
export const getCategorias7M = () => api.get('/7m/categorias').then(r => r.data)

// Criterios
export const getCriterios = (tipo) => api.get('/criterios', { params: { tipo } }).then(r => r.data)
export const initCriterios = () => api.post('/criterios/inicializar').then(r => r.data)
export const getNPRInfo = () => api.get('/criterios/npr-info').then(r => r.data)

// 5 Por Que
export const getAnalisis5PQ = (indicadorId) => api.get('/5pq', { params: { indicador_id: indicadorId } }).then(r => r.data)
export const createAnalisis5PQ = (data) => api.post('/5pq', data).then(r => r.data)
export const updateAnalisis5PQ = (id, data) => api.put(`/5pq/${id}`, data).then(r => r.data)
export const deleteAnalisis5PQ = (id) => api.delete(`/5pq/${id}`).then(r => r.data)

// AMFEC
export const getAMFEC = (indicadorId) => api.get('/amfec', { params: { indicador_id: indicadorId } }).then(r => r.data)
export const createAMFEC = (data) => api.post('/amfec', data).then(r => r.data)
export const updateAMFEC = (id, data) => api.put(`/amfec/${id}`, data).then(r => r.data)
export const deleteAMFEC = (id) => api.delete(`/amfec/${id}`).then(r => r.data)

// Costo Beneficio
export const getCB = (indicadorId) => api.get('/cb', { params: { indicador_id: indicadorId } }).then(r => r.data)
export const createCB = (data) => api.post('/cb', data).then(r => r.data)
export const updateCB = (id, data) => api.put(`/cb/${id}`, data).then(r => r.data)
export const deleteCB = (id) => api.delete(`/cb/${id}`).then(r => r.data)

// Exportar
export const exportarExcel = (indicadorId) =>
  api.get(`/exportar/${indicadorId}`, { responseType: 'blob' }).then(r => {
    const url = window.URL.createObjectURL(new Blob([r.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `riesgos_${indicadorId}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  })
