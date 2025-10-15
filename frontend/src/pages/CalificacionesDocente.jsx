import React, { useEffect, useMemo, useState } from 'react'
import {
  getEstudiantes,
  getEstudiantesByDocente,
  getCalificacionesByDocente,
  getDocenteCursos,
  getEstudianteCursos,
  upsertCalificacion,
} from '../services/api'

const BRAND = '#0d47a1'

export default function CalificacionesDocente() {
  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || 'null') || {}, [])
  const docenteId = user?.id ?? user?.userId ?? user?.docente_id ?? null

  const [loading, setLoading] = useState(true)
  const [estudiantes, setEstudiantes] = useState([])
  const [validEstIds, setValidEstIds] = useState(new Set())
  const [curso, setCurso] = useState('1')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [notas, setNotas] = useState({}) // { [id_est]: { nota, saving } }

  useEffect(() => {
    let mounted = true
    setLoading(true)

    ;(async () => {
      try {
        // 1) Endpoint directo por docente
        if (docenteId && typeof getEstudiantesByDocente === 'function') {
          try {
            const r = await getEstudiantesByDocente(docenteId)
            const arr = Array.isArray(r?.data) ? r.data : []
            if (mounted && arr.length) {
              setEstudiantes(arr)
              // <- ARREGLO: construir validEstIds aquí también
              const ids = new Set(
                arr.map(x => Number(x.id_estudiante ?? x.estudiante_id ?? x.id))
              )
              setValidEstIds(ids)

              // precargar calificaciones del docente (si existe endpoint)
              try {
                const cRes = await getCalificacionesByDocente(docenteId).catch(() => null)
                const califs = Array.isArray(cRes?.data) ? cRes.data : []
                if (mounted && califs.length) {
                  const map = {}
                  califs.forEach(c => {
                    const id = Number(c.id_estudiante ?? c.estudiante_id ?? c.estudiante)
                    map[id] = { nota: Number(c.nota) }
                  })
                  setNotas(prev => ({ ...prev, ...map }))
                }
              } catch {}
              return
            }
          } catch {
            /* caemos al fallback */
          }
        }

        // 2) Fallback: cruza docente_curso + estudiante_curso + estudiantes
        const [allEstRes, dcRes, ecRes] = await Promise.all([
          getEstudiantes().catch(() => null),
          docenteId ? getDocenteCursos(docenteId).catch(() => null) : Promise.resolve(null),
          getEstudianteCursos().catch(() => null),
        ])

        const allEst = Array.isArray(allEstRes?.data) ? allEstRes.data : []
        let mine = allEst

        if (Array.isArray(dcRes?.data) && dcRes.data.length && Array.isArray(ecRes?.data)) {
          const cursosDocente = new Set(
            dcRes.data.map(d => Number(d.id_curso ?? d.curso_id ?? d.id))
          )
          const estudiantesIds = new Set(
            ecRes.data
              .filter(x => cursosDocente.has(Number(x.id_curso ?? x.curso_id ?? x.curso)))
              .map(x => Number(x.id_estudiante ?? x.estudiante_id ?? x.estudiante))
          )
          mine = allEst.filter(e => estudiantesIds.has(Number(e.id_estudiante)))
        }

        if (mounted) {
          setEstudiantes(mine)
          setValidEstIds(new Set(mine.map(x => Number(x.id_estudiante ?? x.estudiante_id ?? x.id))))
        }

        // precarga calificaciones (opcional)
        if (docenteId && typeof getCalificacionesByDocente === 'function') {
          try {
            const cRes = await getCalificacionesByDocente(docenteId).catch(() => null)
            const califs = Array.isArray(cRes?.data) ? cRes.data : []
            if (mounted && califs.length) {
              const map = {}
              califs.forEach(c => {
                const id = Number(c.id_estudiante ?? c.estudiante_id ?? c.estudiante)
                map[id] = { nota: Number(c.nota) }
              })
              setNotas(prev => ({ ...prev, ...map }))
            }
          } catch {}
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [docenteId])

  const handleNota = (id, value) => {
    let n = Number(value)
    if (Number.isNaN(n)) n = ''
    else n = Math.max(0, Math.min(5, n))
    setNotas(prev => ({ ...prev, [id]: { ...(prev[id] || {}), nota: n } }))
  }

  const guardarFila = async (e) => {
    const id_estudiante = Number(e.id_estudiante)
    if (!validEstIds.has(id_estudiante)) {
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'No autorizado', message: 'El estudiante no está registrado en tus cursos', color: '#ef4444' }
      }))
      return
    }
    const row = notas[id_estudiante] || {}
    const nota = Number(row.nota)
    if (Number.isNaN(nota)) {
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Error', message: 'Ingresa una nota válida (0.0 a 5.0)', color: '#ef4444' }
      }))
      return
    }

    setNotas(prev => ({ ...prev, [id_estudiante]: { ...(prev[id_estudiante] || {}), saving: true } }))
    try {
      await upsertCalificacion({
        id_estudiante,
        id_curso: Number(curso),
        nota: Number(nota).toFixed(1),
        fecha,
        registrado_por: docenteId || 0,
      })
      setNotas(prev => ({ ...prev, [id_estudiante]: { ...(prev[id_estudiante] || {}), saving: false } }))
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Guardado', message: 'Calificación guardada', color: '#16a34a' }
      }))
    } catch (err) {
      console.error(err)
      setNotas(prev => ({ ...prev, [id_estudiante]: { ...(prev[id_estudiante] || {}), saving: false } }))
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Error', message: 'No se pudo guardar la calificación', color: '#ef4444' }
      }))
    }
  }

  const guardarTodo = async () => {
    const modified = Object.entries(notas).filter(([, row]) => row && row.nota !== undefined && row.nota !== '')
    if (modified.length === 0) {
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Nada que guardar', message: 'No hay cambios', color: '#f59e0b' }
      }))
      return
    }

    const ids = modified.map(([id]) => Number(id))
    setNotas(prev => {
      const copy = { ...prev }
      ids.forEach(id => (copy[id] = { ...(copy[id] || {}), saving: true }))
      return copy
    })

    try {
      const toSave = modified.filter(([id]) => validEstIds.has(Number(id)))
      const skipped = modified.length - toSave.length
      if (skipped > 0) {
        window.dispatchEvent(new CustomEvent('spde:toast', {
          detail: { title: 'Omitidos', message: `${skipped} fila(s) no asignada(s) a tus cursos`, color: '#f59e0b' }
        }))
      }

      await Promise.all(
        toSave.map(([id, row]) =>
          upsertCalificacion({
            id_estudiante: Number(id),
            id_curso: Number(curso),
            nota: Number(row.nota).toFixed(1),
            fecha,
            registrado_por: docenteId || 0,
          })
        )
      )

      setNotas(prev => {
        const copy = { ...prev }
        ids.forEach(id => copy[id] && (copy[id].saving = false))
        return copy
      })
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Guardado', message: 'Todas las calificaciones guardadas', color: '#16a34a' }
      }))
    } catch (err) {
      console.error(err)
      setNotas(prev => {
        const copy = { ...prev }
        ids.forEach(id => copy[id] && (copy[id].saving = false))
        return copy
      })
      window.dispatchEvent(new CustomEvent('spde:toast', {
        detail: { title: 'Error', message: 'Error al guardar', color: '#ef4444' }
      }))
    }
  }

  // paginación
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(estudiantes.length / pageSize))
  const pageData = estudiantes.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <div className="py-3 mb-3" style={{ background: '#f7f8fa', borderRadius: 12 }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="mb-1">Registro de Calificaciones</h2>
            <div className="text-muted">Solo para estudiantes de tus cursos</div>
          </div>
          <button className="btn btn-primary" style={{ background: BRAND, border: 'none' }} onClick={guardarTodo}>
            💾 Guardar todo
          </button>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex flex-wrap gap-3 align-items-end">
          <div>
            <label className="form-label mb-1">Curso</label>
            <select className="form-select" value={curso} onChange={(e) => setCurso(e.target.value)}>
              <option value="1">Curso 1</option>
              <option value="2">Curso 2</option>
              <option value="3">Curso 3</option>
            </select>
          </div>
          <div>
            <label className="form-label mb-1">Fecha</label>
            <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
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
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th>Estudiante</th>
                <th>Documento</th>
                <th>Programa</th>
                <th style={{ width: 140 }}>Nota (0–5)</th>
                <th style={{ width: 140 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((e) => {
                const row = notas[e.id_estudiante] || {}
                return (
                  <tr key={e.id_estudiante}>
                    <td>{e.nombre || `${e.nombres || ''} ${e.apellidos || ''}`}</td>
                    <td>{e.documento || '—'}</td>
                    <td>{e.programa || '—'}</td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        className="form-control"
                        value={row.nota ?? ''}
                        onChange={(ev) => handleNota(e.id_estudiante, ev.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ background: BRAND, border: 'none' }}
                        disabled={!!row.saving}
                        onClick={() => guardarFila(e)}
                      >
                        {row.saving ? 'Guardando…' : 'Guardar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    Sin estudiantes asignados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <nav className="mt-3 d-flex justify-content-center">
        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
              «
            </button>
          </li>
          {Array.from({ length: totalPages })
            .slice(0, 6)
            .map((_, i) => {
              const p = i + 1
              return (
                <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              )
            })}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              »
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
