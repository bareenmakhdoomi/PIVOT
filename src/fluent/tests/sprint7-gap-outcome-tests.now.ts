import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// Sprint 7 – PIV-045 ATF: gap rules and business outcomes. Child suites "Gap Rules" and "Outcomes" (sprint7-suites.now.ts).
// Data created by a test is rolled back by ATF when the test finishes.

export const s7GapRules = Test({
    $id: Now.ID['atf-s7-gap-rules'],
    name: 'PIVOT S7 – Gap rules (PIV-045.01–.04)',
    description: 'Thresholds utilization 60, low score 40, high usage 70. Idle licences at 40% (Now) with 40% in the text, none at exactly 60%; shelfware for licensed not installed; low adoption at 35 but not when low volume is expected; Not measured; weak outcome for score 90 with a Below Target KPI; adoption potential for score 20 on an important objective.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-gap-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var T = { utilization: 60, lowScore: 40, highUsage: 70 };
    var base = function (f) {
        var c = { name: 'ATF cap', licensed: false, installed: true, score: 80, utilization: null, purchased: null, allocated: null };
        for (var k in f) c[k] = f[k];
        return c;
    };
    var out = function (f) {
        var o = { kpi: 'ATF KPI', status: 'on_target', active: true, important: false, lowVolume: false, current: null, target: null };
        for (var k in f) o[k] = f[k];
        return o;
    };
    var types = function (c, outs) { var g = R.evaluateGaps(base(c), outs || [], T).gaps, t = []; for (var i = 0; i < g.length; i++) t.push(g[i].type); return t.join(','); };
    // PIV-045.01 – the default thresholds the gap rules read
    assertEqual({ name: 'PIV-045.01 default utilization threshold 60', shouldbe: '60', value: R.PROPERTIES.utilization_threshold.def });
    assertEqual({ name: 'PIV-045.01 default low score threshold 40', shouldbe: '40', value: R.PROPERTIES.low_score_threshold.def });
    // PIV-045.02 – idle licences
    var idle = R.evaluateGaps(base({ licensed: true, purchased: 100, allocated: 40, utilization: 40 }), [], T);
    assertEqual({ name: 'PIV-045.02 40% utilization: idle licences', shouldbe: 'idle_licences', value: idle.gaps.length ? idle.gaps[0].type : '' });
    var cfg = R.gapConfig('');
    var text = R.fillTemplate(cfg.idle_licences.text, { capability: 'ATF cap', measured: idle.gaps[0] ? idle.gaps[0].measured : '', threshold: 60, purchased: 100, allocated: 40 });
    assertEqual({ name: 'PIV-045.02 description mentions 40%', shouldbe: true, value: text.indexOf('40%') > -1 });
    var phase = R.roadmapPhase(R.priorityOf(cfg.idle_licences.value, null, cfg.idle_licences.effort), 2, 1);
    assertEqual({ name: 'PIV-045.02 idle licences lands in Now (value 4, effort 2)', shouldbe: 'now', value: phase });
    assertEqual({ name: 'PIV-045.02 exactly 60%: no gap', shouldbe: '', value: types({ licensed: true, purchased: 100, allocated: 60, utilization: 60 }) });
    // PIV-045.03 – shelfware and low adoption
    assertEqual({ name: 'PIV-045.03 licensed not installed: shelfware', shouldbe: 'shelfware', value: types({ licensed: true, installed: false, score: 0 }) });
    assertEqual({ name: 'PIV-045.03 score 35 < 40: low adoption', shouldbe: 'low_adoption', value: types({ score: 35 }) });
    var lv = R.evaluateGaps(base({ score: 35 }), [out({ lowVolume: true })], T);
    assertEqual({ name: 'PIV-045.03 low volume expected: no low adoption', shouldbe: 0, value: lv.gaps.length });
    assertEqual({ name: 'PIV-045.03 low volume expected: note explains why', shouldbe: true, value: lv.notes.join(' ').indexOf('low volume expected') > -1 });
    // PIV-045.04 – not measured, weak outcome, adoption potential
    assertEqual({ name: 'PIV-045.04 licensed, installed, no score: not measured', shouldbe: 'not_measured', value: types({ licensed: true, score: null, purchased: 10, utilization: 90 }) });
    assertEqual({ name: 'PIV-045.04 score 90 + Below Target: weak outcome', shouldbe: 'weak_outcome', value: types({ score: 90 }, [out({ status: 'below_target', current: 30, target: 50 })]) });
    assertEqual({ name: 'PIV-045.04 score 20 + important objective: adoption potential', shouldbe: 'low_adoption,adoption_potential', value: types({ score: 20 }, [out({ important: true })]) });
    assertEqual({ name: 'PIV-045.04 inactive outcome is ignored', shouldbe: '', value: types({ score: 90 }, [out({ status: 'below_target', active: false })]) });
    stepResult.setOutputMessage('PIV-045.01–.04 gap rules: all story examples passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7GapRecords = Test({
    $id: Now.ID['atf-s7-gap-records'],
    name: 'PIVOT S7 – Gap rules on records: no duplicates, closed stay closed (PIV-045.01, .05)',
    description: 'Sets the thresholds to 60/40/70, creates test capabilities with Results (idle 40%, low adoption 35, shelfware) on a test assessment and runs the gap rules twice: the second run creates nothing new. Then one opportunity is Rejected and one Done; a third run keeps them closed and creates no duplicates. All data is rolled back.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-gap-records-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var G = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/gaps.ts');
    // PIV-045.01 – thresholds 60 / 40 / 70 (set only when different; rolled back)
    var setProp = function (name, value) {
        var p = new GlideRecord('sys_properties');
        if (p.get('name', 'x_enno_pivot.' + name) && p.getValue('value') !== value) { p.setValue('value', value); p.update(); }
        assertEqual({ name: 'PIV-045.01 ' + name + ' = ' + value, shouldbe: value, value: String(gs.getProperty('x_enno_pivot.' + name, value)) });
    };
    setProp('utilization_threshold', '60');
    setProp('low_score_threshold', '40');
    setProp('high_usage_threshold', '70');

    var asm = new GlideRecord('x_enno_pivot_assessment');
    asm.initialize();
    asm.setValue('status', 'complete');
    asm.setValue('trigger', 'run_now');
    var asmId = asm.insert();
    asm.get(asmId);
    var number = asm.getValue('number');
    var caps = {};
    var cap = function (key, f, res) {
        var c = new GlideRecord('x_enno_pivot_capability');
        c.initialize();
        c.setValue('name', '[ATF S7 gap] ' + key);
        c.setValue('source', 'store_app');
        c.setValue('active', true);
        c.setValue('installed', true);
        c.setValue('licensed', false);
        for (var k in f) c.setValue(k, f[k]);
        caps[key] = c.insert();
        var r = new GlideRecord('x_enno_pivot_result');
        r.initialize();
        r.setValue('assessment', asmId);
        r.setValue('capability', caps[key]);
        for (var j in res) r.setValue(j, res[j]);
        r.insert();
    };
    cap('idle 40%', { licensed: true, entitled_count: 100, allocated_count: 40 }, { score: 80, utilization: 40 });
    cap('low 35', {}, { score: 35 });
    cap('shelfware', { licensed: true, installed: false }, { score: 0 });
    var count = function (key, type, state) {
        var o = new GlideRecord('x_enno_pivot_opportunity');
        o.addQuery('capability', caps[key]);
        o.addQuery('type', type);
        if (state) o.addQuery('state', state);
        o.query();
        return o.getRowCount();
    };
    var noop = function () {};
    var first = G.runGapRules(asmId, number, noop);
    assertEqual({ name: 'first run: idle licences opportunity', shouldbe: 1, value: count('idle 40%', 'idle_licences') });
    assertEqual({ name: 'first run: low adoption opportunity', shouldbe: 1, value: count('low 35', 'low_adoption') });
    assertEqual({ name: 'first run: shelfware opportunity', shouldbe: 1, value: count('shelfware', 'shelfware') });
    var o = new GlideRecord('x_enno_pivot_opportunity');
    o.addQuery('capability', caps['idle 40%']);
    o.query();
    o.next();
    assertEqual({ name: 'PIV-045.02 idle description mentions 40%', shouldbe: true, value: String(o.getValue('description')).indexOf('40%') > -1 });

    // PIV-045.05 – second run: no duplicates
    G.runGapRules(asmId, number, noop);
    assertEqual({ name: 'PIV-045.05 second run: still one idle licences opportunity', shouldbe: 1, value: count('idle 40%', 'idle_licences') });
    assertEqual({ name: 'PIV-045.05 second run: still one low adoption opportunity', shouldbe: 1, value: count('low 35', 'low_adoption') });
    assertEqual({ name: 'PIV-045.05 second run: still one shelfware opportunity', shouldbe: 1, value: count('shelfware', 'shelfware') });

    // PIV-045.05 – Rejected and Done are not reopened
    var close = function (key, type, state) {
        var x = new GlideRecord('x_enno_pivot_opportunity');
        x.addQuery('capability', caps[key]);
        x.addQuery('type', type);
        x.query();
        if (!x.next()) return false;
        if (state === 'done') { x.setValue('state', 'accepted'); x.update(); }
        x.setValue('state', state);
        if (state === 'rejected') x.setValue('rejection_reason', 'ATF Sprint 7: not relevant for this test');
        return !!x.update();
    };
    assertEqual({ name: 'reject the low adoption opportunity', shouldbe: true, value: close('low 35', 'low_adoption', 'rejected') });
    assertEqual({ name: 'close the shelfware opportunity as Done', shouldbe: true, value: close('shelfware', 'shelfware', 'done') });
    var third = G.runGapRules(asmId, number, noop);
    assertEqual({ name: 'PIV-045.05 Rejected stays Rejected', shouldbe: 1, value: count('low 35', 'low_adoption', 'rejected') });
    assertEqual({ name: 'PIV-045.05 no new low adoption opportunity', shouldbe: 1, value: count('low 35', 'low_adoption') });
    assertEqual({ name: 'PIV-045.05 Done stays Done', shouldbe: 1, value: count('shelfware', 'shelfware', 'done') });
    assertEqual({ name: 'PIV-045.05 no new shelfware opportunity', shouldbe: 1, value: count('shelfware', 'shelfware') });
    assertEqual({ name: 'PIV-045.05 run reports the closed gaps as kept', shouldbe: true, value: third.kept >= 2 });
    stepResult.setOutputMessage('PIV-045.05: first run created ' + first.created + '; later runs made no duplicates and kept Rejected/Done closed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7OutcomeRules = Test({
    $id: Now.ID['atf-s7-outcome-rules'],
    name: 'PIVOT S7 – Outcome improvement % (PIV-045.06)',
    description: 'Lower is better 100 → 60, actual 80 = 50% Improved; higher is better 50 → 100, actual 100 = 100% On Target; actual 40 = Below Target; no value = Not Measured.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-outcome-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var lower = R.outcomeStatus({ baseline: 100, target: 60, direction: 'lower_better' }, 80);
    assertEqual({ name: 'PIV-045.06 lower is better 100 to 60, actual 80: 50%', shouldbe: 50, value: lower.improvement });
    assertEqual({ name: 'PIV-045.06 lower is better: Improved', shouldbe: 'improved', value: lower.status });
    var higher = R.outcomeStatus({ baseline: 50, target: 100, direction: 'higher_better' }, 100);
    assertEqual({ name: 'PIV-045.06 higher is better 50 to 100, actual 100: 100%', shouldbe: 100, value: higher.improvement });
    assertEqual({ name: 'PIV-045.06 higher is better: On Target', shouldbe: 'on_target', value: higher.status });
    var below = R.outcomeStatus({ baseline: 50, target: 100, direction: 'higher_better' }, 40);
    assertEqual({ name: 'PIV-045.06 actual 40: Below Target', shouldbe: 'below_target', value: below.status });
    var none = R.outcomeStatus({ baseline: 50, target: 100, direction: 'higher_better' }, null);
    assertEqual({ name: 'PIV-045.07 no value: Not Measured', shouldbe: 'not_measured', value: none.status });
    assertEqual({ name: 'PIV-045.07 no value: improvement empty', shouldbe: true, value: none.improvement === null });
    stepResult.setOutputMessage('PIV-045.06 improvement and status rules passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7OutcomeRun = Test({
    $id: Now.ID['atf-s7-outcome-run'],
    name: 'PIVOT S7 – Outcomes in a full assessment run (PIV-045.06–.07)',
    description: 'Creates outcomes on a test capability (manual lower-is-better, manual higher-is-better on and below target, calculated KPI on 250 PIVOT rows, a manual KPI without a value and a calculated KPI on a missing table), runs an assessment and checks every Outcome Result: actual, improvement %, status and reason. The run still completes. All data is rolled back.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-outcome-run-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var TAG = 'ATFS7-kpi-', TABLE = 'x_enno_pivot_security_test_log';
    var row = new GlideRecord(TABLE);
    for (var i = 1; i <= 250; i++) {
        row.initialize();
        row.setValue('check_name', TAG + i);
        row.setValue('result', 'pass');
        row.setValue('role', 'x_enno_pivot.viewer');
        row.setValue('table_name', 'x_enno_pivot_capability');
        row.setValue('expected_result', 'ATF Sprint 7 KPI row');
        row.insert();
    }
    var c = new GlideRecord('x_enno_pivot_capability');
    c.initialize();
    c.setValue('name', '[ATF S7] outcome capability');
    c.setValue('source', 'store_app');
    c.setValue('active', true);
    c.setValue('installed', true);
    var capId = c.insert();
    var today = new GlideDateTime().getValue().split(' ')[0];
    var outs = {};
    var outcome = function (key, f) {
        var o = new GlideRecord('x_enno_pivot_business_outcome');
        o.initialize();
        o.setValue('capability', capId);
        o.setValue('objective', 'ATF Sprint 7 outcome check');
        o.setValue('kpi', '[ATF S7] ' + key);
        o.setValue('period', 'monthly');
        o.setValue('active', true);
        for (var k in f) o.setValue(k, f[k]);
        outs[key] = o.insert();
        assertEqual({ name: 'test outcome saved: ' + key, shouldbe: true, value: !!outs[key] });
    };
    outcome('lower 100 to 60, actual 80', { direction: 'lower_better', measurement_type: 'manual', baseline: 100, target: 60, manual_value: 80, manual_value_date: today });
    outcome('higher 50 to 100, actual 100', { direction: 'higher_better', measurement_type: 'manual', baseline: 50, target: 100, manual_value: 100, manual_value_date: today });
    outcome('higher 50 to 100, actual 40', { direction: 'higher_better', measurement_type: 'manual', baseline: 50, target: 100, manual_value: 40, manual_value_date: today });
    outcome('calculated 50 to 450, actual 250', { direction: 'higher_better', measurement_type: 'calculated', kpi_table: TABLE, kpi_filter: 'check_nameSTARTSWITH' + TAG, kpi_aggregate: 'count', baseline: 50, target: 450 });
    outcome('manual without a value', { direction: 'higher_better', measurement_type: 'manual', baseline: 50, target: 100 });
    outcome('missing KPI table', { direction: 'higher_better', measurement_type: 'calculated', kpi_table: 'u_s7_missing_kpi', kpi_aggregate: 'count', baseline: 50, target: 100 });

    var run = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'PIV-045.07 the run completes: ' + run.message, shouldbe: true, value: run.ok });
    if (!run.ok) return false;
    var val = function (r, f) { var v = r.getValue(f); return v === null || v === '' ? null : Number(v); };
    var check = function (story, key, actual, improvement, status) {
        var r = new GlideRecord('x_enno_pivot_outcome_result');
        r.addQuery('assessment', run.sysId);
        r.addQuery('outcome', outs[key]);
        r.query();
        var found = r.next();
        assertEqual({ name: story + ' ' + key + ': one Outcome Result', shouldbe: true, value: found });
        if (!found) return null;
        assertEqual({ name: story + ' ' + key + ': actual', shouldbe: actual, value: val(r, 'actual') });
        assertEqual({ name: story + ' ' + key + ': improvement %', shouldbe: improvement, value: val(r, 'improvement_pct') });
        assertEqual({ name: story + ' ' + key + ': status', shouldbe: status, value: r.getValue('outcome_status') });
        return r;
    };
    check('PIV-045.06', 'lower 100 to 60, actual 80', 80, 50, 'improved');
    check('PIV-045.06', 'higher 50 to 100, actual 100', 100, 100, 'on_target');
    check('PIV-045.06', 'higher 50 to 100, actual 40', 40, -20, 'below_target');
    check('PIV-045.06', 'calculated 50 to 450, actual 250', 250, 50, 'improved');
    var nv = check('PIV-045.07', 'manual without a value', null, null, 'not_measured');
    if (nv) assertEqual({ name: 'PIV-045.07 missing KPI value: reason', shouldbe: 'No manual value entered', value: nv.getValue('reason') });
    var mt = check('PIV-045.07', 'missing KPI table', null, null, 'not_measured');
    if (mt) assertEqual({ name: 'PIV-045.07 missing KPI table: reason names the table', shouldbe: 'KPI table u_s7_missing_kpi does not exist on this instance', value: mt.getValue('reason') });
    stepResult.setOutputMessage('PIV-045.06–.07 outcomes in ' + run.number + ': all Outcome Results match.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
