import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEmpresas, getIndicadores, getRiesgos7M, getAnalisis5PQ, createAnalisis5PQ, updateAnalisis5PQ, deleteAnalisis5PQ } from '../api/client'

const emptyPreguntas = [
  { nivel: 1, pregunta: '', respuesta: '' },
  { nivel: 2, pregunta: '', respuesta: '' },
  { nivel: 3, pregunta: '', respuesta: '' },
  { nivel: 4, pregunta: '', respuesta: '' },
  { nivel: 5, pregunta: '', respuesta: '' },
]

export default function CincoPorQuePage() {
  const [empresas, setEmpresas] = useState([])
  const [indicadores, setIndicadores] = useState([])
  const [selectedInd, setSelectedInd] = useState('')
  const [analisis, setAnalisis] = useState([])
  const [riesgos, setRiesgos] = useState([])
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', riesgo_id: '', causa_raiz: '', preguntas: emptyPreguntas })

  useEffect(() => { getEmpresas().then(setEmpresas) }, [])

  const loadIndicadores = async (empId) => {
    if (!empId) { setIndicadores([]); return }
    setIndicadores(await getIndicadores(empId))
  }

  const loadData = async (indId) => {
    if (!indId) { setAnalisis([]); setRiesgos([]); return }
    const [a, r] = await Promise.all([getAnalisis5PQ(indId), getRiesgos7M(indId)])
    setAnalisis(a)
    setRiesgos(r)
  }

  const save = async () => {
    if (!form.titulo.trim()) { toast.error('El titulo es obligatorio'); return }
    for (const p of form.preguntas) {
      if (!p.pregunta.trim() || !p.respuesta.trim()) { toast.error('Completa todas las preguntas y respuestas'); return }
    }
    try {
      const data = { indicador_id: Number(selectedInd), titulo: form.titulo, riesgo_id: form.riesgo_id ? Number(form.riesgo_id) : null, causa_raiz: form.causa_raiz, preguntas: form.preguntas }
      if (editId) { await updateAnalisis5PQ(editId, data); toast.success('Actualizado') }
      else { await createAnalisis5PQ(data); toast.success('Creado') }
      setShowForm(false); setEditId(null); setForm({ titulo: '', riesgo_id: '', causa_raiz: '', preguntas: emptyPreguntas })
      loadData(selectedInd)
    } catch { toast.error('Error al guardar') }
  }

  const edit = (a) => {
    setForm({ titulo: a.titulo, riesgo_id: a.riesgo_id || '', causa_raiz: a.causa_raiz, preguntas: a.preguntas.map(p => ({ nivel: p.nivel, pregunta: p.pregunta, respuesta: p.respuesta })) })
    setEditId(a.id); setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Eliminar este analisis?')) return
    await deleteAnalisis5PQ(id); toast.success('Eliminado'); loadData(selectedInd)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
        <HelpCircle size={24} /> 5 Por Qu&eacute;
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select onChange={e => { const empId = e.target.value; loadIndicadores(empId); setSelectedInd('') }} className="border rounded px-3 py-2 text-sm mr-2">
          <option value="">Empresa</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={selectedInd} onChange={e => { setSelectedInd(e.target.value); loadData(e.target.value) }} className="border rounded px-3 py-2 text-sm">
          <option value="">Indicador</option>
          {indicadores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
      </div>

      {selectedInd && (
        <>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ titulo: '', riesgo_id: '', causa_raiz: '', preguntas: emptyPreguntas }) }}
            className="bg-[#1F4E79] text-white px-4 py-2 rounded text-sm hover:bg-blue-800 mb-4 flex items-center gap-2">
            <Plus size={18} /> Nuevo An&aacute;lisis
          </button>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold mb-3">{editId ? 'Editar' : 'Nuevo'} An&aacute;lisis 5 Por Qu&eacute;</h3>
              <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm mb-3" placeholder="Titulo del analisis" />
              <select value={form.riesgo_id} onChange={e => setForm({ ...form, riesgo_id: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm mb-3">
                <option value="">Riesgo asociado (opcional)</option>
                {riesgos.map(r => <option key={r.id} value={r.id}>{r.riesgo}</option>)}
              </select>
              {form.preguntas.map((p, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                  <input value={p.pregunta} onChange={e => { const q = [...form.preguntas]; q[idx].pregunta = e.target.value; setForm({ ...form, preguntas: q }) }}
                    className="border rounded px-3 py-2 text-sm" placeholder={`${idx + 1}. Por que?`} />
                  <input value={p.respuesta} onChange={e => { const q = [...form.preguntas]; q[idx].respuesta = e.target.value; setForm({ ...form, preguntas: q }) }}
                    className="border rounded px-3 py-2 text-sm" placeholder={`Respuesta ${idx + 1}`} />
                </div>
              ))}
              <textarea value={form.causa_raiz} onChange={e => setForm({ ...form, causa_raiz: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm mb-3" rows={2} placeholder="Causa raiz (se completa al final)" />
              <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> Guardar
              </button>
            </div>
          )}

          <div className="space-y-4">
            {analisis.map(a => (
              <div key={a.id} className="bg-white rounded-lg shadow">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[#1F4E79]">{a.titulo}</h3>
                    {a.riesgo_id && <p className="text-xs text-gray-500">Riesgo ID: {a.riesgo_id}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => edit(a)} className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                    <button onClick={() => remove(a.id)} className="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
                  </div>
                </div>
                <div className="p-4">
                  {a.preguntas.map(p => (
                    <div key={p.id} className="mb-2 pb-2 border-b last:border-0">
                      <p className="text-sm font-medium text-gray-700">{p.pregunta}</p>
                      <p className="text-sm text-gray-500 ml-4">{p.respuesta}</p>
                    </div>
                  ))}
                  {a.causa_raiz && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs font-semibold text-yellow-800">Causa Raiz:</p>
                      <p className="text-sm text-yellow-700">{a.causa_raiz}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {analisis.length === 0 && <p className="text-gray-400 text-sm">No hay analisis registrados</p>}
          </div>
        </>
      )}
    </div>
  )
}
