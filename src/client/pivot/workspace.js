/* PIVOT workspace – approved design Concept 27, running on the live PIVOT store (PIV-063).
 * Generated from the approved design by port.py; every change to the design code is listed there.
 */
export function startWorkspace(PV) {
'use strict';
const S = PV.store, F = PV.fmt, AI = PV.ai, L = PV.LABELS, DATA = S.data;
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const VIEWS = ['Dashboard', 'Analytics Studio', 'Element Map', 'Capability Library', 'Value & Opportunities', 'Roadmap', 'Assessments', 'Reports', 'Settings', 'Help & Support'];

/* ---------- view state ---------- */
const st = {
  view: 'Dashboard',
  studio: { run: 99, family: 'all', band: 'all' },
  map: { q: '', mode: 'family', sel: '', tab: 'Overview' },
  lib: { q: '', view: 'active', family: 'all', page: 0, errors: {}, note: '' },
  vo: { family: 'all', phase: 'all', state: 'active', type: 'all', assigned: 'all', q: '', outStatus: 'all' },
  road: { owner: 'all', family: 'all', state: 'all' },
  reports: { family: 'all' },
  settings: { tab: 'Scoring & priority', pending: {}, errors: {}, notes: {} },
  read: new Set(),
  exports: [],
  pages: { dashboardAttention: 0, voOpps: 0, voOutcomes: 0, assessments: 0, reportsGenerated: 0, reportsHeat: 0, reportsOutcomes: 0, reportsInsights: 0 },
  more: { roadNow: 5, roadNext: 5, roadLater: 5, roadDone: 5, reportsBands: 5 }
};

/* ---------- small helpers ---------- */
const hi = () => S.prop('high_usage_threshold'), lo = () => S.prop('low_score_threshold');
const BAND = {
  strong: { cls: 'prov', label: 'Strong usage', short: 'STRONG', color: '#2f347d' },
  moderate: { cls: 'adop', label: 'Moderate usage', short: 'MODERATE', color: '#4e55a6' },
  low: { cls: 'inst', label: 'Low usage', short: 'LOW', color: '#c9c9eb' },
  notinst: { cls: 'lic', label: 'Licensed, not installed', short: 'NOT INSTALLED', color: 'repeating-linear-gradient(135deg,#fff,#fff 3px,#c9d0df 3px,#c9d0df 5px)' },
  nm: { cls: 'lic', label: 'Not measured', short: 'NOT MEASURED', color: 'repeating-linear-gradient(135deg,#fff,#fff 3px,#e3e6ee 3px,#e3e6ee 5px)' }
};
const BAND_ORDER = ['strong', 'moderate', 'low', 'notinst', 'nm'];
const DONUT = { strong: '#25b76b', moderate: '#ffc629', low: '#ff9948', notinst: '#ff6474', nm: '#b8bfce' };
const BAND_SOLID = { strong: '#2f347d', moderate: '#5f72d8', low: '#a9b5ef', notinst: '#c8d0df', nm: '#e3e6ee' };
function bandOf(c, score) {
  if (score === undefined) score = c.score;
  if (c.licensed && !c.installed) return 'notinst';
  if (score == null) return 'nm';
  return score >= hi() ? 'strong' : score >= lo() ? 'moderate' : 'low';
}
function bandText(c) {
  const b = bandOf(c);
  if (b === 'strong') return 'Strong usage — score ' + F.score(c.score) + ', at or above ' + hi();
  if (b === 'moderate') return 'Moderate usage — score ' + F.score(c.score) + ' (' + lo() + '–' + (hi() - 1) + ')';
  if (b === 'low') return 'Low usage — score ' + F.score(c.score) + ', below ' + lo();
  if (b === 'notinst') return 'Licensed but not installed — counts as 0';
  return 'Not measured — no measure or no target, left empty (not 0)';
}
function sym(name) {
  const w = String(name).replace(/\(.*?\)/g, '').split(/\s+[–-]\s+/)[0].split(/\s+/).filter(Boolean);
  if (w.length > 1) return w[0][0].toUpperCase() + w[1][0].toLowerCase();
  return w[0][0].toUpperCase() + (w[0][1] || '').toLowerCase();
}
const famLabel = f => f ? (L.family[f] || f) : 'Needs mapping';
const sign = n => n == null ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '±') + F.num(Math.abs(n), 1);
const phasePill = p => `<span class="pill ${p === 'now' ? 'warn' : p === 'next' ? 'blue' : ''}">${esc(L.phase[p] || p).toUpperCase()}</span>`;
const statePill = s => `<span class="pill ${s === 'rejected' ? 'bad' : s === 'open' || s === 'in_progress' ? 'blue' : ''}">${esc(L.state[s] || s)}</span>`;
const outPill = s => `<span class="pill ${s === 'below_target' ? 'bad' : s === 'not_measured' ? 'warn' : s === 'improved' ? 'blue' : ''}">${esc(L.outcome[s] || s)}</span>`;
const runPill = s => `<span class="pill ${s === 'failed' ? 'bad' : s === 'running' || s === 'queued' ? 'blue' : ''}">${esc(L.status[s] || s)}</span>`;
const families = () => DATA.families.map(f => f.value);
const completedRuns = () => S.assessments().filter(a => a.status === 'complete').reverse(); // oldest → newest
const isAdmin = () => S.role() === 'admin';
const why = action => ({
  'assessment.run': S.engineAvailable() ? 'Only PIVOT admins can start an assessment.' : 'The assessment engine arrives in Sprint 4. Runs cannot be started yet.',
  'opportunity.work': 'Only analysts and admins can work opportunities.',
  'roadmap.reorder': 'Only analysts and admins can change the roadmap order.',
  'outcome.create': 'Only business owners and admins can create outcomes.',
  'capability.edit': 'Only PIVOT admins can change measurement settings.',
  'settings.edit': 'Only PIVOT admins can change PIVOT properties.',
  'ai.use': S.aiAvailable() ? 'AI features are switched off in Settings.' : 'AI features arrive with the AI sprint.',
  'ai.suggest': !S.aiAvailable() ? 'AI features arrive with the AI sprint.' : S.prop('ai_enabled') ? 'Only analysts and admins can ask for AI suggestions.' : 'AI features are switched off in Settings.'
}[action] || 'Your role cannot do this.');
function gated(action, html, rec) {
  // html = '<button class="..." data-action="...">Label</button>' → disabled with reason when not allowed
  if (S.can(action, rec)) return html;
  return html.replace('<button', `<button disabled aria-disabled="true" title="${esc(why(action))}"`);
}

/* ---------- design helpers kept from the original concept ---------- */
function panel(title, desc, body, extra = '') { return `<section class="panel"><div class="panelhead"><div><h3>${title}</h3><div class="paneldesc">${desc}</div></div>${extra}</div>${body}</section>`; }
function kpi(title, value, sub, icon, color = '', go = '') { return `<section class="kpi${go ? ' clickable' : ''}" ${go}><div class="kpihead"><span>${title}</span><span class="kpiicon ${color}" aria-hidden="true">${icon}</span></div><div class="kpivalue">${value}</div><div class="kpisub">${sub}</div></section>`; }
function sectionHead(title, desc, actions = '') { return `<div class="section-head"><div><h2>${title}</h2><p>${desc}</p></div><div class="headactions">${actions}</div></div>`; }
function pageSlice(items, key, size = 5) { const total = items.length, pages = Math.max(1, Math.ceil(total / size)); st.pages[key] = Math.max(0, Math.min(st.pages[key] || 0, pages - 1)); const page = st.pages[key]; return { items: items.slice(page * size, page * size + size), total, page, pages, start: total ? page * size + 1 : 0, end: Math.min(total, (page + 1) * size) }; }
function pagerMarkup(key, info, label = 'records') { if (info.total <= 5) return ''; return `<div class="pager"><div class="pager-info">Showing ${info.start}–${info.end} of ${info.total} ${label}</div><div class="pager-actions"><button class="btn" data-page="${key}" data-step="first" ${info.page === 0 ? 'disabled' : ''}>First</button><button class="btn" data-page="${key}" data-step="prev" ${info.page === 0 ? 'disabled' : ''}>Previous</button><span class="pager-info pager-page">${info.page + 1} / ${info.pages}</span><button class="btn" data-page="${key}" data-step="next" ${info.page >= info.pages - 1 ? 'disabled' : ''}>Next</button><button class="btn" data-page="${key}" data-step="last" ${info.page >= info.pages - 1 ? 'disabled' : ''}>Last</button></div></div>`; }
function loadMoreMarkup(key, shown, total, noun) { return shown >= total ? '' : `<div class="load-more-row"><span>${shown} of ${total} ${noun}</span><button class="btn" data-more="${key}">Show ${Math.min(5, total-shown)} more</button></div>`; }
function miniMetric(label, value, sub, percent) { return `<div class="metricmini"><span>${label}</span><b>${value}</b><span>${sub}</span>${percent !== undefined ? `<div class="progressline"><i style="width:${Math.max(0, Math.min(100, percent))}%"></i></div>` : ''}</div>`; }
function heading(eyebrow, title, subtitle, actions) { return `<div class="headingrow"><div><div class="eyebrow">${eyebrow}</div><h1 class="h1">${title}</h1><div class="subtitle">${subtitle}</div></div><div class="headactions">${actions || ''}</div></div>`; }
function notify(msg, kind) {
  const live = $('toastLive'); const old = document.querySelector('.toast'); if (old) old.remove();
  const t = document.createElement('div'); t.className = 'toast' + (kind === 'error' ? ' toast-error' : ''); t.textContent = msg; document.body.appendChild(t);
  if (live) live.textContent = msg; setTimeout(() => t.remove(), 3200);
}
function result(r, okMsg) { if (r && typeof r.then === 'function') return r.then(x => result(x, okMsg)); if (!r) return false; if (r.ok) { notify(r.note || okMsg || 'Saved.'); return true; } notify(r.error || 'Please fix the highlighted fields.', 'error'); return false; }

