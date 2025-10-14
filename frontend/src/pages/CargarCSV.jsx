// src/pages/CargarCSV.jsx
import React, { useRef, useState } from 'react'
import { uploadEstudiantes } from '../services/api'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const BRAND = '#0d47a1'

export default function CargarCSV() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const acceptCSV = (f) => f && f.type.includes('csv') || (f && f.name?.toLowerCase().endsWith('.csv'))

  const handleFile = (f) => {
    setMsg({ type: '', text: '' })
    if (!f) return
    if (!acceptCSV(f)) {
      setMsg({ type: 'danger', text: 'Solo se permiten archivos .csv' })
      return
    }
    if (f.size > MAX_SIZE) {
      setMsg({ type: 'danger', text: 'El archivo supera el tamaño máximo de 10MB' })
      return
    }
    setFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const onChange = (e) => handleFile(e.target.files?.[0])

  const onUpload = async () => {
    if (!file) {
      setMsg({ type: 'warning', text: 'Selecciona un archivo CSV primero.' })
      return
    }
    setUploading(true)
    setMsg({ type: '', text: '' })
    try {
      await uploadEstudiantes(file)
      setMsg({ type: 'success', text: 'Archivo cargado y procesado correctamente.' })
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setMsg({
        type: 'danger',
        text: err?.data?.message || err?.message || 'Error al subir el archivo.'
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Encabezados EXACTOS que me pediste
    const headers = ['nombre','documento','edad','genero','programa','estrato','trabaja']
    // Unas filas de ejemplo (puedes editar)
    const rows = [
      ['Ana García','1001','21','F','Ingeniería de Sistemas','3','0'],
      ['Luis Moreno','1002','23','M','Ingeniería de Software','2','0'],
      ['Sofía Castro','1003','20','F','Psicología','3','1'],
    ]
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla_estudiantes.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-3">
        <button className="btn btn-light border" onClick={() => history.back()}>← Volver</button>
        <div>
          <h2 className="mb-1">Carga de Datos</h2>
          <div className="text-muted">Importar información estudiantil desde archivos CSV</div>
        </div>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} mb-3`}>{msg.text}</div>
      )}

      <div className="row g-3">
        {/* IZQUIERDA: Dropzone */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">⬆️ Cargar Archivo CSV</h5>
              <div
                onDragOver={(e)=>{ e.preventDefault(); setDragOver(true) }}
                onDragLeave={()=> setDragOver(false)}
                onDrop={onDrop}
                className="d-flex flex-column align-items-center justify-content-center text-center p-5 border rounded"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: dragOver ? BRAND : '#cbd5e1',
                  background: dragOver ? '#f1f5f9' : '#fff',
                  transition: 'all .15s ease'
                }}
              >
                <div style={{fontSize:42, marginBottom:8}}>📄</div>
                <div className="mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</div>
                <div className="text-muted small mb-3">Solo archivos CSV. Máximo 10MB.</div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="d-none"
                  onChange={onChange}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={()=> inputRef.current?.click()}
                >
                  Seleccionar archivo
                </button>

                {file && (
                  <div className="mt-3 small">
                    <span className="badge bg-light text-dark">
                      {file.name} — {(file.size/1024).toFixed(0)} KB
                    </span>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    disabled={uploading}
                    onClick={onUpload}
                    className="btn btn-primary"
                    style={{background: BRAND, border:'none'}}
                  >
                    {uploading ? 'Subiendo…' : 'Procesar CSV'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA: Plantilla */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-2">⬇️ Plantilla CSV</h5>
              <div className="text-muted mb-3">
                Descarga la plantilla oficial con las columnas requeridas y ejemplos válidos.
              </div>
              <button
                onClick={downloadTemplate}
                className="btn btn-primary"
                style={{background: BRAND, border:'none'}}
              >
                Descargar Plantilla
              </button>
            </div>
          </div>
        </div>

        {/* INSTRUCCIONES */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">📝 Instrucciones</h5>
              <ol className="mb-0">
                <li className="mb-2">Descarga la plantilla CSV con la estructura requerida.</li>
                <li className="mb-2">Completa los datos de estudiantes siguiendo el formato.</li>
                <li>Sube el archivo completado para procesamiento automático.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* CAMPOS REQUERIDOS */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">✅ Campos Requeridos</h5>
              <ul className="list-unstyled mb-0">
                {['nombre','documento','edad','genero','programa','estrato','trabaja'].map((f) => (
                  <li key={f} className="mb-2">✔️ <span className="fw-semibold">{f}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* IMPORTANTE */}
        <div className="col-12">
          <div className="alert alert-light border">
            <strong>Importante:</strong> Asegúrate de que todos los campos estén completos y en el formato correcto.
            Los datos incompletos pueden afectar la precisión de los análisis.
          </div>
        </div>
      </div>
    </div>
  )
}
