import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../services/api' // POST /auth/login { email, password }

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) navigate('/dashboard', { replace: true })
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const friendlyMessage = (err) => {
    // Normaliza origen del mensaje
    const backendMsg =
      err?.data?.message ||
      err?.data?.error ||
      err?.message ||
      ''

    // Desconexión / backend apagado
    if (backendMsg.includes('ERR_CONNECTION_REFUSED') || backendMsg.toLowerCase().includes('network')) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
    }

    // Credenciales inválidas (401/400 típicos). No mostramos códigos.
    if (err?.status === 401 || err?.status === 400) {
      // Detecta mensajes comunes del backend (ES/EN) y siempre responde en claro
      if (
        /invalid|credencial|contraseñ|usuario|email|correo/i.test(backendMsg)
      ) {
        return 'Correo o contraseña incorrectos.'
      }
      return 'Correo o contraseña incorrectos.'
    }

    // 404 en el login (ruta mal configurada)
    if (err?.status === 404) {
      return 'No se encontró el servicio de autenticación. Revisa la URL del backend.'
    }

    // 403 (bloqueos de acceso, usuario inactivo, etc.)
    if (err?.status === 403) {
      return 'No tienes permisos para iniciar sesión con estas credenciales.'
    }

    // Otros casos
    return backendMsg || 'Ocurrió un error al intentar iniciar sesión.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.usuario?.trim() || !form.password?.trim()) {
      setError('Por favor ingresa correo/usuario y contraseña.')
      return
    }

    try {
      setLoading(true)

      // Tu API espera (email, password). Si tu "usuario" es correo o username, pásalo igual.
      const res = await loginApi(form.usuario, form.password)
      const data = res?.data || {}

      const token = data.token || data.accessToken || data.jwt
      let user = data.user || data.usuario || data.data

      if (!token) throw new Error('El backend no devolvió token.')

      if (!user || typeof user !== 'object') {
        user = {
          id: data.id || data.userId || null,
          nombre: data.nombre || data.name || data.username || form.usuario,
          email: data.email || form.usuario,
          rol: data.rol || data.role || data.tipo || null,
        }
      } else {
        user.rol = user.rol || user.role || user.tipo || null
        user.email = user.email || user.correo || user.username || form.usuario
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // /dashboard selecciona Admin vs Docente por rol (App.jsx)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('LOGIN ERROR:', err)
      setError(friendlyMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f4f8ff' }}>
      <div className="card shadow-sm border-0" style={{ width: 380 }}>
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <div
              style={{
                background: '#0d47a1',
                color: '#fff',
                borderRadius: '50%',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                margin: '0 auto 8px'
              }}
            >
              🎓
            </div>
            <h5 className="mb-0" style={{ color: '#0d47a1' }}>SPADE</h5>
            <small className="text-muted">Sistema Predictivo de Deserción Estudiantil</small>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Correo o usuario</label>
              <input
                type="text"
                name="usuario"
                className="form-control"
                value={form.usuario}
                onChange={handleChange}
                autoComplete="username"
                placeholder="usuario@colegio.edu"
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              style={{ background: '#0d47a1', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Ingresando…' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              ¿Volver al inicio? <Link to="/">Home</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
