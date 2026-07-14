import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, GitBranch, Scale, HelpCircle,
  Table2, DollarSign, FileDown, ChevronRight
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import EmpresasPage from './pages/EmpresasPage'
import IndicadorPage from './pages/IndicadorPage'
import Matriz7MPage from './pages/Matriz7MPage'
import CriteriosPage from './pages/CriteriosPage'
import CincoPorQuePage from './pages/CincoPorQuePage'
import AMFECPage from './pages/AMFECPage'
import CostoBeneficioPage from './pages/CostoBeneficioPage'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/empresas', label: 'Empresas', icon: Building2 },
]

const chainItems = [
  { path: '/matriz-7m', label: 'Matriz 7M', icon: GitBranch },
  { path: '/criterios', label: 'Criterios', icon: Scale },
  { path: '/5pq', label: '5 Por Que', icon: HelpCircle },
  { path: '/amfec', label: 'AMFEC', icon: Table2 },
  { path: '/costo-beneficio', label: 'Costo Beneficio', icon: DollarSign },
]

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#1F4E79] text-white flex flex-col">
        <div className="p-4 border-b border-blue-800">
          <h1 className="text-xl font-bold">RiesgosApp</h1>
          <p className="text-xs text-blue-200 mt-1">Gesti&oacute;n de Riesgos POA</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50'
              }`}>
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-blue-700 my-2 pt-2">
            <p className="px-3 text-xs text-blue-300 uppercase font-semibold mb-1">Cadena de Riesgos</p>
            {chainItems.map((item, idx) => (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50'
                }`}>
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-3 border-t border-blue-800 text-xs text-blue-300">
          <p>v1.0.0</p>
          <p className="mt-1">Isaac Reyes &mdash; Gesti&oacute;n de Riesgos</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/indicador/:id" element={<IndicadorPage />} />
            <Route path="/matriz-7m" element={<Matriz7MPage />} />
            <Route path="/criterios" element={<CriteriosPage />} />
            <Route path="/5pq" element={<CincoPorQuePage />} />
            <Route path="/amfec" element={<AMFECPage />} />
            <Route path="/costo-beneficio" element={<CostoBeneficioPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
