import React, { useEffect, useState } from 'react'
import ActionCard from '../components/ActionCard'
import {
  getEstudiantes,
  getRecentPredictions,
  getCalificaciones,
  getAsistencias
} from '../services/api'
import MetricCard from '../components/MetricCard'
import RiskDistribution from '../components/RiskDistribution'
import RecentPredictions from '../components/RecentPredictions'
import { dashboardAggregates } from '../utils/stats'

const BRAND_BLUE = '#0d47a1'

// --- Helpers para enriquecer estudiantes -----------------------------------

// 1) Promedio 0..5 por estudiante usando /calificaciones
function buildPromedios(calificaciones) {
  const map = new Map()
  for (const c of Array.isArray(calificaciones) ? calificaciones : []) {
    const id = c.id_estudiante
    const nota = Number(c.nota ?? 0)
    if (!map.has(id)) map.set(id, { sum: 0, count: 0 })
    const acc = map.get(id)
    acc.sum += nota
    acc.count += 1
  }
  const out = new Map()
  map.forEach((acc, id) => {
    out.set(id, acc.count ? +(acc.sum / acc.count).toFixed(2) : 0)
  })
  return out
}

// 2) Asistencia 0..100 por estudiante usando /asistencias
//    (presente=1, tarde=0.5, ausente/otro=0)
function buildAsistencias(asistencias) {
  const map = new Map()
  for (const a of Array.isArray(asistencias) ? asistencias : []) {
    const id = a.id_estudiante
    const estado = String(a.estado || '').toLowerCase()
    let s = 0
    if (estado === 'presente') s = 1
    else if (estado === 'tarde') s = 0.5
    else s = 0
    if (!map.has(id)) map.set(id, { score: 0, n: 0 })
    const acc = map.get(id)
    acc.score += s
    acc.n += 1
  }
  const out = new Map()
  map.forEach((acc, id) => {
    const pct = acc.n ? Math.round((acc.score / acc.n) * 100) : 0
    out.set(id, pct)
  })
  return out
}

// 3) Enriquecer cada estudiante con promedio y asistencia calculados si faltan
function enrichEstudiantes(ests, promMap, asisMap) {
  return (Array.isArray(ests) ? ests : []).map(e => {
    const id = e.id_estudiante
    const promedio_nota = (e.promedio_nota ?? promMap.get(id) ?? 0)
    const asistencia    = (e.asistencia    ?? asisMap.get(id) ?? 0)
    return { ...e, promedio_nota, asistencia }
  })
}

// ---------------------------------------------------------------------------

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true)
  const [estudiantes, setEstudiantes] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.all([getEstudiantes(), getCalificaciones(), getAsistencias(), getRecentPredictions()])
      .then(([eRes, cRes, aRes, rRes]) => {
        if (!mounted) return
        const ests = Array.isArray(eRes.data) ? eRes.data : []
        const cals = Array.isArray(cRes.data) ? cRes.data : []
        const asis = Array.isArray(aRes.data) ? aRes.data : []
        const recs = Array.isArray(rRes.data) ? rRes.data : []

        const promMap = buildPromedios(cals)
        const asisMap = buildAsistencias(asis)
        const enriched = enrichEstudiantes(ests, promMap, asisMap)

        setEstudiantes(enriched)
        setRecent(recs)
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  // Agregados para métricas
  const agg = dashboardAggregates(estudiantes)
  const { total, avgAsist, avgProm, riesgo } = agg

  const alto = riesgo?.Alto || 0
  const med  = riesgo?.Medio || 0
  const bajo = riesgo?.Bajo || 0

  const pAlto = riesgo?.pct?.alto || 0
  const pMed  = riesgo?.pct?.medio || 0
  const pBajo = riesgo?.pct?.bajo || 0

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <div className="py-3 mb-3" style={{background:'#f7f8fa', borderRadius:12}}>
        <h2 className="mb-1">Panel de Control - Predicción de Deserción</h2>
        <div className="text-muted">Monitoreo y análisis predictivo del riesgo de abandono académico</div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Total Estudiantes"
            value={loading ? '...' : total}
            sub="Activos en el sistema"
            icon="👤"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Riesgo Alto"
            value={loading ? '...' : alto}
            sub={!loading ? `${pAlto}% del total` : ''}
            icon="⚠️"
            color="#d32f2f"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Riesgo Medio"
            value={loading ? '...' : med}
            sub={!loading ? `${pMed}% del total` : ''}
            icon="📈"
            color="#f9a825"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Bajo Riesgo"
            value={loading ? '...' : bajo}
            sub={!loading ? `${pBajo}% del total` : ''}
            icon="👥"
            color="#388e3c"
          />
        </div>
      </div>

      {/* Segunda fila: promedios */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-1">📅 Promedio de Asistencia</h5>
              <div className="display-6" style={{color:BRAND_BLUE}}>
                {loading ? '...' : `${Math.round(avgAsist)}%`}
              </div>
              <div className="text-muted small">Promedio general (0–100)</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-1">📝 Promedio Académico</h5>
              <div className="display-6" style={{color:BRAND_BLUE}}>
                {loading ? '...' : avgProm.toFixed(2)}
              </div>
              <div className="text-muted small">Escala 0.00 – 5.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución + recientes */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <RiskDistribution riesgo={riesgo} />
        </div>
        <div className="col-12 col-xl-4">
          {/* Si aún no hay IA, esta card quedará vacía o con placeholder */}
          <RecentPredictions items={recent} />
        </div>
      </div>

      {/* Acciones rápidas con ActionCard (diseño nuevo) */}
      <div className="row g-3 action-grid">
        <div className="col-12 col-md-4">
          <ActionCard
            icon="📄"
            title="Cargar Datos"
            subtitle="Importar archivos CSV con información estudiantil"
            to="/cargar"
            buttonText="Importar CSV"
          />
        </div>

        <div className="col-12 col-md-4">
          <ActionCard
            icon="🎯"
            title="Análisis Individual"
            subtitle="Consultar riesgo específico de estudiantes"
            to="/estudiantes"
            buttonText="Ver Estudiantes"
          />
        </div>

        <div className="col-12 col-md-4">
          <ActionCard
            icon="📈"
            title="Reportes"
            subtitle="Generar informes y estadísticas detalladas"
            to="/reportes"
            buttonText="Generar Reporte"
          />
        </div>
      </div>
    </div>
  )
}
