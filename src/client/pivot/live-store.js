/* PIVOT live store (PIV-063).
 * Same API as the approved design's store, but every figure comes from the PIVOT tables through the
 * workspace REST API (ACLs applied on the server) and every change is sent to the server, which
 * validates it again. Reads are synchronous over the last snapshot; changes return Promises that
 * resolve after the server answered and the snapshot was reloaded.
 */
const SCOPE = 'x_enno_pivot';

const PROP_META = [
  ['utilization_threshold', 'Idle licence threshold', '%', 'Idle licences opportunity when utilization is below this.'],
  ['low_score_threshold', 'Low adoption threshold', 'score', 'Low adoption / adoption potential when the score is below this.'],
  ['high_usage_threshold', 'High usage threshold', 'score', 'Score that counts as high usage (weak outcome rule).'],
  ['default_days_back', 'Default look-back', 'days', 'Default look-back for new capabilities.'],
  ['priority_now', 'Priority for Now', '', 'Priority at or above this goes to Now.'],
  ['priority_next', 'Priority for Next', '', 'Priority at or above this (and below Now) goes to Next.'],
  ['slow_capability_seconds', 'Slow capability warning', 's', 'Log a warning when one capability takes longer.'],
  ['admin_group', 'Run email recipients', '', 'Who receives the run complete / failed emails.'],
  ['ai_enabled', 'AI features (Now Assist)', '', 'Turns all PIVOT AI features on or off. PIVOT works fully without them (NFR-AI-02).']
];
const PROP_TYPES = { admin_group: 'string', ai_enabled: 'boolean' };
const ROLE_RANK = ['viewer', 'business_owner', 'analyst', 'admin'];

