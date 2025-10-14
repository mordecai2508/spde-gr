import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getEstudiantes,
  getCalificaciones,
  getAsistencias,
} from '../services/api'
import RiskBadge from '../components/RiskBadge'

// === util: calcula promedio (0..5) y asistencia (0..100) por estudiante ===
const buildPromMap = (califs=[]) => {
  const acc = new Map()
  for (const c of califs) {
    const id = c.id_estudiante, nota = Number(c.nota ?? 0)
    if (!acc.has(id)) acc.set(id, {s:0, n:0})
    acc.get(id).s += nota; acc.get(id).n++
  }
  const out = new Map()
  acc.forEach((v, id) => out.set(id, v.n ? +(v.s/v.n).toFixed(2) : 0))
  return out
}

const buildAsisMap = (asis=[]) => {
  const acc = new Map()
  for (const a of asis) {
    const id = a.id_estudiante
    const st = String(a.estado||'').toLowerCase()
    const s = st==='presente' ? 1 : st==='tarde' ? .5 : 0
    if (!acc.has(id)) acc.set(id, {s:0, n:0})
    acc.get(id).s += s; acc.get(id).n++
  }
  const out = new Map()
  acc.forEach((v, id) => out.set(id, v.n? Math.round((v.s/v.n)*100) : 0))
  return out
}

// === util: categoría y % de riesgo con tus reglas ===
const computeRisk = ({asistencia=0, promedio=0, estrato=0}) => {
  const altoCnt =
    (asistencia < 50 ? 1:0) +
    (promedio   < 3.0 ? 1:0) +
    (estrato>=1 && estrato<=2 ? 1:0)

  const medioCnt =
    (asistencia>=50 && asistencia<=80 ? 1:0) +
    (promedio>=3.0 && promedio<4.0 ? 1:0) +
    (estrato>=3 && estrato<=4 ? 1:0)

  const bajoCnt =
    (asistencia>80 ? 1:0) +
    (promedio>=4.0 ? 1:0) +
    (estrato>=5 && estrato<=6 ? 1:0)

  let categoria = 'Medio'
  if (altoCnt >= 2) categoria = 'Alto'
  else if (bajoCnt >= 2) categoria = 'Bajo'

  // % suave (pesos 35/25/20 como referencia visual)
  const score =
    (promedio < 3 ? 1 : promedio < 4 ? 0.5 : 0) * 0.35 +
    (asistencia < 50 ? 1 : asistencia <= 80 ? 0.5 : 0) * 0.25 +
    (estrato<=2 ? 1 : estrato<=4 ? 0.5 : 0) * 0.20
  const pct = Math.round((score / (0.35+0.25+0.20)) * 100)

  return { categoria, pct }
}

export default function Estudiantes() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    let mounted = true
    setLoading(true); setError('')
    Promise.all([getEstudiantes(), getCalificaciones(), getAsistencias()])
      .then(([eRes, cRes, aRes]) => {
        if (!mounted) return
        const ests = Array.isArray(eRes.data)? eRes.data : []
        const prom = buildPromMap(Array.isArray(cRes.data)? cRes.data : [])
        const asis = buildAsisMap(Array.isArray(aRes.data)? aRes.data : [])
        const enriched = ests.map(e => {
          const promedio_nota = e.promedio_nota ?? prom.get(e.id_estudiante) ?? 0
          const asistencia    = e.asistencia    ?? asis.get(e.id_estudiante) ?? 0
          const estrato       = Number(e.estrato ?? e.nivel_socioeconomico ?? 0)
          const r = computeRisk({ asistencia, promedio: promedio_nota, estrato })
          return { ...e, promedio_nota, asistencia, estrato, riesgoPct:r.pct, riesgoCat:r.categoria }
        })
        setList(enriched)
      })
      .catch((err)=>{
        console.error('Error cargando estudiantes:', err)
        setError(err?.message || 'Error al cargar estudiantes')
      })
      .finally(()=> mounted && setLoading(false))
    return () => { mounted=false }
  }, [])

  // filtro + paginación
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(e =>
      String(e.nombre || e.nombres || '').toLowerCase().includes(q) ||
      String(e.documento || '').includes(q) ||
      String(e.programa || '').toLowerCase().includes(q)
    )
  }, [list, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageData = filtered.slice((page-1)*pageSize, page*pageSize)
  useEffect(() => { if (page>totalPages) setPage(totalPages) }, [totalPages, page])

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Gestión de Estudiantes</h2>
        <div className="text-muted">Monitoreo y análisis individual del riesgo de deserción</div>
      </div>

      {/* buscador */}
      <div className="input-group mb-3">
        <span className="input-group-text">🔎</span>
        <input
          className="form-control"
          placeholder="Buscar por nombre, documento o programa…"
          value={query}
          onChange={e=>{ setQuery(e.target.value); setPage(1) }}
        />
      </div>

      {/* lista */}
      <div className="vstack gap-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center text-muted py-5">Cargando…</div>
        ) : pageData.length === 0 ? (
          <div className="text-center text-muted py-5">Sin resultados</div>
        ) : (
          pageData.map(e => (
            <div key={e.id_estudiante} className="card shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                       style={{width:48, height:48, background:'#f1f5f9'}}>👤</div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="mb-0">{e.nombre || `${e.nombres||''} ${e.apellidos||''}`}</h5>
                      <RiskBadge level={e.riesgoCat} />
                    </div>
                    <div className="text-muted small">
                      {e.codigo ? `EST${String(e.codigo).padStart(3,'0')}` : `ID ${e.id_estudiante}`} · {e.programa || '—'}
                    </div>
                    <div className="d-flex gap-4 mt-2 small">
                      <div><strong>Promedio:</strong> {e.promedio_nota?.toFixed ? e.promedio_nota.toFixed(2) : Number(e.promedio_nota).toFixed(2)}</div>
                      <div><strong>Asistencia:</strong> {e.asistencia}%</div>
                      <div><strong>Nivel socioeconómico:</strong> {e.estrato || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Riesgo a la derecha */}
                <div className="text-end" style={{minWidth:220}}>
                  <div className="text-muted small mb-1">Riesgo de Deserción</div>
                  <div className="fw-bold fs-5">{e.riesgoPct}%</div>
                  <div className="progress" style={{height:8}}>
                    <div className="progress-bar" role="progressbar" style={{width:`${e.riesgoPct}%`, background:'#0d47a1'}} />
                  </div>
                  <button className="btn btn-outline-primary btn-sm mt-2"
                          onClick={()=> navigate(`/estudiantes/${e.id_estudiante}`)}>
                    👁️ Ver Detalle
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* paginación */}
      <nav className="mt-4 d-flex justify-content-center">
        <ul className="pagination mb-0">
          <li className={`page-item ${page===1?'disabled':''}`}>
            <button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>«</button>
          </li>
          {Array.from({length: totalPages}).slice(0,6).map((_,i)=> {
            const p = i+1
            return (
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
