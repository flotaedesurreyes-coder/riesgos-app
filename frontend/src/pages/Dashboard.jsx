import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, GitBranch, Scale, HelpCircle, Table2, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { getEmpresas, getIndicadores, getRiesgos7M, getAMFEC, getCB } from '../api/client'

const stepCards = [
  { path: '/matriz-7m', label: 'Matriz 7M', icon: GitBranch, color: 'bg-blue-500', desc: 'Identificar riesgos del indicador' },
  { path: '/criterios', label: 'Criterios de Valoraci\u00f3n', icon: Scale, color: 'bg-green-500', desc: 'Definir escalas P/I/D 1-5' },
  { path: '/5pq', label: '5 Por Qu\u00e9', icon: HelpCircle, color: 'bg-yellow-500', desc: 'Analizar causa ra\u00edz' },
  { path: '/amfec', label: 'AMFEC', icon: Table2, color: 'bg-purple-500', desc: 'Calcular NPR = P x I x D' },
  { path: '/costo-beneficio', label: 'Costo Beneficio', icon: DollarSign, color: 'bg-red-500', desc: 'Evaluar viabilidad econ\u00f3mica' },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ empresas: 0, indicadores: 0, riesgos: 0, amfec: 0, acciones: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const empresas = await getEmpresas()
        let totalInd = 0, totalRiesgos = 0, totalAMFEC = 0, totalCB = 0
        for (const emp of empresas) {
          const inds = await getIndicadores(emp.id)
          totalInd += inds.length
          for (const ind of inds) {
            const [r, a, c] = await Promise.all([
              getRiesgos7M(ind.id), getAMFEC(ind.id), getCB(ind.id)
            ])
            totalRiesgos += r.length
            totalAMFEC += a.length
            totalCB += c.length
          }
        }
        setStats({ empresas: empresas.length, indicadores: totalInd, riesgos: totalRiesgos, amfec: totalAMFEC, acciones: totalCB })
      } catch { }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F4E79] mb-6">Dashboard</h1>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Empresas', value: stats.empresas, icon: Building2, color: 'text-blue-600' },
          { label: 'Indicadores', value: stats.indicadores, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Riesgos 7M', value: stats.riesgos, icon: AlertTriangle, color: 'text-yellow-600' },
          { label: 'Modos AMFEC', value: stats.amfec, icon: Table2, color: 'text-purple-600' },
          { label: 'Acciones B/C', value: stats.acciones, icon: CheckCircle, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={20} className={s.color} />
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-[#1F4E79]">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-[#1F4E79] mb-4">Cadena de An&aacute;lisis de Riesgos</h2>
      <div className="grid grid-cols-5 gap-4">
        {stepCards.map((step, idx) => (
          <Link key={step.path} to={step.path}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border-t-4"
            style={{ borderTopColor: step.color.replace('bg-', '#').replace('blue', '3B82F6').replace('green', '22C55E').replace('yellow', 'EAB308').replace('purple', 'A855F7').replace('red', 'EF4444') }}>
            <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white mb-3`}>
              <step.icon size={20} />
            </div>
            <p className="text-xs text-gray-400 mb-1">Paso {idx + 1}</p>
            <h3 className="font-semibold text-sm text-[#1F4E79]">{step.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Cadena Completa</h3>
        <p className="text-sm text-blue-700">
          Matriz 7M &#8594; Criterios de Valoraci&oacute;n &#8594; 5 Por Qu&eacute; &#8594; AMFEC &#8594; Costo Beneficio
        </p>
        <p className="text-xs text-blue-500 mt-1">
          NPR = Probabilidad (1-5) x Impacto (1-5) x Detectabilidad (1-5)
        </p>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        Creado por <strong>Isaac Reyes</strong> para la clase de Gesti&oacute;n de Riesgos
      </div>
    </div>
  )
}