export function createPV(first, api) {
  const T0 = Date.now();
  const clone = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
  const r1 = n => Math.round(n * 10) / 10;
  const r2 = n => Math.round(n * 100) / 100;

  const LABELS = {
    source: { subscription: 'Subscription', store_app: 'Store app', plugin: 'Plugin' },
    family: {}, status: { queued: 'Queued', running: 'Running', complete: 'Complete', failed: 'Failed', none: 'No run yet' },
    type: { shelfware: 'Shelfware', idle_licences: 'Idle licences', low_adoption: 'Low adoption', not_measured: 'Not measured', weak_outcome: 'Weak outcome', adoption_potential: 'Adoption potential' },
    state: { open: 'Open', accepted: 'Accepted', rejected: 'Rejected', done: 'Done' },
    phase: { now: 'Now', next: 'Next', later: 'Later' },
    outcome: { improved: 'Improved', on_target: 'On target', below_target: 'Below target', not_measured: 'Not measured' },
    direction: { higher_better: 'Higher is better', lower_better: 'Lower is better' },
    measurement: { calculated: 'Calculated', manual: 'Entered manually' },
    period: { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' },
    role: { viewer: 'Viewer', analyst: 'Analyst', business_owner: 'Business owner', admin: 'Admin' }
  };

  // D mirrors the design's data object; S holds the current snapshot.
  const D = { users: {}, personas: {}, families: [], instance: {}, properties: [] };
  const S = { me: '', realRoles: ['viewer'], role: 'viewer', props: {}, caps: [], assessments: [], results: {}, outcomeResults: {}, opps: [], roadmapSeq: {}, outcomes: [], logs: {}, serverNow: Date.now(), engine: false, ai: false };
  let listeners = [];
  const emit = e => listeners.slice().forEach(fn => { try { fn(e || {}); } catch (x) { console.error(x); } });
  const now = () => S.serverNow + (Date.now() - T0);

  function ingest(snap) {
    D.users = snap.users || {};
    D.families = snap.families || [];
    D.families.forEach(f => { LABELS.family[f.value] = f.label; });
    D.instance = snap.instance || {};
    S.me = snap.me.id;
    S.realRoles = snap.me.roles && snap.me.roles.length ? snap.me.roles : ['viewer'];
    if (!previewRoles().includes(S.role) || !S.loaded) S.role = snap.me.role || 'viewer';
    D.personas = { admin: S.me, analyst: S.me, business_owner: S.me, viewer: S.me };
    S.props = {};
    Object.keys(snap.properties || {}).forEach(k => {
      const v = snap.properties[k], t = PROP_TYPES[k] || 'number';
      S.props[SCOPE + '.' + k] = t === 'boolean' ? v === 'true' || v === true : t === 'string' ? String(v) : Number(v);
    });
    D.properties = PROP_META.map(([n, label, unit, help]) => ({ name: SCOPE + '.' + n, label, unit, help, value: PROP_TYPES[n] === 'boolean' ? true : PROP_TYPES[n] === 'string' ? '' : 0 }));
    S.caps = snap.capabilities || [];
    S.assessments = (snap.assessments || []).slice().sort((a, b) => (a.run_date || 0) - (b.run_date || 0));
    S.logs = snap.logs || {};
    S.results = snap.results || {};
    S.outcomeResults = snap.outcomeResults || {};
    S.outcomes = snap.outcomes || [];
    S.roadmapSeq = snap.roadmap || {};
    S.opps = (snap.opportunities || []).map(o => Object.assign(o, { phase: phaseOf(o.priority), activity: o.activity || [] }));
    S.serverNow = snap.now || Date.now();
    S.engine = !!snap.engineAvailable;
    S.ai = !!snap.aiAvailable;
    S.loaded = true;
  }

  function P(n) { return S.props[SCOPE + '.' + n]; }
  function phaseOf(p) { return p == null ? 'later' : p >= P('priority_now') ? 'now' : p >= P('priority_next') ? 'next' : 'later'; }
  function cap(id) { return S.caps.find(c => c.id === id); }
  function completedRuns() { return S.assessments.filter(a => a.status === 'complete'); }
  function latestRun() { const c = completedRuns(); return c[c.length - 1] || null; }
  function latestRes() { const a = latestRun(); return (a && S.results[a.number]) || {}; }
  function latestOutRes() { const a = latestRun(); return (a && S.outcomeResults[a.number]) || {}; }
  function measured(c) { return !!(c.installed && c.measure_table && c.target != null && c.target > 0); }
  function outcomeEval(o, actual) {
    if (actual == null || o.baseline == null || o.target == null) return { actual, improvement: null, status: 'not_measured' };
    const span = o.target - o.baseline, imp = span === 0 ? null : (actual - o.baseline) / span * 100;
    const reached = o.direction === 'lower_better' ? actual <= o.target : actual >= o.target;
    return { actual, improvement: imp == null ? null : r1(imp), status: reached ? 'on_target' : (imp > 0 ? 'improved' : 'below_target') };
  }
  function priorityReason(v, i, e, p) {
    const words = [];
    if (v >= 4) words.push('high value'); else if (v <= 2) words.push('low value');
    if (e <= 2) words.push('low effort'); else if (e >= 4) words.push('high effort');
    if (i === 0) words.push('no outcome data yet, so no business impact counted');
    return '(' + v + ' + ' + i + ') ÷ ' + e + ' = ' + fmt.pri(p) + (words.length ? ' – ' + words.join(', ') : '');
  }
  function previewRoles() {
    // Admins can preview every role; others their own roles and Viewer. The server always uses the real roles.
    const set = S.realRoles.includes('admin') ? ROLE_RANK.slice() : S.realRoles.concat(['viewer']);
    return ROLE_RANK.filter(r => set.includes(r)).reverse();
  }
  function can(action, rec) {
    const r = S.role;
    switch (action) {
      case 'assessment.run': return r === 'admin' && S.engine;
      case 'capability.edit': case 'capability.mapFamily': case 'outcome.baseline': case 'settings.edit': return r === 'admin';
      case 'opportunity.work': case 'roadmap.reorder': return r === 'analyst' || r === 'admin';
      case 'outcome.create': return r === 'business_owner' || r === 'admin';
      case 'outcome.edit': return r === 'admin' || (r === 'business_owner' && (!rec || rec.owner === S.me));
      case 'ai.suggest': return (r === 'analyst' || r === 'admin') && S.ai && !!P('ai_enabled');
      case 'ai.use': return S.ai && !!P('ai_enabled');
      case 'settings.view': case 'needsMapping.view': return r === 'admin';
      default: return true;
    }
  }
  const NETWORK_ERROR = 'PIVOT could not reach the instance. Check your connection and try again.';
  function reload() { return api.load().then(snap => { ingest(snap); emit({ type: 'data' }); }); }
  function act(body, opts) {
    return api.act(body)
      .then(r => {
        r = r || { ok: false, error: NETWORK_ERROR };
        if (r.ok && !(opts && opts.reload === false)) return reload().then(() => r, () => r);
        return r;
      })
      .catch(err => ({ ok: false, error: (err && err.message) || NETWORK_ERROR }));
  }
  const denied = msg => Promise.resolve({ ok: false, error: msg || 'Your role (' + LABELS.role[S.role] + ') cannot do this.' });

  const fmt = {
    num: (n, d) => (n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-GB', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 })),
    pct: n => (n == null ? '—' : Math.round(n) + '%'),
    score: n => (n == null ? '—' : String(Math.round(n))),
    pri: n => (n == null ? '—' : (Math.round(n * 100) / 100).toString()),
    date: t => (t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'),
    dateShort: t => (t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'),
    dateTime: t => { if (!t) return '—'; const d = new Date(t); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); },
    time: t => (t ? new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'),
    rel: t => {
      if (!t) return 'never'; const s = Math.round((now() - t) / 1000);
      if (s < 45) return 'just now'; if (s < 3600) return Math.round(s / 60) + ' min ago'; if (s < 86400) return Math.round(s / 3600) + ' h ago';
      const d = Math.round(s / 86400); return d === 1 ? 'yesterday' : d + ' days ago';
    },
    dur: ms => { if (ms == null) return '—'; const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m ? m + ' min ' + (s % 60) + ' s' : s + ' s'; },
    user: id => (id === 'system' ? 'System (weekly job)' : D.users[id] ? D.users[id].name : id ? 'Unknown user' : 'Unassigned'),
    label: (group, v) => (LABELS[group] && LABELS[group][v]) || v || '—'
  };

  const store = {
    data: D, now, labels: LABELS,
    subscribe(fn) { listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn); }; },
    refresh: () => reload().then(() => ({ ok: true }), err => ({ ok: false, error: (err && err.message) || NETWORK_ERROR })),
    role: () => S.role,
    previewRoles,
    setRole(r) { if (LABELS.role[r] && previewRoles().includes(r)) { S.role = r; emit({ type: 'role' }); } },
    user: () => Object.assign({ title: '' }, D.users[S.me], { title: (D.users[S.me] && D.users[S.me].title) || 'ServiceNow user' }),
    users: role => Object.keys(D.users).map(k => D.users[k]).filter(u => !role || u.role === role),
    can,
    hasRun: () => !!latestRun(),
    engineAvailable: () => S.engine,
    aiAvailable: () => S.ai,
    prop: n => S.props[n.indexOf('.') > -1 ? n : SCOPE + '.' + n],
    properties: () => D.properties.map(p => Object.assign(clone(p), { value: S.props[p.name] })),
    setProp(name, value, opts) {
      if (!can('settings.edit')) return denied();
      return act({ action: 'setProp', name, value }, opts);
    },

    // ----- capabilities -----
    capabilities(o) {
      o = o || {}; const res = latestRes(), q = (o.q || '').toLowerCase();
      const rows = S.caps.map(c => store._capRow(c, res)).filter(c => {
        if (q && (c.name + ' ' + c.scope + ' ' + c.number + ' ' + c.measure_table).toLowerCase().indexOf(q) < 0) return false;
        if (o.family && o.family !== 'all' && c.family !== o.family) return false;
        if (o.source && o.source !== 'all' && c.source !== o.source) return false;
        switch (o.view) {
          case 'active': return c.active;
          case 'licensed_not_installed': return c.licensed && !c.installed;
          case 'not_measured': return c.active && c.score == null && c.installed;
          case 'needs_mapping': return !c.family;
          case 'not_found': return c.not_found;
          case 'low': return c.score != null && c.score < P('low_score_threshold');
          case 'idle': return c.utilization != null && c.utilization < P('utilization_threshold');
        }
        return true;
      });
      const s = o.sort || { key: 'name', dir: 'asc' };
      rows.sort((x, y) => { const a1 = x[s.key], b1 = y[s.key]; if (a1 == null && b1 == null) return 0; if (a1 == null) return 1; if (b1 == null) return -1; return (a1 > b1 ? 1 : a1 < b1 ? -1 : 0) * (s.dir === 'desc' ? -1 : 1); });
      return rows;
    },
    _capRow(c, res) {
      const x = clone(c), r = (res || latestRes())[c.id] || {};
      x.score = r.score == null ? null : r.score; x.actual = r.actual == null ? null : r.actual;
      x.utilization = r.utilization != null ? r.utilization : null; x.measured = measured(c);
      x.familyLabel = c.family ? LABELS.family[c.family] || c.family : ''; x.sourceLabel = LABELS.source[c.source] || c.source || '—';
      x.openOpps = S.opps.filter(o => o.capability === c.id && (o.state === 'open' || o.state === 'accepted')).length;
      x.trend = completedRuns().slice(-8).map(a => { const rr = (S.results[a.number] || {})[c.id]; return rr && rr.score != null ? rr.score : null; });
      return x;
    },
    capability(id) {
      const c = cap(id); if (!c) return null; const x = store._capRow(c);
      x.results = completedRuns().slice(-8).map(a => {
        const r = clone((S.results[a.number] || {})[c.id]) || { score: null, actual: null, utilization: null, target: null, missing: true };
        r.licensed = c.licensed; r.installed = c.installed; r.assessment = a.number; r.date = a.run_date; return r;
      }).reverse();
      x.opportunities = store.opportunities({ capability: id, state: 'all' });
      x.outcomes = store.outcomes({ capability: id });
      x.linkedName = c.linked_app ? (cap(c.linked_app) || {}).name || '' : '';
      return x;
    },
    updateCapability(id, f) {
      if (!can('capability.edit')) return denied('Only PIVOT admins can change measurement settings.');
      return act({ action: 'updateCapability', id, fields: f });
    },
    mapFamily(ids, family) {
      if (!can('capability.mapFamily')) return denied('Only PIVOT admins can map product families.');
      return act({ action: 'mapFamily', ids, family });
    },

    // ----- assessments -----
    assessments: () => S.assessments.slice().reverse().map(a => Object.assign(clone(a), { byName: fmt.user(a.run_by) })),
    assessment(num) {
      const a = S.assessments.find(x => x.number === num); if (!a) return null; const x = clone(a);
      x.log = clone(S.logs[num] || []); x.byName = fmt.user(a.run_by);
      const res = S.results[num];
      if (res) {
        const vals = Object.keys(res).map(k => res[k]);
        x.counts = { capabilities: vals.length, scored: vals.filter(r => r.score != null).length, notMeasured: vals.filter(r => r.score == null).length, low: vals.filter(r => r.score != null && r.score < P('low_score_threshold')).length };
        x.opportunities = S.opps.filter(o => o.assessment === num).length;
      }
      const comp = completedRuns(), i = comp.findIndex(c => c.number === num); x.previousScore = i > 0 ? comp[i - 1].overall_score : null;
      return x;
    },
    latest() {
      const a = latestRun(); if (a) return store.assessment(a.number);
      const n = S.caps.filter(c => c.active).length;
      return { number: 'No run yet', none: true, run_date: null, run_by: 'system', byName: '—', trigger: 'Weekly schedule', status: 'none', duration: null, overall_score: null, previousScore: null, log: [], counts: { capabilities: n, scored: 0, notMeasured: n, low: 0 }, opportunities: S.opps.length };
    },
    running() { const r = S.assessments.find(a => a.status === 'running' || a.status === 'queued'); return r ? store.assessment(r.number) : null; },
    scoreHistory: () => S.assessments.map(a => ({ number: a.number, date: a.run_date, score: a.overall_score, status: a.status })),
    runNow() {
      if (!S.engine) return Promise.resolve({ ok: false, error: 'The assessment engine arrives in Sprint 4. Runs cannot be started from PIVOT yet.' });
      if (!can('assessment.run')) return denied('Only PIVOT admins can start a run.');
      return Promise.resolve({ ok: false, error: 'Run Now is not available yet.' });
    },

    // ----- opportunities -----
    opportunities(o) {
      o = o || {}; const q = (o.q || '').toLowerCase(), st = o.state || 'active';
      const rows = S.opps.filter(x => {
        if (st === 'active' && !(x.state === 'open' || x.state === 'accepted')) return false;
        if (st !== 'active' && st !== 'all' && x.state !== st) return false;
        if (o.type && o.type !== 'all' && x.type !== o.type) return false;
        if (o.phase && o.phase !== 'all' && x.phase !== o.phase) return false;
        if (o.capability && x.capability !== o.capability) return false;
        if (o.assigned === 'me' && x.assigned_to !== S.me) return false;
        if (o.assigned === 'unassigned' && x.assigned_to) return false;
        const c = cap(x.capability) || {};
        if (o.family && o.family !== 'all' && c.family !== o.family) return false;
        if (q && (x.number + ' ' + (c.name || '') + ' ' + x.description + ' ' + fmt.user(x.assigned_to)).toLowerCase().indexOf(q) < 0) return false;
        return true;
      }).map(store._oppRow);
      const s = o.sort || { key: 'priority', dir: 'desc' };
      rows.sort((a, b) => { const x = a[s.key], y = b[s.key]; if (x === y) return (b.priority || 0) - (a.priority || 0); if (x == null) return 1; if (y == null) return -1; return (x > y ? 1 : -1) * (s.dir === 'asc' ? 1 : -1); });
      return rows;
    },
    _oppRow(x) {
      const c = cap(x.capability) || { name: 'Capability not visible to you', family: '' }, y = clone(x);
      y.capabilityName = c.name; y.family = c.family; y.familyLabel = LABELS.family[c.family] || '';
      y.typeLabel = LABELS.type[x.type] || x.type || '—'; y.stateLabel = LABELS.state[x.state]; y.phaseLabel = LABELS.phase[x.phase]; y.assignedName = x.assigned_to ? fmt.user(x.assigned_to) : '';
      y.stale = !!c.stale; y.staleNote = c.staleNote || ''; return y;
    },
    opportunity(num) {
      const x = S.opps.find(o => o.number === num); if (!x) return null; const y = store._oppRow(x), c = cap(x.capability);
      y.capabilityRecord = c ? store._capRow(c) : { name: y.capabilityName, outcomes: [], entitled: null, allocated: null, target: null, score: null };
      y.capabilityRecord.outcomes = store.outcomes({ capability: x.capability });
      y.outcomeRecord = x.outcome ? store.outcome(x.outcome) : null; return y;
    },
    accept: num => (can('opportunity.work') ? act({ action: 'accept', number: num }) : denied()),
    reject: (num, reason) => (can('opportunity.work') ? act({ action: 'reject', number: num, reason }) : denied()),
    markDone: num => (can('opportunity.work') ? act({ action: 'done', number: num }) : denied()),
    assign: (num, userId) => (can('opportunity.work') ? act({ action: 'assign', number: num, user: userId || '' }) : denied()),
    addNote: (num, text) => (can('opportunity.work') ? act({ action: 'note', number: num, text }) : denied()),
    editScores: (num, f) => (can('opportunity.work') ? act({ action: 'scores', number: num, value: f.value, business_impact: f.business_impact, effort: f.effort }) : denied('Only analysts and admins can change value, impact or effort.')),
    preview(f) { const v = +f.value, i = +f.business_impact, e = +f.effort; if (!(e >= 1)) return null; const p = r2((v + i) / e); return { priority: p, phase: phaseOf(p), reason: priorityReason(v, i, e, p) }; },

    // ----- roadmap -----
    roadmap() {
      const out = { now: [], next: [], later: [] }; let manual = false;
      S.opps.filter(x => x.state === 'open' || x.state === 'accepted').map(store._oppRow).forEach(x => { out[x.phase].push(x); });
      Object.keys(out).forEach(ph => {
        out[ph].sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.number.localeCompare(b.number));
        const byPriority = out[ph].map(x => x.number), seq = x => (S.roadmapSeq[x.id] == null ? Infinity : S.roadmapSeq[x.id]);
        if (out[ph].some(x => S.roadmapSeq[x.id] != null)) out[ph].sort((a, b) => seq(a) - seq(b) || byPriority.indexOf(a.number) - byPriority.indexOf(b.number));
        const isManual = out[ph].some((x, i) => x.number !== byPriority[i]); manual = manual || isManual;
        out[ph].forEach((x, i) => { x.sequence = i + 1; x.manual = isManual; });
      });
      const a = latestRun(); out.assessment = a ? a.number : ''; out.manual = manual; return out;
    },
    moveRoadmap(num, dir) {
      if (!can('roadmap.reorder')) return denied('Only analysts and admins can change the roadmap order.');
      const rm = store.roadmap(), ph = ['now', 'next', 'later'].find(p => rm[p].some(x => x.number === num));
      if (!ph) return Promise.resolve({ ok: false, error: 'This opportunity is not on the roadmap.' });
      const list = rm[ph].map(x => x.number), i = list.indexOf(num), j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= list.length) return Promise.resolve({ ok: false, error: 'Already ' + (dir === 'up' ? 'first' : 'last') + ' in ' + LABELS.phase[ph] + '.' });
      list.splice(j, 0, list.splice(i, 1)[0]);
      return act({ action: 'reorder', phase: ph, numbers: list });
    },
    resetRoadmap: () => (can('roadmap.reorder') ? act({ action: 'resetRoadmap' }) : denied()),

    // ----- outcomes -----
    outcomes(o) {
      o = o || {}; const ores = latestOutRes();
      return S.outcomes.map(x => store._outRow(x, ores)).filter(x => {
        if (o.capability && x.capability !== o.capability) return false;
        if (o.status && o.status !== 'all' && o.status !== 'mine' && x.status !== o.status) return false;
        if (o.mine && x.owner !== S.me) return false; return true;
      });
    },
    _outRow(x, ores) {
      const y = clone(x), r = (ores || latestOutRes())[x.id] || outcomeEval(x, null);
      y.current_value = r.actual; y.improvement = r.improvement; y.status = r.status || 'not_measured'; y.statusLabel = LABELS.outcome[y.status];
      y.capabilityName = (cap(x.capability) || {}).name || ''; y.ownerName = fmt.user(x.owner);
      y.trend = completedRuns().slice(-8).map(a => { const rr = (S.outcomeResults[a.number] || {})[x.id]; return rr ? rr.actual : null; });
      return y;
    },
    outcome(id) {
      const x = S.outcomes.find(o => o.id === id); if (!x) return null; const y = store._outRow(x);
      y.results = completedRuns().slice(-8).map(a => { const r = clone((S.outcomeResults[a.number] || {})[id]) || { actual: null, improvement: null, status: 'not_measured' }; r.assessment = a.number; r.date = a.run_date; return r; }).reverse();
      y.baselineLocked = x.baseline != null; return y;
    },
    saveOutcome(f) {
      const isNew = !f.id, x = isNew ? null : S.outcomes.find(o => o.id === f.id);
      if (isNew ? !can('outcome.create') : !can('outcome.edit', x)) return denied(isNew ? 'Only business owners and admins can create outcomes.' : 'You can only edit outcomes you own.');
      return act({ action: 'saveOutcome', fields: f });
    },

    // ----- dashboard (B12) -----
    dashboard() {
      const a = store.latest(), caps = store.capabilities({ view: 'active' }), outs = store.outcomes(), rm = store.roadmap();
      const byStatus = { improved: 0, on_target: 0, below_target: 0, not_measured: 0 }; outs.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
      const licensed = caps.filter(c => c.licensed);
      return {
        assessment: a, score: a.overall_score, previousScore: a.previousScore, history: store.scoreHistory(),
        licensed: licensed.length, installed: licensed.filter(c => c.installed).length, licensedNotInstalled: licensed.filter(c => !c.installed),
        outcomesByStatus: byStatus, outcomes: outs,
        scores: caps.filter(c => c.score != null).sort((x, y) => x.score - y.score),
        utilization: caps.filter(c => c.utilization != null).sort((x, y) => x.utilization - y.utilization),
        kpiTrend: outs.filter(o => o.status !== 'not_measured'),
        topOpportunities: store.opportunities().slice(0, 10), roadmap: rm,
        notMeasured: { capabilities: caps.filter(c => c.score == null && c.installed && c.licensed), outcomes: outs.filter(o => o.status === 'not_measured') },
        insights: store.insights(), running: store.running(), needsMapping: S.caps.filter(c => !c.family).length
      };
    },
    insights() {
      const out = [], res = latestRes(), ores = latestOutRes();
      S.outcomes.forEach(o => {
        const r = res[o.capability], or = ores[o.id] || {}, c = cap(o.capability); if (!r || r.score == null || !c) return;
        if (r.score >= P('high_usage_threshold') && or.status === 'below_target') out.push({ kind: 'high_usage_below_target', capability: c.name, capabilityId: c.id, outcome: o.kpi, score: r.score, text: c.name + ' is used a lot (score ' + Math.round(r.score) + ') but “' + o.kpi + '” is below target.' });
        if (r.score < P('low_score_threshold') && o.important_objective) out.push({ kind: 'low_usage_important', capability: c.name, capabilityId: c.id, outcome: o.objective, score: r.score, text: c.name + ' has low usage (score ' + Math.round(r.score) + ') but supports an important objective: “' + o.objective + '”.' });
      });
      return out;
    },
    familySummary() {
      const rows = {}, caps = store.capabilities({ view: 'active' });
      caps.forEach(c => { const k = c.family || ''; const r = rows[k] = rows[k] || { family: k, label: k ? LABELS.family[k] : 'Needs mapping', count: 0, licensed: 0, installed: 0, scored: 0, scoreSum: 0, wSum: 0, opps: 0 };
        r.count++; if (c.licensed) r.licensed++; if (c.installed) r.installed++; if (c.score != null) { r.scored++; r.scoreSum += c.score * c.weight; r.wSum += c.weight; } r.opps += c.openOpps; });
      return Object.keys(rows).map(k => { const r = rows[k]; r.score = r.wSum ? r.scoreSum / r.wSum : null; return r; }).sort((a, b) => (a.family ? 0 : 1) - (b.family ? 0 : 1) || b.count - a.count);
    }
  };

  // AI (FR-AI-01 … 07) arrives with the AI sprint. Until then every AI entry point reports "not available"
  // and the workspace hides the AI panels (AI.enabled() is false). No sample answers are ever shown.
  const ai = {
    label: 'AI-generated',
    enabled: () => S.ai && !!P('ai_enabled'),
    stamp: () => { const a = latestRun(); return a ? 'AI-generated from ' + a.number + ', ' + fmt.date(a.run_date) : 'AI-generated'; },
    explain: () => null, briefing: () => null, suggestScores: () => null, suggestOwners: () => [], draftPlan: () => null,
    ask: () => ({ ok: false, answer: 'AI features are not available in this version of PIVOT yet.', items: [] })
  };

  ingest(first);
  return { store, ai, fmt, LABELS };
}

/** REST client for the PIVOT workspace API. Uses the platform session (X-UserToken); no other authentication. */
export function createApi(base) {
  const headers = () => ({ Accept: 'application/json', 'Content-Type': 'application/json', 'X-UserToken': (window.g_ck || '') });
  const handle = res => res.text().then(text => {
    let body = null; try { body = text ? JSON.parse(text) : null; } catch (e) { body = null; }
    const data = body && body.result !== undefined ? body.result : body;
    if (res.status === 401) throw new Error('Your ServiceNow session has ended. Reload the page to sign in again.');
    if (res.status === 403) throw new Error('You need a PIVOT role to use this workspace. Ask your PIVOT admin for access.');
    if (!res.ok) throw new Error((data && data.error) || (body && body.error && body.error.message) || 'PIVOT could not complete the request (HTTP ' + res.status + ').');
    return data;
  });
  return {
    load: () => fetch(base + '/bootstrap', { method: 'GET', headers: headers(), credentials: 'same-origin' }).then(handle),
    act: body => fetch(base + '/action', { method: 'POST', headers: headers(), credentials: 'same-origin', body: JSON.stringify(body) }).then(handle)
  };
}
