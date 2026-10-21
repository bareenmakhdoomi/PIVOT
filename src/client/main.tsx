// PIVOT workspace entry point (UI page x_enno_pivot_workspace.do).
// Loads the approved Concept 27 shell, reads the PIVOT data through the workspace REST API
// (platform session, ACLs applied on the server) and starts the workspace.
import './pivot/pivot.css'
import { SHELL } from './pivot/shell.js'
import { createPV, createApi } from './pivot/live-store.js'
import { startWorkspace } from './pivot/workspace.js'

const API_BASE = '/api/x_enno_pivot/v1/workspace'

function escapeHtml(s: string) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

function boot() {
    const root = document.getElementById('root') || document.body
    root.innerHTML = SHELL
    const main = document.getElementById('main') as HTMLElement
    main.innerHTML = '<section class="panel"><div class="empty-state" role="status"><b>Loading PIVOT…</b><p class="record-desc">Reading capabilities, assessments, opportunities and outcomes.</p></div></section>'
    const api = createApi(API_BASE)
    api.load()
        .then((snapshot: any) => startWorkspace(createPV(snapshot, api)))
        .catch((err: Error) => {
            main.innerHTML =
                '<section class="panel"><div class="empty-state" role="alert"><b>PIVOT could not load.</b><p class="record-desc">' +
                escapeHtml((err && err.message) || 'Unknown error.') +
                '</p><button class="btn primary" id="pivotRetry" type="button">Try again</button></div></section>'
            const retry = document.getElementById('pivotRetry')
            if (retry) retry.addEventListener('click', () => window.location.reload())
        })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
