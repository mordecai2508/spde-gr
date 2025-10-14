import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import CargarCSV from './pages/CargarCSV'
import Prediccion from './pages/Prediccion'
import Estudiantes from './pages/Estudiantes'           // Lista (paginada 10)
import EstudianteDetalle from './pages/EstudianteDetalle' // Detalle /estudiantes/:id

// Dashboards por rol
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardDocente from './pages/DashboardDocente'

// UI
import Navbar from './components/Navbar'
import Toasts from './components/Toasts'

// ==== Guard de ruta privada (token en localStorage) ====
// (useLocation is already imported above with Routes/Route/Navigate)

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const loc = useLocation()
  // debug: log token presence and attempted path
  console.log('[PrivateRoute] token?', !!token, 'path=', loc.pathname)
  return token ? children : <Navigate to="/login" replace />
}

// ==== Selector de dashboard según `user.rol` en localStorage ====
// valores esperados: 'COORDINADOR' | 'DOCENTE'
const DashboardByRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  console.log('[DashboardByRole] user=', user)
  if (!user?.rol) return <Navigate to="/login" replace />
  return user.rol === 'COORDINADOR' ? <DashboardAdmin /> : <DashboardDocente />
}

export default function App() {
  const location = useLocation()
  // Ocultar navbar en Home y Login
  const hideNavbar = location.pathname === '/' || location.pathname === '/login'

  return (
    <div>
      {!hideNavbar && <Navbar />}

      {/* Contenedor general (sin padding en Home/Login para landing limpia) */}
      <div className={hideNavbar ? '' : 'container container-fixed mt-4'}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardByRole />
              </PrivateRoute>
            }
          />

          <Route
            path="/estudiantes"
            element={
              <PrivateRoute>
                <Estudiantes />
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiantes/:id"
            element={
              <PrivateRoute>
                <EstudianteDetalle />
              </PrivateRoute>
            }
          />

          <Route
            path="/cargar"
            element={
              <PrivateRoute>
                <CargarCSV />
              </PrivateRoute>
            }
          />
          <Route
            path="/prediccion"
            element={
              <PrivateRoute>
                <Prediccion />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toasts />
    </div>
  )
}
