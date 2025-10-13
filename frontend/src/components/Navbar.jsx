import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Navbar simple con logout
export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{background:'#ffffff', boxShadow:'0 2px 6px rgba(0,0,0,0.04)'}}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <div style={{fontSize:22, marginRight:8}}>🎓</div>
          <div>
            <div className="fw-bold">SPADE</div>
            <div className="small text-muted">Sistema Predictivo de Deserción Estudiantil</div>
          </div>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cargar">Cargar CSV</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/prediccion">Predicción</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/estudiante">Estudiante</Link></li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {token && user ? (
              <>
                <div className="me-3 text-muted">{user.nombre || user.email}</div>
                <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link className="btn btn-primary" to="/login">Acceder al Sistema</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
