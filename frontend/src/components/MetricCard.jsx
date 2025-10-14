import React from 'react'

export default function MetricCard({
  title,
  value,
  sub,
  icon = '📊',
  color = '#0d47a1',
}) {
  return (
    <div className="card shadow-sm h-100 border-0" style={{ borderRadius: 14 }}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="text-muted small">{title}</div>
          <div
            aria-hidden
            style={{
              width: 38, height: 38, borderRadius: '50%',
              display: 'grid', placeItems: 'center',
              background: '#f1f4fb', color
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
          </div>
        </div>

        <div className="display-6" style={{ color }}>{value}</div>

        {sub && <div className="text-muted small mt-1">{sub}</div>}
      </div>
    </div>
  )
}
