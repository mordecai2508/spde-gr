import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = React.useMemo(() => JSON.parse(localStorage.getItem('user') || 'null') || {}, [])

  const initials = (() => {
    const n = user?.nombre || user?.name || ''
    if (!n) return 'U'
    return n.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
  })()

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const commonLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/estudiantes', label: 'Estudiantes' },
  ]

  const coordLinks = [
    { to: '/cargar', label: 'Cargar Datos' },
    { to: '/reportes', label: 'Reportes' },
  ]

  const docenteLinks = [
    { to: '/calificaciones', label: 'Calificaciones' },
    { to: '/asistencias', label: 'Asistencias' },
    { to: '/reportes', label: 'Reportes' },
  ]

  const navItems = user?.rol === 'COORDINADOR'
    ? [...commonLinks, ...coordLinks]
    : user?.rol === 'DOCENTE'
      ? [...commonLinks, ...docenteLinks]
      : commonLinks

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center">
          <div style={{fontWeight:700, color:'#0d47a1', marginRight:12}}>SPADE</div>
          <div className="d-none d-md-block">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({isActive}) => `me-3 text-decoration-none ${isActive ? 'fw-bold' : 'text-muted'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <button className="btn btn-light border rounded-circle" title="Notificaciones">🔔</button>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
          </div>

          <div className="dropdown">
            <button className="btn btn-light border d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width:34,height:34,background:'#eef2f7'}}>{initials}</div>
              <div className="d-none d-md-block text-start">
                <div style={{fontSize:12}}>{user?.nombre || user?.name || user?.email}</div>
                <div className="text-muted" style={{fontSize:11}}>{user?.rol || ''}</div>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={()=>navigate('/perfil')}>Perfil</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={onLogout}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
