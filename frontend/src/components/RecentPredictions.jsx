import React from 'react'

export default function RecentPredictions({ items }) {
  const list = Array.isArray(items) ? items : []
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="m-0">🧠 Predicciones Recientes</h5>
          <div className="small text-muted">{list.length} eventos</div>
        </div>
        {!list.length && <div className="text-muted small">Sin registros en las últimas 24h.</div>}
        <ul className="list-group list-group-flush">
          {list.map((it) => (
            <li key={it.id || `${it.title}-${it.fecha}`} className="list-group-item d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold">{it.title || `Predicción ${it.id}`}</div>
                <div className="small text-muted">{it.description || it.fecha}</div>
              </div>
              {it.tag && (
                <span className={`badge ${it.tag === 'Nuevo' ? 'text-bg-warning' : it.tag === 'Listo' ? 'text-bg-primary' : 'text-bg-secondary'}`}>
                  {it.tag}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
