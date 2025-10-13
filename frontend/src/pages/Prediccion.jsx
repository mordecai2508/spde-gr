import React, { useState } from 'react'
import { createPrediccion } from '../services/api'
import Recommendations from '../components/Recommendations'
import { success, error as notifyError } from '../utils/notify'

// Página para generar una predicción individual y mostrar recomendaciones
export default function Prediccion() {
  const [idEstudiante, setIdEstudiante] = useState('')
  const [prob, setProb] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const body = { id_estudiante: Number(idEstudiante), probabilidad_desercion: Number(prob), fecha_prediccion: new Date().toISOString() }
      const res = await createPrediccion(body)
      const created = res.data
      const recs = []
      if (created.probabilidad_desercion >= 0.7) recs.push('Alto riesgo: contactar al estudiante cuanto antes')
      if (created.probabilidad_desercion >= 0.4 && created.probabilidad_desercion < 0.7) recs.push('Medio riesgo: monitorear asistencia y desempeño')
      if (created.probabilidad_desercion < 0.4) recs.push('Bajo riesgo: seguimiento estándar')
      setRecommendations(recs)
      success('Predicción creada con éxito')
    } catch (err) {
      const txt = err.response?.data?.error || 'Error al crear predicción'
      setError(txt)
      notifyError(txt)
    }
  }

  return (
    <div>
      <h3>Generar predicción individual</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>ID Estudiante</label>
          <input className="form-control" value={idEstudiante} onChange={e => setIdEstudiante(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Probabilidad (0-1)</label>
          <input type="number" step="0.01" min="0" max="1" className="form-control" value={prob ?? ''} onChange={e => setProb(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Generar predicción</button>
      </form>

      <div className="mt-4">
        <div className="d-flex align-items-center mb-3">
          <div className={`risk-badge ${recommendations.length ? (recommendations[0].startsWith('Alto') ? 'risk-high' : recommendations[0].startsWith('Medio') ? 'risk-medium' : 'risk-low') : 'risk-low'}`}>
            {recommendations.length ? (recommendations[0].startsWith('Alto') ? 'Alto' : recommendations[0].startsWith('Medio') ? 'Medio' : 'Bajo') : 'Sin predicción'}
          </div>
          <div className="ms-3 text-muted">Nivel de riesgo</div>
        </div>

        <Recommendations items={recommendations} />
      </div>
    </div>
  )
}
