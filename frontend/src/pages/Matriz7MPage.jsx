import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEmpresas, getIndicadores, getRiesgos7M, createRiesgo7M, updateRiesgo7M, deleteRiesgo7M, getCategorias7M } from '../api/client'

const initialRiesgo = {
  categoria: 'MANO DE OBRA', fuente: '', riesgo: '', descripcion: '', efecto: '', controles: ''
}

export default function Matriz7MPage() {
  const [empresas, setEmpresas] = useState([])
  const [indicadores, setIndicadores] = useState([])
  const [selectedInd, setSelectedInd] = useState('')
  const [riesgos, setRiesgos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(initialRiesgo)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getEmpresas().then(setEmpresas)
    getCategorias7M().then(setCategorias)
  }, [])

  const loadIndicadores = async (empId) => {
    if (!empId) { setIndicadores([]); return }
    const inds = await getIndicadores(empId)
    setIndicadores(inds)
  }

  const loadRiesgos = async (indId) => {
    if (!indId) { setRiesgos([]); return }
    const r = await getRiesgos7M(indId)
    setRiesgos(r)
  }

  const handleEmpresaChange = (e) => {
    const empId = e.target.value
    setSelectedInd('')
    loadIndicadores(empId)
  }

  const handleIndChange = (e) => {
    const indId = e.target.value
    setSelectedInd(indId)
    loadRiesgos(indId)
  }

  const saveRiesgo = async () => {
    if (!form.fuente.trim() || !form.riesgo.trim()) {
      toast.error('Fuente y Riesgo son obligatorios')
      return
    }
    try {
      if (editId) {
        await updateRiesgo7M(editId, { ...form, indicador_id: Number(selectedInd) })
        toast.success('Riesgo actualizado')
      } else {
        await createRiesgo7M({ ...form, indicador_id: Number(selectedInd) })
        toast.success('Riesgo creado')
      }
      setForm(initialRiesgo)
      setEditId(null)
      setShowForm(false)
      loadRiesgos(selectedInd)
    } catch { toast.error('Error al guardar') }
  }

  const editRiesgo = (r) => {
    setForm({ categoria: r.categoria, fuente: r.fuente, riesgo: r.riesgo, descripcion: r.descripcion, efecto: r.efecto, controles: r.controles })
    setEditId(r.id)
    setShowForm(true)
  }

  const removeRiesgo = async (id) => {
    if (!confirm('Eliminar este riesgo?')) return
    await deleteRiesgo7M(id)
    toast.success('Riesgo eliminado')
    loadRiesgos(selectedInd)
  }

  const catColors = {
    'MANO DE OBRA': 'bg-red-100 text-red-800',
    'MATERIALES': 'bg-yellow-100 text-yellow-800',
    'METODO': 'bg-blue-100 text-blue-800',
    'MAQUINARIA': 'bg-purple-100 text-purple-800',
    'MEDICION': 'bg-green-100 text-green-800',
    'MEDIO AMBIENTE': 'bg-orange-100 text-orange-800',
    'MANEJO ADMIN': 'bg-pink-100 text-pink-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
        <AlertTriangle size={24} /> Matriz 7M
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select onChange={handleEmpresaChange} className="border rounded px-3 py-2 text-sm">
            <option value="">Seleccionar empresa</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <select value={selectedInd} onChange={handleIndChange} className="border rounded px-3 py-2 text-sm">
            <option value="">Seleccionar indicador</option>
            {indicadores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        </div>
      </div>

      {selectedInd && (
        <>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(initialRiesgo) }}
            className="bg-[#1F4E79] text-white px-4 py-2 rounded text-sm hover:bg-blue-800 mb-4 flex items-center gap-2">
            <Plus size={18} /> Nuevo Riesgo
          </button>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold mb-3">{editId ? 'Editar Riesgo' : 'Nuevo Riesgo'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className="border rounded px-3 py-2 text-sm">
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={form.fuente} onChange={e => setForm({ ...form, fuente: e.target.value })}
                  className="border rounded px-3 py-2 text-sm" placeholder="Fuente de riesgo" />
              </div>
              <input value={form.riesgo} onChange={e => setForm({ ...form, riesgo: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm mb-3" placeholder="Nombre del riesgo" />
              <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm mb-3" rows={2} placeholder="Descripcion del riesgo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <textarea value={form.efecto} onChange={e => setForm({ ...form, efecto: e.target.value })}
                  className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Efecto en cliente externo" />
                <textarea value={form.controles} onChange={e => setForm({ ...form, controles: e.target.value })}
                  className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Controles actuales" />
              </div>
              <button onClick={saveRiesgo} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> {editId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-[#1F4E79] text-white">
                <tr>
                  <th className="p-2 text-left">7M</th>
                  <th className="p-2 text-left">Fuente</th>
                  <th className="p-2 text-left">Riesgo</th>
                  <th className="p-2 text-left">Descripci&oacute;n</th>
                  <th className="p-2 text-left">Efecto</th>
                  <th className="p-2 text-left">Controles</th>
                  <th className="p-2 w-20">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {riesgos.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-2"><span className={`text-xs px-2 py-1 rounded ${catColors[r.categoria] || 'bg-gray-100'}`}>{r.categoria}</span></td>
                    <td className="p-2 text-xs">{r.fuente}</td>
                    <td className="p-2 text-xs font-medium">{r.riesgo}</td>
                    <td className="p-2 text-xs text-gray-600">{r.descripcion}</td>
                    <td className="p-2 text-xs text-gray-500">{r.efecto}</td>
                    <td className="p-2 text-xs text-gray-500">{r.controles}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <button onClick={() => editRiesgo(r)} className="text-blue-600 hover:text-blue-800 text-xs">Editar</button>
                        <button onClick={() => removeRiesgo(r.id)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {riesgos.length === 0 && (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-400">No hay riesgos registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
