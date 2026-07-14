import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEmpresas, getIndicadores, getCB, createCB, updateCB, deleteCB } from '../api/client'

const initialState = {
  accion: '', riesgo_asociado: '', presupuesto: 0, disminucion_impacto: 0,
  disminucion_probabilidad: 0, tiempo_implementacion: 0, personal_propio: 0,
  impacto_imagen: 0, impacto_resultados: 0, impacto_equipos: 0, impacto_legales: 0, probabilidad_antes: 0
}

export default function CostoBeneficioPage() {
  const [empresas, setEmpresas] = useState([])
  const [indicadores, setIndicadores] = useState([])
  const [selectedInd, setSelectedInd] = useState('')
  const [acciones, setAcciones] = useState([])
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialState)

  useEffect(() => { getEmpresas().then(setEmpresas) }, [])

  const loadInds = async (empId) => {
    if (!empId) { setIndicadores([]); return }
    setIndicadores(await getIndicadores(empId))
  }

  const loadAcciones = async (indId) => {
    if (!indId) { setAcciones([]); return }
    setAcciones(await getCB(indId))
  }

  const save = async () => {
    if (!form.accion.trim()) { toast.error('La accion es obligatoria'); return }
    try {
      const data = { ...form, indicador_id: Number(selectedInd) }
      if (editId) { await updateCB(editId, data); toast.success('Actualizado') }
      else { await createCB(data); toast.success('Creado') }
      setShowForm(false); setEditId(null); setForm(initialState)
      loadAcciones(selectedInd)
    } catch { toast.error('Error al guardar') }
  }

  const edit = (cb) => {
    setForm({
      accion: cb.accion, riesgo_asociado: cb.riesgo_asociado, presupuesto: cb.presupuesto,
      disminucion_impacto: cb.disminucion_impacto, disminucion_probabilidad: cb.disminucion_probabilidad,
      tiempo_implementacion: cb.tiempo_implementacion, personal_propio: cb.personal_propio,
      impacto_imagen: cb.impacto_imagen, impacto_resultados: cb.impacto_resultados,
      impacto_equipos: cb.impacto_equipos, impacto_legales: cb.impacto_legales, probabilidad_antes: cb.probabilidad_antes
    })
    setEditId(cb.id); setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Eliminar esta accion?')) return
    await deleteCB(id); toast.success('Eliminado'); loadAcciones(selectedInd)
  }

  const getDecisionStyle = (d) => {
    if (d.includes('NO')) return 'bg-red-100 text-red-800'
    if (d.includes('6 meses')) return 'bg-yellow-100 text-yellow-800'
    if (d.includes('3 meses')) return 'bg-blue-100 text-blue-800'
    if (d.includes('2 meses')) return 'bg-orange-100 text-orange-800'
    if (d.includes('1 mes')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
        <DollarSign size={24} /> Costo Beneficio
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select onChange={e => loadInds(e.target.value)} className="border rounded px-3 py-2 text-sm mr-2">
          <option value="">Empresa</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={selectedInd} onChange={e => { setSelectedInd(e.target.value); loadAcciones(e.target.value) }} className="border rounded px-3 py-2 text-sm">
          <option value="">Indicador</option>
          {indicadores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
      </div>

      {selectedInd && (
        <>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(initialState) }}
            className="bg-[#1F4E79] text-white px-4 py-2 rounded text-sm hover:bg-blue-800 mb-4 flex items-center gap-2">
            <Plus size={18} /> Nueva Acci&oacute;n
          </button>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold mb-3">{editId ? 'Editar' : 'Nueva'} Acci&oacute;n</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="col-span-2">
                  <input value={form.accion} onChange={e => setForm({ ...form, accion: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm" placeholder="Accion de mejora" />
                </div>
                <input value={form.riesgo_asociado} onChange={e => setForm({ ...form, riesgo_asociado: e.target.value })}
                  className="border rounded px-3 py-2 text-sm" placeholder="Riesgo asociado" />
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Beneficios (0-3)</p>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {[['presupuesto', 'Presupuesto'], ['disminucion_impacto', 'Dism Impacto'], ['disminucion_probabilidad', 'Dism Prob'], ['tiempo_implementacion', 'Tiempo'], ['personal_propio', 'Personal']].map(([k, lbl]) => (
                  <div key={k}><label className="text-xs text-gray-400">{lbl}</label>
                    <input type="number" min={0} max={3} value={form[k]} onChange={e => setForm({ ...form, [k]: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Costos / Consecuencias (0-3)</p>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {[['impacto_imagen', 'Imagen'], ['impacto_resultados', 'Resultados'], ['impacto_equipos', 'Equipos'], ['impacto_legales', 'Legales'], ['probabilidad_antes', 'Prob Antes']].map(([k, lbl]) => (
                  <div key={k}><label className="text-xs text-gray-400">{lbl}</label>
                    <input type="number" min={0} max={3} value={form[k]} onChange={e => setForm({ ...form, [k]: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                ))}
              </div>
              <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> Guardar
              </button>
            </div>
          )}

          <div className="space-y-3">
            {acciones.map(a => {
              const totalB = a.presupuesto + a.disminucion_impacto + a.disminucion_probabilidad + a.tiempo_implementacion + a.personal_propio
              const totalC = a.impacto_imagen + a.impacto_resultados + a.impacto_equipos + a.impacto_legales + a.probabilidad_antes
              const bc = totalC ? (totalB / totalC).toFixed(2) : 'N/A'
              return (
                <div key={a.id} className="bg-white rounded-lg shadow">
                  <div className="p-4 flex justify-between items-start border-b">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1F4E79]">{a.accion}</h3>
                      {a.riesgo_asociado && <p className="text-xs text-gray-500">{a.riesgo_asociado}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => edit(a)} className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                      <button onClick={() => remove(a.id)} className="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-bold">{totalB}</span>
                      </div>
                      <p className="text-xs text-gray-500">Beneficios</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600">
                        <TrendingDown size={16} />
                        <span className="text-2xl font-bold">{totalC}</span>
                      </div>
                      <p className="text-xs text-gray-500">Consecuencias</p>
                    </div>
                    <div className="text-center">
                      <span className={`text-2xl font-bold ${Number(bc) >= 2 ? 'text-green-600' : Number(bc) >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {bc}
                      </span>
                      <p className="text-xs text-gray-500">B/C</p>
                    </div>
                    <div className="text-center">
                      <span className={`text-xs px-2 py-1 rounded ${getDecisionStyle(a.decision)}`}>
                        {a.decision}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {acciones.length === 0 && <p className="text-gray-400 text-sm">No hay acciones registradas</p>}
          </div>
        </>
      )}

      {/* Reference table */}
      <div className="mt-8 bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-[#1F4E79] mb-2">Reglas de Decisi&oacute;n B/C</h3>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {[
            { range: '< 1', desc: 'NO IMPLEMENTAR', class: 'bg-red-100 text-red-800' },
            { range: '1 - 1.5', desc: '6 meses maximo', class: 'bg-yellow-100 text-yellow-800' },
            { range: '1.5 - 2', desc: '3 meses maximo', class: 'bg-blue-100 text-blue-800' },
            { range: '2 - 2.5', desc: '2 meses maximo', class: 'bg-orange-100 text-orange-800' },
            { range: '> 2.5', desc: '< 1 mes', class: 'bg-green-100 text-green-800' },
          ].map(r => (
            <div key={r.range} className={`text-center p-2 rounded ${r.class}`}>
              <p className="font-bold">B/C {r.range}</p>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
