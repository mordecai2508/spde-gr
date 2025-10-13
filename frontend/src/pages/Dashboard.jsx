import React, { useEffect, useState } from 'react'
import Charts from '../components/Charts'
import { Link } from 'react-router-dom'
import { getEstudiantes, getPredicciones } from '../services/api'
import { error as notifyError } from '../utils/notify'

// Dashboard principal que muestra gráficos y resumen
export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [estudiantesCount, setEstudiantesCount] = useState(null)
  const [prediccionesCount, setPrediccionesCount] = useState(null)

  const fetchCounts = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    Promise.all([getEstudiantes(), getPredicciones()])
      .then(([eRes, pRes]) => {
        if (!mounted) return
        setEstudiantesCount(Array.isArray(eRes.data) ? eRes.data.length : 0)
        setPrediccionesCount(Array.isArray(pRes.data) ? pRes.data.length : 0)
      })
      .catch((err) => {
        const status = err.response?.status
        const msg = err.response?.data?.error || err.message || 'Error al obtener datos'
        if (status === 401) notifyError('No autorizado. Por favor inicie sesión.')
        else notifyError(msg)
      })
      .finally(() => setLoading(false))

    return () => (mounted = false)
  }

  useEffect(() => { fetchCounts() }, [])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Dashboard SPDE</h2>
          <p className="text-muted mb-0">Monitoreo y predicciones de riesgo de deserción</p>
        </div>
        <div>
          <button onClick={fetchCounts} className="btn btn-outline-secondary me-2">Actualizar</button>
          <Link to="/cargar" className="btn btn-outline-primary me-2">Subir CSV</Link>
          <Link to="/prediccion" className="btn btn-primary">Nueva Predicción</Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm card-hero">
            <h6 className="mb-1">Estudiantes</h6>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-4 fw-bold">{loading ? 'Cargando...' : (estudiantesCount ?? '—')}</div>
                <div className="text-muted">Total registrados</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm card-hero">
            <h6 className="mb-1">Predicciones</h6>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-4 fw-bold">{loading ? 'Cargando...' : (prediccionesCount ?? '—')}</div>
                <div className="text-muted">Total predicciones</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm card-hero">
            <h6 className="mb-1">Alertas</h6>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-4 fw-bold text-danger">—</div>
                <div className="text-muted">Estudiantes en alto riesgo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Charts />
    </div>
  )
}
