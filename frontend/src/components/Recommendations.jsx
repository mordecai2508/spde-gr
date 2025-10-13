import React from 'react'

// Simple Recommendations component that accepts a list of recommendation strings
export default function Recommendations({ items }) {
  if (!items || items.length === 0) return <div>No hay recomendaciones.</div>
  return (
    <div>
      <h5>Recomendaciones</h5>
      <ul className="list-group">
        {items.map((r, i) => (
          <li key={i} className="list-group-item">{r}</li>
        ))}
      </ul>
    </div>
  )
}
