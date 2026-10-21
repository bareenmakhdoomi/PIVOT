import React from 'react'
import './app.css'

// Placeholder shell – the Concept 27 views are added feature by feature (PIV-062 onwards)
const VIEWS = ['Dashboard', 'Analytics Studio', 'Element Map', 'Capability Library', 'Value & Opportunities', 'Roadmap', 'Assessments', 'Reports']

export default function App() {
    const [view, setView] = React.useState('Dashboard')
    return (
        <div className="shell">
            <nav className="sidebar" aria-label="PIVOT">
                <div className="brand">PIVOT</div>
                {VIEWS.map((v) => (
                    <button key={v} className={v === view ? 'navbtn active' : 'navbtn'} aria-current={v === view ? 'page' : undefined} onClick={() => setView(v)}>
                        {v}
                    </button>
                ))}
            </nav>
            <main className="main">
                <div className="eyebrow">PIVOT / {view}</div>
                <h1>{view}</h1>
                <p>Workspace shell is deployed. Views are built in Sprint 3–5.</p>
            </main>
        </div>
    )
}
