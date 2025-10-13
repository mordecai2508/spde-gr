import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getCalificaciones, getAsistencias } from '../services/api'

// Charts component muestra calificaciones y asistencia usando recharts
export default function Charts() {
  const [calificaciones, setCalificaciones] = useState([])
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([getCalificaciones(), getAsistencias()])
      .then(([cRes, aRes]) => {
        if (!mounted) return
        setCalificaciones(cRes.data || [])
        setAsistencias(aRes.data || [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
    return () => (mounted = false)
  }, [])

  if (loading) return <div>Cargando gráficos...</div>

  // Simplified merge: plot average calificacion per fecha and asistencia rate per fecha
  const calByDate = {}
  calificaciones.forEach(c => {
    const date = new Date(c.fecha_calificacion).toLocaleDateString()
    if (!calByDate[date]) calByDate[date] = { date, total: 0, count: 0 }
    calByDate[date].total += Number(c.calificacion)
    calByDate[date].count += 1
  })
  const calData = Object.values(calByDate).map(d => ({ date: d.date, promedio: +(d.total / d.count).toFixed(2) }))

  const asisByDate = {}
  asistencias.forEach(a => {
    const date = new Date(a.fecha).toLocaleDateString()
    if (!asisByDate[date]) asisByDate[date] = { date, present: 0, total: 0 }
    asisByDate[date].present += a.asistio ? 1 : 0
    asisByDate[date].total += 1
  })
  const asisData = Object.values(asisByDate).map(d => ({ date: d.date, tasa: +(d.present / d.total).toFixed(2) }))

  return (
    <div className="row">
      <div className="col-md-6">
        <h5>Promedio de calificaciones</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="promedio" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="col-md-6">
        <h5>Tasa de asistencia</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={asisData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tasa" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
