import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  getEstudiante,
  getCalificaciones,
  getAsistencias,
} from '../services/api'

const BLUE  = '#0d47a1'
const LIGHT = '#eef2f7'

/* ----------------- helpers de datos ----------------- */
// promedio 0..5 por estudiante
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

// asistencia 0..100 por estudiante (presente=1, tarde=0.5, ausente=0)
const buildAsisMap = (rows=[]) => {
  const acc = new Map()
  for (const a of rows) {
    const id = a.id_estudiante
    const st = String(a.estado||'').toLowerCase()
    const s = st==='presente' ? 1 : st==='tarde' ? 0.5 : 0
    if (!acc.has(id)) acc.set(id, {s:0, n:0})
    acc.get(id).s += s; acc.get(id).n++
  }
  const out = new Map()
  acc.forEach((v, id) => out.set(id, v.n? Math.round((v.s/v.n)*100) : 0))
  return out
}

/** Reglas de riesgo (tus condiciones) + % suavizado para UI */
const computeRisk = ({ asistencia=0, promedio=0, estrato=0 }) => {
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

  // % visual (pesos de referencia: promedio 35, asistencia 25, estrato 20)
  const score =
    (promedio < 3 ? 1 : promedio < 4 ? 0.5 : 0) * 0.35 +
    (asistencia < 50 ? 1 : asistencia <= 80 ? 0.5 : 0) * 0.25 +
    (estrato<=2 ? 1 : estrato<=4 ? 0.5 : 0) * 0.20

  const pct = Math.round((score / (0.35 + 0.25 + 0.20)) * 100)
  return { categoria, pct }
}

/* ----------------- helpers UI ----------------- */
function numPercent(v){
  if (typeof v === 'number') return Math.max(0, Math.min(100, Math.round(v)))
  if (typeof v === 'string' && v.endsWith('%')) return parseInt(v,10)
  if (typeof v === 'string' && !isNaN(Number(v))) return Math.round(Number(v))
  return NaN
}
function badge(color, text){ return <span className="badge rounded-pill" style={{background:color}}>{text}</span> }
function badgeFromPromedio(p){
  if (p == null || isNaN(Number(p))) return null
  const n = Number(p)
  if (n < 3)   return badge('#ef5350','Alto Riesgo')
  if (n < 3.5) return badge('#f9a825','Riesgo Medio')
  return badge('#16a34a','Bajo Riesgo')
}
function badgeFromAsistencia(a){
  const n = typeof a === 'number' ? a : parseInt(a,10)
  if (isNaN(n)) return null
  if (n < 70)   return badge('#ef5350','Alto Riesgo')
  if (n < 85)   return badge('#f9a825','Riesgo Medio')
  return badge('#16a34a','Bajo Riesgo')
}
function badgeFromSocio(s){
  const v = String(s || '').toLowerCase()
  if (!v) return null
  if (['baja','low','1','2'].includes(v)) return badge('#ef5350','Alto Riesgo')
  if (['media','medio','medium','3','4'].includes(v)) return badge('#f9a825','Riesgo Medio')
  return badge('#16a34a','Bajo Riesgo')
}
function badgeFromEdad(age){
  const n = Number(age)
  if (isNaN(n)) return null
  if (n > 25) return badge('#ef5350','Alto Riesgo')
  if (n >= 20 && n <= 25) return badge('#f9a825','Riesgo Medio')
  return badge('#16a34a','Bajo Riesgo')
}
function capitalize(x){ return (x && typeof x==='string') ? x.charAt(0).toUpperCase()+x.slice(1) : x }

