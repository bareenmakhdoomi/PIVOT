/* PIVOT in Service Portal: mounts the same Concept 27 workspace inside the PIVOT portal widget.
 * Bundled by scripts/build-portal-bundle.mjs into the UI script x_enno_pivot.pivot_portal. */
const API_BASE = '/api/x_enno_pivot/v1/workspace';
// Removes the Service Portal page gutters around the workspace (Bootstrap container, row and column padding).
const PORTAL_CSS = `
#x_enno_pivot_html .x-enno-pivot-page{padding:0;margin:0;width:100%;max-width:none}
#x_enno_pivot_html .x-enno-pivot-page>.row{margin:0}
#x_enno_pivot_html .x-enno-pivot-page [class*="col-"]{padding:0}
`;
let root = null;
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function mount(host) {
  if (!host) return;
  if (root) { if (root.parentNode !== host) host.appendChild(root); return; } // keep the running app when the portal re-renders the widget
  if (!document.documentElement.id) document.documentElement.id = 'x_enno_pivot_html'; // design CSS is scoped to this id
  document.documentElement.classList.add('x-enno-pivot'); // Bootstrap reset is scoped to this class
  if (!document.getElementById('x_enno_pivot_styles')) {
    const style = document.createElement('style'); style.id = 'x_enno_pivot_styles'; style.textContent = BOOTSTRAP_RESET + CSS + PORTAL_CSS; document.head.appendChild(style);
  }
  root = document.createElement('div'); root.className = 'x-enno-pivot-portal'; root.innerHTML = SHELL; host.appendChild(root);
  const main = document.getElementById('main');
  main.innerHTML = '<section class="panel"><div class="empty-state" role="status"><b>Loading PIVOT…</b><p class="record-desc">Reading capabilities, assessments, opportunities and outcomes.</p></div></section>';
  const api = createApi(API_BASE);
  api.load()
    .then(snapshot => startWorkspace(createPV(snapshot, api)))
    .catch(err => {
      const title = err && err.noAccess ? 'You do not have access to PIVOT' : 'PIVOT could not load.'; // PIV-008.02 AC 3
      main.innerHTML = '<section class="panel"><div class="empty-state" role="alert"><b>' + title + '</b><p class="record-desc">' + escapeHtml((err && err.message) || 'Unknown error.') + '</p>' + (err && err.noAccess ? '' : '<button class="btn primary" id="pivotRetry" type="button">Try again</button>') + '</div></section>';
      const retry = document.getElementById('pivotRetry'); if (retry) retry.addEventListener('click', () => window.location.reload());
    });
}
window.x_enno_pivot_portal = { mount, version: '__PIVOT_PORTAL_VERSION__' };
