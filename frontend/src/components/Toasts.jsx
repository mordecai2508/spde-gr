import React, { useEffect, useState } from 'react'

// Very small toast system: listens to window events to show messages
export default function Toasts() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random()
      setToasts(t => [...t, { id, ...e.detail }])
      // auto remove
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), e.detail.duration || 3000)
    }
    window.addEventListener('spde:toast', handler)
    return () => window.removeEventListener('spde:toast', handler)
  }, [])

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1050 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast show mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className={`toast-body`} style={{ background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderLeft: `4px solid ${t.color || '#2b6cb0'}` }}>
            <div className="small text-muted">{t.title}</div>
            <div>{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
