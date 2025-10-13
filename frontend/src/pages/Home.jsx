import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGraduationCap, FaBrain, FaChartLine, FaHandsHelping } from 'react-icons/fa'

// Home page (hero + features + metrics + CTA)
export default function Home(){
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero (standalone) */}
      <div style={{background: '#f4f8ff'}} className="flex flex-col items-center justify-center text-center" role="main">
        <div className="container" style={{minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:0, paddingBottom:0}}>
          <div className="mx-auto">
            <h1 className="display-5 fw-bold">Predicción Inteligente de Deserción Estudiantil</h1>
            <p className="lead text-muted">Sistema avanzado que utiliza inteligencia artificial para identificar estudiantes en riesgo de abandono académico y proponer intervenciones preventivas efectivas.</p>
            <div className="mt-4">
              <Link to="/dashboard" className="btn btn-primary btn-lg">Comenzar Análisis</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container my-5">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <div className="text-primary fs-2 mb-2"><FaBrain /></div>
              <h5>IA Predictiva</h5>
              <p className="text-muted">Algoritmos avanzados que analizan múltiples variables para predecir el riesgo de deserción con alta precisión.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <div className="text-primary fs-2 mb-2"><FaChartLine /></div>
              <h5>Analítica Visual</h5>
              <p className="text-muted">Dashboards intuitivos con gráficos claros que facilitan la interpretación de patrones y tendencias.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <div className="text-primary fs-2 mb-2"><FaHandsHelping /></div>
              <h5>Intervención Temprana</h5>
              <p className="text-muted">Recomendaciones personalizadas y accionables para implementar estrategias de retención efectivas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="py-4 bg-white">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4">
              <div className="fs-2 text-primary fw-bold">87%</div>
              <div className="text-muted">Precisión Predictiva</div>
            </div>
            <div className="col-md-4">
              <div className="fs-2 text-primary fw-bold">1,200+</div>
              <div className="text-muted">Estudiantes Analizados</div>
            </div>
            <div className="col-md-4">
              <div className="fs-2 text-primary fw-bold">45%</div>
              <div className="text-muted">Reducción en Deserción</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:'#0b4b8a', color:'#fff'}} className="py-5 text-center">
        <div className="container">
          <h3>¿Listo para transformar la retención estudiantil?</h3>
          <p>Accede al sistema como Coordinador Académico y comienza a utilizar el poder de la predicción inteligente.</p>
          <Link to="/login" className="btn btn-light text-primary">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  )
}
