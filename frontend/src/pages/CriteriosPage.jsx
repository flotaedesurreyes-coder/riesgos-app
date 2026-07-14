import { useState, useEffect } from 'react'
import { Scale, Info } from 'lucide-react'
import { getCriterios, initCriterios, getNPRInfo } from '../api/client'

const tipos = ['PROBABILIDAD', 'IMPACTO', 'DETECTABILIDAD']
const tipoColors = { 'PROBABILIDAD': 'border-blue-400', 'IMPACTO': 'border-red-400', 'DETECTABILIDAD': 'border-yellow-400' }

export default function CriteriosPage() {
  const [criterios, setCriterios] = useState({})
  const [nprInfo, setNprInfo] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.all(tipos.map(t => getCriterios(t)))
        const map = {}
        tipos.forEach((t, i) => { map[t] = results[i] })
        setCriterios(map)
        setNprInfo(await getNPRInfo())
      } catch {
        try {
          await initCriterios()
          const results = await Promise.all(tipos.map(t => getCriterios(t)))
          const map = {}
          tipos.forEach((t, i) => { map[t] = results[i] })
          setCriterios(map)
          setNprInfo(await getNPRInfo())
        } catch { }
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
        <Scale size={24} /> Criterios de Valoraci&oacute;n
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {tipos.map(tipo => (
          <div key={tipo} className={`bg-white rounded-lg shadow p-4 border-t-4 ${tipoColors[tipo]}`}>
            <h2 className="font-semibold text-[#1F4E79] mb-3">{tipo}</h2>
            <div className="space-y-2">
              {(criterios[tipo] || []).map(c => (
                <div key={c.id} className="text-sm border-b pb-2 last:border-0">
                  <span className="font-bold text-lg text-[#1F4E79]">{c.valor}</span>
                  <span className="text-gray-600 ml-2">{c.nivel}</span>
                  <p className="text-xs text-gray-500 mt-1">{c.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {nprInfo && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-[#1F4E79] mb-3 flex items-center gap-2">
            <Info size={18} /> Matriz de Criticidad NPR
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            F&oacute;rmula: <strong>NPR = Probabilidad x Impacto x Detectabilidad</strong>
            &nbsp;(Rango: {nprInfo.rango_min} - {nprInfo.rango_max})
          </p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(nprInfo.clasificacion).map(([key, val]) => (
              <div key={key} className={`rounded p-3 text-white text-center ${
                key === 'Bajo' ? 'bg-green-500' : key === 'Moderado' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <p className="text-lg font-bold">{val.min} - {val.max}</p>
                <p className="text-sm font-semibold">{key}</p>
                <p className="text-xs mt-1 opacity-90">{val.accion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
