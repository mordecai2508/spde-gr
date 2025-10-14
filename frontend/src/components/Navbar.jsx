import React, { useState, useEffect, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getPredicciones } from '../services/api'

const BRAND_BLUE = '#0d47a1'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [alerts, setAlerts] = useState(0)

  // Lee el usuario del localStorage y normaliza rol/nombre/email
  const user = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null') || {}
      return {
        nombre: u.nombre || u.name || u.username || '',
        email: u.email || u.correo || '',
        rol: (u.rol || u.role || u.tipo || '').toUpperCase() || '', // 'COORDINADOR' | 'DOCENTE'
      }
    } catch {
      return { nombre: '', email: '', rol: '' }
    }
  }, [])

  // Iniciales desde nombre o email
  const initials = useMemo(() => {
    const src = user.nombre?.trim() || user.email?.trim() || 'CA'
    const parts = src.split(/[\s.@_]+/).filter(Boolean)
    const a = (parts[0]?.[0] || '').toUpperCase()
    const b = (parts[1]?.[0] || '').toUpperCase()
    return (a + (b || '')).slice(0, 2) || 'CA'
  }, [user])

  // Etiquetas de rol
  const roleLabel = user.rol === 'COORDINADOR' ? 'Coordinador' : (user.rol === 'DOCENTE' ? 'Docente' : 'Usuario')
  const subtitle = user.email || 'Académico'

  useEffect(() => {
    let mounted = true
    if (!token) return
    getPredicciones()
      .then(res => {
        if (!mounted) return
        const items = Array.isArray(res?.data) ? res.data : []
        const cutoff = Date.now() - 24 * 60 * 60 * 1000
        const recent = items.filter(p => new Date(p.fecha || p.fecha_prediccion || p.createdAt || 0) >= cutoff)
        setAlerts(recent.length)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [token])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav className="shadow-sm" style={{ background: '#fff' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between py-2 px-4">
        {/* IZQUIERDA: Marca */}
        <div className="d-flex align-items-center">
          <div style={{ fontSize: 24, marginRight: 8 }}>🎓</div>
          <div>
            <div style={{ color: BRAND_BLUE, fontWeight: 600 }}>SPADE</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Sistema Predictivo de Deserción Estudiantil</div>
          </div>
        </div>

        {/* CENTRO: Menú */}
        <ul className="nav d-none d-md-flex gap-3">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'fw-semibold text-primary bg-light rounded px-2' : 'text-dark'}`
              }
            >
              🏠 Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/estudiantes"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'fw-semibold text-primary bg-light rounded px-2' : 'text-dark'}`
              }
            >
              👥 Estudiantes
            </NavLink>
          </li>
          {/* Nota: si quieres ocultar “Cargar Datos” a DOCENTE, descomenta el condicional */}
          {/* {user.rol === 'COORDINADOR' && ( */}
          <li className="nav-item">
            <NavLink
              to="/cargar"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'fw-semibold text-primary bg-light rounded px-2' : 'text-dark'}`
              }
            >
              ⬆️ Cargar Datos
            </NavLink>
          </li>
          {/* )} */}
          <li className="nav-item">
            <NavLink
              to="/prediccion"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'fw-semibold text-primary bg-light rounded px-2' : 'text-dark'}`
              }
            >
              📊 Reportes
            </NavLink>
          </li>
        </ul>

        {/* DERECHA: Notificaciones + Usuario (rol auto) + Cerrar sesión */}
        <div className="d-flex align-items-center gap-3">
          {/* Notificaciones */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-light position-relative" title="Notificaciones">🔔</button>
            {alerts > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  background: '#d32f2f',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '2px 6px',
                  fontSize: 12
                }}
              >
                {alerts}
              </span>
            )}
          </div>

          {/* Usuario */}
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                background: BRAND_BLUE,
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 15
              }}
            >
              {initials}
            </div>
            <div className="text-start">
              <div className="fw-semibold" style={{ fontSize: 14 }}>
                {roleLabel}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {subtitle}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-link text-dark"
              title="Cerrar sesión"
              style={{ fontSize: 20, textDecoration: 'none' }}
            >
              ↩️
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