/* ---------- CSV export (real download of what is on screen) ---------- */
function csvDownload(title, file, rows) {
  const body = rows.map(r => r.map(v => { v = v == null ? '' : String(v); return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  st.exports.unshift({ title, file, ts: S.now(), by: S.user().id, rows: rows.length - 1, redo: title });
  notify(file + ' downloaded (' + (rows.length - 1) + ' rows).');
}
const EXPORTS = {
  'Capability estate': () => csvDownload('Capability estate', 'pivot_capabilities.csv', [['Number', 'Capability', 'Product family', 'Source', 'Licensed', 'Installed', 'Entitled', 'Allocated', 'Utilization %', 'Measure table', 'Target', 'Actual', 'Score', 'Band', 'Weight', 'Open opportunities']].concat(S.capabilities({ view: 'all' }).map(c => [c.number, c.name, famLabel(c.family), c.sourceLabel, c.licensed ? 'Yes' : 'No', c.installed ? 'Yes' : 'No', c.entitled || '', c.allocated || '', c.utilization == null ? '' : Math.round(c.utilization), c.measure_table || '', c.target == null ? '' : c.target, c.actual == null ? '' : c.actual, c.score == null ? '' : Math.round(c.score), BAND[bandOf(c)].label, c.weight, c.openOpps]))),
  'Opportunities': () => csvDownload('Opportunities', 'pivot_opportunities.csv', [['Number', 'Capability', 'Family', 'Type', 'Description', 'Value', 'Business impact', 'Effort', 'Priority', 'Reason', 'Roadmap', 'State', 'Assigned to', 'Rejection reason']].concat(S.opportunities({ state: 'all' }).map(o => [o.number, o.capabilityName, famLabel(o.family), o.typeLabel, o.description, o.value, o.business_impact, o.effort, o.priority, o.priority_reason, o.phaseLabel, o.stateLabel, o.assignedName, o.rejection_reason]))),
  'Business outcomes': () => csvDownload('Business outcomes', 'pivot_outcomes.csv', [['Objective', 'KPI', 'Capability', 'Owner', 'Direction', 'Baseline', 'Current', 'Target', 'Improvement %', 'Status', 'Period']].concat(S.outcomes().map(o => [o.objective, o.kpi, o.capabilityName, o.ownerName, L.direction[o.direction], o.baseline == null ? '' : o.baseline, o.current_value == null ? '' : o.current_value, o.target, o.improvement == null ? '' : o.improvement, o.statusLabel, L.period[o.period] || o.period]))),
  'Roadmap': () => { const rm = S.roadmap(); csvDownload('Roadmap', 'pivot_roadmap.csv', [['Roadmap', 'Order', 'Number', 'Capability', 'Type', 'Priority', 'Reason', 'State', 'Assigned to']].concat(['now', 'next', 'later'].flatMap(p => rm[p].map(o => [L.phase[p], o.sequence, o.number, o.capabilityName, o.typeLabel, o.priority, o.priority_reason, o.stateLabel, o.assignedName])))); },
  'Assessment runs': () => csvDownload('Assessment runs', 'pivot_assessments.csv', [['Number', 'Started', 'Trigger', 'Run by', 'Status', 'Platform Value Score', 'Duration']].concat(S.assessments().map(a => [a.number, F.dateTime(a.run_date), a.trigger, a.byName, L.status[a.status], a.overall_score == null ? '' : a.overall_score, F.dur(a.duration)]))),
  'Decision log': () => csvDownload('Decision log', 'pivot_decision_log.csv', [['Opportunity', 'Capability', 'When', 'Who', 'Entry']].concat(S.opportunities({ state: 'all' }).flatMap(o => S.opportunity(o.number).activity.map(a => [o.number, o.capabilityName, F.dateTime(a.ts), F.user(a.user), a.text])))),
  'Executive value summary': () => { const d = S.dashboard(); csvDownload('Executive value summary', 'pivot_value_summary.csv', [['Measure', 'Value'], ['Assessment', d.assessment.number], ['Run date', F.dateTime(d.assessment.run_date)], ['Platform Value Score', d.score], ['Previous score', d.previousScore], ['Licensed capabilities', d.licensed], ['Licensed and installed', d.installed], ['Outcomes improved', d.outcomesByStatus.improved], ['Outcomes on target', d.outcomesByStatus.on_target], ['Outcomes below target', d.outcomesByStatus.below_target], ['Outcomes not measured', d.outcomesByStatus.not_measured], ['Opportunities in Now', d.roadmap.now.length], ['Opportunities in Next', d.roadmap.next.length], ['Opportunities in Later', d.roadmap.later.length]]); }
};

/* ---------- charts (hand-written SVG / CSS, data from the engine) ---------- */
function lineChart(labels, a, b, aria) {
  const n = labels.length, x = i => 30 + (n > 1 ? i * (276 / (n - 1)) : 138), y = v => 130 - (v / 100) * 110;
  const pts = arr => arr.map((v, i) => v == null ? null : [x(i), y(v)]).filter(Boolean);
  const pa = pts(a), pb = b ? pts(b) : [];
  const area = pa.length ? `<path d="M${pa.map(p => p.join(' ')).join(' L')} L${pa[pa.length - 1][0]} 130 L${pa[0][0]} 130Z" fill="#2864e8" opacity=".09"/>` : '';
  const step = Math.ceil(n / 6);
  return `<svg class="linechart" viewBox="0 0 320 160" role="img" aria-label="${esc(aria)}"><title>${esc(aria)}</title><g stroke="#e8edf5" stroke-width="1"><path d="M30 20H306 M30 47.5H306 M30 75H306 M30 102.5H306"/></g><g fill="#8a98ad" font-size="9"><text x="4" y="23">100</text><text x="9" y="50">75</text><text x="9" y="78">50</text><text x="9" y="105">25</text><text x="18" y="133">0</text>${labels.map((l, i) => i % step === 0 || i === n - 1 ? `<text x="${x(i) - 12}" y="152">${esc(l)}</text>` : '').join('')}</g>${area}<polyline points="${pa.map(p => p.join(',')).join(' ')}" fill="none" stroke="#2864e8" stroke-width="2.5"/>${b ? `<polyline points="${pb.map(p => p.join(',')).join(' ')}" fill="none" stroke="#bdc9ef" stroke-width="2" stroke-dasharray="5 4"/>` : ''}${pa.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.3" fill="#2864e8"/>`).join('')}</svg>`;
}
function conic(parts) { // parts: [[color, count]]
  const total = parts.reduce((s, p) => s + p[1], 0) || 1; let acc = 0;
  return 'conic-gradient(' + parts.map(([c, v]) => { const a = acc; acc += v / total * 100; return `${c} ${a.toFixed(2)}% ${acc.toFixed(2)}%`; }).join(',') + ')';
}
function trendBars(vals) { const max = Math.max(1, ...vals.filter(v => v != null)); return `<div class="mini-bars" aria-hidden="true">${vals.map((v,i) => `<i style="--chart-index:${i};height:${v == null ? 2 : Math.max(4, v / max * 100)}%"></i>`).join('')}</div>`; }
function miniRankedBars(vals) { const list = vals.filter(v => v != null).slice(0, 7); const max = Math.max(1, ...list); return `<div class="mini-ranked" role="img" aria-label="Ranked opportunity priorities">${list.map((v,i) => `<div class="mini-ranked-row"><span>${i+1}</span><i><b style="width:${Math.max(6, v/max*100)}%"></b></i><strong>${Math.round(v)}</strong></div>`).join('')}</div>`; }
function miniLineTrend(vals) { const list = vals.filter(v => v != null).slice(-8); if (!list.length) return '<div class="mini-empty">No duration data</div>'; const max = Math.max(1, ...list), min = Math.min(0, ...list); const pts = list.map((v,i) => ({x: 10 + (list.length===1?0:i*80/(list.length-1)), y: 72 - ((v-min)/(max-min || 1))*54, v})); const path = pts.map((p,i)=>(i?'L':'M')+p.x+','+p.y).join(' '); return `<svg class="mini-line-svg" viewBox="0 0 100 82" preserveAspectRatio="none" role="img" aria-label="Assessment duration trend"><defs><linearGradient id="runLineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6579ee" stop-opacity=".24"/><stop offset="100%" stop-color="#6579ee" stop-opacity="0"/></linearGradient></defs><path d="${path} L ${pts[pts.length-1].x},76 L ${pts[0].x},76 Z" fill="url(#runLineFill)"/><path d="${path}" fill="none" stroke="#5969e8" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="${i===pts.length-1?2.8:1.8}" fill="#fff" stroke="#5969e8" stroke-width="1.4"><title>${p.v.toFixed(1)} minutes</title></circle>`).join('')}<path d="M5 76 H95" stroke="#dfe5f5" stroke-width=".8"/></svg>`; }

function miniAreaTrend(vals) { const list = vals.filter(v => v != null).slice(-12); if (!list.length) return '<div class="mini-empty">No score history</div>'; const max = Math.max(1, ...list), min = Math.min(0, ...list); const pts = list.map((v,i) => ({x: 5 + (list.length===1?0:i*90/(list.length-1)), y: 68 - ((v-min)/(max-min || 1))*49, v})); const path = pts.map((p,i)=>(i?'L':'M')+p.x+','+p.y).join(' '); return `<svg class="mini-area-svg" viewBox="0 0 100 78" preserveAspectRatio="none" role="img" aria-label="Platform value score trend"><defs><linearGradient id="valueAreaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5a72ee" stop-opacity=".34"/><stop offset="100%" stop-color="#8c83f2" stop-opacity=".02"/></linearGradient></defs><path class="area-fill" d="${path} L ${pts[pts.length-1].x},72 L ${pts[0].x},72 Z" fill="url(#valueAreaFill)"/><path class="draw-line" d="${path}" fill="none" stroke="#5269e8" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p,i)=>`<circle class="chart-point" style="--point-delay:${i*55}ms" cx="${p.x}" cy="${p.y}" r="${i===pts.length-1?3:2}" fill="#fff" stroke="#5269e8" stroke-width="1.4"><title>Score ${Math.round(p.v)}</title></circle>`).join('')}<path d="M4 72 H96" stroke="#dfe5f5" stroke-width=".8"/></svg>`; }
function miniLollipop(vals) { const list = vals.filter(v => v != null).slice(0,7); if (!list.length) return '<div class="mini-empty">No opportunity scores</div>'; const max = Math.max(1, ...list); const barW = 18, gap = 13, startX = 12, baseY = 88, usableH = 58; return `<svg class="mini-priority-svg" viewBox="0 0 240 108" preserveAspectRatio="none" role="img" aria-label="Opportunity priority ranking, vertical columns"><defs><linearGradient id="priorityBarsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7667ee"/><stop offset="100%" stop-color="#4e83f4"/></linearGradient></defs>${[0,1,2].map(i=>`<line x1="5" y1="${baseY-i*27}" x2="235" y2="${baseY-i*27}" stroke="#e6eafa" stroke-width=".8" stroke-dasharray="2 3"/>`).join('')}${list.map((v,i)=>{const h=Math.max(8,v/max*usableH),x=startX+i*(barW+gap);return `<g class="priority-column" style="--bar-delay:${i*65}ms"><rect x="${x}" y="${baseY-h}" width="${barW}" height="${h}" rx="4" fill="url(#priorityBarsFill)" opacity="${i===0?1:.82}"><title>Rank ${i+1}: priority ${Number(v).toFixed(1)}</title></rect><text x="${x+barW/2}" y="${Math.max(10,baseY-h-4)}" text-anchor="middle" font-size="7" fill="#5263a6" font-weight="700">${Number(v).toFixed(1)}</text><text x="${x+barW/2}" y="101" text-anchor="middle" font-size="7" fill="#7a87a5">${i+1}</text></g>`}).join('')}<line x1="5" y1="${baseY}" x2="235" y2="${baseY}" stroke="#cfd8ef" stroke-width="1"/></svg>`; }
function miniDurationDots(vals) { const list = vals.filter(v => v != null).slice(-8); if (!list.length) return '<div class="mini-empty">No duration data</div>'; const max = Math.max(1, ...list); return `<div class="duration-dots" role="img" aria-label="Assessment duration by run">${list.map((v,i)=>`<div class="duration-dot-row" style="--row-delay:${i*60}ms"><span>R${i+1}</span><div class="duration-track"><i style="width:${Math.max(4,v/max*100)}%"></i><b style="left:${Math.max(4,v/max*100)}%" title="${v.toFixed(1)} minutes"></b></div><strong>${v.toFixed(1)}</strong></div>`).join('')}</div>`; }

/* ---------- per-run figures for Analytics Studio ---------- */
function runSnapshot(idx) {
  const caps = S.capabilities({ view: 'active' });
  return caps.map(c => { const sc = c.trend[idx]; return Object.assign({}, c, { score: sc === undefined ? null : sc }); });
}
function outcomeShareByRun() {
  const runs = completedRuns().slice(-8).map(a => a.number), outs = S.outcomes().map(o => S.outcome(o.id));
  return runs.map(num => { let m = 0, ok = 0; outs.forEach(o => { const r = o.results.find(x => x.assessment === num); if (r && r.status !== 'not_measured') { m++; if (r.status === 'improved' || r.status === 'on_target') ok++; } }); return m ? ok / m * 100 : null; });
}

/* =====================================================================
   DASHBOARD
   ===================================================================== */
function dashboardHome() {
  const d = S.dashboard(), a = d.assessment, run = d.running, ob = d.outcomesByStatus, outs = d.outcomes.length;
  const delta = d.previousScore == null ? null : d.score - d.previousScore;
  const caps = S.capabilities({ view: 'active' }), scored = caps.filter(c => c.score != null).length;
  const onTrack = ob.improved + ob.on_target, measuredOut = outs - ob.not_measured;
  const stale = caps.filter(c => c.stale);
  const top = d.roadmap.now.slice(0, 3);
  const hero = `<div class="signal-hero"><div class="signal-copy"><div class="signal-kicker"><span class="signal-live"></span> ${run ? 'Assessment ' + esc(run.number) + ' running · step ' + (run.log[run.log.length - 1].step) + ' of 10' : 'Platform pulse · ' + esc(a.number)}</div><div class="signal-title">Platform Value Score ${F.num(d.score, 1)}${delta == null ? '.' : delta >= 0 ? ', up ' + F.num(delta, 1) + ' since the previous run.' : ', down ' + F.num(-delta, 1) + ' since the previous run.'}</div><div class="signal-text">${esc(a.number)} ran ${esc(F.dateTime(a.run_date))} (${esc(a.trigger.toLowerCase())}) and checked ${a.counts.capabilities} capabilities. ${a.counts.notMeasured} are Not Measured and left out of the score, not counted as 0. ${d.licensed - d.installed} licensed capabilities are not installed.</div><div class="signal-footer"><button class="signal-tag" data-view="Roadmap"><strong>${d.roadmap.now.length}</strong> opportunities in Now</button><button class="signal-tag" data-view="Value & Opportunities"><strong>${ob.below_target}</strong> outcomes below target</button><button class="signal-tag" data-asm="${esc(a.number)}">Last assessment · ${esc(F.date(a.run_date))}</button></div></div><div class="signal-stats"><div class="signal-stat"><span>Score change</span><b>${sign(delta)}</b><em>${delta == null ? 'First run' : delta >= 0 ? '↗ Improving' : '↘ Falling'}</em></div><div class="signal-stat"><span>Outcomes on track</span><b>${onTrack} / ${measuredOut}</b><em>${ob.not_measured} not measured</em></div></div></div>`;
  const signals = [
    { t: delta == null ? 'First assessment' : delta >= 0 ? 'Platform Value Score is rising' : 'Platform Value Score fell', s: 'Weighted score of ' + scored + ' scored capabilities, ' + F.num(d.score, 1) + ' now', v: sign(delta), pos: delta >= 0, go: 'data-view="Analytics Studio"' },
    { t: (d.licensed - d.installed) + ' licensed capabilities are not installed', s: d.licensedNotInstalled.map(c => c.name).slice(0, 3).join(', ') + (d.licensedNotInstalled.length > 3 ? '…' : ''), v: d.installed + ' / ' + d.licensed, go: 'data-view="Element Map"' },
    { t: ob.below_target + ' business outcomes are below target', s: d.outcomes.filter(o => o.status === 'below_target').map(o => o.kpi).join('; '), v: measuredOut ? Math.round(onTrack / measuredOut * 100) + '% on track' : '—', go: 'data-view="Value & Opportunities"' }
  ];
  const attention = [];
  d.insights.forEach(i => attention.push({ item: i.capability, fam: famLabel((S.capability(i.capabilityId) || {}).family), sig: i.kind === 'high_usage_below_target' ? '<span class="pill warn">High usage, outcome below target</span>' : '<span class="pill warn">Low usage, important objective</span>', next: i.text, go: `data-cap-open="${i.capabilityId}"` }));
  stale.forEach(c => attention.push({ item: c.name, fam: famLabel(c.family), sig: '<span class="pill bad">Stale source data</span>', next: c.staleNote + '. Check the source before acting on its score.', go: `data-cap-open="${c.id}"` }));
  if (d.needsMapping) attention.push({ item: d.needsMapping + ' capabilities without a product family', fam: 'Needs mapping', sig: '<span class="pill blue">Mapping</span>', next: 'An admin sets the product family so they appear in family reports.', go: 'data-action="needsMapping"' });
  d.notMeasured.outcomes.forEach(o => attention.push({ item: o.kpi, fam: famLabel((S.capability(o.capability) || {}).family), sig: '<span class="pill warn">Outcome not measured</span>', next: 'No measured value yet. ' + o.ownerName + ' owns this outcome.', go: `data-out="${o.id}"` }));
  const attentionPage = pageSlice(attention, 'dashboardAttention', 5);
  return hero + heading('PIVOT / OVERVIEW', 'Dashboard', 'Value and outcomes first, then scores and usage, then the opportunities and roadmap that follow from them.', `<button class="btn" data-view="Analytics Studio">Open Analytics Studio →</button><button class="btn primary" data-view="Reports">View reports →</button>`)
    + `<div class="kpis">${kpi('CAPABILITIES', caps.length, scored + ' scored · ' + (caps.length - scored) + ' not measured or not installed', '▦', '', 'data-view="Capability Library" role="link" tabindex="0"')}${kpi('PLATFORM VALUE SCORE', F.num(d.score, 1), (delta == null ? 'First run' : (delta >= 0 ? '↑ ' : '↓ ') + F.num(Math.abs(delta), 1) + ' vs ' + esc(completedRuns().slice(-2)[0].number)), '◉', 'green', 'data-view="Analytics Studio" role="link" tabindex="0"')}${kpi('BUSINESS OUTCOMES', outs, onTrack + ' improved or on target · ' + ob.below_target + ' below', '◎', 'purple', 'data-view="Value & Opportunities" role="link" tabindex="0"')}${kpi('ACTIVE OPPORTUNITIES', d.roadmap.now.length + d.roadmap.next.length + d.roadmap.later.length, d.roadmap.now.length + ' Now · ' + d.roadmap.next.length + ' Next · ' + d.roadmap.later.length + ' Later', '↗', 'orange', 'data-view="Roadmap" role="link" tabindex="0"')}</div>`
    + `<div class="dashboard-focus-grid"><section class="panel focus-panel"><div class="panelhead"><div><h3>Executive signals</h3><div class="paneldesc">What changed in ${esc(a.number)}</div></div><span class="pill blue">This run</span></div><div class="signal-list">${signals.map((s, i) => `<button class="signal-row" ${s.go}><span class="signal-index">0${i + 1}</span><span class="signal-body"><b>${esc(s.t)}</b><span>${esc(s.s)}</span></span><strong class="${s.pos ? 'signal-positive' : ''}">${esc(s.v)}</strong></button>`).join('')}</div><button class="btn" data-view="Analytics Studio">Explore detailed analytics →</button></section>`
    + `<section class="panel focus-panel"><div class="panelhead"><div><h3>Priority queue</h3><div class="paneldesc">Top of the Now column, highest priority first</div></div><span class="pill warn">${d.roadmap.now.length} in Now</span></div><div class="priority-stack">${top.map(o => `<button class="priority-item" data-opp="${o.number}"><span class="priority-mark ${o.priority >= 3 ? 'urgent' : 'mid'}" aria-hidden="true">${o.type === 'idle_licences' || o.type === 'shelfware' ? '!' : '↗'}</span><span><b>${esc(o.capabilityName)}</b><p>${esc(famLabel(o.family))} · ${esc(o.description)}</p><span class="priority-meta">PRIORITY ${F.pri(o.priority)} · ${esc(o.typeLabel.toUpperCase())} · ${o.assignedName ? esc(o.assignedName.toUpperCase()) : 'UNASSIGNED'}</span></span></button>`).join('') || '<p class="record-desc">Nothing in Now.</p>'}</div><button class="btn primary" data-view="Value & Opportunities">Review opportunities →</button></section></div>`
    + sectionHead('Needs attention', 'Usage-versus-outcome insights, stale source data, mapping gaps and outcomes without a measured value.', `<button class="btn" data-view="Value & Opportunities">View opportunities →</button>`)
    + `<div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Item</th><th scope="col">Family</th><th scope="col">Signal</th><th scope="col">Next step</th></tr></thead><tbody>${attentionPage.items.map(r => `<tr class="rowlink" ${r.go} tabindex="0"><td><b>${esc(r.item)}</b></td><td>${esc(r.fam)}</td><td>${r.sig}</td><td>${esc(r.next)}</td></tr>`).join('')}</tbody></table></div>${pagerMarkup('dashboardAttention', attentionPage, 'items')}</div>`;
}

/* =====================================================================
   ANALYTICS STUDIO
   ===================================================================== */
function analyticsStudio() {
  const runs = completedRuns().slice(-8), s = st.studio; if (s.run > runs.length - 1) s.run = runs.length - 1;
  const run = runs[s.run], snap = runSnapshot(s.run).filter(c => (s.family === 'all' || c.family === s.family) && (s.band === 'all' || bandOf(c) === s.band));
  const fams = families().filter(f => snap.some(c => c.family === f)); if (snap.some(c => !c.family)) fams.push('');
  const famScore = f => { const cs = snap.filter(c => (c.family || '') === f && c.score != null); const w = cs.reduce((t, c) => t + c.weight, 0); return w ? cs.reduce((t, c) => t + c.score * c.weight, 0) / w : null; };
  const bars = fams.map(f => {
    const cs = snap.filter(c => (c.family || '') === f), sc = famScore(f), parts = BAND_ORDER.map(b => cs.filter(c => bandOf(c) === b).length);
    return `<div class="barcol" title="${esc(famLabel(f))}: score ${F.score(sc)}, ${cs.length} capabilities"><span class="barvalue">${F.score(sc)}</span><div class="barstack" style="height:${sc == null ? 4 : Math.max(4, sc)}%">${parts.map((v, i) => v ? `<i style="height:${v / cs.length * 100}%;background:${BAND[BAND_ORDER[i]].color === BAND.notinst.color || BAND_ORDER[i] === 'nm' ? BAND[BAND_ORDER[i]].color : BAND_SOLID[BAND_ORDER[i]]}"></i>` : '').join('')}</div><span class="barlabel">${esc(f ? famLabel(f) : 'Unmapped')}</span></div>`;
  }).join('');
  const counts = BAND_ORDER.map(b => [b, snap.filter(c => bandOf(c) === b).length]);
  const hist = completedRuns().slice(-8), share = outcomeShareByRun();
  const first = hist[0], last = hist[hist.length - 1];
  const scored = snap.filter(c => c.score != null);
  const w = scored.reduce((t, c) => t + c.weight, 0), pvs = w ? scored.reduce((t, c) => t + c.score * c.weight, 0) / w : null;
  const now = S.roadmap().now.slice(0, 3);
  const famOpts = families().map(f => `<option value="${f}" ${s.family === f ? 'selected' : ''}>${esc(L.family[f])}</option>`).join('');
  const running = S.running();
  return heading('PIVOT / ANALYTICS', 'Analytics Studio', 'Scores, usage bands and value trend from the assessment runs. Every figure is calculated by PIVOT from the capability results.', `<button class="btn" data-action="exportCaps">Export CSV ↓</button>${gated('assessment.run', `<button class="btn primary" data-action="runNow" ${running ? 'disabled title="' + esc(running.number) + ' is running"' : ''}>${running ? 'Running ' + esc(running.number) + '…' : 'Run assessment now ↻'}</button>`)}`)
    + `<div class="filters"><label class="field">Assessment run<select id="studioRun">${runs.map((r, i) => `<option value="${i}" ${i === s.run ? 'selected' : ''}>${esc(r.number)} · ${esc(F.date(r.run_date))}</option>`).join('')}</select></label><label class="field">Product family<select id="studioFamily"><option value="all">All product families</option>${famOpts}</select></label><label class="field">Usage band<select id="studioBand"><option value="all">All bands</option>${BAND_ORDER.map(b => `<option value="${b}" ${s.band === b ? 'selected' : ''}>${BAND[b].label}</option>`).join('')}</select></label><span class="filters-meta">${esc(run.number)} · ${esc(F.dateTime(run.run_date))} · ${esc(run.trigger)}</span></div>`
    + `<div class="kpis">${kpi('CAPABILITIES IN VIEW', snap.length, scored.length + ' scored · ' + (snap.length - scored.length) + ' not scored', '▦')}${kpi('WEIGHTED SCORE', F.num(pvs, 1), s.family === 'all' && s.band === 'all' ? 'Platform Value Score for this run' : 'For the filtered capabilities', '◉', 'green')}${kpi('LOW USAGE', counts[2][1], 'Score below ' + lo() + ' (low adoption rule)', '△', 'orange')}${kpi('SCORE SINCE ' + esc(first.number), sign(last.overall_score - first.overall_score), F.num(first.overall_score, 1) + ' → ' + F.num(last.overall_score, 1) + ' over ' + hist.length + ' runs', '↗', 'purple')}</div>`
    + `<div class="charts">${panel('Score by product family', 'Bar height = weighted family score; segments = share of capabilities per usage band', `<div class="bar-chart" role="img" aria-label="Weighted score per product family"><div class="yaxis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="bars">${bars || '<p class="record-desc" style="margin:auto">No capabilities match.</p>'}</div></div><div class="chartlegend">${BAND_ORDER.map(b => `<span><i class="dot" style="background:${b === 'notinst' || b === 'nm' ? BAND[b].color : BAND_SOLID[b]};${b === 'nm' || b === 'notinst' ? 'border:1px solid #c8d0df' : ''}"></i>${BAND[b].label}</span>`).join('')}</div>`)}`
    + panel('Platform Value Score by run', 'Σ(score × weight) ÷ Σ(weight) · last ' + hist.length + ' completed runs', `${lineChart(hist.map(h => F.dateShort(h.run_date)), hist.map(h => h.overall_score), share, 'Platform Value Score from ' + F.num(first.overall_score, 1) + ' to ' + F.num(last.overall_score, 1))}<div class="chartlegend"><span><i class="dot" style="background:#2864e8"></i>Platform Value Score</span><span><i class="dot" style="background:#bdc9ef"></i>% of measured outcomes improved or on target</span></div>`)
    + panel('Capabilities by usage band', snap.length + ' capabilities in view', `<div class="donutwrap"><div class="donut" style="background:${conic(counts.map(([b, v]) => [DONUT[b], v]))} !important" role="img" aria-label="${counts.map(([b, v]) => BAND[b].label + ' ' + v).join(', ')} !important"><div class="donutcenter"><b>${snap.length}</b><span>Capabilities</span></div></div><div class="legend-right">${counts.map(([b, v]) => `<button class="legenditem" data-studio-band="${b}"><i class="dot" style="background:${DONUT[b]}"></i><span>${BAND[b].label}<small style="display:block;color:#8997aa">${snap.length ? Math.round(v / snap.length * 100) : 0}%</small></span><span class="count">${v}</span></button>`).join('')}</div></div>`) + `</div>`
    + `<div class="viewplaceholder"><div class="panelhead"><div><h3>What needs attention</h3><div class="paneldesc">Top three opportunities in Now, ranked by (value + impact) ÷ effort</div></div><button class="btn" data-view="Value & Opportunities">View value &amp; opportunities →</button></div><div class="attention-grid">${now.map(o => `<button class="attention-card now" data-opp="${o.number}"><span class="pill warn">NOW · ${F.pri(o.priority)}</span><b>${esc(o.capabilityName)}</b><span>${esc(o.typeLabel)} · ${esc(o.description)}</span></button>`).join('')}</div></div>`;
}

/* =====================================================================
   ELEMENT MAP
   ===================================================================== */
function topOpp(capId) { return S.opportunities({ capability: capId })[0]; }
function tileMarkup(c) {
  const b = bandOf(c), o = topOpp(c.id);
  return `<button class="tile ${BAND[b].cls} ${c.id === st.map.sel ? 'selected' : ''} ${o ? 'has-horizon' : ''}" data-tile="${c.id}" aria-pressed="${c.id === st.map.sel}" aria-label="${esc(c.name)}, ${esc(BAND[b].label)}${c.score != null ? ', score ' + F.score(c.score) : ''}${o ? ', open opportunity in ' + L.phase[o.phase] : ''}"><span class="score">${F.score(c.score)}</span>${o ? `<span class="horizon">${L.phase[o.phase].toUpperCase()}</span>` : ''}<span class="symbol">${esc(sym(c.name))}</span><span><span class="tilename">${esc(c.name)}</span><br><span class="tilemeta">● ${BAND[b].short}</span></span></button>`;
}
function mapDetailBody(c, tab) {
  if (tab === 'Usage') return `<div class="detailfacts"><span>Measure table</span><b>${esc(c.measure_table || '—')}</b><span>Look-back</span><b>${c.days_back ? c.days_back + ' days' : '—'}</b><span>Actual</span><b>${F.num(c.actual)}</b><span>Target</span><b>${F.num(c.target)}</b><span>Licences</span><b>${c.entitled ? c.allocated + ' of ' + c.entitled : 'Not a subscription'}</b><span>Utilization</span><b>${F.pct(c.utilization)}</b><span>Last 8 runs</span><b>${c.trend.map(v => F.score(v)).join(' · ')}</b></div>`;
  if (tab === 'Outcomes') { const outs = S.outcomes({ capability: c.id }); return outs.length ? `<div class="mini-list">${outs.map(o => `<button data-out="${o.id}"><b>${esc(o.kpi)}</b><span>${esc(o.statusLabel)} · ${F.num(o.current_value, 1)} of target ${F.num(o.target, 1)}</span></button>`).join('')}</div>` : '<p class="record-desc">No business outcome is linked to this capability.</p>'; }
  if (tab === 'Opportunities') { const ops = S.opportunities({ capability: c.id, state: 'all' }); return ops.length ? `<div class="mini-list">${ops.map(o => `<button data-opp="${o.number}"><b>${esc(o.number)} · ${esc(o.typeLabel)}</b><span>${esc(o.stateLabel)} · ${esc(o.phaseLabel)} · priority ${F.pri(o.priority)}</span></button>`).join('')}</div>` : '<p class="record-desc">No opportunity. None of the six gap rules applies.</p>'; }
  return `<div class="detailfacts"><span>Product family</span><b>${esc(famLabel(c.family))}</b><span>Source</span><b>${esc(c.sourceLabel)}</b><span>Usage band</span><b>${esc(BAND[bandOf(c)].label)}</b><span>Score</span><b>${F.score(c.score)}</b><span>Weight</span><b>${c.weight}</b><span>Last discovered</span><b>${esc(F.date(c.last_discovered))}</b></div>`;
}
function renderDetail() {
  const c = S.capability(st.map.sel) || S.capabilities({ view: 'active' })[0]; const o = topOpp(c.id);
  return `<aside><div class="detailpanel"><div class="smallcaps">${esc(famLabel(c.family))} · ${esc(c.number)}</div><div class="detailtop"><div class="largesymbol">${esc(sym(c.name))}</div><div><div class="detailname">${esc(c.name)}</div><div class="detailscore">${esc(bandText(c))}</div></div></div><div class="opportunity">${o ? '! Open opportunity · ' + esc(o.typeLabel) + ' · priority ' + F.pri(o.priority) : '● No open opportunity'}${c.stale ? '<br>! ' + esc(c.staleNote) : ''}</div><button class="btn primary detailbtn" data-cap-open="${c.id}">View capability details <span>›</span></button><div class="detailtabs" role="tablist">${['Overview', 'Usage', 'Outcomes', 'Opportunities'].map(t => `<button role="tab" aria-selected="${st.map.tab === t}" class="${st.map.tab === t ? 'active' : ''}" data-detailtab="${t}">${t}</button>`).join('')}</div><div id="detailTabBody">${mapDetailBody(c, st.map.tab)}</div></div><div class="legendpanel"><div class="smallcaps">Key · Usage band</div><p><i class="swatch" style="background:#2f347d"></i>STRONG · score ${hi()} or more</p><p><i class="swatch" style="background:#4e55a6"></i>MODERATE · score ${lo()}–${hi() - 1}</p><p><i class="swatch" style="background:#c9c9eb"></i>LOW · score below ${lo()}</p><p><i class="swatch" style="background:repeating-linear-gradient(135deg,#fff,#fff 5px,#e8e9ef 5px,#e8e9ef 7px)"></i>Hatched · licensed not installed, or not measured</p><p><span class="horizon" style="position:static;display:inline-block;margin-right:5px">NOW</span> Top open opportunity and its roadmap column</p></div></aside>`;
}
function mapColumn(cl) {
  if (!cl.items.length) return '<div class="emptycol">No matching capabilities</div>';
  const key = 'map:' + st.map.mode + ':' + cl.label, limit = st.more[key] || 5, rest = cl.items.length - limit;
  return cl.items.slice(0, limit).map(tileMarkup).join('')
    + (rest > 0 ? `<button class="btn map-more" data-more="${esc(key)}" aria-label="Load ${Math.min(10, rest)} more in ${esc(cl.label)}" title="${rest} more in this column">Load more · ${rest}</button>` : '');
}
function elementMap() {
  const q = st.map.q.toLowerCase(), all = S.capabilities({ view: 'active' });
  const shown = all.filter(c => !q || (c.name + ' ' + famLabel(c.family) + ' ' + sym(c.name) + ' ' + c.number).toLowerCase().includes(q));
  let cols;
  if (st.map.mode === 'band') cols = BAND_ORDER.map(b => ({ label: BAND[b].label, items: shown.filter(c => bandOf(c) === b) }));
  else { cols = families().filter(f => all.some(c => c.family === f)).map(f => ({ label: L.family[f], items: shown.filter(c => c.family === f) })); if (all.some(c => !c.family)) cols.push({ label: 'Needs mapping', items: shown.filter(c => !c.family) }); }
  cols.forEach(cl => cl.items.sort((a, b) => (b.score == null ? -1 : b.score) - (a.score == null ? -1 : a.score)));
  const groups = cols.map(cl => `<div class="familycol"><div class="familylabel">${esc(cl.label)} <span class="familycount">${cl.items.length}</span></div>${mapColumn(cl)}</div>`).join('');
  return heading('PIVOT / CAPABILITY LANDSCAPE', 'Element Map', 'Every active capability is an element. Columns are product families; each tile shows its score and usage band. Hatched tiles are licensed but not installed, or not measured.', `<button class="btn" data-action="exportCaps">Export map ↓</button>`)
    + `<div class="maphead"><div><div style="font-size:11px;color:var(--muted)">${shown.length} of ${all.length} active capabilities · scores from ${esc(S.latest().number)}</div></div><div class="maptools"><div class="toggle" role="group" aria-label="Group by"><button class="${st.map.mode === 'family' ? 'active' : ''}" aria-pressed="${st.map.mode === 'family'}" data-mode="family">Product families</button><button class="${st.map.mode === 'band' ? 'active' : ''}" aria-pressed="${st.map.mode === 'band'}" data-mode="band">Usage band</button></div><input class="mapsearch" id="mapSearch" value="${esc(st.map.q)}" placeholder="⌕ Search capabilities…" aria-label="Search capabilities"><button class="btn" data-action="resetMap">Reset</button></div></div>`
    + `<div class="maplayout"><div class="elementgrid" style="--cols:${cols.length}">${groups}</div>${renderDetail()}</div>`;
}

/* =====================================================================
   CAPABILITY LIBRARY — one record per page
   ===================================================================== */
const LIB_VIEWS = [['active', 'All active capabilities'], ['all', 'All capabilities, including inactive'], ['low', 'Low usage (score below threshold)'], ['idle', 'Idle licences (below utilization threshold)'], ['not_measured', 'Not measured'], ['licensed_not_installed', 'Licensed, not installed'], ['needs_mapping', 'Needs mapping (no family)'], ['not_found', 'Not found in the last run']];
function libList() { const l = st.lib; return S.capabilities({ q: l.q, view: l.view, family: l.family }); }
function fieldErr(errs, k) { return errs[k] ? `<span class="fielderr" id="err-${k}">${esc(errs[k])}</span>` : ''; }
function inField(label, name, value, errs, opts = {}) {
  const dis = opts.disabled ? 'disabled' : '', err = errs && errs[name];
  const ctrl = opts.select ? `<select name="${name}" id="f-${name}" ${dis} ${err ? `aria-invalid="true" aria-describedby="err-${name}"` : ''}>${opts.select.map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(value == null ? '' : value) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`
    : opts.area ? `<textarea name="${name}" id="f-${name}" rows="${opts.rows || 3}" ${dis} ${err ? `aria-invalid="true" aria-describedby="err-${name}"` : ''} placeholder="${esc(opts.ph || '')}">${esc(value == null ? '' : value)}</textarea>`
      : `<input name="${name}" id="f-${name}" type="${opts.type || 'text'}" value="${esc(value == null ? '' : value)}" ${dis} ${opts.step ? `step="${opts.step}"` : ''} placeholder="${esc(opts.ph || '')}" ${err ? `aria-invalid="true" aria-describedby="err-${name}"` : ''}>`;
  return `<label class="field ${opts.wide ? 'wide' : ''}">${esc(label)}${ctrl}${opts.help ? `<small class="fieldhelp">${esc(opts.help)}</small>` : ''}${fieldErr(errs || {}, name)}</label>`;
}
function capabilityLibrary() {
  const l = st.lib, list = libList(), total = list.length; l.page = Math.max(0, Math.min(l.page, Math.max(0, total - 1)));
  const c0 = list[l.page], c = c0 && S.capability(c0.id), admin = S.can('capability.edit'), nm = S.capabilities({ view: 'needs_mapping' }).length;
  const actions = `<button class="btn" data-action="exportCaps">Export catalogue ↓</button>${isAdmin() ? `<button class="btn primary" data-action="needsMapping">Needs mapping (${nm})</button>` : ''}`;
  let rec = `<div class="record-card empty-state"><b>No capabilities match these filters.</b><p class="record-desc">Clear the filters or try another search.</p><button class="btn" data-action="clearLibrary">Clear filters</button></div>`;
  if (c) {
    const b = bandOf(c), opps = c.opportunities.filter(o => S.isActive(o.state));
    const fam = [['', '— Needs mapping —']].concat(DATA.families.map(f => [f.value, f.label]));
    rec = `<div class="record-card"><div class="record-top"><div style="display:flex;gap:13px;align-items:flex-start"><div class="record-symbol">${esc(sym(c.name))}</div><div><div class="eyebrow">${esc(famLabel(c.family).toUpperCase())} / CAPABILITY RECORD</div><div class="record-title">${esc(c.name)}</div><div class="record-desc">${esc(c.number)} · ${esc(c.sourceLabel)} · scope ${esc(c.scope || '—')}${c.linkedName ? ' · linked to ' + esc(c.linkedName) : ''}</div></div></div><span class="pill ${b === 'low' ? 'warn' : b === 'notinst' ? 'bad' : b === 'nm' ? 'warn' : 'blue'}">${esc(BAND[b].label)}</span></div>
 ${c.stale ? `<div class="opportunity" style="margin-top:14px">! ${esc(c.staleNote)}. The score may be out of date.</div>` : ''}${c.not_found ? `<div class="opportunity" style="margin-top:14px">! Not found in the last discovery. It is kept for history and excluded from scoring.</div>` : ''}
 <div class="detail-grid" style="margin-top:18px"><section class="panel"><div class="panelhead"><div><h3>Score</h3><div class="paneldesc">actual ÷ target × 100, capped at 100</div></div></div><div class="bigscore">${F.score(c.score)}<span>${c.score == null ? (b === 'notinst' ? '' : ' not measured') : ' / 100'}</span></div><div class="progressline"><i style="width:${c.score || 0}%;background:${BAND_SOLID[b]}"></i></div><p class="record-desc">${esc(bandText(c))}. ${c.measured ? 'Actual ' + F.num(c.actual) + ' against a target of ' + F.num(c.target) + ' in the last ' + c.days_back + ' days.' : ''}</p><div class="sparkline-row"><span>Last 8 runs</span>${trendBars(c.trend)}</div></section>
 <section class="panel"><div class="panelhead"><div><h3>Licence &amp; discovery</h3><div class="paneldesc">Read-only — set by discovery in each run</div></div><span class="pill">Read-only</span></div><div class="detailfacts"><span>Source</span><b>${esc(c.sourceLabel)}</b><span>Licensed</span><b>${c.licensed ? 'Yes' : 'No'}</b><span>Installed</span><b>${c.installed ? 'Yes' : 'No'}</b><span>Licences</span><b>${c.entitled ? c.allocated + ' allocated of ' + c.entitled : '—'}</b><span>Utilization</span><b>${F.pct(c.utilization)}${c.utilization != null && c.utilization < S.prop('utilization_threshold') ? ' · below ' + S.prop('utilization_threshold') + '%' : ''}</b><span>Last discovered</span><b>${esc(F.dateTime(c.last_discovered))}</b></div></section></div>
 <div class="detail-grid" style="margin-top:12px"><section class="panel"><div class="panelhead"><div><h3>Measurement settings</h3><div class="paneldesc">${admin ? 'Used from the next assessment run' : esc(why('capability.edit'))}</div></div>${admin ? '' : '<span class="pill">Read-only</span>'}</div><form id="capForm" data-cap="${c.id}" class="formgrid" novalidate>
 ${inField('Measure table', 'measure_table', c.measure_table, l.errors, { disabled: !admin, ph: 'e.g. incident' })}${inField('Date field', 'date_field', c.date_field, l.errors, { disabled: !admin })}
 ${inField('Filter (encoded query)', 'measure_filter', c.measure_filter, l.errors, { disabled: !admin, wide: true })}
 ${inField('Days back', 'days_back', c.days_back, l.errors, { disabled: !admin, type: 'number' })}${inField('Target', 'target', c.target, l.errors, { disabled: !admin, type: 'number', help: 'Empty = Not Measured' })}
 ${inField('Weight (1–5)', 'weight', c.weight, l.errors, { disabled: !admin, type: 'number' })}${inField('Product family', 'family', c.family || '', l.errors, { disabled: !admin, select: fam })}
 ${admin ? `<div class="formactions wide"><button class="btn primary" type="submit">Save measurement settings</button>${l.note ? `<span class="formnote" role="status">${esc(l.note)}</span>` : ''}</div>` : ''}</form></section>
 <section class="panel"><h3>Evidence &amp; next step</h3><p class="record-desc">Each assessment stores a result per capability. Check the history before acting on one run.</p><div class="subnav"><button data-action="evidence" data-cap="${c.id}">View evidence (${c.results.length} runs)</button><button data-asm="${esc(c.results[0] ? c.results[0].assessment : S.latest().number)}">Open assessment</button></div>
 <h3 style="margin-top:16px">Opportunities (${opps.length} active)</h3>${opps.length ? `<div class="mini-list">${opps.map(o => `<button data-opp="${o.number}"><b>${esc(o.number)} · ${esc(o.typeLabel)}</b><span>${esc(o.phaseLabel)} · priority ${F.pri(o.priority)} · ${esc(o.stateLabel)}</span></button>`).join('')}</div>` : '<p class="record-desc">No active opportunity for this capability.</p>'}
 <h3 style="margin-top:16px">Business outcomes (${c.outcomes.length})</h3>${c.outcomes.length ? `<div class="mini-list">${c.outcomes.map(o => `<button data-out="${o.id}"><b>${esc(o.kpi)}</b><span>${esc(o.statusLabel)} · owner ${esc(o.ownerName)}</span></button>`).join('')}</div>` : '<p class="record-desc">No outcome linked.</p>'}</section></div>
 <div class="pager"><div class="pager-info">Record <b>${l.page + 1}</b> of <b>${total}</b> · one record per page</div><div class="pager-actions"><button class="btn" data-action="firstPage" ${l.page === 0 ? 'disabled' : ''}>« First</button><button class="btn" data-action="prevPage" ${l.page === 0 ? 'disabled' : ''}>‹ Previous</button><button class="btn primary" data-action="nextPage" ${l.page >= total - 1 ? 'disabled' : ''}>Next ›</button><button class="btn" data-action="lastPage" ${l.page >= total - 1 ? 'disabled' : ''}>Last »</button></div></div></div>`;
  }
  const famOpts = DATA.families.map(f => `<option value="${f.value}" ${l.family === f.value ? 'selected' : ''}>${esc(f.label)}</option>`).join('');
  return heading('PIVOT / CAPABILITIES', 'Capability Library', 'Each licensed subscription, store app and plugin PIVOT discovered. Discovery fields are read-only; admins set how usage is measured.', actions)
    + `<div class="metricstrip">${miniMetric('CAPABILITIES IN VIEW', total, 'Matching current filters')}${miniMetric('SCORED', list.filter(x => x.score != null).length, 'Have a score in ' + esc(S.latest().number), total ? list.filter(x => x.score != null).length / total * 100 : 0)}${miniMetric('ACTIVE OPPORTUNITIES', list.reduce((t, x) => t + x.openOpps, 0), 'New, accepted or in progress')}</div>`
    + `<div class="filterbar"><input id="librarySearchInput" value="${esc(l.q)}" placeholder="Search name, number, scope or table…" aria-label="Search capabilities"><select id="libraryView" aria-label="View">${LIB_VIEWS.filter(v => v[0] !== 'needs_mapping' || isAdmin()).map(([v, t]) => `<option value="${v}" ${l.view === v ? 'selected' : ''}>${t}</option>`).join('')}</select><select id="libraryFamily" aria-label="Product family"><option value="all">All product families</option>${famOpts}</select><button class="btn" data-action="clearLibrary">Clear filters</button><span class="filters-meta">One capability per page</span></div>`
    + rec;
}

/* =====================================================================
   VALUE & OPPORTUNITIES — outcomes and the opportunities that move them
   ===================================================================== */
function voList() { const v = st.vo; return S.opportunities({ state: v.state, type: v.type, phase: v.phase, family: v.family, assigned: v.assigned === 'all' ? undefined : v.assigned, q: v.q }); }
function valueOpportunities() {
  const v = st.vo, list = voList(), outs = S.outcomes(), ob = { improved: 0, on_target: 0, below_target: 0, not_measured: 0 }; outs.forEach(o => ob[o.status]++);
  const measured = outs.length - ob.not_measured, att = measured ? (ob.improved + ob.on_target) / measured * 100 : null;
  const nmCaps = S.dashboard().notMeasured.capabilities.length, all = S.opportunities();
  const sel = (id, label, cur, opts) => `<label class="field">${label}<select id="${id}">${opts.map(([val, t]) => `<option value="${val}" ${cur === val ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  const outList = S.outcomes({ status: v.outStatus, mine: S.role() === 'business_owner' && v.outStatus === 'mine' ? true : undefined }).filter(o => v.outStatus !== 'mine' || o.owner === S.user().id);
  const owners = {}; outs.forEach(o => { owners[o.owner] = owners[o.owner] || { n: 0, below: 0 }; owners[o.owner].n++; if (o.status === 'below_target') owners[o.owner].below++; });
  const filtered = v.family !== 'all' || v.phase !== 'all' || v.state !== 'active' || v.type !== 'all' || v.assigned !== 'all' || v.q;
  const oppPage = pageSlice(list, 'voOpps', 5), outcomePage = pageSlice(outList, 'voOutcomes', 5);
  return heading('PIVOT / VALUE', 'Value &amp; Opportunities', 'Business outcomes and the opportunities PIVOT raised to move them. Every opportunity comes from one of the six gap rules and is ranked by (value + impact) ÷ effort.', `<button class="btn" data-action="exportOpps">Export opportunities ↓</button>${gated('outcome.create', '<button class="btn primary" data-out="new">+ New outcome</button>')}`)
    + `<div class="filters">${sel('voFamily', 'Product family', v.family, [['all', 'All product families']].concat(DATA.families.map(f => [f.value, f.label])))}${sel('voPhase', 'Roadmap', v.phase, [['all', 'Now, Next and Later'], ['now', 'Now'], ['next', 'Next'], ['later', 'Later']])}${sel('voState', 'State', v.state, [['active', 'Active (new, accepted, in progress)'], ['open', 'New'], ['accepted', 'Accepted'], ['in_progress', 'In progress'], ['done', 'Done'], ['rejected', 'Rejected'], ['all', 'All states']])}${sel('voType', 'Gap rule', v.type, [['all', 'All rules']].concat(Object.keys(L.type).map(k => [k, L.type[k]])))}${sel('voAssigned', 'Assigned', v.assigned, [['all', 'Anyone'], ['me', 'Assigned to me'], ['unassigned', 'Unassigned']])}<label class="field">Search<input id="voSearch" value="${esc(v.q)}" placeholder="Number, capability, text"></label></div>`
    + `<div class="kpis">${kpi('OUTCOME ATTAINMENT', att == null ? '—' : F.num(att, 1) + '%', (ob.improved + ob.on_target) + ' of ' + measured + ' measured outcomes improved or on target', '◎', 'green')}${kpi('ACTIVE OPPORTUNITIES', all.length, all.filter(o => o.phase === 'now').length + ' in Now · ' + all.filter(o => !o.assigned_to).length + ' unassigned', '↗', 'purple')}${kpi('BELOW TARGET', ob.below_target + ' outcomes', 'Owner review needed', '△', 'orange')}${kpi('NOT MEASURED', nmCaps + ob.not_measured, nmCaps + ' capabilities · ' + ob.not_measured + ' outcomes', '!', '')}</div>`
    + `<div class="detail-grid" style="margin:12px 0"><section class="panel"><h3>Outcome review</h3><p class="record-desc">${outs.length} outcomes are in scope. ${ob.improved} improved, ${ob.on_target} reached target, ${ob.below_target} are below target and ${ob.not_measured} have no measured value yet. Improvement = (actual − baseline) ÷ (target − baseline). Baselines are locked after the first measurement.</p></section><section class="panel"><h3>Opportunity decision rule</h3><p class="record-desc">Priority = (value + business impact) ÷ effort. Now at ${S.prop('priority_now')} or more, Next from ${S.prop('priority_next')} to below ${S.prop('priority_now')}, Later below ${S.prop('priority_next')}. Rejected and done opportunities are never reopened by later runs; a rejection needs a reason.</p></section></div>`
    + sectionHead('Prioritized improvement work', list.length + ' opportunities · highest priority first. Select a row to accept, reject, assign or change scores.', `<button class="btn" data-action="scrollOutcomes">Outcome register</button>${filtered ? '<button class="btn" data-action="clearVo">Clear filters</button>' : ''}`)
    + `<div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Opportunity</th><th scope="col">Linked outcome</th><th scope="col">Capability</th><th scope="col">Value · Impact · Effort</th><th scope="col">Priority</th><th scope="col">Roadmap</th><th scope="col">State</th></tr></thead><tbody>
 ${oppPage.items.map(o => { const oc = o.outcome ? S.outcome(o.outcome) : null; return `<tr class="rowlink" data-opp="${o.number}" tabindex="0"><td><b>${esc(o.typeLabel)}: ${esc(o.description)}</b><div class="cellsub">${esc(o.number)} · ${esc(o.assignedName || 'Unassigned')}${o.stale ? ' · ! stale data' : ''}</div></td><td>${oc ? esc(oc.kpi) : '<span class="muted">—</span>'}</td><td>${esc(o.capabilityName)}<div class="cellsub">${esc(famLabel(o.family))}</div></td><td>${o.value} · ${o.business_impact == null ? '—' : o.business_impact} · ${o.effort}</td><td><b>${F.pri(o.priority)}</b></td><td>${S.isActive(o.state) ? phasePill(o.phase) : '<span class="muted">—</span>'}</td><td>${statePill(o.state)}</td></tr>`; }).join('') || `<tr><td colspan="7"><div class="empty-state"><b>No opportunities match these filters.</b> <button class="btn" data-action="clearVo">Clear filters</button></div></td></tr>`}
 </tbody></table></div>${pagerMarkup('voOpps', oppPage, 'opportunities')}</div>`
    + `<div id="outcomeRegister">${sectionHead('Business outcomes', 'Objectives, KPIs and targets owned by the business. Status is calculated by each assessment run.', `<label class="field inline">Status<select id="voOutStatus">${[['all', 'All statuses'], ['improved', 'Improved'], ['on_target', 'On target'], ['below_target', 'Below target'], ['not_measured', 'Not measured']].concat(S.role() === 'business_owner' ? [['mine', 'My outcomes']] : []).map(([val, t]) => `<option value="${val}" ${v.outStatus === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label><button class="btn" data-action="exportOutcomes">Export ↓</button>`)}</div>`
    + `<div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Objective · KPI</th><th scope="col">Capability</th><th scope="col">Owner</th><th scope="col">Baseline</th><th scope="col">Current</th><th scope="col">Target</th><th scope="col">Improvement</th><th scope="col">Status</th></tr></thead><tbody>${outcomePage.items.map(o => `<tr class="rowlink" data-out="${o.id}" tabindex="0"><td><b>${esc(o.objective)}</b><div class="cellsub">${esc(o.kpi)} · ${esc(L.direction[o.direction])}</div></td><td>${esc(o.capabilityName)}</td><td>${esc(o.ownerName)}</td><td>${F.num(o.baseline, 1)}</td><td>${F.num(o.current_value, 1)}</td><td>${F.num(o.target, 1)}</td><td>${o.improvement == null ? '—' : F.num(o.improvement, 1) + '%'}</td><td>${outPill(o.status)}</td></tr>`).join('') || '<tr><td colspan="8"><div class="empty-state"><b>No outcomes with this status.</b></div></td></tr>'}</tbody></table></div>${pagerMarkup('voOutcomes', outcomePage, 'outcomes')}</div>`
    + `<div class="detail-grid" style="margin-top:12px"><section class="panel"><h3>Outcome owners</h3><div class="detailfacts" style="margin-top:12px">${Object.keys(owners).map(u => `<span>${esc(F.user(u))}</span><b>${owners[u].n} outcome${owners[u].n > 1 ? 's' : ''}${owners[u].below ? ' · ' + owners[u].below + ' below target' : ''}</b>`).join('')}</div></section><section class="panel"><h3>The six gap rules</h3>${[['Shelfware', 'Licensed but not installed.'], ['Idle licences', 'Utilization below ' + S.prop('utilization_threshold') + '%.'], ['Low adoption', 'Score below ' + lo() + ', unless low volume is expected.'], ['Not measured', 'No measure or no target.'], ['Weak outcome', 'Score ' + hi() + ' or more but the outcome is below target.'], ['Adoption potential', 'Score below ' + lo() + ' on an important objective.']].map(r => `<div class="rule-row"><b>${r[0]}</b><span>${esc(r[1])}</span></div>`).join('')}</section></div>`;
}

/* =====================================================================
   MODALS
   ===================================================================== */
let modal = null; // { el, render, wire, live, opener }
const ai = {}; // AI answers per opportunity number, kept while the page is open
function openModal(o) {
  closeModal(true);
  const wrap = document.createElement('div'); wrap.className = 'modal-backdrop'; wrap.innerHTML = `<div class="modal ${o.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-body"></div></div>`;
  document.body.appendChild(wrap);
  modal = Object.assign({ el: wrap, opener: document.activeElement }, o);
  wrap.addEventListener('mousedown', e => { if (e.target === wrap) closeModal(); });
  drawModal(true);
}
function drawModal(first) {
  if (!modal) return; const body = modal.el.querySelector('.modal-body'), scroll = body.scrollTop;
  const active = document.activeElement && document.activeElement.id;
  body.innerHTML = `<div class="modal-head"><div><div class="eyebrow">${modal.eyebrow ? modal.eyebrow() : ''}</div><h2 id="modalTitle">${modal.title()}</h2></div><button class="drawer-close" data-action="closeModal" aria-label="Close dialog">×</button></div>` + modal.render();
  if (modal.wire) modal.wire(body);
  body.scrollTop = scroll;
  if (first) { const f = body.querySelector('[autofocus]') || body.querySelector('.modal-head + * button, .modal-head + * input, .modal-head + * select, textarea, input, select, button:not([data-action="closeModal"])') || body.querySelector('button'); if (f) f.focus(); }
  else if (active && $(active)) $(active).focus();
}
function closeModal(silent) { if (!modal) return; const op = modal.opener; modal.el.remove(); modal = null; if (!silent && op && document.body.contains(op)) op.focus(); }
document.addEventListener('keydown', e => {
  if (!modal) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
  if (e.key === 'Tab') {
    const f = [...modal.el.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]')].filter(x => x.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
function aiBlock(inner) { return `<div class="ai-block"><div class="ai-label">${esc(AI.label)} · ${esc(AI.stamp())}</div>${inner}<div class="ai-foot">Review before use. AI never changes PIVOT numbers itself.</div></div>`; }

/* ----- opportunity ----- */
function openOpp(num) {
  const m = { reject: false, errors: {}, scores: null };
  openModal({
    wide: true, live: 'opportunity',
    eyebrow: () => { const x = S.opportunity(num); return esc(famLabel(x.family).toUpperCase()) + ' / OPPORTUNITY ' + esc(num); },
    title: () => { const x = S.opportunity(num); return esc(x.typeLabel) + ' · ' + esc(x.capabilityName); },
    render: () => {
      const x = S.opportunity(num), c = x.capabilityRecord, work = S.can('opportunity.work'), A = ai[num] || {};
      const sc = m.scores || { value: x.value, business_impact: x.business_impact, effort: x.effort }, pv = S.preview(sc);
      const active = S.isActive(x.state);
      const analysts = S.users().filter(u => u.role === 'analyst' || u.role === 'admin');
      return `<p class="record-desc" style="font-size:12px">${esc(x.description)}</p><div class="pillrow">${statePill(x.state)}${active ? phasePill(x.phase) : ''}<span class="pill">${esc(x.typeLabel)}</span></div>
 ${x.stale ? `<div class="opportunity">! ${esc(x.staleNote)}. Check the source data before acting on this finding.</div>` : ''}${x.state === 'rejected' ? `<div class="opportunity">Rejected: ${esc(x.rejection_reason)}</div>` : ''}
 <div class="detail-grid" style="margin-top:12px"><section class="panel"><h3>Priority</h3><div class="bigscore">${F.pri(x.priority)}<span> ${active ? '→ ' + esc(x.phaseLabel) : ''}</span></div><p class="record-desc">${esc(x.priority_reason)}</p>
 ${work && active ? `<form id="scoreForm" class="formgrid three" novalidate>${inField('Value (1–5)', 'value', sc.value, m.errors, { type: 'number' })}${inField('Business impact (0–5)', 'business_impact', sc.business_impact, m.errors, { type: 'number' })}${inField('Effort (1–5)', 'effort', sc.effort, m.errors, { type: 'number' })}<div class="wide preview-line" role="status" aria-live="polite">${pv ? 'Preview: ' + esc(pv.reason) + ' → ' + esc(L.phase[pv.phase]) : 'Enter whole numbers to preview the priority.'}</div><div class="formactions wide"><button class="btn primary" type="submit">Save scores</button>${m.scores ? '<button class="btn" type="button" data-action="resetScores">Undo changes</button>' : ''}</div></form>` : `<div class="detailfacts"><span>Value</span><b>${x.value}</b><span>Business impact</span><b>${x.business_impact == null ? '— (no outcome data, not counted)' : x.business_impact}</b><span>Effort</span><b>${x.effort}</b></div>${!work ? `<p class="record-desc">${esc(why('opportunity.work'))}</p>` : ''}`}</section>
 <section class="panel"><h3>Record</h3><div class="detailfacts"><span>Capability</span><b><button class="linkbtn" data-cap-open="${c.id}">${esc(c.name)}</button></b><span>Score</span><b>${F.score(c.score)} (${esc(BAND[bandOf(c)].label)})</b><span>Utilization</span><b>${F.pct(c.utilization)}</b><span>Linked outcome</span><b>${x.outcomeRecord ? `<button class="linkbtn" data-out="${x.outcomeRecord.id}">${esc(x.outcomeRecord.kpi)}</button>` : '—'}</b>${x.groupName ? `<span>Assignment group</span><b>${esc(x.groupName)}</b>` : ''}<span>Assigned to</span><b>${esc(x.assignedName || 'Unassigned')}</b><span>Raised by</span><b><button class="linkbtn" data-asm="${esc(x.assessment)}">${esc(x.assessment)}</button></b><span>Updated</span><b>${esc(F.dateTime(x.updated))}</b></div>
 ${work && active ? `<div class="assign-row"><label class="field">Assign to<select id="assignSel"><option value="">Unassigned</option>${analysts.map(u => `<option value="${u.id}" ${x.assigned_to === u.id ? 'selected' : ''}>${esc(u.name)} · ${esc(u.title)}</option>`).join('')}</select></label><button class="btn" data-action="assign">Assign</button></div>` : ''}</section></div>
 ${work && active ? `<div class="actionbar">${x.state === 'open' ? '<button class="btn primary" data-action="accept">Accept</button>' : ''}${x.state === 'accepted' ? '<button class="btn primary" data-action="start">Start work</button><button class="btn" data-action="done">Close as done</button>' : ''}${x.state === 'in_progress' ? '<button class="btn primary" data-action="done">Close as done</button>' : ''}<button class="btn" data-action="toggleReject" aria-expanded="${m.reject}">Reject…</button></div>
 ${m.reject ? `<form id="rejectForm" class="reject-form" novalidate>${inField('Reason for rejecting (required, at least 10 characters)', 'rejection_reason', m.reason || '', m.errors, { area: true, wide: true, ph: 'e.g. Licences are reserved for the Q1 onboarding wave.' })}<div class="formactions"><button class="btn primary" type="submit">Reject opportunity</button><button class="btn" type="button" data-action="toggleReject">Cancel</button></div></form>` : ''}` : ''}${work && (x.state === 'done' || x.state === 'rejected') ? '<div class="actionbar"><button class="btn" data-action="reopen">Reopen</button><span class="muted">Done and rejected opportunities can only be reopened. Later runs never reopen them.</span></div>' : ''}
 ${AI.enabled() ? `<section class="panel" style="margin-top:12px"><div class="panelhead"><div><h3>AI assistance</h3><div class="paneldesc">Now Assist · suggestions only</div></div></div><div class="subnav"><button data-action="aiExplain">Explain this finding</button>${gated('ai.suggest', '<button data-action="aiScores">Suggest scores</button>')}${gated('ai.suggest', '<button data-action="aiOwners">Suggest owner</button>')}${gated('ai.suggest', '<button data-action="aiPlan">Draft action plan</button>')}</div>
 ${A.explain ? aiBlock(`<p><b>What:</b> ${esc(A.explain.what)}</p><p><b>Why it matters:</b> ${esc(A.explain.why)}</p><p><b>Suggested next step:</b> ${esc(A.explain.next)}</p>`) : ''}
 ${A.scores ? aiBlock(`<div class="detailfacts"><span>Value ${A.scores.value}</span><b>${esc(A.scores.reasons.value)}</b><span>Impact ${A.scores.business_impact}</span><b>${esc(A.scores.reasons.business_impact)}</b><span>Effort ${A.scores.effort}</span><b>${esc(A.scores.reasons.effort)}</b></div>${work && active ? '<button class="btn" data-action="useScores">Put these in the form</button>' : ''}`) : ''}
 ${A.owners ? aiBlock(A.owners.length ? `<div class="mini-list">${A.owners.map(u => `<div class="owner-row"><span><b>${esc(u.name)}</b><span>${esc(u.reason)}</span></span>${work && active ? `<button class="btn" data-assign-to="${u.user}">Assign</button>` : ''}</div>`).join('')}</div>` : '<p>No other suitable owner found.</p>') : ''}
 ${A.plan ? aiBlock(`<ol class="plan">${A.plan.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>${work ? '<button class="btn" data-action="planNote">Add plan as a note</button>' : ''}`) : ''}</section>` : ''}
 <section class="panel" style="margin-top:12px"><h3>Activity</h3><div class="activity">${x.activity.slice().reverse().map(a => `<div class="activity-row ${a.note ? 'note' : ''}"><b>${esc(F.user(a.user))}</b><span>${esc(a.text)}</span><time>${esc(F.dateTime(a.ts))}</time></div>`).join('')}</div>
 ${work ? `<form id="noteForm" class="note-form"><label class="field wide">Add a note<textarea id="noteText" rows="2" placeholder="Visible to everyone who can read this opportunity"></textarea></label><button class="btn" type="submit">Add note</button></form>` : ''}</section>`;
    },
    wire: body => {
      const f = body.querySelector('#scoreForm');
      if (f) {
        f.addEventListener('input', () => { m.scores = { value: f.value.value, business_impact: f.business_impact.value, effort: f.effort.value }; const pv = S.preview(m.scores); f.querySelector('.preview-line').textContent = pv && +m.scores.effort <= 5 ? 'Preview: ' + pv.reason + ' → ' + L.phase[pv.phase] : 'Enter whole numbers to preview the priority.'; });
        f.addEventListener('submit', e => { e.preventDefault(); S.editScores(num, { value: f.value.value, business_impact: f.business_impact.value, effort: f.effort.value }).then(r => { if (r.ok) { m.scores = null; m.errors = {}; notify('Scores saved. ' + S.opportunity(num).priority_reason); drawModal(); } else { m.errors = r.errors || {}; if (r.error) notify(r.error, 'error'); drawModal(); } }); });
      }
      const rf = body.querySelector('#rejectForm');
      if (rf) {
        rf.rejection_reason.addEventListener('input', e => { m.reason = e.target.value; });
        rf.addEventListener('submit', e => { e.preventDefault(); S.reject(num, rf.rejection_reason.value).then(r => { if (r.ok) { m.reject = false; m.errors = {}; notify(r.note); drawModal(); } else { m.errors = r.errors || {}; if (r.error) notify(r.error, 'error'); drawModal(); const t = $('f-rejection_reason'); if (t) t.focus(); } }); });
      }
      const nf = body.querySelector('#noteForm'); if (nf) nf.addEventListener('submit', e => { e.preventDefault(); result(S.addNote(num, $('noteText').value), 'Note added.'); });
      body.onclick = e => {
        const b = e.target.closest('button'); if (!b || b.disabled) return; const a = b.dataset.action;
        if (a === 'accept') result(S.accept(num), 'Accepted. It stays on the roadmap until it is closed as done.');
        else if (a === 'done') result(S.markDone(num), 'Closed as done.');
        else if (a === 'start') result(S.startWork(num), 'Work started. The opportunity is now In progress.');
        else if (a === 'reopen') result(S.reopen(num), 'Reopened. The opportunity is New again.');
        else if (a === 'toggleReject') { m.reject = !m.reject; m.errors = {}; drawModal(); if (m.reject && $('f-rejection_reason')) $('f-rejection_reason').focus(); }
        else if (a === 'assign') result(S.assign(num, $('assignSel').value), 'Assignment saved.');
        else if (b.dataset.assignTo) result(S.assign(num, b.dataset.assignTo), 'Assigned to ' + F.user(b.dataset.assignTo) + '.');
        else if (a === 'resetScores') { m.scores = null; m.errors = {}; drawModal(); }
        else if (a === 'aiExplain') { ai[num] = Object.assign(ai[num] || {}, { explain: AI.explain(num) }); drawModal(); }
        else if (a === 'aiScores') { ai[num] = Object.assign(ai[num] || {}, { scores: AI.suggestScores(num) }); drawModal(); }
        else if (a === 'aiOwners') { ai[num] = Object.assign(ai[num] || {}, { owners: AI.suggestOwners(num) }); drawModal(); }
        else if (a === 'aiPlan') { ai[num] = Object.assign(ai[num] || {}, { plan: AI.draftPlan(num) }); drawModal(); }
        else if (a === 'useScores') { const s = ai[num].scores; m.scores = { value: s.value, business_impact: s.business_impact, effort: s.effort }; drawModal(); notify('Suggested scores are in the form. Save to apply them.'); }
        else if (a === 'planNote') result(S.addNote(num, 'Action plan (AI draft, reviewed): ' + ai[num].plan.steps.map((s, i) => (i + 1) + '. ' + s).join(' ')), 'Plan added as a note.');
      };
    }
  });
}

/* ----- business outcome (view, edit, create) ----- */
function openOutcome(id) {
  const isNew = id === 'new'; let draft = null, errors = {}, savedId = isNew ? null : id;
  openModal({
    wide: true, live: 'outcome',
    eyebrow: () => savedId ? 'BUSINESS OUTCOME' : 'NEW BUSINESS OUTCOME',
    title: () => savedId ? esc(S.outcome(savedId).objective) : 'Create a business outcome',
    render: () => {
      const o = savedId ? S.outcome(savedId) : null;
      const canEdit = o ? S.can('outcome.edit', o) : S.can('outcome.create'), admin = S.can('outcome.baseline');
      const d = draft || (o ? Object.assign({}, o) : { capability: '', objective: '', kpi: '', direction: 'higher_better', measurement_type: 'calculated', kpi_table: '', kpi_filter: '', kpi_aggregate: 'count', target: '', period: 'monthly', expected_benefit: '', important_objective: false, low_volume_expected: false, owner: S.role() === 'business_owner' ? S.user().id : DATA.personas.business_owner });
      const capOpts = [['', 'Choose a capability…']].concat(S.capabilities({ view: 'active' }).map(c => [c.id, c.name]));
      const lockedBaseline = o && o.baselineLocked;
      return `${o ? `<div class="pillrow">${outPill(o.status)}<span class="pill">${esc(L.direction[o.direction])}</span><span class="pill">Owner · ${esc(o.ownerName)}</span></div>` : ''}
 ${o ? `<div class="metricstrip" style="margin:12px 0">${miniMetric('BASELINE', F.num(o.baseline, 1), o.baseline_date ? 'Locked since ' + esc(F.date(o.baseline_date)) : 'Set by the first measurement')}${miniMetric('CURRENT', F.num(o.current_value, 1), 'From ' + esc(S.latest().number))}${miniMetric('IMPROVEMENT', o.improvement == null ? '—' : F.num(o.improvement, 1) + '%', 'Target ' + F.num(o.target, 1), o.improvement == null ? 0 : o.improvement)}</div>` : '<p class="record-desc">New outcomes show Not measured until the next assessment run reads the KPI. The first measured value becomes the baseline and is then locked.</p>'}
 ${!canEdit ? `<p class="record-desc"><b>Read-only.</b> ${o ? (S.role() === 'business_owner' ? 'You can only edit outcomes you own.' : 'Business owners edit their own outcomes; admins can edit all.') : esc(why('outcome.create'))}</p>` : ''}
 <form id="outForm" class="formgrid" novalidate>
 ${inField('Capability', 'capability', d.capability, errors, { disabled: !canEdit, select: capOpts })}${inField('Period', 'period', d.period, errors, { disabled: !canEdit, select: Object.keys(L.period).map(k => [k, L.period[k]]) })}
 ${inField('Objective — what the business wants', 'objective', d.objective, errors, { disabled: !canEdit, wide: true })}
 ${inField('KPI', 'kpi', d.kpi, errors, { disabled: !canEdit })}${inField('Direction', 'direction', d.direction, errors, { disabled: !canEdit, select: Object.keys(L.direction).map(k => [k, L.direction[k]]) })}
 ${inField('Measurement type', 'measurement_type', d.measurement_type, errors, { disabled: !canEdit, select: Object.keys(L.measurement).map(k => [k, L.measurement[k]]) })}${inField('Aggregate', 'kpi_aggregate', d.kpi_aggregate, errors, { disabled: !canEdit || d.measurement_type !== 'calculated', select: [['count', 'Count'], ['sum', 'Sum'], ['avg', 'Average']] })}
 ${inField('KPI table', 'kpi_table', d.kpi_table, errors, { disabled: !canEdit || d.measurement_type !== 'calculated', ph: 'e.g. incident' })}${inField('KPI filter (encoded query)', 'kpi_filter', d.kpi_filter, errors, { disabled: !canEdit || d.measurement_type !== 'calculated' })}
 ${d.measurement_type === 'calculated' && d.kpi_aggregate !== 'count' ? inField('Field to ' + (d.kpi_aggregate === 'sum' ? 'sum' : 'average'), 'kpi_field', d.kpi_field, errors, { disabled: !canEdit, ph: 'e.g. business_duration', wide: true }) : ''}
 ${d.measurement_type === 'manual' ? inField('Manual value', 'manual_value', d.manual_value, errors, { type: 'number', step: 'any', disabled: !canEdit, help: o && o.manual_value_by ? 'Entered by ' + F.user(o.manual_value_by) : 'Used by the next assessment run.' }) + inField('Value date', 'manual_value_date', d.manual_value_date, errors, { type: 'date', disabled: !canEdit, help: 'The date the value applies to. Not in the future.' }) : ''}
 ${inField('Baseline', 'baseline', d.baseline, errors, { type: 'number', step: 'any', disabled: !canEdit || (lockedBaseline && !admin), help: !o || !lockedBaseline ? 'Optional starting value. Leave empty and the first measurement sets it. Locked once set.' : admin ? 'Locked. As admin you can change it; the change is audited.' : 'Locked after the first measurement. Only admins can change it.' })}${inField('Target', 'target', d.target, errors, { type: 'number', step: 'any', disabled: !canEdit })}
 ${o && lockedBaseline && admin ? inField('Reason for change (required when you change the baseline)', 'baseline_change_reason', d.baseline_reason_new || '', errors, { wide: true, ph: 'e.g. Baseline measured before the new category was introduced' }) : ''}
 ${inField('Expected benefit', 'expected_benefit', d.expected_benefit, errors, { disabled: !canEdit, wide: true })}
 <label class="check"><input type="checkbox" name="important_objective" ${d.important_objective ? 'checked' : ''} ${canEdit ? '' : 'disabled'}> Important objective <small>(low usage then raises Adoption potential)</small></label><label class="check"><input type="checkbox" name="low_volume_expected" ${d.low_volume_expected ? 'checked' : ''} ${canEdit ? '' : 'disabled'}> Low volume expected <small>(skips the Low adoption rule)</small></label>
 ${canEdit ? `<div class="formactions wide"><button class="btn primary" type="submit">${savedId ? 'Save outcome' : 'Create outcome'}</button><button class="btn" type="button" data-action="closeModal">Cancel</button></div>` : ''}</form>
 ${o ? `<section class="panel" style="margin-top:12px"><h3>KPI by run</h3><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Assessment</th><th scope="col">Date</th><th scope="col">Actual</th><th scope="col">Improvement</th><th scope="col">Status</th></tr></thead><tbody>${o.results.map(r => `<tr><td>${esc(r.assessment)}</td><td>${esc(F.date(r.date))}</td><td>${F.num(r.actual, 1)}</td><td>${r.improvement == null ? '—' : F.num(r.improvement, 1) + '%'}</td><td>${outPill(r.status)}</td></tr>`).join('')}</tbody></table></div>${o.baseline_change_reason ? `<p class="record-desc">${esc(o.baseline_change_reason)} (audited)</p>` : ''}</section>` : ''}`;
    },
    wire: body => {
      const f = body.querySelector('#outForm'); if (!f) return;
      const read = () => ({ id: savedId || undefined, capability: f.capability.value, objective: f.objective.value, kpi: f.kpi.value, direction: f.direction.value, measurement_type: f.measurement_type.value, kpi_table: f.kpi_table.value, kpi_filter: f.kpi_filter.value, kpi_aggregate: f.kpi_aggregate.value, kpi_field: f.kpi_field ? f.kpi_field.value : undefined, manual_value: f.manual_value ? f.manual_value.value : undefined, manual_value_date: f.manual_value_date ? f.manual_value_date.value : undefined, baseline_change_reason: f.baseline_change_reason ? f.baseline_change_reason.value : undefined, baseline_reason_new: f.baseline_change_reason ? f.baseline_change_reason.value : undefined, baseline: f.baseline.disabled ? undefined : f.baseline.value, target: f.target.value, period: f.period.value, expected_benefit: f.expected_benefit.value, important_objective: f.important_objective.checked, low_volume_expected: f.low_volume_expected.checked });
      f.measurement_type.addEventListener('change', () => { draft = read(); drawModal(); });
      f.kpi_aggregate.addEventListener('change', () => { draft = read(); drawModal(); });
      f.addEventListener('submit', e => {
        e.preventDefault(); const v = read(); S.saveOutcome(v).then(r => {
        if (r.ok) { errors = {}; draft = null; savedId = r.id; notify(r.note); drawModal(); }
        else { draft = v; errors = r.errors || {}; if (r.error) notify(r.error, 'error'); drawModal(); const first = body.querySelector('[aria-invalid="true"]'); if (first) first.focus(); } });
      });
    }
  });
}

/* ----- assessment run ----- */
function openAssessment(num) {
  if (!S.assessment(num)) { notify(S.hasRun() ? 'Assessment ' + num + ' was not found.' : 'No assessment has run yet.', 'error'); return; }
  const m = { brief: null };
  openModal({
    wide: true, live: 'run',
    eyebrow: () => 'ASSESSMENT RUN',
    title: () => esc(num),
    render: () => {
      const a = S.assessment(num), steps = a.log.length ? Math.max(...a.log.map(l => l.step)) : 0;
      const warn = a.log.filter(l => l.level === 'warn').length, err = a.log.filter(l => l.level === 'error').length;
      return `<div class="pillrow">${runPill(a.status)}<span class="pill">${esc(a.trigger)}</span><span class="pill">Run by ${esc(a.byName)}</span></div>
 ${a.status === 'running' || a.status === 'queued' ? `<div class="run-progress" role="status" aria-live="polite"><b>Step ${steps} of 10</b> · ${esc(a.log[a.log.length - 1].message)}<div class="progressline"><i style="width:${steps * 10}%"></i></div><small>Runs in the background. You can close this window.</small></div>` : ''}
 <div class="metricstrip" style="margin:12px 0">${miniMetric('PLATFORM VALUE SCORE', F.num(a.overall_score, 1), a.previousScore != null && a.overall_score != null ? sign(a.overall_score - a.previousScore) + ' vs previous (' + F.num(a.previousScore, 1) + ')' : a.status === 'failed' ? 'No score — the run failed' : '—')}${miniMetric('CAPABILITIES', a.counts ? a.counts.capabilities : '—', a.counts ? a.counts.scored + ' scored · ' + a.counts.notMeasured + ' not measured · ' + a.counts.low + ' low' : 'Not calculated')}${miniMetric('STARTED', esc(F.dateTime(a.run_date)), 'Duration ' + esc(F.dur(a.duration)) + ' · ' + warn + ' warnings · ' + err + ' errors')}</div>
 ${AI.enabled() && a.status === 'complete' ? `<div class="subnav"><button data-action="brief">${m.brief ? 'Refresh briefing' : 'Generate assessment briefing'}</button></div>${m.brief ? aiBlock(`<p><b>${esc(m.brief.headline)}</b></p><ul>${m.brief.changed.map(t => `<li>${esc(t)}</li>`).join('')}</ul><p><b>In Now:</b></p><ul>${m.brief.now.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${m.brief.warnings.length ? `<p><b>Data warnings:</b> ${m.brief.warnings.map(esc).join(' ')}</p>` : ''}`) : ''}` : ''}
 <section class="panel" style="margin-top:12px"><h3>Step log</h3><div class="table-wrap"><table class="table log"><thead><tr><th scope="col">Time</th><th scope="col">Step</th><th scope="col">Level</th><th scope="col">Message</th></tr></thead><tbody>${a.log.map(l => `<tr class="lvl-${l.level}"><td>${esc(F.time(l.ts))}</td><td>${l.step}</td><td><span class="pill ${l.level === 'error' ? 'bad' : l.level === 'warn' ? 'warn' : ''}">${esc(l.level)}</span></td><td>${esc(l.message)}</td></tr>`).join('')}</tbody></table></div></section>`;
    },
    wire: body => { body.onclick = e => { const b = e.target.closest('button'); if (b && b.dataset.action === 'brief') { m.brief = AI.briefing(num); drawModal(); } }; }
  });
}
function confirmRunNow() {
  if (!S.can('assessment.run')) { notify(why('assessment.run'), 'error'); return; }
  let err = '';
  openModal({
    eyebrow: () => 'RUN NOW', title: () => 'Start an assessment now?', live: 'run',
    render: () => { const r = S.running(); return `<p class="record-desc" style="font-size:12px">PIVOT runs the same 10 steps as the weekly job (Sunday 02:00): discovery, usage measurement, scoring, utilization, outcomes, the six gap rules, priority and the roadmap. It runs in the background and emails ${esc(S.prop('admin_group'))} when it finishes. Only one assessment can run at a time.</p>${r ? `<div class="opportunity">! ${esc(r.number)} is already running (step ${Math.max(...r.log.map(l => l.step))} of 10).</div>` : ''}${err ? `<div class="formerror" role="alert">${esc(err)}</div>` : ''}<div class="formactions"><button class="btn primary" data-action="startRun" autofocus>Start assessment</button><button class="btn" data-action="closeModal">Cancel</button></div>`; },
    wire: body => { body.onclick = e => { const b = e.target.closest('button'); if (b && b.dataset.action === 'startRun') { S.runNow().then(r => { if (r.ok) { closeModal(); notify(r.number + ' started. Progress is shown live.'); openAssessment(r.number); } else { err = r.error; drawModal(); } }); } }; }
  });
}
function openSchedule() {
  const n = new Date(S.now()), next = new Date(S.now()); const day = n.getUTCDay(); next.setUTCDate(n.getUTCDate() + ((7 - day) % 7 || 7)); next.setUTCHours(0, 0, 0, 0); // Sunday 02:00 CEST
  openModal({ eyebrow: () => 'SCHEDULE', title: () => 'Weekly assessment', render: () => !S.engineAvailable() ? `<p class="record-desc">The weekly assessment job ("PIVOT weekly assessment", every Sunday at 02:00) is installed with the assessment engine in Sprint 4. Until then no runs are scheduled and the screens show the data already in the PIVOT tables.</p><div class="formactions"><button class="btn" data-action="closeModal">Close</button></div>` : `<div class="detailfacts"><span>Schedule</span><b>Every Sunday at 02:00 (scheduled job "PIVOT weekly assessment")</b><span>Next run</span><b>${esc(F.dateTime(next.getTime()))}</b><span>Emails</span><b>"PIVOT run complete" or "PIVOT run failed" to ${esc(S.prop('admin_group'))}</b><span>Overlap</span><b>A run is skipped while another one is running</b></div><p class="record-desc">The schedule is a ServiceNow scheduled job. Admins change it in the instance, not in this screen. Use Run Now for an extra run.</p><div class="formactions">${gated('assessment.run', '<button class="btn primary" data-action="runNow">Run now instead…</button>')}<button class="btn" data-action="closeModal">Close</button></div>` });
}

/* ----- evidence (results history of one capability) ----- */
function openEvidence(id) {
  openModal({ wide: true, eyebrow: () => 'EVIDENCE · ' + esc(S.capability(id).number), title: () => esc(S.capability(id).name), render: () => { const c = S.capability(id); return `<p class="record-desc">One result per assessment run: licensed, installed, actual usage, target, score and utilization at that time.</p><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Assessment</th><th scope="col">Date</th><th scope="col">Licensed</th><th scope="col">Installed</th><th scope="col">Actual</th><th scope="col">Target</th><th scope="col">Score</th><th scope="col">Utilization</th></tr></thead><tbody>${c.results.map(r => `<tr><td><button class="linkbtn" data-asm="${esc(r.assessment)}">${esc(r.assessment)}</button></td><td>${esc(F.date(r.date))}</td><td>${r.licensed ? 'Yes' : 'No'}</td><td>${r.installed ? 'Yes' : 'No'}</td><td>${F.num(r.actual)}</td><td>${F.num(r.target)}</td><td><b>${F.score(r.score)}</b></td><td>${F.pct(r.utilization)}</td></tr>`).join('')}</tbody></table></div>`; } });
}

/* ----- needs mapping (admin) ----- */
function openMapping() {
  let err = '', chosen = new Set();
  openModal({
    wide: true, eyebrow: () => 'ADMIN · NEEDS MAPPING', title: () => 'Set product family', live: 'capability',
    render: () => { const list = S.capabilities({ view: 'needs_mapping' }); return list.length ? `<p class="record-desc">These capabilities have no product family, so they do not appear in family reports. Select them and choose a family.</p><div class="table-wrap"><table class="table"><thead><tr><th scope="col"><input type="checkbox" id="mapAll" aria-label="Select all" ${chosen.size === list.length ? 'checked' : ''}></th><th scope="col">Capability</th><th scope="col">Source</th><th scope="col">Scope</th></tr></thead><tbody>${list.map(c => `<tr><td><input type="checkbox" class="mapChk" value="${c.id}" aria-label="Select ${esc(c.name)}" ${chosen.has(c.id) ? 'checked' : ''}></td><td><b>${esc(c.name)}</b><div class="cellsub">${esc(c.number)}</div></td><td>${esc(c.sourceLabel)}</td><td>${esc(c.scope)}</td></tr>`).join('')}</tbody></table></div><div class="assign-row"><label class="field">Product family<select id="mapFamily"><option value="">Choose…</option>${DATA.families.map(f => `<option value="${f.value}">${esc(f.label)}</option>`).join('')}</select></label><button class="btn primary" data-action="applyMap">Set family for ${chosen.size} selected</button></div>${err ? `<div class="formerror" role="alert">${esc(err)}</div>` : ''}` : '<div class="empty-state"><b>Every capability has a product family.</b></div>'; },
    wire: body => {
      body.onchange = e => { if (e.target.id === 'mapAll') { const l = S.capabilities({ view: 'needs_mapping' }); chosen = e.target.checked ? new Set(l.map(c => c.id)) : new Set(); drawModal(); } else if (e.target.classList.contains('mapChk')) { e.target.checked ? chosen.add(e.target.value) : chosen.delete(e.target.value); drawModal(); } };
      body.onclick = e => { const b = e.target.closest('button'); if (b && b.dataset.action === 'applyMap') { if (!chosen.size) { err = 'Select at least one capability.'; drawModal(); return; } const fam = $('mapFamily').value; S.mapFamily([...chosen], fam).then(r => { if (r.ok) { err = ''; notify(r.count + ' capabilities mapped to ' + L.family[fam] + '.'); chosen = new Set(); drawModal(); } else { err = r.error; drawModal(); } }); } };
    }
  });
}

/* ----- global search ----- */
function openSearch(q) {
  openModal({
    wide: true, eyebrow: () => 'SEARCH', title: () => 'Results for “' + esc(q) + '”',
    render: () => {
      const t = q.toLowerCase(), caps = S.capabilities({ q, view: 'all' }), opps = S.opportunities({ q, state: 'all' }), outs = S.outcomes().filter(o => (o.objective + ' ' + o.kpi + ' ' + o.capabilityName).toLowerCase().includes(t)), runs = S.assessments().filter(a => a.number.toLowerCase().includes(t));
      const grp = (title, items) => items.length ? `<h3 class="search-h">${title} <span class="muted">${items.length}</span></h3><div class="mini-list">${items.join('')}</div>` : '';
      const html = grp('Capabilities', caps.slice(0, 8).map(c => `<button data-cap-open="${c.id}"><b>${esc(c.name)}</b><span>${esc(c.number)} · ${esc(famLabel(c.family))} · score ${F.score(c.score)}</span></button>`))
        + grp('Opportunities', opps.slice(0, 8).map(o => `<button data-opp="${o.number}"><b>${esc(o.number)} · ${esc(o.capabilityName)}</b><span>${esc(o.typeLabel)} · ${esc(o.stateLabel)} · priority ${F.pri(o.priority)}</span></button>`))
        + grp('Business outcomes', outs.slice(0, 8).map(o => `<button data-out="${o.id}"><b>${esc(o.kpi)}</b><span>${esc(o.objective)} · ${esc(o.statusLabel)}</span></button>`))
        + grp('Assessments', runs.slice(0, 8).map(a => `<button data-asm="${esc(a.number)}"><b>${esc(a.number)}</b><span>${esc(F.dateTime(a.run_date))} · ${esc(L.status[a.status])}</span></button>`));
      return html || `<div class="empty-state"><b>Nothing matches “${esc(q)}”.</b><p class="record-desc">Search by capability name, PVC/PVO/PVA number, scope, table or KPI.</p></div>`;
    }
  });
}

/* ----- Ask PIVOT (FR-AI) ----- */
function openAsk() {
  let answer = null, lastQ = '';
  openModal({
    eyebrow: () => 'ASK PIVOT', title: () => 'Ask a question about this instance',
    render: () => AI.enabled() ? `<form id="askForm" class="assign-row"><label class="field" style="flex:1">Question<input id="askInput" value="${esc(lastQ)}" placeholder="How are we doing?" autofocus></label><button class="btn primary" type="submit">Ask</button></form><div class="chips">${['How are we doing?', 'Which licences are we not using?', 'What is assigned to me?', 'When did PIVOT last run?', 'What is not measured?', 'What should we do first?'].map(s => `<button class="chip" data-ask="${esc(s)}">${esc(s)}</button>`).join('')}</div>${answer ? (answer.ok ? aiBlock(`<p>${esc(answer.answer)}</p>${answer.items.length ? `<div class="mini-list">${answer.items.map(i => `<button ${/^PVO/.test(i.ref) ? 'data-opp' : 'data-cap-open'}="${esc(i.ref)}"><b>${esc(i.ref)}</b><span>${esc(i.label)}</span></button>`).join('')}</div>` : ''}`) : `<p class="record-desc" role="status">${esc(answer.answer)}</p>`) : ''}` : `<p class="record-desc">${esc(why('ai.use'))}</p>`,
    wire: body => {
      const f = body.querySelector('#askForm'); if (f) f.addEventListener('submit', e => { e.preventDefault(); lastQ = $('askInput').value; answer = AI.ask(lastQ); drawModal(); });
      body.onclick = e => { const b = e.target.closest('[data-ask]'); if (b) { lastQ = b.dataset.ask; answer = AI.ask(lastQ); drawModal(); } };
    }
  });
}
function openRules() {
  openModal({ wide: true, eyebrow: () => 'HOW PIVOT CALCULATES', title: () => 'Scores, outcomes and priority', render: () => `<div class="detailfacts"><span>Score</span><b>actual ÷ target × 100, capped at 100</b><span>Licensed, not installed</span><b>Score 0</b><span>No measure or no target</span><b>Not Measured — left empty, never 0, excluded from the platform score</b><span>Platform Value Score</span><b>Σ(score × weight) ÷ Σ(weight) over scored capabilities</b><span>Utilization</span><b>allocated ÷ entitled licences</b><span>Improvement</span><b>(actual − baseline) ÷ (target − baseline)</b><span>Outcome status</span><b>On target when the target is reached; Improved when moving the right way; otherwise Below target</b><span>Priority</span><b>(value × ${S.prop('priority_weight_value')} + business impact × ${S.prop('priority_weight_impact')}) ÷ effort; an empty business impact (no outcome data) is not counted</b><span>Roadmap</span><b>Now ≥ ${S.prop('priority_now')} · Next ${S.prop('priority_next')} to below ${S.prop('priority_now')} · Later below ${S.prop('priority_next')}</b><span>Defaults (value / effort)</span><b>Shelfware 4/3 · Idle licences 4/2 · Low adoption 3/3 · Not measured 2/1 · Weak outcome 4/3 · Adoption potential 4/3 (admins can change these in Settings)</b></div>` });
}

/* =====================================================================
   ROADMAP — Now / Next / Later, built by priority each run
   ===================================================================== */
function roadmapView() {
  const rm = S.roadmap(), r = st.road, canMove = S.can('roadmap.reorder');
  const keep = o => (r.owner === 'all' || (r.owner === 'none' ? !o.assigned_to : o.assigned_to === r.owner)) && (r.family === 'all' || o.family === r.family) && (r.state === 'all' || o.state === r.state);
  const done = S.opportunities({ state: 'done' });
  const maxP = Math.max(1, ...['now', 'next', 'later'].flatMap(p => rm[p].map(o => o.priority)));
  const cols = [
    { key: 'now', name: 'Now', sub: 'priority ≥ ' + S.prop('priority_now'), color: '#c98222', cards: rm.now },
    { key: 'next', name: 'Next', sub: S.prop('priority_next') + ' to below ' + S.prop('priority_now'), color: '#2864e8', cards: rm.next },
    { key: 'later', name: 'Later', sub: 'below ' + S.prop('priority_next'), color: '#7356d9', cards: rm.later },
    { key: 'done', name: 'Closed as done', sub: 'not on the roadmap', color: '#168b69', cards: done }
  ];
  const all = rm.now.concat(rm.next, rm.later), assigned = all.filter(o => o.assigned_to).length;
  const owners = [...new Set(all.map(o => o.assigned_to).filter(Boolean))];
  const filtered = r.owner !== 'all' || r.family !== 'all' || r.state !== 'all';
  return heading('PIVOT / ROADMAP', 'Roadmap', 'New, accepted and in-progress opportunities, highest priority first. Rejected ones never appear. Each assessment run rebuilds the order; analysts can change it until then.', `<button class="btn" data-action="exportRoadmap">Export roadmap ↓</button>${rm.manual ? gated('roadmap.reorder', '<button class="btn primary" data-action="resetRoadmap">Reset to priority order</button>') : ''}`)
    + `<div class="filters"><label class="field">Assigned to<select id="roadOwner"><option value="all">Anyone</option><option value="none" ${r.owner === 'none' ? 'selected' : ''}>Unassigned</option>${owners.map(u => `<option value="${u}" ${r.owner === u ? 'selected' : ''}>${esc(F.user(u))}</option>`).join('')}</select></label><label class="field">Product family<select id="roadFamily"><option value="all">All product families</option>${DATA.families.map(f => `<option value="${f.value}" ${r.family === f.value ? 'selected' : ''}>${esc(f.label)}</option>`).join('')}</select></label><label class="field">State<select id="roadState">${[['all', 'All active'], ['open', 'New'], ['accepted', 'Accepted'], ['in_progress', 'In progress']].map(([v, t]) => `<option value="${v}" ${r.state === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${filtered ? '<button class="btn" data-action="clearRoad" style="align-self:flex-end">Clear filters</button>' : ''}<span class="filters-meta">Built by ${esc(rm.assessment)}${rm.manual ? ' · order changed by hand' : ''}</span></div>`
    + `<div class="kpis">${kpi('IN NOW', rm.now.length, 'Do these first', '!', 'orange')}${kpi('IN NEXT', rm.next.length, 'Plan after Now', '↗', '')}${kpi('IN LATER', rm.later.length, 'Low value for the effort', '◷', 'purple')}${kpi('WITH AN OWNER', assigned + ' / ' + all.length, (all.length - assigned) + ' unassigned', '✓', 'green')}</div>`
    + sectionHead('Roadmap columns', canMove ? 'Use the arrows to change the order inside a column. The next assessment run puts everything back in priority order.' : esc(why('roadmap.reorder')) + ' You can open any item.', `<button class="btn" data-action="exportDecisions">Export decision log</button>`)
    + `<div class="roadmap-board">${cols.map(col => { const cards = col.cards.filter(keep), moreKey = 'road' + col.key[0].toUpperCase() + col.key.slice(1), shown = Math.min(cards.length, st.more[moreKey] || 5), visibleCards = cards.slice(0, shown); return `<section class="road-col" aria-label="${esc(col.name)}"><div class="road-colhead"><span style="color:${col.color}">${esc(col.name)} <small class="muted">· ${esc(col.sub)}</small></span><span class="road-count">${cards.length}</span></div>${visibleCards.map((o, i) => `<article class="road-card">${col.key === 'done' ? '<span class="pill">DONE</span>' : phasePill(col.key)} <span class="seq">#${o.sequence || ''}</span><h4><button class="linkbtn" data-opp="${o.number}">${esc(o.capabilityName)}</button></h4><p>${esc(o.typeLabel)} · ${esc(o.description)}</p><div class="road-meta"><span>${esc(famLabel(o.family))}</span><span>Priority ${F.pri(o.priority)}</span></div><div class="road-progress" title="Priority relative to the highest"><i style="width:${Math.min(100, o.priority / maxP * 100)}%;background:${col.color}"></i></div><div class="road-meta"><span>${esc(o.assignedName || 'Unassigned')} · ${esc(o.stateLabel)}</span>${col.key !== 'done' && canMove && !filtered ? `<span class="movebtns"><button class="iconbtn" data-move="up" data-num="${o.number}" aria-label="Move ${esc(o.capabilityName)} up" title="Move up" ${i === 0 ? 'disabled' : ''}>▲</button><button class="iconbtn" data-move="down" data-num="${o.number}" aria-label="Move ${esc(o.capabilityName)} down" title="Move down" ${i === cards.length - 1 ? 'disabled' : ''}>▼</button></span>` : ''}</div></article>`).join('') || `<div class="emptycol">${filtered ? 'No items match these filters' : (col.key === 'done' ? 'Nothing closed as done yet' : 'No items in ' + esc(col.name) + ' for this assessment')}</div>`}${loadMoreMarkup(moreKey, shown, cards.length, 'cards')}</section>`; }).join('')}</div>`
    + (filtered && canMove ? '<p class="record-desc">Clear the filters to change the order.</p>' : '')
    + `<div class="detail-grid" style="margin-top:14px"><section class="panel"><h3>How the roadmap is built</h3><div class="detailfacts" style="margin-top:12px"><span>Now</span><b>Priority ${S.prop('priority_now')} or more</b><span>Next</span><b>${S.prop('priority_next')} to below ${S.prop('priority_now')}</b><span>Later</span><b>Below ${S.prop('priority_next')}</b><span>Rebuilt</span><b>Every assessment run (step 8)</b><span>Manual order</span><b>Kept until the next run</b></div></section><section class="panel"><h3>Roadmap governance</h3><p class="record-desc">Every item should have an owner. Accept items you will work on; reject the ones you will not, with a reason, so later runs do not raise them again.</p><div class="subnav"><button data-action="showUnassigned">Show unassigned (${all.length - assigned})</button><button data-view="Value & Opportunities">Work opportunities</button><button data-action="exportDecisions">Export decision log</button></div></section></div>`;
}

/* =====================================================================
   ASSESSMENTS
   ===================================================================== */
function assessmentsView() {
  const a = S.latest(), runs = S.assessments(), running = S.running(), caps = S.capabilities({ view: 'active' });
  const inst = caps.filter(c => c.installed), meas = inst.filter(c => c.score != null);
  const famCov = families().filter(f => inst.some(c => c.family === f)).map(f => { const i = inst.filter(c => c.family === f); return [L.family[f], i.filter(c => c.score != null).length, i.length]; });
  const warn = a.log.filter(l => l.level === 'warn'), errs = a.log.filter(l => l.level === 'error'), failed = runs.filter(r => r.status === 'failed');
  const runsPage = pageSlice(runs, 'assessments', 5);
  return heading('PIVOT / ASSESSMENTS', 'Assessments', 'Each run discovers capabilities, measures usage, scores them, reads outcome KPIs, applies the gap rules and rebuilds the roadmap. Weekly on Sunday 02:00, or Run Now.', `<button class="btn" data-action="exportRuns">Export results ↓</button>${gated('assessment.run', `<button class="btn primary" data-action="runNow" ${running ? 'disabled title="' + esc(running.number) + ' is running"' : ''}>+ Run assessment now</button>`)}`)
    + (running ? `<div class="run-progress" role="status" aria-live="polite"><b>${esc(running.number)} is running · step ${Math.max(...running.log.map(l => l.step))} of 10</b> · ${esc(running.log[running.log.length - 1].message)}<div class="progressline"><i style="width:${Math.max(...running.log.map(l => l.step)) * 10}%"></i></div><button class="btn" data-asm="${esc(running.number)}">Open run</button></div>` : '')
    + `<div class="kpis">${kpi('LATEST ASSESSMENT', esc(F.dateShort(a.run_date)), esc(a.number) + ' · ' + esc(a.trigger), '↻', '', `data-asm="${esc(a.number)}" role="button" tabindex="0"`)}${kpi('MEASUREMENT COVERAGE', inst.length ? Math.round(meas.length / inst.length * 100) + '%' : '—', meas.length + ' of ' + inst.length + ' installed capabilities scored', '✓', 'green')}${kpi('NOT MEASURED', a.counts.notMeasured, 'No measure or target — excluded, not 0', '△', 'orange')}${kpi('SCORE CHANGE', sign(a.previousScore == null ? null : a.overall_score - a.previousScore), 'Platform Value Score ' + F.num(a.overall_score, 1), '↗', 'purple')}</div>`
    + `<div class="detail-grid" style="margin:12px 0"><section class="panel"><h3>Measurement coverage by family</h3><div class="detailfacts" style="margin-top:12px">${famCov.map(([n, m, t]) => `<span>${esc(n)}</span><b>${Math.round(m / t * 100)}% · ${m} of ${t}</b>`).join('')}</div></section><section class="panel"><h3>Exceptions in ${esc(a.number)}</h3><div class="detailfacts" style="margin-top:12px"><span>Warnings</span><b>${warn.length}</b><span>Errors</span><b>${errs.length}</b><span>Stale source data</span><b>${caps.filter(c => c.stale).map(c => esc(c.name)).join(', ') || 'None'}</b><span>Failed runs (history)</span><b>${failed.map(r => esc(r.number)).join(', ') || 'None'}</b></div>${warn.map(w => `<p class="record-desc">! Step ${w.step}: ${esc(w.message)}</p>`).join('')}</section></div>`
    + sectionHead('Assessment runs', runs.length + ' runs, newest first. Open a run for its 10-step log' + (AI.enabled() ? ' and AI briefing.' : '.'), `<button class="btn" data-action="schedule">Schedule</button>`)
    + `<div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Assessment run</th><th scope="col">Trigger</th><th scope="col">Started</th><th scope="col">Run by</th><th scope="col">Duration</th><th scope="col">Score</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Open</span></th></tr></thead><tbody>${runsPage.items.map(r => `<tr><td><b>${esc(r.number)}</b></td><td>${esc(r.trigger)}</td><td>${esc(F.dateTime(r.run_date))}</td><td>${esc(r.byName)}</td><td>${esc(F.dur(r.duration))}</td><td><b>${F.num(r.overall_score, 1)}</b></td><td>${runPill(r.status)}</td><td><button class="btn" data-asm="${esc(r.number)}">Open</button></td></tr>`).join('')}</tbody></table></div>${pagerMarkup('assessments', runsPage, 'runs')}</div>`
    + `<div class="detail-grid" style="margin-top:12px"><section class="panel"><h3>Scoring principles</h3>${['Score = actual ÷ target × 100, capped at 100', 'Licensed but not installed counts as 0', 'No measure or no target = Not Measured, never 0', 'Baselines lock after the first measurement', 'Rejected and done opportunities are never reopened'].map(t => `<div class="rule-row"><span>✓ &nbsp;${esc(t)}</span></div>`).join('')}</section><section class="panel"><h3>After each run</h3><p class="record-desc">PIVOT emails "${S.prop('admin_group') === '' ? '' : 'PIVOT run complete'}" or "PIVOT run failed" to ${esc(S.prop('admin_group'))}. Analysts then review new opportunities and business owners check their outcomes.</p><div class="subnav"><button data-action="rules">How scores are calculated</button>${isAdmin() ? '<button data-view="Settings">Thresholds and recipients</button>' : ''}</div></section></div>`;
}

/* =====================================================================
   REPORTS (B12)
   ===================================================================== */
function reportsView() {
  const d = S.dashboard(), a = d.assessment, fam = st.reports.family;
  const caps = S.capabilities({ view: 'active' }).filter(c => fam === 'all' || c.family === fam);
  const cnt = b => caps.filter(c => bandOf(c) === b).length;
  const idle = caps.filter(c => c.utilization != null && c.utilization < S.prop('utilization_threshold'));
  const ob = d.outcomesByStatus, outs = d.outcomes.length, measuredOut = outs - ob.not_measured;
  const lic = caps.filter(c => c.licensed), utilCaps = caps.filter(c => c.utilization != null);
  const drivers = [['Licensed &amp; installed', lic.length ? lic.filter(c => c.installed).length / lic.length * 100 : null], ['Licence utilization', utilCaps.length ? utilCaps.reduce((t, c) => t + c.utilization, 0) / utilCaps.length : null], ['Installed &amp; measured', caps.filter(c => c.installed).length ? caps.filter(c => c.installed && c.score != null).length / caps.filter(c => c.installed).length * 100 : null], ['Outcomes on track', measuredOut ? (ob.improved + ob.on_target) / measuredOut * 100 : null]];
  const hist = completedRuns().slice(-6), allOpps = S.opportunities();
  const cell = (v, h, m) => v == null ? '<td class="prs-cell-none">—</td>' : `<td class="${v >= h ? 'prs-cell-high' : v >= m ? 'prs-cell-med' : 'prs-cell-low'}">${Math.round(v)}${typeof v === 'number' && h > 1 ? '' : ''}</td>`;
  const heat = caps.slice().sort((x, y) => (x.score == null ? 999 : x.score) - (y.score == null ? 999 : y.score));
  const heatPage = pageSlice(heat, 'reportsHeat', 5);
  const outStat = c => { const os = S.outcomes({ capability: c.id }); if (!os.length) return '—'; return os.map(o => o.statusLabel).join(', '); };
  const famRows = S.familySummary().filter(r => r.family && (fam === 'all' || r.family === fam));
  const fmax = Math.max(1, ...famRows.map(r => r.licensed));
  const topOpps = allOpps.slice(0, 5), pmax = Math.max(1, ...topOpps.map(o => o.priority));
  const insights = d.insights.map(i => ['△', i.capability, i.text, i.capabilityId]).concat(S.capabilities({ view: 'active' }).filter(c => c.stale).map(c => ['!', c.name + ': stale source data', c.staleNote + '.', c.id]));
  const insightPage = pageSlice(insights, 'reportsInsights', 5);
  const outcomeRows = d.outcomes.filter(o => o.status !== 'not_measured');
  const outcomeChartPage = pageSlice(outcomeRows, 'reportsOutcomes', 5);
  // impact vs effort bubbles, grouped by (effort, value + impact)
  const groups = {}; allOpps.forEach(o => { const k = o.effort + '|' + (o.value + o.business_impact); (groups[k] = groups[k] || []).push(o); });
  const bubbleGroups = Object.keys(groups).map(k => { const [e, vi] = k.split('|').map(Number); return { e, vi, g: groups[k] }; }).sort((a,b) => a.e-b.e || a.vi-b.vi);
  const perEffort = {}; bubbleGroups.forEach(b => { (perEffort[b.e] = perEffort[b.e] || []).push(b); });
  const bubbles = bubbleGroups.map(b => { const {e,vi,g}=b, bucket=perEffort[e], idx=bucket.indexOf(b), mid=(bucket.length-1)/2, spread=(idx-mid)*Math.min(13, 42/Math.max(1,bucket.length-1)), vertical=(idx%2===0?1:-1)*Math.ceil(idx/2)*8; const x=Math.max(4,Math.min(96,(e-1)/4*88+6+spread)); const y=Math.max(7,Math.min(90,vi/10*82+5+vertical)); const sz=Math.min(48,Math.max(28,22+Math.sqrt(g.length)*10)); const phase=g[0].phase; const cls=phase==='now'?'discovery':phase==='next'?'virtual':'hub'; return `<button class="bubble ${cls}" style="width:${sz}px;height:${sz}px;left:${x}%;bottom:${y}%;top:auto;--bubble-size:${sz}px" data-vo-filter="${e}|${vi}" title="${g.length} opportunit${g.length>1?'ies':'y'}: effort ${e}, value + impact ${vi} (${g.map(o=>o.number).join(', ')})" aria-label="${g.length} opportunities with effort ${e} and value plus impact ${vi}">${g.length}</button>`; }).join('');
  const logs = completedRuns().slice(-8).map(r => S.assessment(r.number).log), lv = { info: 0, warn: 0, error: 0 }; logs.forEach(l => l.forEach(x => lv[x.level] = (lv[x.level] || 0) + 1));
  const lvTotal = lv.info + lv.warn + lv.error;
  const gridCaps = S.capabilities({ view: 'active' });
  const bandShown = Math.min(gridCaps.length, st.more.reportsBands || 5), visibleBands = gridCaps.slice(0, bandShown);
  const queue = [].concat(S.capabilities({ view: 'active' }).filter(c => c.stale).map(c => [c.name + ' source data is stale', famLabel(c.family) + ' · ' + c.staleNote, 'Critical', `data-cap-open="${c.id}"`]), S.assessments().filter(r => r.status === 'failed').map(r => [r.number + ' failed', 'Run failed email sent · ' + F.date(r.run_date), 'Warning', `data-asm="${esc(r.number)}"`]), d.needsMapping ? [[d.needsMapping + ' capabilities need a product family', 'Admin · Needs mapping', 'Warning', 'data-action="needsMapping"']] : [], d.outcomes.filter(o => o.status === 'below_target').map(o => [o.kpi + ' below target', o.capabilityName + ' · owner ' + o.ownerName, 'Warning', `data-out="${o.id}"`]));
  const reports = [
    ['▥', 'Executive value summary', 'Platform Value Score, licences installed, outcomes and roadmap counts for ' + a.number + '.', 'Sponsor', 'Executive value summary', `${miniAreaTrend(completedRuns().slice(-12).map(r => r.overall_score))}`, 'Score trend · last 12 runs'],
    ['▦', 'Capability estate', 'Every capability with licence, installation, utilization, score and band.', 'Admin', 'Capability estate', `<div class="mini-grid">${gridCaps.map((c,i) => `<i style="--chart-index:${i};background:${BAND_SOLID[bandOf(c)]}"></i>`).join('')}</div>`, gridCaps.length + ' capabilities'],
    ['◎', 'Business outcomes', 'Baseline, current, target, improvement and status per KPI.', 'Business owner', 'Business outcomes', `<div class="mini-donut"><div class="donut" style="background:${conic([[BAND_SOLID.strong, ob.improved + ob.on_target], ['#ef9aa6', ob.below_target], ['#e3e6ee', ob.not_measured]])} !important"><div class="donutcenter"><b>${ob.improved + ob.on_target}</b><span>on track</span></div></div></div>`, (ob.improved + ob.on_target) + ' of ' + outs],
    ['△', 'Opportunities', 'All opportunities with scores, priority reason, state and owner.', 'Analyst', 'Opportunities', miniLollipop(allOpps.slice(0, 7).map(o => o.priority)), 'Priority ranking · top 7'],
    ['↻', 'Assessment runs', 'Run history with trigger, duration, score and status.', 'Admin', 'Assessment runs', miniLineTrend(S.assessments().slice(0, 8).reverse().map(r => r.duration ? r.duration / 60000 : null)), 'Duration trend · minutes per run'],
    ['⇢', 'Roadmap', 'Now, Next and Later in roadmap order with priority and owner.', 'Analyst', 'Roadmap', `<div class="mini-stack">${['now', 'next', 'later'].map((p,i) => `<span style="--chart-index:${i}"><b>${d.roadmap[p].length}</b>${L.phase[p]}</span>`).join('')}</div>`, 'Items per column']
  ];
  const generated = st.exports.map(x => [x.title, F.dateTime(x.ts), F.user(x.by), 'CSV · ' + x.rows + ' rows', `<button class="btn" data-export="${esc(x.redo)}">Download again</button>`])
    .concat(S.assessments().filter(r => r.status === 'complete' || r.status === 'failed').slice(0, 6).map(r => [r.status === 'failed' ? 'PIVOT run failed (email)' : 'PIVOT run complete (email)', F.dateTime(r.run_date + (r.duration || 0)), S.prop('admin_group'), r.number, `<button class="btn" data-asm="${esc(r.number)}">Open run</button>`]));
  const generatedPage = pageSlice(generated, 'reportsGenerated', 5);
  return `<div class="signal-hero"><div class="signal-copy"><div class="signal-kicker"><span class="signal-live"></span> Reports · ${esc(a.number)}</div><div class="signal-title">See where the platform pays off, and where it does not yet.</div><div class="signal-text">Value and outcomes first, then scores and utilization, then opportunities and the roadmap. Every chart below is calculated from ${esc(a.number)} (${esc(F.dateTime(a.run_date))}).</div><div class="signal-footer"><span class="signal-tag">${caps.length} capabilities</span><span class="signal-tag">${outs} business outcomes</span><span class="signal-tag">${allOpps.length} active opportunities</span></div></div><div class="signal-stats"><div class="signal-stat"><span>Priority actions</span><b>${String(d.roadmap.now.length).padStart(2, '0')}</b><em>In Now</em></div><div class="signal-stat"><span>Outcome status</span><b>${ob.improved + ob.on_target} / ${measuredOut}</b><em>On track</em></div></div></div>`
    + `<div class="headingrow reports-heading"><div><div class="eyebrow">PIVOT / REPORTS</div><h1 class="h1">Reports</h1><div class="subtitle">The B12 dashboard reports for sponsors, admins, analysts and business owners. Download any report as CSV.</div></div><div class="headactions reports-actions"><button class="btn" data-action="print">Print this page</button><button class="btn primary" data-export="Executive value summary">Export overview ↓</button></div></div>`
    + `<div class="filters"><label class="field">Product family<select id="repFamily"><option value="all">All product families</option>${DATA.families.map(f => `<option value="${f.value}" ${fam === f.value ? 'selected' : ''}>${esc(f.label)}</option>`).join('')}</select></label><span class="filters-meta">From ${esc(a.number)} · ${esc(F.dateTime(a.run_date))}</span></div>`
    + `<section class="platform-report-suite"><div class="prs-kpis">
 <div class="prs-kpi"><div class="prs-kpi-icon">▱</div><div><strong>${caps.length}</strong><span>Capabilities assessed</span><em>${caps.filter(c => c.score != null).length} scored</em></div></div>
 <div class="prs-kpi"><div class="prs-kpi-icon">▦</div><div><strong>${cnt('strong')}</strong><span>Strong usage</span><em>Score ${hi()}+</em></div></div>
 <div class="prs-kpi"><div class="prs-kpi-icon">▥</div><div><strong>${cnt('moderate')}</strong><span>Moderate usage</span><em>${lo()}–${hi() - 1}</em></div></div>
 <div class="prs-kpi"><div class="prs-kpi-icon">△</div><div><strong>${cnt('low')}</strong><span>Low usage</span><em style="color:#b36a10">Below ${lo()}</em></div></div>
 <div class="prs-kpi"><div class="prs-kpi-icon">⚙</div><div><strong>${cnt('notinst')}</strong><span>Licensed, not installed</span><em style="color:#c23b50">Shelfware</em></div></div>
 <div class="prs-kpi"><div class="prs-kpi-icon">ϟ</div><div><strong>${idle.length}</strong><span>Idle licence subscriptions</span><em>Below ${S.prop('utilization_threshold')}% used</em></div></div></div>`
    + `<div class="prs-grid-top"><section class="prs-panel"><div class="prs-panel-head"><div><h3>Capability health</h3><div class="prs-desc">Capabilities by usage band</div></div><span class="prs-mini-label">${caps.length} total</span></div><div class="prs-health-layout"><div class="prs-donut" style="background:${conic(BAND_ORDER.map(b => [{ strong: '#2ab96c', moderate: '#ffc629', low: '#ff9948', notinst: '#ff6474', nm: '#b8bfce' }[b], cnt(b)]))}" role="img" aria-label="${BAND_ORDER.map(b => BAND[b].label + ' ' + cnt(b)).join(', ')}"><div class="prs-donut-label"><b>${caps.length}</b><span>Total</span></div></div><div class="prs-legend">${BAND_ORDER.map(b => `<div class="prs-legend-row"><i style="background:${{ strong: '#2ab96c', moderate: '#ffc629', low: '#ff9948', notinst: '#ff6474', nm: '#b8bfce' }[b]}"></i><span>${BAND[b].label}</span><b>${cnt(b)}</b></div>`).join('')}</div></div></section>`
    + `<section class="prs-panel"><div class="prs-panel-head"><div><h3>Platform Value Score</h3><div class="prs-desc">Weighted score and the figures around it</div></div><span class="pill blue">${d.score >= hi() ? 'Strong' : d.score >= lo() ? 'Moderate' : 'Low'}</span></div><div class="prs-score-layout"><svg class="prs-gauge" viewBox="0 0 220 140" role="img" aria-label="Platform Value Score ${F.num(d.score, 1)} out of 100"><title>Platform Value Score ${F.num(d.score, 1)} out of 100</title><defs><linearGradient id="prsGauge"><stop stop-color="#ff8062"/><stop offset=".52" stop-color="#ffc52f"/><stop offset="1" stop-color="#5b82f4"/></linearGradient></defs><path d="M24 112 A86 86 0 0 1 196 112" fill="none" stroke="#e8edfa" stroke-width="18" stroke-linecap="round"/><path d="M24 112 A86 86 0 0 1 196 112" fill="none" stroke="url(#prsGauge)" stroke-width="18" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.round(d.score)} 100"/><text x="110" y="92" text-anchor="middle" font-size="36" font-weight="800" fill="#142255">${Math.round(d.score)}</text><text x="110" y="111" text-anchor="middle" font-size="10" fill="#6e7d9d">out of 100</text></svg><div class="prs-driver">${drivers.map(([n, v]) => `<div class="prs-driver-row"><span>${n}</span><div class="prs-track"><i style="width:${v == null ? 0 : Math.round(v)}%"></i></div><b>${v == null ? '—' : Math.round(v)}</b></div>`).join('')}</div></div></section>`
    + `<section class="prs-panel"><div class="prs-panel-head"><div><h3>Value trend</h3><div class="prs-desc">Platform Value Score, last ${hist.length} completed runs</div></div><span class="prs-mini-label">${esc(F.dateShort(hist[0].run_date))}–${esc(F.dateShort(hist[hist.length - 1].run_date))}</span></div>${lineChart(hist.map(h => F.dateShort(h.run_date)), hist.map(h => h.overall_score), null, 'Platform Value Score from ' + F.num(hist[0].overall_score, 1) + ' to ' + F.num(hist[hist.length - 1].overall_score, 1))}</section></div>`
    + `<div class="prs-grid-mid"><section class="prs-panel"><div class="prs-panel-head"><div><h3>Capability heatmap</h3><div class="prs-desc">Lowest scores first · utilization and score per capability</div></div><button class="prs-view-link" data-view="Element Map">Open Element Map →</button></div><div class="prs-heatmap-wrap"><table class="prs-heatmap"><thead><tr><th scope="col">Capability</th><th scope="col">Family</th><th scope="col">Licensed</th><th scope="col">Installed</th><th scope="col">Utilization %</th><th scope="col">Score</th><th scope="col">Outcome</th><th scope="col">Band</th></tr></thead><tbody>${heatPage.items.map(c => `<tr class="rowlink" data-cap-open="${c.id}" tabindex="0"><td>${esc(c.name)}</td><td>${esc(famLabel(c.family))}</td><td class="${c.licensed ? 'prs-cell-high' : 'prs-cell-none'}">${c.licensed ? 'Yes' : 'No'}</td><td class="${c.installed ? 'prs-cell-high' : 'prs-cell-low'}">${c.installed ? 'Yes' : 'No'}</td>${cell(c.utilization, 80, S.prop('utilization_threshold'))}${cell(c.score, hi(), lo())}<td>${esc(outStat(c))}</td><td class="prs-status">${esc(BAND[bandOf(c)].label)}</td></tr>`).join('')}</tbody></table></div>${pagerMarkup('reportsHeat', heatPage, 'capabilities')}</section>`
    + `<section class="prs-panel"><div class="prs-panel-head"><div><h3>Top insights</h3><div class="prs-desc">Usage versus outcome, and data quality</div></div><button class="prs-view-link" data-view="Value & Opportunities">View all →</button></div>${insightPage.items.map(i => `<button class="prs-insight" data-cap-open="${i[3]}"><span class="prs-insight-icon">${i[0]}</span><span><b>${esc(i[1])}</b><small>${esc(i[2])}</small></span></button>`).join('') || '<p class="record-desc">No insights in this run.</p>'}${pagerMarkup('reportsInsights', insightPage, 'insights')}</section></div>`
    + `<div class="prs-grid-bottom"><section class="prs-panel"><div class="prs-panel-head"><div><h3>Licensed vs installed</h3><div class="prs-desc">Licensed capabilities per family, and how many are installed</div></div></div><div class="prs-bars">${famRows.map(r => `<div class="prs-bar-row"><span>${esc(r.label)}</span><div class="prs-track" title="${r.installed} installed of ${r.count}"><i style="width:${r.count ? r.installed / Math.max(1, r.count) * 100 : 0}%"></i></div><b>${r.installed}/${r.count}</b></div>`).join('')}</div><div class="chartlegend"><span><i class="dot" style="background:#557bf0"></i>Installed share of the family's capabilities</span></div></section>`
    + `<section class="prs-panel"><div class="prs-panel-head"><div><h3>Top value opportunities</h3><div class="prs-desc">Highest priority = (value + impact) ÷ effort</div></div></div><div class="prs-bars">${topOpps.map(o => `<button class="prs-bar-row" data-opp="${o.number}"><span>${esc(o.capabilityName)}</span><span class="prs-track"><i style="width:${o.priority / pmax * 100}%"></i></span><b>${F.pri(o.priority)}</b></button>`).join('')}</div></section>`
    + `<section class="prs-panel"><div class="prs-panel-head"><div><h3>Recommended roadmap</h3><div class="prs-desc">Built by ${esc(d.roadmap.assessment)}</div></div><button class="prs-view-link" data-view="Roadmap">View roadmap →</button></div><div class="prs-roadmap">${['now', 'next', 'later'].map((p, i) => `<div class="prs-road-stage"><span class="prs-stage-dot">${i + 1}</span><div><div class="prs-stage-title">${L.phase[p].toUpperCase()} <span class="prs-stage-time">· ${d.roadmap[p].length} items</span></div><ul class="prs-stage-list">${d.roadmap[p].slice(0, 3).map(o => `<li>${esc(o.capabilityName)} — ${esc(o.typeLabel)}</li>`).join('') || '<li>Nothing here</li>'}</ul></div></div>`).join('')}<div class="prs-road-stage"><span class="prs-stage-dot">✓</span><div><div class="prs-stage-title">DONE <span class="prs-stage-time">· ${S.opportunities({ state: 'done' }).length} items</span></div><ul class="prs-stage-list">${S.opportunities({ state: 'done' }).slice(0, 2).map(o => `<li>${esc(o.capabilityName)} — ${esc(o.typeLabel)}</li>`).join('') || '<li>Nothing closed yet</li>'}</ul></div></div></div></section></div></section>`
    + `<div class="section-head"><div><h2>Portfolio &amp; operational charts</h2><p>Impact against effort, outcome progress and assessment health.</p></div></div>`
    + `<div class="reportcharts"><section class="reportchart"><h3>Impact vs effort</h3><div class="desc">Active opportunities grouped by effort (→) and value + impact (↑). Bubble = number of opportunities.</div><div class="bubbleplot">${bubbles}</div><div class="plotfoot"><span>Effort 1 → 5</span><span>Value + impact ↑ 0–10</span></div><div class="chartlegend"><span><i class="dot" style="background:#262d70"></i>Now</span><span><i class="dot" style="background:#304db5"></i>Next</span><span><i class="dot" style="background:#a9b9fa"></i>Later</span></div></section>`
    + `<section class="reportchart"><h3>Outcome progress</h3><div class="desc">Improvement from baseline towards target, per measured KPI</div>${lineChart(completedRuns().slice(-8).map(r => F.dateShort(r.run_date)), outcomeShareByRun(), null, 'Share of measured outcomes improved or on target per run')}<div class="chartlegend"><span><i class="dot" style="background:#2864e8"></i>% of measured outcomes improved or on target, by run</span></div><div class="outcome-bars">${outcomeChartPage.items.map(o => `<button class="outcome-row" data-out="${o.id}"><span title="${esc(o.kpi)}">${esc(o.kpi)}</span><span class="outcome-track"><i class="actual" style="width:${Math.max(0, Math.min(100, o.improvement || 0))}%"></i><i class="variance" style="width:${Math.max(0, 100 - Math.max(0, Math.min(100, o.improvement || 0)))}%"></i></span><b>${F.num(o.improvement, 0)}%</b></button>`).join('')}${pagerMarkup('reportsOutcomes', outcomeChartPage, 'outcomes')}</div><div class="desc" style="margin-top:10px">Direction-aware: for “lower is better” KPIs a fall counts as improvement.</div></section>`
    + `<section class="reportchart operational-wide"><h3>Operational health</h3><div class="desc">Assessment log levels, capability bands and the actions that need attention</div><div class="ops-grid"><div class="ops-subsection"><h4>Log entries <span style="font-weight:500;color:var(--muted)">· last ${logs.length} runs</span></h4><div style="display:flex;gap:18px;align-items:center"><div class="donut" style="width:112px;height:112px;flex:0 0 112px;background:${conic([['#304db5', lv.info], ['#a9b9fa', lv.warn], ['#d74452', lv.error]])} !important" role="img" aria-label="${lv.info} info, ${lv.warn} warnings, ${lv.error} errors"><div class="donutcenter"><b>${lvTotal}</b><span>Entries</span></div></div><div style="font-size:10px;line-height:2.1"><div><i class="dot" style="background:#304db5"></i> Info <b>${lv.info}</b></div><div><i class="dot" style="background:#a9b9fa"></i> Warning <b>${lv.warn}</b></div><div><i class="dot" style="background:#d74452"></i> Error <b>${lv.error}</b></div></div></div></div>`
    + `<div class="ops-subsection"><h4>Capability bands <span style="font-weight:500;color:var(--muted)">· ${bandShown} of ${gridCaps.length} shown</span></h4><div class="heatgrid">${visibleBands.map(c => `<button style="background:${BAND_SOLID[bandOf(c)]}" data-cap-open="${c.id}" title="${esc(c.name)} · ${esc(BAND[bandOf(c)].label)} · score ${F.score(c.score)}" aria-label="${esc(c.name)}, ${esc(BAND[bandOf(c)].label)}"></button>`).join('')}</div>${loadMoreMarkup('reportsBands', bandShown, gridCaps.length, 'capabilities')}<div style="display:flex;justify-content:space-between;color:var(--muted);font-size:9px;margin-top:9px"><span>Dark = strong usage</span><span>Light = low or not measured</span></div></div>`
    + `<div class="ops-subsection"><h4>Action queue <span style="font-weight:500;color:var(--muted)">· ${queue.length} items</span></h4><div class="alertlist">${queue.map(q => `<button class="alertrow" ${q[3]}><span><b>${esc(q[0])}</b><small>${esc(q[1])}</small></span><span class="severity ${q[2] === 'Warning' ? 'warn' : ''}">${q[2]}</span></button>`).join('')}</div></div></div></section></div>`
    + `<div class="report-grid">${reports.map(r => `<article class="report-card"><div class="report-card-heading"><div class="report-icon">${r[0]}</div><div class="report-card-copy"><h3>${esc(r[1])}</h3><p>${esc(r[2])}</p></div></div><div class="mini-chart">${r[5]}<span class="mini-caption">${esc(r[6])}</span></div><div class="report-card-footer"><span class="pill blue">${esc(r[3])}</span><button class="btn" data-export="${esc(r[4])}">Download CSV ↓</button></div></article>`).join('')}</div>`
    + sectionHead('Recently generated', 'Exports made in this session and the run emails PIVOT sent.', '')
    + `<div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">Report</th><th scope="col">Generated</th><th scope="col">By / to</th><th scope="col">Format</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead><tbody>${generatedPage.items.map(g => `<tr><td><b>${esc(g[0])}</b></td><td>${esc(g[1])}</td><td>${esc(g[2])}</td><td>${esc(g[3])}</td><td>${g[4]}</td></tr>`).join('')}</tbody></table></div>${pagerMarkup('reportsGenerated', generatedPage, 'generated reports')}</div>`;
}

/* =====================================================================
   SETTINGS (admin) — the PIVOT system properties
   ===================================================================== */
const SET_TABS = { 'Scoring & priority': ['utilization_threshold', 'low_score_threshold', 'high_usage_threshold', 'priority_now', 'priority_next', 'default_days_back', 'slow_capability_seconds'], 'AI features': ['ai_enabled'], 'Data sources': [], 'Access': [], 'Notifications': ['admin_group'] };
function settingsView() {
  const s = st.settings, edit = S.can('settings.edit'), props = S.properties(), pend = Object.keys(s.pending).length;
  const row = p => {
    const short = p.name.replace('x_enno_pivot.', ''), val = short in s.pending ? s.pending[short] : p.value, err = s.errors[short], note = s.notes[short];
    const ctl = typeof p.value === 'boolean' ? `<input class="switch" type="checkbox" id="set-${short}" data-prop="${short}" ${val ? 'checked' : ''} ${edit ? '' : 'disabled'} aria-label="${esc(p.label)}">`
      : `<span class="setctl"><input id="set-${short}" data-prop="${short}" type="${typeof p.value === 'number' ? 'number' : 'text'}" value="${esc(val)}" ${edit ? '' : 'disabled'} aria-label="${esc(p.label)}" ${err ? `aria-invalid="true" aria-describedby="err-set-${short}"` : ''}>${p.unit ? `<small>${esc(p.unit)}</small>` : ''}</span>`;
    return `<div class="setting-row"><div><b>${esc(p.label)}</b><p>${esc(p.help)} <span class="muted">(${esc(p.name)})</span></p>${err ? `<span class="fielderr" id="err-set-${short}">${esc(err)}</span>` : ''}${note ? `<span class="formnote">${esc(note)}</span>` : ''}</div>${ctl}</div>`;
  };
  const byTab = SET_TABS[s.tab].map(n => props.find(p => p.name === 'x_enno_pivot.' + n));
  let body = byTab.map(row).join('');
  if (s.tab === 'Scoring & priority') body = (S.engineAvailable() ? `<div class="setting-row"><div><b>Weekly schedule</b><p>Scheduled job "PIVOT weekly assessment" runs every Sunday at 02:00. Changed in the instance, not here.</p></div><span class="pill blue">Sunday 02:00</span></div>` : `<div class="setting-row"><div><b>Weekly schedule</b><p>Scheduled job "PIVOT weekly assessment" (Sunday 02:00) is installed with the assessment engine in Sprint 4.</p></div><span class="pill warn">Not installed yet</span></div>`) + body;
  if (s.tab === 'Data sources') { const all = S.capabilities({ view: 'all' }); body = [['Subscriptions', 'subscription', 'License entitlements and allocations in the instance.'], ['Store apps', 'store_app', 'Installed applications from the ServiceNow Store.'], ['Plugins', 'plugin', 'Active plugins.']].map(([t, k, h]) => `<div class="setting-row"><div><b>${t}</b><p>${h}</p></div><span class="pill">${all.filter(c => c.source === k).length} found</span></div>`).join('') + `<div class="setting-row"><div><b>Instance</b><p>PIVOT runs inside ${esc(DATA.instance.name)} and only reads tables in the instance. It never writes outside scope x_enno_pivot.</p></div><span class="pill blue">${esc(DATA.instance.name)}</span></div><div class="setting-row"><div><b>Data leaving the instance</b><p>None. There are no outbound integrations; AI features use Now Assist inside the instance.</p></div><span class="pill blue">None</span></div>`; }
  if (s.tab === 'Access') {
    const acts = [['Read dashboard and records', 'all'], ['Accept, reject, assign, close opportunities', 'opportunity.work'], ['Change value / impact / effort', 'opportunity.work'], ['Reorder the roadmap', 'roadmap.reorder'], ['Create outcomes; edit own outcomes', 'outcome.create'], ['Change a locked baseline', 'outcome.baseline'], ['Measurement settings and family mapping', 'capability.edit'], ['Run Now and properties', 'settings.edit']];
    const allowed = (r, a) => a === 'all' ? true : a === 'opportunity.work' || a === 'roadmap.reorder' ? (r === 'analyst' || r === 'admin') : a === 'outcome.create' ? (r === 'business_owner' || r === 'admin') : r === 'admin';
    body = `<div class="table-wrap"><table class="table"><thead><tr><th scope="col">What</th>${Object.keys(L.role).map(r => `<th scope="col">${L.role[r]}</th>`).join('')}</tr></thead><tbody>${acts.map(([t, a]) => `<tr><td>${t}</td>${Object.keys(L.role).map(r => `<td>${allowed(r, a) ? '✓' : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="setting-row"><div><b>Preview as</b><p>Switch role to check what each user group sees. Your real PIVOT roles (x_enno_pivot.viewer, analyst, business_owner, admin) still decide what the server lets you change. Users without a PIVOT role see nothing.</p></div><select id="roleSelect" aria-label="Preview as role">${S.previewRoles().map(r => `<option value="${r}" ${S.role() === r ? 'selected' : ''}>${L.role[r]}</option>`).join('')}</select></div>`;
  }
  if (s.tab === 'Notifications') body += `<div class="setting-row"><div><b>PIVOT run complete</b><p>Sent after every successful run with the score and the number of new opportunities.</p></div><span class="pill blue">Always sent</span></div><div class="setting-row"><div><b>PIVOT run failed</b><p>Sent when a run stops with an error, with a link to its log.</p></div><span class="pill blue">Always sent</span></div>`;
  const hasProps = SET_TABS[s.tab].length > 0;
  return heading('PIVOT / ADMINISTRATION', 'Settings', 'PIVOT system properties. Threshold changes apply from the next assessment run; priority limits re-sort the roadmap straight away.', hasProps && edit ? `<button class="btn" data-action="discardSettings" ${pend ? '' : 'disabled'}>Discard changes</button><button class="btn primary" data-action="saveSettings" ${pend ? '' : 'disabled'}>Save settings${pend ? ' (' + pend + ')' : ''}</button>` : '')
    + `<div class="settings-layout"><nav class="settings-nav" aria-label="Settings sections">${Object.keys(SET_TABS).map(t => `<button class="${s.tab === t ? 'active' : ''}" data-settingtab="${t}" aria-current="${s.tab === t}">${t}</button>`).join('')}</nav><section class="panel"><div class="panelhead"><div><h3>${esc(s.tab)}</h3><div class="paneldesc">${edit ? (hasProps ? 'Change values, then Save. Invalid values are refused with a message.' : 'Read-only information.') : esc(why('settings.edit'))}</div></div><span class="pill blue">${hasProps ? 'System properties' : 'Information'}</span></div>${body}</section></div>`;
}

/* =====================================================================
   HELP & SUPPORT
   ===================================================================== */
function helpView() {
  return heading('PIVOT / SUPPORT', 'Help &amp; Support', 'How to read PIVOT and what each role does with it.', `<button class="btn" data-action="rules">How scores work</button>${gated('ai.use', '<button class="btn primary" data-action="ask">Ask PIVOT</button>')}`)
    + `<div class="help-layout"><article class="help-card"><div class="report-icon">⌕</div><h3>Getting started</h3><p>Start on the Dashboard: the Platform Value Score, outcomes and the Now column. Then open the records behind them.</p><button class="help-link" data-view="Dashboard">Open Dashboard →</button></article><article class="help-card"><div class="report-icon">▦</div><h3>Reading the Element Map</h3><p>Columns are product families; colour is the usage band. Hatched tiles are licensed but not installed, or not measured. The tag shows the roadmap column of the top opportunity.</p><button class="help-link" data-view="Element Map">Open Element Map →</button></article><article class="help-card"><div class="report-icon">↻</div><h3>Assessments</h3><p>Every Sunday at 02:00, or with Run Now (admin), PIVOT runs 10 steps and logs each one. Open a run to see warnings and errors.</p><button class="help-link" data-view="Assessments">Review assessments →</button></article><article class="help-card"><div class="report-icon">⇢</div><h3>Working opportunities</h3><p>Analysts accept, reject with a reason, assign and close opportunities, and can change value, impact and effort. Business owners keep their outcomes up to date.</p><button class="help-link" data-view="Value & Opportunities">Open Value &amp; Opportunities →</button></article></div>`
    + sectionHead('Frequently asked questions', 'Short answers to common questions.')
    + `<div class="panel">${[
      ['Why is a capability hatched?', 'It is licensed but not installed (score 0), or it has no measure table or target (Not Measured). Open the capability to see which.'],
      ['Does Not Measured mean zero?', 'No. Not Measured stays empty and is left out of the Platform Value Score. Only licensed-but-not-installed counts as 0.'],
      ['How is priority calculated?', 'Priority = (value + business impact) ÷ effort. Now at ' + S.prop('priority_now') + ' or more, Next from ' + S.prop('priority_next') + ', Later below ' + S.prop('priority_next') + '. Analysts can change the three numbers.'],
      ['Why can I not change a baseline?', 'The baseline is locked after the first measurement so improvement stays honest. Admins can change it; the change is audited.'],
      ['Will a rejected opportunity come back?', 'No. Rejected and done opportunities are never reopened by later runs. That is why a rejection needs a reason.'],
      ['What do the AI features do?', 'They explain findings, brief you on a run, suggest scores, owners and action plans, and answer questions. They are labelled, never change numbers themselves, and can be switched off in Settings.'],
      ['Does any data leave the instance?', 'No. PIVOT reads tables in the instance and writes only to its own scope.']
    ].map((x, i) => `<details class="faq" ${i === 0 ? 'open' : ''}><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('')}</div>`;
}

/* =====================================================================
   TOP BAR — notifications, avatar menu with "Preview as"
   ===================================================================== */
function notifications() {
  const n = [], a = S.latest(), run = S.running(), dash = S.dashboard();
  if (run) n.push({ k: 'run-' + run.number + '-' + run.log.length, sym: '↻', cls: 'roadmap', t: run.number + ' is running', p: 'Step ' + Math.max(...run.log.map(l => l.step)) + ' of 10 · ' + run.log[run.log.length - 1].message, time: 'now · Assessments', go: `data-asm="${esc(run.number)}"` });
  n.push({ k: 'done-' + a.number, sym: '✓', cls: 'outcome', t: 'PIVOT run complete · ' + a.number, p: 'Platform Value Score ' + F.num(a.overall_score, 1) + (a.previousScore != null ? ' (' + sign(a.overall_score - a.previousScore) + ')' : '') + '. ' + a.opportunities + ' opportunities raised or updated.', time: F.rel(a.run_date + (a.duration || 0)) + ' · Assessments', go: `data-asm="${esc(a.number)}"` });
  S.capabilities({ view: 'active' }).filter(c => c.stale).forEach(c => n.push({ k: 'stale-' + c.id, sym: '!', cls: 'evidence', t: 'Stale source data · ' + c.name, p: c.staleNote + '. Its score may be out of date.', time: F.rel(a.run_date) + ' · Capability', go: `data-cap-open="${c.id}"` }));
  const below = dash.outcomes.filter(o => o.status === 'below_target'); if (below.length) n.push({ k: 'below-' + a.number, sym: '◎', cls: 'outcome', t: below.length + ' outcomes below target', p: below.map(o => o.kpi).join('; '), time: F.rel(a.run_date) + ' · Outcomes', go: 'data-view="Value & Opportunities"' });
  if (isAdmin() && dash.needsMapping) n.push({ k: 'map-' + dash.needsMapping, sym: '▦', cls: 'roadmap', t: dash.needsMapping + ' capabilities need a product family', p: 'Map them so they appear in family reports.', time: 'Admin', go: 'data-action="needsMapping"' });
  return n;
}
function renderTopbar() {
  const list = notifications(), unread = list.filter(x => !st.read.has(x.k)).length;
  const dr = $('notificationDrawer'); if (!dr) return;
  dr.querySelector('.drawer-summary').innerHTML = `<span class="drawer-live-dot"></span><span><b>${unread ? unread + ' item' + (unread > 1 ? 's' : '') + ' need attention' : 'All caught up'}</b><small>From ${esc(S.latest().number)} and live runs</small></span><button type="button" class="mark-read" id="markNotificationsRead" ${unread ? '' : 'disabled'}>Mark read</button>`;
  dr.querySelector('.notification-list').innerHTML = list.map(x => `<button class="notification-item ${st.read.has(x.k) ? '' : 'unread'}" ${x.go} data-note="${esc(x.k)}"><span class="notification-symbol ${x.cls}">${x.sym}</span><span><span class="notification-title">${esc(x.t)}</span><p>${esc(x.p)}</p><time>${esc(x.time)}</time></span>${st.read.has(x.k) ? '' : '<span class="unread-dot"></span>'}</button>`).join('');
  $('notificationTrigger').querySelector('.notification-dot').classList.toggle('is-hidden', !unread);
  $('notificationTrigger').setAttribute('aria-label', 'Notifications, ' + unread + ' unread');
  const u = S.user(), av = document.querySelector('.profile-trigger'); av.textContent = u.initials; av.title = u.name + ' · ' + L.role[S.role()];
  $('roleChip').innerHTML = `Preview as <b>${esc(L.role[S.role()])}</b> ▾`;
  document.querySelectorAll('.navbtn[data-view="Settings"]').forEach(b => { b.hidden = !S.can('settings.view'); });
}
function toggleProfile(open) {
  let m = $('profileMenu'); const trig = document.querySelector('.profile-trigger');
  if (open === false || (m && open === undefined)) { if (m) { m.remove(); trig.setAttribute('aria-expanded', 'false'); } return; }
  const u = S.user();
  m = document.createElement('section'); m.id = 'profileMenu'; m.className = 'menu-pop'; m.setAttribute('aria-label', 'Profile and preview role');
  m.innerHTML = `<div class="menu-user"><span class="avatar">${esc(u.initials)}</span><span><b>${esc(u.name)}</b><small>${esc(u.title)} · ${esc(L.role[S.role()])}</small></span></div><div class="menu-label">Preview as</div><div role="radiogroup" aria-label="Preview as role">${S.previewRoles().map(r => `<button role="radio" aria-checked="${S.role() === r}" class="menu-item ${S.role() === r ? 'active' : ''}" data-role="${r}"><span>${L.role[r]}</span><small>${r === S.previewRoles()[0] ? 'Your role' : 'Preview only'}</small></button>`).join('')}</div><div class="menu-sep"></div>${S.can('settings.view') ? '<button class="menu-item" data-view="Settings">Settings</button>' : ''}<button class="menu-item" data-view="Help & Support">Help &amp; Support</button><p class="menu-note">Preview hides controls only. What you can change is always decided by your PIVOT roles.</p>`;
  document.querySelector('.topbar-actions').appendChild(m); trig.setAttribute('aria-expanded', 'true');
  const first = m.querySelector('.menu-item.active') || m.querySelector('.menu-item'); if (first) first.focus();
}

/* =====================================================================
   RENDER + EVENTS
   ===================================================================== */
/* Reliable chart motion: use the Web Animations API so each chart visibly animates
   after render and can replay independently on hover. */
const PIVOT_CHART_SELECTOR = '.mini-chart,.reportchart,.panel:has(.linechart,.bar-chart,.donut,.bubble,.mini-grid,.bars,.heatmap),.prs-panel';
function animateOne(el, frames, options) {
  if (!el || !el.animate) return;
  try { el.getAnimations().forEach(a => a.cancel()); el.animate(frames, options); } catch (_) { /* CSS remains the fallback */ }
}
function animateChart(chart, replay) {
  if (!chart) return;
  chart.classList.remove('chart-enter','chart-hover');
  chart.classList.add(replay ? 'chart-hover' : 'chart-enter');
  const delay = i => (replay ? 25 : 55) * i;
  chart.querySelectorAll('.mini-priority-svg .priority-column rect,.mini-bars i,.bars .barstack').forEach((el,i) => {
    animateOne(el,[{transform:'scaleY(.04)',opacity:.25},{transform:'scaleY(1)',opacity:1}],{duration:replay?520:760,delay:delay(i),easing:'cubic-bezier(.2,.75,.2,1)',fill:'both'});
    el.style.transformOrigin = 'center bottom';
  });
  chart.querySelectorAll('.mini-grid i,.heatgrid button').forEach((el,i) => animateOne(el,[{transform:'scale(.12)',opacity:.2},{transform:'scale(1)',opacity:1}],{duration:replay?300:420,delay:delay(i),easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}));
  chart.querySelectorAll('.mini-donut .donut,.donut:not(.donutcenter)').forEach(el => animateOne(el,[{transform:'rotate(-65deg) scale(.78)',opacity:.25},{transform:'rotate(0) scale(1)',opacity:1}],{duration:replay?520:850,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'}));
  chart.querySelectorAll('.mini-area-svg .draw-line,.mini-line-svg path, .linechart polyline, .linechart path').forEach(el => {
    if (el.tagName.toLowerCase()==='path' && (el.getAttribute('fill')||'none')!=='none' && !el.classList.contains('draw-line')) return;
    let len=220; try { if (el.getTotalLength) len=Math.max(1,el.getTotalLength()); } catch (_) {}
    el.style.strokeDasharray=String(len); el.style.strokeDashoffset=String(len);
    animateOne(el,[{strokeDashoffset:len},{strokeDashoffset:0}],{duration:replay?650:1050,easing:'ease-out',fill:'both'});
  });
  chart.querySelectorAll('.mini-area-svg .area-fill').forEach(el=>animateOne(el,[{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:replay?400:650,delay:120,easing:'ease-out',fill:'both'}));
  chart.querySelectorAll('.mini-line-svg circle,.mini-area-svg circle,.linechart circle,.chart-point').forEach((el,i)=>animateOne(el,[{opacity:0,transform:'scale(.25)'},{opacity:1,transform:'scale(1)'}],{duration:300,delay:(replay?100:360)+delay(i),easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}));
  chart.querySelectorAll('.lollipop-track>i,.duration-track>i,.prs-track>i,.progressline i').forEach((el,i)=>{
    const target=el.style.width || getComputedStyle(el).width;
    animateOne(el,[{width:'0%'},{width:target}],{duration:replay?450:700,delay:delay(i),easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
  });
  chart.querySelectorAll('.mini-stack span,.bubble').forEach((el,i)=>animateOne(el,[{opacity:0,transform:'translateY(10px) scale(.92)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:replay?300:440,delay:delay(i),easing:'ease-out',fill:'both'}));
  chart.querySelectorAll('.prs-gauge path:nth-of-type(2)').forEach(el=>{
    const target=el.getAttribute('stroke-dasharray')||'70 100';
    animateOne(el,[{strokeDasharray:'0 100'},{strokeDasharray:target}],{duration:900,easing:'ease-out',fill:'both'});
  });
}
function initChartMotion() {
  document.querySelectorAll(PIVOT_CHART_SELECTOR).forEach((chart,i)=>{
    chart.querySelectorAll('.mini-bars i,.mini-grid i,.bars i,.heatgrid button').forEach((el,j)=>el.style.setProperty('--chart-index',j));
    requestAnimationFrame(()=>setTimeout(()=>animateChart(chart,false),Math.min(i*35,350)));
  });
}
document.addEventListener('pointerenter', e => {
  const chart=e.target.closest && e.target.closest(PIVOT_CHART_SELECTOR);
  if (!chart || chart.dataset.motionHovering==='1') return;
  chart.dataset.motionHovering='1'; animateChart(chart,true);
}, true);
document.addEventListener('pointerleave', e => {
  const chart=e.target.closest && e.target.closest(PIVOT_CHART_SELECTOR);
  if (chart) delete chart.dataset.motionHovering;
}, true);

const NEEDS_RUN = ['Dashboard', 'Analytics Studio', 'Reports'];
function noRunYet(view) {
  const caps = S.capabilities({ view: 'all' }), outs = S.outcomes(), opps = S.opportunities({ state: 'all' });
  const eyebrow = { 'Dashboard': 'PIVOT / OVERVIEW', 'Analytics Studio': 'PIVOT / ANALYTICS', 'Reports': 'PIVOT / REPORTS' }[view];
  return heading(eyebrow, esc(view), 'Built from the results of an assessment run.', `<button class="btn" data-view="Capability Library">Open Capability Library →</button>`)
    + `<section class="panel empty-run"><div class="empty-state"><b>No assessment has run yet.</b><p class="record-desc">This view shows scores, usage bands, trends and outcomes from the latest completed assessment run. ${S.engineAvailable() ? 'An admin can start one with Run Now, or wait for the weekly run on Sunday at 02:00.' : 'The assessment engine (discovery, measurement and scoring) arrives in Sprint 4; until then the PIVOT tables hold only the records created by hand.'}</p></div>`
    + `<div class="metricstrip">${miniMetric('CAPABILITIES', caps.length, caps.filter(c => c.active).length + ' active')}${miniMetric('OPPORTUNITIES', opps.length, opps.filter(o => S.isActive(o.state)).length + ' active')}${miniMetric('BUSINESS OUTCOMES', outs.length, 'Not measured until the first run')}</div>`
    + `<div class="formactions"><button class="btn" data-view="Capability Library">Capabilities</button><button class="btn" data-view="Value &amp; Opportunities">Value &amp; Opportunities</button><button class="btn" data-view="Assessments">Assessments</button></div></section>`;
}
function noCapabilities() {
  return heading('PIVOT / ELEMENT MAP', 'Element Map', 'Every active capability as a tile, grouped by product family.', '')
    + `<section class="panel"><div class="empty-state"><b>No active capabilities yet.</b><p class="record-desc">Discovery fills the capability table from subscriptions, Store apps and plugins (assessment engine, Sprint 4). PIVOT admins can also add capabilities under PIVOT &gt; Administration &gt; Capabilities.</p></div></section>`;
}
const RENDER = { 'Dashboard': dashboardHome, 'Analytics Studio': analyticsStudio, 'Element Map': elementMap, 'Capability Library': capabilityLibrary, 'Value & Opportunities': valueOpportunities, 'Roadmap': roadmapView, 'Assessments': assessmentsView, 'Reports': reportsView, 'Settings': settingsView, 'Help & Support': helpView };
function render(keepScroll) {
  if (st.view === 'Settings' && !S.can('settings.view')) st.view = 'Dashboard';
  const y = window.scrollY, focusId = document.activeElement && document.activeElement.id, sel = focusId && document.activeElement.selectionStart;
  $('crumb').textContent = st.view;
  document.querySelectorAll('.navbtn[data-view]').forEach(b => { const on = b.dataset.view === st.view; b.classList.toggle('active', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  $('main').innerHTML = NEEDS_RUN.includes(st.view) && !S.hasRun() ? noRunYet(st.view) : st.view === 'Element Map' && !S.capabilities({ view: 'active' }).length ? noCapabilities() : RENDER[st.view]();
  initChartMotion();
  document.title = 'PIVOT — ' + st.view;
  renderTopbar();
  if (keepScroll) window.scrollTo(0, y);
  if (focusId && $(focusId) && $(focusId) !== document.body) { const el = $(focusId); el.focus(); if (sel != null && el.setSelectionRange && /text|search/.test(el.type || 'text')) try { el.setSelectionRange(sel, sel); } catch (e) { /* number inputs */ } }
}
function viewSlug(v) { return String(v || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function viewFromParam(p) { if (!p) return ''; const want = viewSlug(p); return Object.keys(RENDER).find(k => viewSlug(k) === want || viewSlug(k).replace(/-and-/g, '-') === want) || ''; }
function syncViewParam(view) { try { const u = new URL(window.location.href); if (u.searchParams.get('view') === viewSlug(view)) return; u.searchParams.set('view', viewSlug(view)); window.history.replaceState(window.history.state, '', u.toString()); } catch (e) { /* address not writable here */ } }
function go(view) { if (!RENDER[view]) view = 'Dashboard'; st.view = view; syncViewParam(view); closeModal(true); toggleProfile(false); closeDrawer(); render(); window.scrollTo({ top: 0 }); const h = document.querySelector('#main .h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
function openCapability(id) { const l = st.lib; l.q = ''; l.family = 'all'; l.errors = {}; l.note = ''; const c = S.capability(id); l.view = c && !c.active ? 'not_found' : 'active'; if (c && !c.family && isAdmin()) l.view = 'needs_mapping'; const list = libList(); l.page = Math.max(0, list.findIndex(x => x.id === id)); if (list.findIndex(x => x.id === id) < 0) { l.view = 'all'; l.page = Math.max(0, libList().findIndex(x => x.id === id)); } go('Capability Library'); }
function closeDrawer() { const d = $('notificationDrawer'), t = $('notificationTrigger'); if (d && !d.hidden) { d.hidden = true; t.setAttribute('aria-expanded', 'false'); t.classList.remove('is-open'); } }

document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-view], [data-opp], [data-out], [data-asm], [data-cap-open], [data-action], tr[data-opp], tr[data-out]');
  // outside clicks close the popovers
  if (!e.target.closest('#notificationDrawer') && !e.target.closest('#notificationTrigger')) closeDrawer();
  if (!e.target.closest('#profileMenu') && !e.target.closest('.profile-trigger') && !e.target.closest('#roleChip')) toggleProfile(false);
  if (!t || t.disabled) return;
  const ds = t.dataset;
  if (ds.page) { const infoKey = ds.page, current = st.pages[infoKey] || 0; if (ds.step === 'first') st.pages[infoKey] = 0; else if (ds.step === 'prev') st.pages[infoKey] = Math.max(0, current - 1); else if (ds.step === 'next') st.pages[infoKey] = current + 1; else if (ds.step === 'last') st.pages[infoKey] = 999999; render(true); return; }
  if (ds.more) { if (ds.more.startsWith('map:')) st.more[ds.more] = (st.more[ds.more] || 5) + 10; else if (ds.more.startsWith('road')) st.more[ds.more] = (st.more[ds.more] || 5) + 5; else if (ds.more === 'reportsBands') st.more.reportsBands = (st.more.reportsBands || 5) + 5; render(true); return; }
  if (ds.note) st.read.add(ds.note);
  if (t.id === 'notificationTrigger') { const d = $('notificationDrawer'), open = d.hidden; d.hidden = !open; t.setAttribute('aria-expanded', String(open)); t.classList.toggle('is-open', open); toggleProfile(false); if (open) { const f = d.querySelector('button'); if (f) f.focus(); } return; }
  if (t.id === 'notificationClose') { closeDrawer(); $('notificationTrigger').focus(); return; }
  if (t.id === 'markNotificationsRead') { notifications().forEach(x => st.read.add(x.k)); renderTopbar(); return; }
  if (t.id === 'viewAllNotifications') { go('Assessments'); return; }
  if (t.classList.contains('profile-trigger') || t.id === 'roleChip') { closeDrawer(); toggleProfile(); return; }
  if (ds.role) { S.setRole(ds.role); toggleProfile(false); notify('Previewing as ' + L.role[ds.role] + '.'); return; }
  if (ds.view) { go(ds.view); return; }
  if (ds.opp) { toggleProfile(false); closeDrawer(); openOpp(ds.opp); return; }
  if (ds.out) { toggleProfile(false); closeDrawer(); if (ds.out === 'new' && !S.can('outcome.create')) return; openOutcome(ds.out); return; }
  if (ds.asm) { toggleProfile(false); closeDrawer(); openAssessment(ds.asm); return; }
  if (ds.capOpen) { openCapability(ds.capOpen); return; }
  if (ds.export) { EXPORTS[ds.export](); if (st.view === 'Reports') render(true); return; }
  if (ds.tile) { st.map.sel = ds.tile; render(true); const b = document.querySelector(`[data-tile="${ds.tile}"]`); if (b) b.focus({ preventScroll: true }); return; }
  if (ds.mode) { st.map.mode = ds.mode; render(true); return; }
  if (ds.detailtab) { st.map.tab = ds.detailtab; render(true); const b = document.querySelector(`[data-detailtab="${ds.detailtab}"]`); if (b) b.focus({ preventScroll: true }); return; }
  if (ds.studioBand) { st.studio.band = st.studio.band === ds.studioBand ? 'all' : ds.studioBand; render(true); return; }
  if (ds.settingtab) { st.settings.tab = ds.settingtab; st.settings.errors = {}; st.settings.notes = {}; render(true); return; }
  if (ds.move) { S.moveRoadmap(ds.num, ds.move).then(r => { if (!r.ok) notify(r.error, 'error'); else { notify(r.note); const b = document.querySelector(`[data-move="${ds.move}"][data-num="${ds.num}"]`); if (b && !b.disabled) b.focus({ preventScroll: true }); else { const o = document.querySelector(`[data-num="${ds.num}"]:not([disabled])`); if (o) o.focus({ preventScroll: true }); } } }); return; }
  if (ds.voFilter) { st.vo = Object.assign(st.vo, { q: '', state: 'active' }); const [ef, vi] = ds.voFilter.split('|').map(Number); const m = S.opportunities().filter(o => o.effort === ef && o.value + o.business_impact === vi); if (m.length === 1) openOpp(m[0].number); else { go('Value & Opportunities'); notify(m.length + ' opportunities with effort ' + ef + ' and value + impact ' + vi + ': ' + m.map(o => o.number).join(', ')); } return; }
  const a = ds.action; if (!a) return;
  const L2 = st.lib;
  switch (a) {
    case 'closeModal': closeModal(); break;
    case 'runNow': closeModal(true); confirmRunNow(); break;
    case 'schedule': openSchedule(); break;
    case 'rules': openRules(); break;
    case 'ask': openAsk(); break;
    case 'needsMapping': if (isAdmin()) openMapping(); else notify(why('capability.edit'), 'error'); break;
    case 'evidence': openEvidence(t.dataset.cap); break;
    case 'print': window.print(); break;
    case 'exportCaps': EXPORTS['Capability estate'](); break;
    case 'exportOpps': EXPORTS['Opportunities'](); break;
    case 'exportOutcomes': EXPORTS['Business outcomes'](); break;
    case 'exportRoadmap': EXPORTS['Roadmap'](); break;
    case 'exportRuns': EXPORTS['Assessment runs'](); break;
    case 'exportDecisions': EXPORTS['Decision log'](); break;
    case 'resetMap': st.map.q = ''; st.map.mode = 'family'; render(true); break;
    case 'firstPage': L2.page = 0; L2.errors = {}; L2.note = ''; render(true); break;
    case 'prevPage': L2.page = Math.max(0, L2.page - 1); L2.errors = {}; L2.note = ''; render(true); break;
    case 'nextPage': L2.page++; L2.errors = {}; L2.note = ''; render(true); break;
    case 'lastPage': L2.page = libList().length - 1; L2.errors = {}; L2.note = ''; render(true); break;
    case 'clearLibrary': Object.assign(L2, { q: '', view: 'active', family: 'all', page: 0, errors: {}, note: '' }); render(true); break;
    case 'clearVo': st.vo = { family: 'all', phase: 'all', state: 'active', type: 'all', assigned: 'all', q: '', outStatus: st.vo.outStatus }; render(true); break;
    case 'scrollOutcomes': { const el = $('outcomeRegister'); if (el) el.scrollIntoView({ behavior: 'smooth' }); break; }
    case 'clearRoad': st.road = { owner: 'all', family: 'all', state: 'all' }; render(true); break;
    case 'showUnassigned': st.road.owner = 'none'; render(true); break;
    case 'resetRoadmap': result(S.resetRoadmap(), 'Roadmap back in priority order.'); break;
    case 'saveSettings': {
      const s = st.settings; s.errors = {}; s.notes = {}; let ok = 0;
      Object.keys(s.pending).reduce((p, k) => p.then(() => S.setProp('x_enno_pivot.' + k, s.pending[k], { reload: false }).then(r => { if (r.ok) { ok++; s.notes[k] = r.note; delete s.pending[k]; } else s.errors[k] = r.error; })), Promise.resolve())
        .then(() => S.refresh()).then(() => {
          render(true); const bad = Object.keys(s.errors).length;
          notify(bad ? bad + ' value' + (bad > 1 ? 's' : '') + ' not saved. See the messages.' : ok + ' setting' + (ok > 1 ? 's' : '') + ' saved.', bad ? 'error' : '');
          if (bad) { const f = $('set-' + Object.keys(s.errors)[0]); if (f) f.focus(); }
        });
      break;
    }
    case 'discardSettings': st.settings.pending = {}; st.settings.errors = {}; st.settings.notes = {}; render(true); notify('Changes discarded.'); break;
  }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr[tabindex], .kpi[tabindex]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Escape') { if ($('profileMenu')) { toggleProfile(false); document.querySelector('.profile-trigger').focus(); } const d = $('notificationDrawer'); if (d && !d.hidden) { closeDrawer(); $('notificationTrigger').focus(); } }
  if (e.target.id === 'globalSearch' && e.key === 'Enter') { e.preventDefault(); const q = e.target.value.trim(); if (q) setTimeout(() => openSearch(q), 0); }
});
document.addEventListener('input', e => {
  const id = e.target.id, v = e.target.value;
  if (id === 'mapSearch') { st.map.q = v; render(true); }
  else if (id === 'librarySearchInput') { st.lib.q = v; st.lib.page = 0; render(true); }
  else if (id === 'voSearch') { st.vo.q = v; render(true); }
  else if (e.target.dataset.prop && e.target.type !== 'checkbox') { st.settings.pending[e.target.dataset.prop] = v; delete st.settings.errors[e.target.dataset.prop]; const btns = document.querySelectorAll('[data-action="saveSettings"],[data-action="discardSettings"]'); btns.forEach(b => b.disabled = false); const sb = document.querySelector('[data-action="saveSettings"]'); if (sb) sb.textContent = 'Save settings (' + Object.keys(st.settings.pending).length + ')'; }
});
document.addEventListener('change', e => {
  const id = e.target.id, v = e.target.value;
  const map = { studioRun: () => st.studio.run = +v, studioFamily: () => st.studio.family = v, studioBand: () => st.studio.band = v, libraryView: () => { st.lib.view = v; st.lib.page = 0; }, libraryFamily: () => { st.lib.family = v; st.lib.page = 0; }, voFamily: () => st.vo.family = v, voPhase: () => st.vo.phase = v, voState: () => st.vo.state = v, voType: () => st.vo.type = v, voAssigned: () => st.vo.assigned = v, voOutStatus: () => st.vo.outStatus = v, roadOwner: () => st.road.owner = v, roadFamily: () => st.road.family = v, roadState: () => st.road.state = v, repFamily: () => st.reports.family = v };
  if (map[id]) { map[id](); render(true); return; }
  if (id === 'roleSelect') { S.setRole(v); notify('Previewing as ' + L.role[v] + '.'); return; }
  if (e.target.dataset.prop && e.target.type === 'checkbox') { st.settings.pending[e.target.dataset.prop] = e.target.checked; render(true); }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'capForm') {
    e.preventDefault(); const f = e.target, id = f.dataset.cap;
    S.updateCapability(id, { measure_table: f.measure_table.value.trim(), measure_filter: f.measure_filter.value, date_field: f.date_field.value.trim(), days_back: f.days_back.value, target: f.target.value, weight: f.weight.value, family: f.family.value }).then(r => {
    if (r.ok) { st.lib.errors = {}; st.lib.note = r.note; notify(r.note); render(true); } else { st.lib.errors = r.errors || {}; st.lib.note = ''; if (r.error) notify(r.error, 'error'); render(true); const first = document.querySelector('#capForm [aria-invalid="true"]'); if (first) first.focus(); } });
  }
});

S.subscribe(ev => {
  if (ev.type === 'role') { closeModal(true); toggleProfile(false); st.settings.pending = {}; st.settings.errors = {}; render(true); return; }
  if (ev.type === 'run') {
    if (ev.done) notify(ev.number + ' complete. "PIVOT run complete" email sent to ' + S.prop('admin_group') + '.');
    const live = ['Dashboard', 'Assessments', 'Analytics Studio', 'Reports'].includes(st.view) || ev.done;
    if (live && !document.activeElement.matches('input, textarea, select')) render(true); else renderTopbar();
    if (modal && (modal.live === 'run' || ev.done)) drawModal();
    return;
  }
  if (ev.type === 'settings' || ev.type === 'capability') st.lib.errors = st.lib.errors || {};
  render(true);
  if (modal) drawModal();
});

try { const startView = viewFromParam(new URL(window.location.href).searchParams.get('view')); if (startView) st.view = startView; } catch (e) { /* no address */ }
render();
}
