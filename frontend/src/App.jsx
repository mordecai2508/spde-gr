import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import CargarCSV from './pages/CargarCSV'
import Prediccion from './pages/Prediccion'
import Estudiantes from './pages/Estudiantes'
import EstudianteDetalle from './pages/EstudianteDetalle'

// Nuevas (docente)
import CalificacionesDocente from './pages/CalificacionesDocente'
import AsistenciasDocente from './pages/AsistenciasDocente'

// Dashboards
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardDocente from './pages/DashboardDocente'

// UI
import Navbar from './components/Navbar'
import Toasts from './components/Toasts'

// Guard simple
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

// Selector por rol
const DashboardByRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user?.rol) return <Navigate to="/login" replace />
  return user.rol === 'COORDINADOR' ? <DashboardAdmin /> : <DashboardDocente />
}

export default function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/' || location.pathname === '/login'

  return (
    <div>
      {!hideNavbar && <Navbar />}

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

          {/* Solo coordinador verá el link en el menú, pero protegemos igual */}
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

          {/* Nuevas del docente */}
          <Route
            path="/calificaciones"
            element={
              <PrivateRoute>
                <CalificacionesDocente />
              </PrivateRoute>
            }
          />
          <Route
            path="/asistencias"
            element={
              <PrivateRoute>
                <AsistenciasDocente />
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
