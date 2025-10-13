import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { success, error as notifyError } from '../utils/notify'
import { FaGraduationCap } from 'react-icons/fa'

// Login page: formulario de inicio de sesión
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      // Debug: log payload to console so we can inspect what the browser sends
      console.log('Login attempt payload:', { email, password })
      const res = await login(email, password)
      console.log('Login response:', res?.data)
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  success('Login exitoso')
  navigate('/dashboard')
    } catch (err) {
      console.log('Login error response:', err.response?.data || err.message)
      const details = err.response?.data?.details || err.response?.data?.error || err.message || 'Credenciales inválidas'
      setError(details)
      notifyError(details)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:'70vh'}}>
      <div className="card shadow p-4" style={{maxWidth:480, width:'100%'}}>
        <div className="text-center mb-3">
          <div style={{fontSize:40}}>🎓</div>
          <div className="fw-bold">Sistema Predictivo - Deserción Estudiantil</div>
          <div className="small text-muted">Coordinador Académico</div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100" type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  )
}
