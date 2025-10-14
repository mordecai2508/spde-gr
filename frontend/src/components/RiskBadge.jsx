import React from 'react'

export default function RiskBadge({ level }) {
  const L = String(level || '').toLowerCase()
  const map = {
    alto:   { text: 'Alto Riesgo',   className: 'badge rounded-pill', bg: '#e53935' },
    medio:  { text: 'Riesgo Medio',  className: 'badge rounded-pill', bg: '#f9a825' },
    bajo:   { text: 'Bajo Riesgo',   className: 'badge rounded-pill', bg: '#2e7d32' },
  }
  const item = L.includes('alto') ? map.alto : L.includes('med') ? map.medio : map.bajo
  return (
    <span className={item.className} style={{background:item.bg, color:'#fff', fontWeight:600}}>
      {item.text}
    </span>
  )
}
