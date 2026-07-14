import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Building2, TrendingUp, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEmpresas, createEmpresa, deleteEmpresa, getIndicadores, createIndicador, deleteIndicador } from '../api/client'

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([])
  const [indicadores, setIndicadores] = useState({})
  const [newEmp, setNewEmp] = useState('')
  const [newInd, setNewInd] = useState({ empresaId: '', nombre: '' })

  const load = async () => {
    const emps = await getEmpresas()
    setEmpresas(emps)
    const indMap = {}
    for (const emp of emps) {
      indMap[emp.id] = await getIndicadores(emp.id)
    }
    setIndicadores(indMap)
  }

  useEffect(() => { load() }, [])

  const addEmpresa = async () => {
    if (!newEmp.trim()) return
    await createEmpresa({ nombre: newEmp.trim() })
    setNewEmp('')
    toast.success('Empresa creada')
    load()
  }

  const removeEmpresa = async (id) => {
    if (!confirm('Eliminar empresa y todos sus datos?')) return
    await deleteEmpresa(id)
    toast.success('Empresa eliminada')
    load()
  }

  const addIndicador = async () => {
    if (!newInd.nombre.trim() || !newInd.empresaId) return
    await createIndicador({ empresa_id: Number(newInd.empresaId), nombre: newInd.nombre.trim() })
    setNewInd({ empresaId: '', nombre: '' })
    toast.success('Indicador creado')
    load()
  }

  const removeIndicador = async (id) => {
    if (!confirm('Eliminar indicador y todos sus datos asociados?')) return
    await deleteIndicador(id)
    toast.success('Indicador eliminado')
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6">Empresas e Indicadores</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><Building2 size={18} /> Nueva Empresa</h2>
          <div className="flex gap-2">
            <input value={newEmp} onChange={e => setNewEmp(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Nombre de la empresa"
              onKeyDown={e => e.key === 'Enter' && addEmpresa()} />
            <button onClick={addEmpresa} className="bg-[#1F4E79] text-white px-4 py-2 rounded text-sm hover:bg-blue-800">
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp size={18} /> Nuevo Indicador POA</h2>
          <div className="flex gap-2">
            <select value={newInd.empresaId} onChange={e => setNewInd({ ...newInd, empresaId: e.target.value })}
              className="border rounded px-3 py-2 text-sm">
              <option value="">Seleccionar empresa</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
            <input value={newInd.nombre} onChange={e => setNewInd({ ...newInd, nombre: e.target.value })}
              className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Nombre del indicador"
              onKeyDown={e => e.key === 'Enter' && addIndicador()} />
            <button onClick={addIndicador} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {empresas.map(emp => (
        <div key={emp.id} className="bg-white rounded-lg shadow mb-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-lg text-[#1F4E79] flex items-center gap-2">
              <Building2 size={20} /> {emp.nombre}
            </h2>
            <button onClick={() => removeEmpresa(emp.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="p-4">
            {(indicadores[emp.id] || []).length === 0 ? (
              <p className="text-sm text-gray-400">No hay indicadores registrados</p>
            ) : (
              <div className="space-y-2">
                {(indicadores[emp.id] || []).map(ind => (
                  <div key={ind.id} className="flex items-center justify-between border rounded p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{ind.nombre}</p>
                      {ind.descripcion && <p className="text-xs text-gray-500">{ind.descripcion}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/indicador/${ind.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                        Abrir <ExternalLink size={14} />
                      </Link>
                      <button onClick={() => removeIndicador(ind.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
