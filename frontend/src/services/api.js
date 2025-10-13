// API service layer - centraliza llamadas al backend
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3006/api'

const client = axios.create({ baseURL: API_BASE })

// Attach token if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = (email, password) => client.post('/auth/login', { email, password })
export const register = (data) => client.post('/auth/register', data)

// Students
export const getEstudiantes = () => client.get('/estudiantes')
export const getEstudianteById = (id) => client.get(`/estudiantes/${id}`)
export const createEstudiante = (data) => client.post('/estudiantes', data)
export const uploadEstudiantes = (file) => {
  const form = new FormData()
  form.append('file', file)
  return client.post('/estudiantes/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// Predictions
export const getPredicciones = () => client.get('/predicciones')
export const createPrediccion = (data) => client.post('/predicciones', data)
export const getPrediccionById = (id) => client.get(`/predicciones/${id}`)

// Calificaciones y asistencias (for charts)
export const getCalificaciones = () => client.get('/calificaciones')
export const getAsistencias = () => client.get('/asistencias')

export default client
