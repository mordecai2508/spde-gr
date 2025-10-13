import React, { useState } from 'react'
import { uploadEstudiantes } from '../services/api'
import { success, error as notifyError } from '../utils/notify'

// Página de carga de CSV
export default function CargarCSV() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setMessage({ type: 'danger', text: 'Seleccione un archivo' })
    setMessage(null)
    try {
      const res = await uploadEstudiantes(file)
      const txt = `${res.data.created} registros creados`
      setMessage({ type: 'success', text: txt })
      success(txt)
    } catch (err) {
      const txt = err.response?.data?.error || 'Error al subir CSV'
      setMessage({ type: 'danger', text: txt })
      notifyError(txt)
    }
  }

  return (
    <div>
      <div className="card p-4 shadow-sm">
        <h3>Cargar archivo CSV de estudiantes</h3>
        <p className="text-muted">Sube un archivo CSV con los datos de los estudiantes. El backend procesará y guardará los registros.</p>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} className="form-control" />
          </div>
          <button className="btn btn-primary">Subir CSV</button>
        </form>
      </div>
    </div>
  )
}
