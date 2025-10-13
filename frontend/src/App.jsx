import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import CargarCSV from './pages/CargarCSV'
import Prediccion from './pages/Prediccion'
import Estudiante from './pages/Estudiante'
import Navbar from './components/Navbar'
import Toasts from './components/Toasts'

// Simple auth helper using localStorage token
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container container-fixed mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/cargar" element={<PrivateRoute><CargarCSV /></PrivateRoute>} />
          <Route path="/prediccion" element={<PrivateRoute><Prediccion /></PrivateRoute>} />
          <Route path="/estudiante" element={<PrivateRoute><Estudiante /></PrivateRoute>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
  <Toasts />
    </div>
  )
}
