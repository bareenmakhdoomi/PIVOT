import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// Sprint 7 – PIV-044 ATF: scoring. Two tests, both in the "Scoring" child suite of "PIVOT Regression" (sprint7-suites.now.ts).
// Data created by a test is rolled back by ATF when the test finishes.

export const s7ScoringRules = Test({
    $id: Now.ID['atf-s7-scoring-rules'],
    name: 'PIVOT S7 – Scoring rules (PIV-044.03–.07)',
    description: 'Story examples on the scoring functions: 250/500 = 50, 750/500 = 100, 500/500 = 100, 0/500 = 0; licensed not installed = 0 even with a target; no target, no measure table and a missing table = Not Measured (empty, never 0); overall 80×3 + 40×1 with a Not Measured row = 70; utilization 120/200 = 60%, empty without a purchased count.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-scoring-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var inst = { licensed: false, installed: true, target: 500 };
    // PIV-044.03 – actual / target x 100; the assertion names the expected value, so a wrong return (e.g. 49) shows "expected 50"
    assertEqual({ name: 'PIV-044.03 score 250 of 500 = 50', shouldbe: 50, value: R.scoreOf(inst, 250).score });
    assertEqual({ name: 'PIV-044.03 status measured', shouldbe: 'measured', value: R.scoreOf(inst, 250).status });
    // PIV-044.04 – licensed but not installed = 0, even with a target and a value
    var shelf = R.scoreOf({ licensed: true, installed: false, target: 500 }, 250);
    assertEqual({ name: 'PIV-044.04 licensed not installed = 0', shouldbe: 0, value: shelf.score });
    assertEqual({ name: 'PIV-044.04 status not installed', shouldbe: 'not_installed', value: shelf.status });
    // PIV-044.05 – Not Measured, empty score
    var noTarget = R.scoreOf({ licensed: false, installed: true, target: null }, 250);
    assertEqual({ name: 'PIV-044.05 no target: Not Measured', shouldbe: 'not_measured', value: noTarget.status });
    assertEqual({ name: 'PIV-044.05 no target: score empty, not 0', shouldbe: true, value: noTarget.score === null });
    var noTable = R.scoreOf(inst, null, 'No measure table configured');
    assertEqual({ name: 'PIV-044.05 no measure table: Not Measured', shouldbe: 'not_measured', value: noTable.status });
    assertEqual({ name: 'PIV-044.05 no measure table: reason kept', shouldbe: 'No measure table configured', value: noTable.reason });
    var missing = R.scoreOf(inst, null, 'Measure table u_s7_missing does not exist on this instance');
    assertEqual({ name: 'PIV-044.05 missing table: score empty', shouldbe: true, value: missing.score === null });
    // PIV-044.06 – cap at 100, zero is a real 0
    assertEqual({ name: 'PIV-044.06 750 of 500 capped at 100', shouldbe: 100, value: R.scoreOf(inst, 750).score });
    assertEqual({ name: 'PIV-044.06 500 of 500 = 100', shouldbe: 100, value: R.scoreOf(inst, 500).score });
    assertEqual({ name: 'PIV-044.06 0 of 500 = 0', shouldbe: 0, value: R.scoreOf(inst, 0).score });
    assertEqual({ name: 'PIV-044.06 0 of 500 is measured, not Not Measured', shouldbe: 'measured', value: R.scoreOf(inst, 0).status });
    // PIV-044.07 – Platform Value Score and utilization
    assertEqual({ name: 'PIV-044.07 overall (80x3 + 40x1) / 4 = 70', shouldbe: 70, value: R.overallScore([{ score: 80, weight: 3 }, { score: 40, weight: 1 }, { score: null, weight: 2 }]) });
    assertEqual({ name: 'PIV-044.07 utilization 120 of 200 = 60%', shouldbe: 60, value: R.utilizationOf(200, 120).utilization });
    assertEqual({ name: 'PIV-044.07 no purchased count: utilization empty', shouldbe: true, value: R.utilizationOf(null, 120).utilization === null });
    assertEqual({ name: 'PIV-044.07 purchased 0: utilization empty', shouldbe: true, value: R.utilizationOf(0, 120).utilization === null });
    stepResult.setOutputMessage('PIV-044 scoring rules: all story examples passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7ScoringRun = Test({
    $id: Now.ID['atf-s7-scoring-run'],
    name: 'PIVOT S7 – Scoring in a full assessment run (PIV-044.01–.07)',
    description: 'Creates 250 usage rows in a PIVOT table (PIVOT only reads incident, PIV-016) and test capabilities with targets 500, 250, 125 and none, one licensed-not-installed, one without a measure table, one on a missing table and one licence with 120 of 200 allocated. Runs an assessment and checks every Result: actual, target, score, status and reason, the log line for the missing table, and that the Platform Value Score equals the weighted average of the run\'s Results. All data is rolled back.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-scoring-run-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var TAG = 'ATFS7-usage-', USAGE_TABLE = 'x_enno_pivot_security_test_log';
    // PIV-044.01 – this step only runs when the ATF runner is enabled; the run below must not be blocked by another run
    assertEqual({ name: 'PIV-044.01 no other assessment queued or running', shouldbe: true, value: A.busyRun() === null });

    // PIV-044.02 – test data: 250 usage rows in the last 30 days
    var row = new GlideRecord(USAGE_TABLE), made = 0;
    for (var i = 1; i <= 250; i++) {
        row.initialize();
        row.setValue('check_name', TAG + i);
        row.setValue('result', 'pass');
        row.setValue('role', 'x_enno_pivot.viewer');
        row.setValue('table_name', 'x_enno_pivot_capability');
        row.setValue('expected_result', 'ATF Sprint 7 usage row');
        if (row.insert()) made++;
    }
    assertEqual({ name: 'PIV-044.02 250 usage rows created', shouldbe: 250, value: made });

    var caps = {};
    var cap = function (key, f) {
        var c = new GlideRecord('x_enno_pivot_capability');
        c.initialize();
        c.setValue('name', '[ATF S7] ' + key);
        c.setValue('source', 'store_app');
        c.setValue('active', true);
        c.setValue('installed', true);
        c.setValue('licensed', false);
        c.setValue('weight', 1);
        c.setValue('days_back', 30);
        c.setValue('date_field', 'sys_created_on');
        for (var k in f) c.setValue(k, f[k]);
        caps[key] = c.insert();
        assertEqual({ name: 'PIV-044.02 test capability saved: ' + key, shouldbe: true, value: !!caps[key] });
    };
    var usage = 'check_nameSTARTSWITH' + TAG;
    cap('half 250 of 500', { measure_table: USAGE_TABLE, measure_filter: usage, target_value: 500, weight: 3 });
    cap('equal 250 of 250', { measure_table: USAGE_TABLE, measure_filter: usage, target_value: 250 });
    cap('over 250 of 125', { measure_table: USAGE_TABLE, measure_filter: usage, target_value: 125 });
    cap('zero 0 of 500', { measure_table: USAGE_TABLE, measure_filter: 'check_nameSTARTSWITHATFS7-none-', target_value: 500 });
    cap('licensed not installed', { licensed: true, installed: false, measure_table: USAGE_TABLE, measure_filter: usage, target_value: 500 });
    cap('no target', { measure_table: USAGE_TABLE, measure_filter: usage });
    cap('no measure table', { target_value: 500 });
    cap('missing table', { measure_table: 'u_s7_missing', target_value: 500 });
    cap('licence 120 of 200', { licensed: true, entitled_count: 200, allocated_count: 120, measure_table: USAGE_TABLE, measure_filter: usage, target_value: 500 });
    cap('licence no purchased count', { licensed: true, allocated_count: 120, measure_table: USAGE_TABLE, measure_filter: usage, target_value: 500 });

    var run = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'assessment run completes: ' + run.message, shouldbe: true, value: run.ok });
    if (!run.ok) return false;

    var result = function (key) {
        var r = new GlideRecord('x_enno_pivot_result');
        r.addQuery('assessment', run.sysId);
        r.addQuery('capability', caps[key]);
        r.query();
        return r.next() ? r : null;
    };
    var val = function (r, f) { var v = r.getValue(f); return v === null || v === '' ? null : Number(v); };
    var check = function (story, key, actual, target, score, status) {
        var r = result(key);
        assertEqual({ name: story + ' ' + key + ': one Result', shouldbe: true, value: !!r });
        if (!r) return null;
        assertEqual({ name: story + ' ' + key + ': actual', shouldbe: actual, value: val(r, 'actual_value') });
        assertEqual({ name: story + ' ' + key + ': target on the Result (traceable)', shouldbe: target, value: val(r, 'target_value') });
        assertEqual({ name: story + ' ' + key + ': score', shouldbe: score, value: val(r, 'score') });
        assertEqual({ name: story + ' ' + key + ': status', shouldbe: status, value: r.getValue('measurement_status') });
        return r;
    };
    check('PIV-044.03', 'half 250 of 500', 250, 500, 50, 'measured');
    check('PIV-044.06', 'equal 250 of 250', 250, 250, 100, 'measured');
    check('PIV-044.06', 'over 250 of 125', 250, 125, 100, 'measured');
    check('PIV-044.06', 'zero 0 of 500', 0, 500, 0, 'measured');
    check('PIV-044.04', 'licensed not installed', null, 500, 0, 'not_installed');
    var nt = check('PIV-044.05', 'no target', 250, null, null, 'not_measured');
    if (nt) assertEqual({ name: 'PIV-044.05 no target: reason', shouldbe: 'No target set', value: nt.getValue('reason') });
    var nm = check('PIV-044.05', 'no measure table', null, 500, null, 'not_measured');
    if (nm) assertEqual({ name: 'PIV-044.05 no measure table: reason', shouldbe: 'No measure table configured', value: nm.getValue('reason') });
    var mt = check('PIV-044.05', 'missing table', null, 500, null, 'not_measured');
    if (mt) assertEqual({ name: 'PIV-044.05 missing table: reason names the table', shouldbe: 'Measure table u_s7_missing does not exist on this instance', value: mt.getValue('reason') });

    var a = new GlideRecord('x_enno_pivot_assessment');
    a.get(run.sysId);
    var logText = a.getValue('log') || '';
    assertEqual({ name: 'PIV-044.05 run log records the skipped table', shouldbe: true, value: logText.indexOf('[ATF S7] missing table') > -1 && logText.indexOf('u_s7_missing') > -1 });

    // PIV-044.07 – utilization on the Result, and the Platform Value Score is the weighted average of this run's Results
    var lic = result('licence 120 of 200');
    assertEqual({ name: 'PIV-044.07 utilization 120 of 200 = 60', shouldbe: 60, value: lic ? val(lic, 'utilization') : -1 });
    var noPur = result('licence no purchased count');
    assertEqual({ name: 'PIV-044.07 no purchased count: utilization empty', shouldbe: null, value: noPur ? val(noPur, 'utilization') : -1 });
    var rows = [], all = new GlideRecord('x_enno_pivot_result');
    all.addQuery('assessment', run.sysId);
    all.query();
    while (all.next()) rows.push({ score: val(all, 'score'), weight: val(all, 'weight') });
    assertEqual({ name: 'PIV-044.07 Platform Value Score = weighted average of the Results', shouldbe: R.overallScore(rows), value: val(a, 'overall_score') });
    stepResult.setOutputMessage('PIV-044 scoring in a full run (' + run.number + '): ' + rows.length + ' Results checked.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
