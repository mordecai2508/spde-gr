import React from 'react'
import { Link } from 'react-router-dom'
import { FaFileCsv, FaUserCheck, FaChartBar } from 'react-icons/fa'

export default function QuickActions(){
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <div className="card p-4 shadow-sm text-center h-100">
          <div className="mb-3" style={{fontSize:34, color:'#0d47a1'}}><FaFileCsv /></div>
          <div className="fw-bold mb-1">Cargar Datos</div>
          <div className="small text-muted mb-3">Importar archivos CSV con información estudiantil</div>
          <Link to="/cargar" className="btn btn-light border">Importar CSV</Link>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card p-4 shadow-sm text-center h-100">
          <div className="mb-3" style={{fontSize:34, color:'#0d47a1'}}><FaUserCheck /></div>
          <div className="fw-bold mb-1">Análisis Individual</div>
          <div className="small text-muted mb-3">Consultar riesgo específico de estudiantes</div>
          <Link to="/estudiantes" className="btn btn-light border">Ver Estudiantes</Link>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card p-4 shadow-sm text-center h-100">
          <div className="mb-3" style={{fontSize:34, color:'#0d47a1'}}><FaChartBar /></div>
          <div className="fw-bold mb-1">Reportes</div>
          <div className="small text-muted mb-3">Generar informes y estadísticas detalladas</div>
          <Link to="/reportes" className="btn btn-light border">Generar Reporte</Link>
        </div>
      </div>
    </div>
  )
}