/* ----------------- componente ----------------- */
export default function EstudianteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [estu, setEstu]       = useState(null)

  // datos derivados
  const [promedio, setPromedio]     = useState(null)  // 0..5
  const [asistencia, setAsistencia] = useState(null)  // 0..100
  const [estrato, setEstrato]       = useState(null)  // 1..6

  useEffect(() => {
    let mounted = true
    setLoading(true); setError('')

    Promise.all([getEstudiante(id), getCalificaciones(), getAsistencias()])
      .then(([eRes, cRes, aRes]) => {
        if (!mounted) return

        const e = eRes?.data || null
        setEstu(e)

        // construir mapas y tomar valor del estudiante
        const promMap = buildPromMap(Array.isArray(cRes?.data)? cRes.data : [])
        const asisMap = buildAsisMap(Array.isArray(aRes?.data)? aRes.data : [])

        const prom = e?.promedio_nota ?? promMap.get(Number(id)) ?? null
        const asis = e?.asistencia    ?? asisMap.get(Number(id)) ?? null
        const est  = Number(e?.estrato ?? e?.nivel_socioeconomico ?? 0) || null

        setPromedio(prom)
        setAsistencia(asis)
        setEstrato(est)
      })
      .catch(err => {
        console.error(err)
        setError('No fue posible cargar los datos del estudiante.')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [id])

  // riesgo final con tus reglas
  const risk = useMemo(() => {
    if (promedio == null || asistencia == null || estrato == null) return null
    return computeRisk({ asistencia, promedio, estrato })
  }, [promedio, asistencia, estrato])

  const nombre = estu ? `${estu.nombres ?? ''} ${estu.apellidos ?? ''}`.trim() || estu.nombre : '—'
  const codigo = estu?.codigo ?? estu?.id ?? id
  const carrera = estu?.programa ?? estu?.carrera ?? '—'
  const socioTxt = (()=>{
    if (estrato == null) return '—'
    if (estrato <=2) return 'low'
    if (estrato <=4) return 'medium'
    return 'high'
  })()

  // usar edad directamente desde la entidad `estu.edad` (ya provista por la base de datos)
  const edad = estu?.edad ?? estu?.age ?? null

  const riskBadge =
    !risk ? null :
    (risk.categoria === 'Alto'  ? badge('#ef5350','Alto Riesgo') :
     risk.categoria === 'Medio' ? badge('#f9a825','Riesgo Medio') :
                                  badge('#16a34a','Bajo Riesgo'))

  return (
    <div>
      {/* Header */}
      <div className="py-4" style={{ background: '#f7f8fa' }}>
        <div className="container d-flex align-items-center gap-3">
          <button className="btn btn-light border" onClick={() => navigate(-1)}>← Volver</button>
          <h2 className="fw-bold mb-0">Análisis Individual</h2>
          <div className="text-muted ms-2">Perfil completo y predicción de riesgo</div>
        </div>
      </div>

      <div className="container py-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="text-muted">Cargando…</div>}

        {!loading && (
          <>
            {/* Fila superior: Perfil + Factores */}
            <div className="row g-3">
              {/* Perfil */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                           style={{width:72,height:72,background:LIGHT,fontSize:34}}>👤</div>
                      <div>
                        <h5 className="mb-1">{nombre}</h5>
                        <div className="text-muted small">ID: {codigo}</div>
                        <div className="mt-2">{riskBadge}</div>
                      </div>
                    </div>

                    <ul className="list-unstyled small mb-0">
                      <li className="mb-2">🎓 <span className="text-muted">Programa:</span> {carrera}</li>
                      <li className="mb-2">💲 <span className="text-muted">Nivel socioeconómico:</span> {capitalize(socioTxt)}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Factores (sin semestre) */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="mb-1">📊 Factores de Riesgo</h5>
                    <small className="text-muted">Análisis detallado de variables predictivas</small>

                    <FactorRow
                      label="Promedio Académico"
                      // Mostrar promedio como decimal (0..5) con 2 decimales; usar max=5
                      value={(promedio==null)? '—' : promedio}
                      weight="35%"
                      tag={badgeFromPromedio(promedio)}
                      max={5}
                    />

                    <FactorRow
                      label="Asistencia"
                      value={(asistencia==null)? '—' : asistencia}
                      weight="25%"
                      tag={badgeFromAsistencia(asistencia)}
                    />

                    <FactorRow
                      label="Situación Socioeconómica"
                      value={capitalize(socioTxt)}
                      weight="20%"
                      tag={badgeFromSocio(socioTxt)}
                    />

                    <FactorRow
                      label="Edad"
                      value={(edad==null)? '—' : edad}
                      weight="20%"
                      tag={badgeFromEdad(edad)}
                      format="int"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Predicción + Recomendaciones */}
            <div className="row g-3 mt-1">
              {/* Predicción (usa porcentaje calculado) */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="mb-3">⚠️ Predicción de Deserción</h5>
                    {risk ? (
                      <>
                        <div className="display-6 fw-bold" style={{color: BLUE}}>
                          {risk.pct}%
                        </div>
                        <div className="progress mt-2" style={{height:10, background:LIGHT}}>
                          <div className="progress-bar" style={{width:`${risk.pct}%`, background:BLUE}} />
                        </div>
                        <div className="text-muted small mt-2">
                          Riesgo: <strong>{risk.categoria}</strong>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted">No hay datos suficientes para calcular el riesgo.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recomendaciones: placeholder hasta IA */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="mb-1">💡 Recomendaciones de Intervención</h5>
                    <small className="text-muted">Acciones sugeridas para reducir el riesgo de deserción</small>

                    <div className="alert alert-light border mt-3 mb-0">
                      <div className="fw-semibold mb-1">Aún no hay recomendaciones generadas.</div>
                      <div className="text-muted small">Este panel quedará vacío hasta integrar el API de IA.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* (Información adicional eliminada por solicitud) */}
          </>
        )}
      </div>
    </div>
  )
}

/* -------- subcomponentes UI -------- */
function FactorRow({ label, value, weight, tag, max = 100, format }) {
  // value can be number or string; for numeric values compute pct = (value/max)*100
  const num = (typeof value === 'number') ? value : (!isNaN(Number(value)) ? Number(value) : NaN)
  const pct = isNaN(num) || !max ? NaN : Math.round((num / max) * 100)

  // determine display format: explicit `format` overrides default behavior
  // default: if max===5 -> decimal, else percent
  const fmt = format || (max === 5 ? 'decimal' : 'percent')
  let display
  if (isNaN(num)) display = (value ?? '—')
  else if (fmt === 'decimal') display = num.toFixed(2)
  else if (fmt === 'int') display = String(Math.round(num))
  else /* percent */ display = `${num}%`

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="fw-semibold">{label}</div>
        <div className="d-flex align-items-center gap-2">
          {weight && <span className="text-muted small">Peso: {weight}</span>}
          {tag}
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="fw-semibold" style={{minWidth:60}}>
          {display}
        </div>
        <div className="progress flex-grow-1" style={{height:10, background:LIGHT}}>
          <div className="progress-bar" style={{width: isNaN(pct) ? '0%' : `${pct}%`, background:BLUE}} />
        </div>
      </div>
    </div>
  )
}

function Info({label, value}) {
  return (
    <div className="col-md-4 mt-2">
      <div className="text-muted">{label}</div>
      <div className="fw-semibold">{value}</div>
    </div>
  )
}
