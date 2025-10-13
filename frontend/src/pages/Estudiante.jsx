import React, { useState } from 'react'
import { getEstudianteById } from '../services/api'

// Página para consultar estudiante individualmente (RF03)
export default function Estudiante() {
  const [id, setId] = useState('')
  const [estudiante, setEstudiante] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)
    setEstudiante(null)
    try {
      const res = await getEstudianteById(id)
      setEstudiante(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Estudiante no encontrado')
    }
  }

  return (
    <div>
      <h3>Consultar estudiante</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input className="form-control" placeholder="ID del estudiante" value={id} onChange={e => setId(e.target.value)} required />
          <button className="btn btn-primary" type="submit">Buscar</button>
        </div>
      </form>

      {estudiante && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{estudiante.nombre}</h5>
            <p className="card-text">Documento: {estudiante.documento}</p>
            <p className="card-text">Edad: {estudiante.edad}</p>
            <p className="card-text">Programa: {estudiante.programa}</p>
            {/* You can add more fields as provided by the backend */}
          </div>
        </div>
      )}
    </div>
  )
}
