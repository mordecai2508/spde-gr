import React, { useEffect, useMemo, useState } from 'react'
import { getEstudiantes, getEstudiantesByDocente, upsertAsistencia, getAsistenciasByFecha } from '../services/api'

const BRAND = '#0d47a1'

export default function AsistenciasDocente() {
  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || 'null') || {}, [])
  const docenteId = user?.id ?? user?.docente_id ?? user?.userId ?? null

  const [loading, setLoading] = useState(true)
  const [estudiantes, setEstudiantes] = useState([])
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10))
  const [estado, setEstado] = useState({}) // { [id_est]: 'presente'|'tarde'|'ausente' }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const [dRes, allRes] = await Promise.all([
          docenteId ? getEstudiantesByDocente(docenteId).catch(()=>null) : Promise.resolve(null),
          getEstudiantes().catch(()=>null)
        ])
        let base = Array.isArray(dRes?.data) ? dRes.data : (Array.isArray(allRes?.data) ? allRes.data : [])
        if (!Array.isArray(dRes?.data) && docenteId) {
          base = base.filter(e =>
            String(e.docente_id ?? e.id_docente ?? e.profesor_id ?? '')
              .toLowerCase() === String(docenteId).toLowerCase()
          )
        }
        if (mounted) setEstudiantes(base)
        // intentar precargar asistencias para la fecha y docente
        try {
          const aRes = await getAsistenciasByFecha(fecha, docenteId).catch(()=>null)
          if (mounted && Array.isArray(aRes?.data)) {
            const map = {}
            aRes.data.forEach(x => { map[x.id_estudiante ?? x.estudiante_id ?? x.estudiante] = (x.estado||x.estado_asistencia||x.state) })
            setEstado(map)
          }
        } catch(e) { /* ignore */ }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted=false }
  }, [docenteId])

  const handleEstado = (id, value) => {
    setEstado(prev => ({ ...prev, [id]: value }))
  }

  const guardarFila = async (e) => {
    const id_estudiante = e.id_estudiante
    const st = String(estado[id_estudiante] || '').toLowerCase()
    if (!['presente','tarde','ausente'].includes(st)) return alert('Selecciona un estado (Presente/Tarde/Ausente)')
    try {
      await upsertAsistencia({ id_estudiante, fecha, estado: st, docenteId: docenteId || 0 })
      window.dispatchEvent(new CustomEvent('spde:toast', { detail: { title: 'Guardado', message: 'Asistencia guardada', color: '#16a34a' } }))
    } catch (err) {
      console.error(err)
      window.dispatchEvent(new CustomEvent('spde:toast', { detail: { title: 'Error', message: 'No se pudo guardar la asistencia', color: '#ef4444' } }))
    }
  }

  // paginación
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(estudiantes.length / pageSize))
  const pageData = estudiantes.slice((page-1)*pageSize, page*pageSize)

  return (
    <div>
      <div className="py-3 mb-3" style={{background:'#f7f8fa', borderRadius:12}}>
        <h2 className="mb-1">Registro de Asistencias</h2>
        <div className="text-muted">Marca la asistencia de tus estudiantes</div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex flex-wrap gap-3 align-items-end">
          <div>
            <label className="form-label mb-1">Fecha</label>
            <input type="date" className="form-control" value={fecha} onChange={e=>setFecha(e.target.value)} />
          </div>
          <div className="ms-auto text-muted small">
            Docente: <strong>{user?.nombre || user?.name || user?.email || '—'}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted py-5">Cargando…</div>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table align-middle">
            <thead style={{background:'#f8fafc'}}>
              <tr>
                <th>Estudiante</th>
                <th>Documento</th>
                <th>Programa</th>
                <th style={{width:220}}>Estado</th>
                <th style={{width:140}}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(e => (
                <tr key={e.id_estudiante}>
                  <td>{e.nombre || `${e.nombres||''} ${e.apellidos||''}`}</td>
                  <td>{e.documento || '—'}</td>
                  <td>{e.programa || '—'}</td>
                  <td>
                    <select
                      className="form-select"
                      value={estado[e.id_estudiante] || ''}
                      onChange={ev=>handleEstado(e.id_estudiante, ev.target.value)}
                    >
                      <option value="">— Selecciona —</option>
                      <option value="presente">Presente</option>
                      <option value="tarde">Tarde</option>
                      <option value="ausente">Ausente</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-primary"
                            style={{background:BRAND, border:'none'}}
                            onClick={()=>guardarFila(e)}>
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan="5" className="text-center text-muted py-4">Sin estudiantes asignados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <nav className="mt-3 d-flex justify-content-center">
        <ul className="pagination mb-0">
          <li className={`page-item ${page===1?'disabled':''}`}>
            <button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>«</button>
          </li>
          {Array.from({length: totalPages}).slice(0,6).map((_,i)=>{
            const p=i+1; return (
              <li key={p} className={`page-item ${page===p?'active':''}`}>
                <button className="page-link" onClick={()=>setPage(p)}>{p}</button>
              </li>
            )
          })}
          <li className={`page-item ${page===totalPages?'disabled':''}`}>
            <button className="page-link" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>»</button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
