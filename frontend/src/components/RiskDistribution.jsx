import React, { useMemo } from 'react'

/**
 * Espera un objeto riesgo con:
 *   { Alto: number, Medio: number, Bajo: number, pct: {alto, medio, bajo} }
 * Si no vienen pct, se calculan desde los conteos.
 */
export default function RiskDistribution({ riesgo }) {
  const stats = useMemo(() => {
    const a = Number(riesgo?.Alto || 0)
    const m = Number(riesgo?.Medio || 0)
    const b = Number(riesgo?.Bajo || 0)
    const total = a + m + b

    const pct = {
      alto: riesgo?.pct?.alto ?? (total ? Math.round((a / total) * 100) : 0),
      medio: riesgo?.pct?.medio ?? (total ? Math.round((m / total) * 100) : 0),
      bajo: riesgo?.pct?.bajo ?? (total ? Math.round((b / total) * 100) : 0),
    }

    return { a, m, b, total, pct }
  }, [riesgo])

  const Row = ({ label, value, pct, badgeColor }) => (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="text-muted">{label}</div>
        <span className="badge border-0"
          style={{ background: badgeColor, color: badgeColor === '#f9a825' ? '#000' : '#fff' }}>
          {value} estudiantes
        </span>
      </div>
      <div className="progress mb-3" style={{ height: 8, background: '#eef1f6' }}>
        <div className="progress-bar"
          role="progressbar"
          style={{ width: `${pct}%`, background: '#0d47a1' }}
          aria-valuemin="0" aria-valuemax="100" />
      </div>
    </>
  )

  return (
    <div className="card shadow-sm h-100 border-0" style={{ borderRadius: 14 }}>
      <div className="card-body">
        <h5 className="mb-2">📊 Distribución de Riesgo</h5>
        <div className="text-muted small mb-3">Análisis predictivo de deserción estudiantil</div>

        <Row label="Riesgo Alto"  value={stats.a} pct={stats.pct.alto}  badgeColor="#d32f2f" />
        <Row label="Riesgo Medio" value={stats.m} pct={stats.pct.medio} badgeColor="#f9a825" />
        <Row label="Bajo Riesgo"  value={stats.b} pct={stats.pct.bajo}  badgeColor="#388e3c" />
      </div>
    </div>
  )
}
