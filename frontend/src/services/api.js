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
