import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Table2, Calculator } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEmpresas, getIndicadores, getAMFEC, createAMFEC, updateAMFEC, deleteAMFEC, getCategorias7M } from '../api/client'

const initialState = {
  siete_m: 'MANO DE OBRA', componente: '', funcion: '', modo_fallo: '', efecto: '',
  causa: '', controles: '', probabilidad: 1, impacto: 1, detectabilidad: 1,
  clasificacion: '', tratamiento: 'Mitigar', accion: '', responsable: '', actividades: ''
}

export default function AMFECPage() {
  const [empresas, setEmpresas] = useState([])
  const [indicadores, setIndicadores] = useState([])
  const [selectedInd, setSelectedInd] = useState('')
  const [rows, setRows] = useState([])
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    getEmpresas().then(setEmpresas)
    getCategorias7M().then(setCategorias)
  }, [])

  const loadInds = async (empId) => {
    if (!empId) { setIndicadores([]); return }
    setIndicadores(await getIndicadores(empId))
  }

  const loadRows = async (indId) => {
    if (!indId) { setRows([]); return }
    setRows(await getAMFEC(indId))
  }

  const save = async () => {
    try {
      const data = { ...form, indicador_id: Number(selectedInd) }
      if (editId) { await updateAMFEC(editId, data); toast.success('Actualizado') }
      else { await createAMFEC(data); toast.success('Creado') }
      setShowForm(false); setEditId(null); setForm(initialState)
      loadRows(selectedInd)
    } catch { toast.error('Error al guardar') }
  }

  const edit = (r) => {
    setForm({
      siete_m: r.siete_m, componente: r.componente, funcion: r.funcion, modo_fallo: r.modo_fallo,
      efecto: r.efecto, causa: r.causa, controles: r.controles, probabilidad: r.probabilidad,
      impacto: r.impacto, detectabilidad: r.detectabilidad, clasificacion: r.clasificacion,
      tratamiento: r.tratamiento, accion: r.accion, responsable: r.responsable, actividades: r.actividades
    })
    setEditId(r.id); setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Eliminar esta fila AMFEC?')) return
    await deleteAMFEC(id); toast.success('Eliminado'); loadRows(selectedInd)
  }

  const getClassColor = (c) => {
    if (c === 'Alto') return 'text-red-600 bg-red-50'
    if (c === 'Moderado') return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
        <Table2 size={24} /> AMFEC
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select onChange={e => loadInds(e.target.value)} className="border rounded px-3 py-2 text-sm mr-2">
          <option value="">Empresa</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={selectedInd} onChange={e => { setSelectedInd(e.target.value); loadRows(e.target.value) }} className="border rounded px-3 py-2 text-sm">
          <option value="">Indicador</option>
          {indicadores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
      </div>

      {selectedInd && (
        <>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(initialState) }}
            className="bg-[#1F4E79] text-white px-4 py-2 rounded text-sm hover:bg-blue-800 mb-4 flex items-center gap-2">
            <Plus size={18} /> Nuevo Modo de Fallo
          </button>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold mb-3">{editId ? 'Editar' : 'Nuevo'} Modo de Fallo</h3>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <select value={form.siete_m} onChange={e => setForm({ ...form, siete_m: e.target.value })} className="border rounded px-3 py-2 text-sm">
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={form.componente} onChange={e => setForm({ ...form, componente: e.target.value })} className="border rounded px-3 py-2 text-sm" placeholder="Componente" />
                <input value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} className="border rounded px-3 py-2 text-sm" placeholder="Responsable" />
              </div>
              <textarea value={form.funcion} onChange={e => setForm({ ...form, funcion: e.target.value })} className="w-full border rounded px-3 py-2 text-sm mb-2" rows={1} placeholder="Funcion del componente" />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <textarea value={form.modo_fallo} onChange={e => setForm({ ...form, modo_fallo: e.target.value })} className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Modo de fallo potencial" />
                <textarea value={form.efecto} onChange={e => setForm({ ...form, efecto: e.target.value })} className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Efecto del fallo" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <textarea value={form.causa} onChange={e => setForm({ ...form, causa: e.target.value })} className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Causas potenciales" />
                <textarea value={form.controles} onChange={e => setForm({ ...form, controles: e.target.value })} className="border rounded px-3 py-2 text-sm" rows={2} placeholder="Controles actuales" />
              </div>
              <div className="grid grid-cols-5 gap-2 mb-2">
                <div><label className="text-xs text-gray-500">Probabilidad (1-5)</label>
                  <input type="number" min={1} max={5} value={form.probabilidad} onChange={e => setForm({ ...form, probabilidad: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Impacto (1-5)</label>
                  <input type="number" min={1} max={5} value={form.impacto} onChange={e => setForm({ ...form, impacto: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Detect. (1-5)</label>
                  <input type="number" min={1} max={5} value={form.detectabilidad} onChange={e => setForm({ ...form, detectabilidad: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">NPR</label>
                  <input value={form.probabilidad * form.impacto * form.detectabilidad} className="w-full border rounded px-3 py-2 text-sm font-bold bg-gray-50" disabled /></div>
                <div><label className="text-xs text-gray-500">Clasificacion</label>
                  <input value={form.probabilidad * form.impacto * form.detectabilidad <= 27 ? 'Bajo' : form.probabilidad * form.impacto * form.detectabilidad <= 64 ? 'Moderado' : 'Alto'} className="w-full border rounded px-3 py-2 text-sm font-bold bg-gray-50" disabled /></div>
              </div>
              <textarea value={form.accion} onChange={e => setForm({ ...form, accion: e.target.value })} className="w-full border rounded px-3 py-2 text-sm mb-2" rows={2} placeholder="Acciones a tomar" />
              <textarea value={form.actividades} onChange={e => setForm({ ...form, actividades: e.target.value })} className="w-full border rounded px-3 py-2 text-sm mb-2" rows={2} placeholder="Actividades" />
              <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> Guardar
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#1F4E79] text-white">
                <tr>
                  <th className="p-2">7M</th><th className="p-2">Componente</th><th className="p-2">Fallo</th>
                  <th className="p-2">Efecto</th><th className="p-2">Causa</th>
                  <th className="p-2 w-12">P</th><th className="p-2 w-12">I</th><th className="p-2 w-12">D</th>
                  <th className="p-2 w-14">NPR</th><th className="p-2 w-20">Clasif</th>
                  <th className="p-2">Accion</th><th className="p-2 w-20">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-1">{r.siete_m}</td>
                    <td className="p-1">{r.componente}</td>
                    <td className="p-1">{r.modo_fallo}</td>
                    <td className="p-1 text-gray-600">{r.efecto}</td>
                    <td className="p-1 text-gray-600">{r.causa}</td>
                    <td className="p-1 text-center">{r.probabilidad}</td>
                    <td className="p-1 text-center">{r.impacto}</td>
                    <td className="p-1 text-center">{r.detectabilidad}</td>
                    <td className={`p-1 text-center font-bold ${r.npr >= 65 ? 'text-red-600' : r.npr >= 28 ? 'text-yellow-600' : 'text-green-600'}`}>{r.npr}</td>
                    <td className={`p-1 text-center ${getClassColor(r.clasificacion)} rounded`}>{r.clasificacion}</td>
                    <td className="p-1 text-gray-600">{r.accion}</td>
                    <td className="p-1">
                      <button onClick={() => edit(r)} className="text-blue-600 hover:text-blue-800 mr-1">Editar</button>
                      <button onClick={() => remove(r.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={12} className="p-4 text-center text-gray-400">Sin datos AMFEC</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
