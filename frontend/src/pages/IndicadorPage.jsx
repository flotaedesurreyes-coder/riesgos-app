import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, GitBranch, Scale, HelpCircle, Table2, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { getIndicador, getRiesgos7M, getAMFEC, getCB, exportarExcel } from '../api/client'

const chainLinks = [
  { path: '/matriz-7m', label: 'Matriz 7M', icon: GitBranch, step: 1 },
  { path: '/criterios', label: 'Criterios', icon: Scale, step: 2 },
  { path: '/5pq', label: '5 Por Que', icon: HelpCircle, step: 3 },
  { path: '/amfec', label: 'AMFEC', icon: Table2, step: 4 },
  { path: '/costo-beneficio', label: 'Costo Beneficio', icon: DollarSign, step: 5 },
]

export default function IndicadorPage() {
  const { id } = useParams()
  const [ind, setInd] = useState(null)
  const [stats, setStats] = useState({ riesgos: 0, amfec: 0, cb: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const indicador = await getIndicador(id)
        setInd(indicador)
        const [r, a, c] = await Promise.all([
          getRiesgos7M(id), getAMFEC(id), getCB(id)
        ])
        setStats({ riesgos: r.length, amfec: a.length, cb: c.length })
      } catch {
        toast.error('Error al cargar indicador')
      }
    }
    load()
  }, [id])

  if (!ind) return <p className="text-gray-500">Cargando...</p>

  const handleExport = async () => {
    try {
      await exportarExcel(id)
      toast.success('Excel descargado')
    } catch {
      toast.error('Error al exportar')
    }
  }

  return (
    <div>
      <Link to="/empresas" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm mb-4">
        <ArrowLeft size={16} /> Volver a Empresas
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1F4E79]">{ind.nombre}</h1>
            {ind.descripcion && <p className="text-gray-500 text-sm mt-1">{ind.descripcion}</p>}
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
            <Download size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.riesgos}</p>
          <p className="text-sm text-blue-800">Riesgos 7M</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.amfec}</p>
          <p className="text-sm text-purple-800">Modos AMFEC</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.cb}</p>
          <p className="text-sm text-red-800">Acciones B/C</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-[#1F4E79] mb-4">Cadena de An&aacute;lisis</h2>
      <div className="grid grid-cols-5 gap-3">
        {chainLinks.map(link => (
          <Link key={link.path} to={link.path}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center">
            <div className="w-10 h-10 rounded-full bg-[#1F4E79] flex items-center justify-center text-white mx-auto mb-2">
              <link.icon size={20} />
            </div>
            <p className="text-xs text-gray-400">Paso {link.step}</p>
            <p className="font-semibold text-sm text-[#1F4E79]">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
