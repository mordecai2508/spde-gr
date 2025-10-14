import React from 'react'
import { Link } from 'react-router-dom'

const BRAND = '#0d47a1'

export default function ActionCard({
  icon = '📄',
  title,
  subtitle,
  to = '#',
  buttonText = 'Abrir',
}) {
  return (
    <div className="card action-card shadow-sm border-0">
      <div className="card-body d-flex flex-column align-items-center text-center">
        {/* Icono dentro de un aro */}
        <div className="icon-ring mb-3" aria-hidden>
          <span className="icon-emoji">{icon}</span>
        </div>

        <h5 className="mb-2">{title}</h5>
        <p className="text-muted small mb-4">{subtitle}</p>

        <Link to={to} className="btn action-btn w-100">
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
