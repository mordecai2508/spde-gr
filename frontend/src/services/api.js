import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3006/api'
export const client = axios.create({ baseURL: API_BASE })

// === Interceptores ===
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const e = new Error(
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Error de red'
    )
    e.status = err?.response?.status
    e.data = err?.response?.data
    throw e
  }
)

// === Auth ===
export const login = (email, password) => client.post('/auth/login', { email, password })
export const register = (data) => client.post('/auth/register', data)

// === Estudiantes ===
export const getEstudiantes = () => client.get('/estudiantes')                    // <-- faltaba
export const getEstudiante = (id) => client.get(`/estudiantes/${id}`)
export const getEstudianteById = (id) => client.get(`/estudiantes/${id}`)
export const createEstudiante = (data) => client.post('/estudiantes', data)
export const uploadEstudiantes = (file) => {
  const form = new FormData()
  form.append('file', file)
  return client.post('/estudiantes/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// === Predicciones ===
export const getPredicciones = () => client.get('/predicciones')
export const createPrediccion = (data) => client.post('/predicciones', data)
export const getPrediccionById = (id) => client.get(`/predicciones/${id}`)

// Predicciones por estudiante (intenta 2 rutas comunes y si no, filtra en front)
export const getPrediccionesByEstudiante = async (id) => {
  try {
    // patrón 1: /predicciones?estudiante=ID
    return await client.get('/predicciones', { params: { estudiante: id } })
  } catch (e1) {
    try {
      // patrón 2: /predicciones/estudiante/:id
      return await client.get(`/predicciones/estudiante/${id}`)
    } catch (e2) {
      // fallback: todas y filtramos
      const res = await client.get('/predicciones')
      const arr = Array.isArray(res.data) ? res.data : []
      const filtered = arr.filter(p =>
        String(p.id_estudiante ?? p.estudiante_id ?? p.estudianteId) === String(id)
      )
      return { data: filtered }
    }
  }
}

// === Dashboard helpers (opcionales) ===
export const getDashboardStats = async () => {
  try {
    return await client.get('/dashboard-stats')
  } catch {}
  const [eRes, pRes] = await Promise.all([client.get('/estudiantes'), client.get('/predicciones')])
  const estudiantes = Array.isArray(eRes.data) ? eRes.data : []
  const predicciones = Array.isArray(pRes.data) ? pRes.data : []
  let high = 0, medium = 0, low = 0
  predicciones.forEach(p => {
    const r = Number(p.riesgo ?? p.probabilidad_desercion ?? 0)
    if (r >= 0.66) high++
    else if (r >= 0.33) medium++
    else low++
  })
  return { data: { total: estudiantes.length, high, medium, low } }
}

export const getRiskDistribution = async () => {
  try {
    return await client.get('/risk-distribution')
  } catch {}
  const res = await client.get('/predicciones')
  const predicciones = Array.isArray(res.data) ? res.data : []
  const total = predicciones.length
  const high = predicciones.filter(p => Number(p.riesgo ?? p.probabilidad_desercion ?? 0) >= 0.66).length
  const medium = predicciones.filter(p => {
    const r = Number(p.riesgo ?? p.probabilidad_desercion ?? 0)
    return r >= 0.33 && r < 0.66
  }).length
  const low = predicciones.filter(p => Number(p.riesgo ?? p.probabilidad_desercion ?? 0) < 0.33).length
  return { data: { total, high, medium, low } }
}

export const getRecentPredictions = async () => {
  try {
    return await client.get('/recent-predictions')
  } catch {}
  const res = await client.get('/predicciones')
  const predicciones = Array.isArray(res.data) ? res.data : []
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const recent = predicciones.filter(p =>
    new Date(p.fecha ?? p.fecha_prediccion ?? p.createdAt ?? 0) >= cutoff
  )
  const items = recent.map(p => ({
    id: p.id_prediccion ?? p.id ?? p._id,
    title: `Predicción ${p.id_prediccion ?? p.id ?? ''}`.trim(),
    description: `Estudiante ${p.id_estudiante ?? p.estudiante_id ?? ''}`.trim(),
    riesgo: p.riesgo ?? p.probabilidad_desercion ?? null,
    fecha: p.fecha ?? p.fecha_prediccion ?? p.createdAt ?? null,
    tag: (Number(p.riesgo ?? p.probabilidad_desercion ?? 0) >= 0.66) ? 'Nuevo' : 'Listo'
  }))
  return { data: items }
}

// === Otras entidades ===
export const getCalificaciones = () => client.get('/calificaciones')
export const getAsistencias = () => client.get('/asistencias')

export default client

// --- Calificaciones helpers ---
export const createCalificacion = (data) => client.post('/calificaciones', data)
export const upsertCalificacion = async (payload) => {
  // Try common upsert endpoint, then POST, then PUT as fallbacks
  try { return await client.post('/calificaciones/upsert', payload) } catch {}
  try { return await client.post('/calificaciones', payload) } catch {}
  try { return await client.put('/calificaciones', payload) } catch {}
  throw new Error('No se pudo upsertar la calificación')
}
// Calificaciones del docente (para precargar edición)
export const getCalificacionesByDocente = async (docenteId) => {
  try { return await client.get(`/calificaciones`, { params: { docente: docenteId } }) } catch {}
  try { return await client.get(`/docentes/${docenteId}/calificaciones`) } catch {}
  return { data: [] }
}

// --- Asistencias helpers ---
export const createAsistencia = (data) => client.post('/asistencias', data)
export const upsertAsistencia = async (payload) => {
  try { return await client.post('/asistencias/upsert', payload) } catch {}
  try { return await client.post('/asistencias', payload) } catch {}
  try { return await client.put('/asistencias', payload) } catch {}
  throw new Error('No se pudo upsertar la asistencia')
}
export const getAsistenciasByFecha = (fecha, docenteId) => client.get('/asistencias', { params: { fecha, docente: docenteId } })

// --- Estudiantes por docente y relaciones ---
export const getEstudiantesByDocente = async (docenteId) => {
  try { return await client.get(`/docentes/${docenteId}/estudiantes`) } catch {}
  try { return await client.get('/estudiantes', { params: { docente: docenteId } }) } catch {}
  // Try to derive via docente_curso -> estudiante_curso
  try {
    const cursosRes = await client.get('/docente_curso', { params: { docente: docenteId } })
    const cursos = Array.isArray(cursosRes.data) ? cursosRes.data : []
    const cursoIds = cursos.map(c => c.id_curso ?? c.cursoId ?? c.id)
    if (cursoIds.length) {
      const ecRes = await client.get('/estudiante_curso')
      const ecs = Array.isArray(ecRes.data) ? ecRes.data : []
      const estudiantes = ecs
        .filter(ec => cursoIds.includes(ec.id_curso ?? ec.cursoId ?? ec.curso_id))
        .map(ec => ({ id: ec.id_estudiante ?? ec.estudianteId ?? ec.id_usuario ?? ec.id }))
      return { data: estudiantes }
    }
  } catch {}
  // Final fallback: return all estudiantes
  return await client.get('/estudiantes')
}

export const getDocenteCursos = async (docenteId) => {
  try { return await client.get(`/docentes/${docenteId}/cursos`) } catch {}
  try { return await client.get(`/docente_curso`, { params: { docente: docenteId } }) } catch {}
  try { return await client.get(`/docente_curso`, { params: { id_usuario: docenteId } }) } catch {}
  return { data: [] }
}

export const getEstudianteCursos = async () => {
  try { return await client.get(`/estudiante_curso`) } catch {}
  try { return await client.get(`/cursos/estudiantes`) } catch {}
  return { data: [] }
}

