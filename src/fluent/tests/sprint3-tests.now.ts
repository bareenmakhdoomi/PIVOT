import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// ATF tests for the Sprint 3 rules (PIV-019.07, PIV-020.05, PIV-021.05, PIV-024.09, PIV-025.05, PIV-018.08).
// Data created by a test is rolled back by ATF when the test finishes.

Test({
    $id: Now.ID['atf-scoring-rules'],
    name: 'PIVOT – Scoring, Platform Value Score and utilization rules',
    description: 'Story examples: score 250/500 = 50, 800/500 = 100, licensed-not-installed = 0, no target = Not Measured; overall 50×1 + 100×3 = 88 (Not Measured left out); utilization 45/100 = 45%, empty without purchased count, 120% over-allocated.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-scoring-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var inst = { licensed: false, installed: true, target: 500 };
    assertEqual({ name: 'score 250 of 500', shouldbe: 50, value: R.scoreOf(inst, 250).score });
    assertEqual({ name: 'score 125 of 400 rounds to 31', shouldbe: 31, value: R.scoreOf({ licensed: false, installed: true, target: 400 }, 125).score });
    assertEqual({ name: 'score capped at 100', shouldbe: 100, value: R.scoreOf(inst, 800).score });
    assertEqual({ name: 'licensed not installed scores 0', shouldbe: 0, value: R.scoreOf({ licensed: true, installed: false, target: 500 }, null).score });
    assertEqual({ name: 'no target is Not Measured', shouldbe: 'not_measured', value: R.scoreOf({ licensed: false, installed: true, target: null }, 300).status });
    assertEqual({ name: 'target 0 is Not Measured', shouldbe: 'not_measured', value: R.scoreOf({ licensed: false, installed: true, target: 0 }, 300).status });
    assertEqual({ name: 'overall 88', shouldbe: 88, value: R.overallScore([{ score: 50, weight: 1 }, { score: 100, weight: 3 }]) });
    assertEqual({ name: 'overall ignores Not Measured', shouldbe: 88, value: R.overallScore([{ score: 50, weight: 1 }, { score: 100, weight: 3 }, { score: null, weight: 5 }]) });
    assertEqual({ name: 'overall empty without scores', shouldbe: true, value: R.overallScore([{ score: null, weight: 1 }]) === null });
    assertEqual({ name: 'utilization 45%', shouldbe: 45, value: R.utilizationOf(100, 45).utilization });
    assertEqual({ name: 'utilization empty without purchased', shouldbe: true, value: R.utilizationOf(null, 5).utilization === null });
    assertEqual({ name: 'utilization 120% not capped', shouldbe: 120, value: R.utilizationOf(100, 120).utilization });
    assertEqual({ name: 'over-allocated flag', shouldbe: true, value: R.utilizationOf(100, 120).overAllocated });
    stepResult.setOutputMessage('All scoring, overall score and utilization rules passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-assessment-run'],
    name: 'PIVOT – Assessment run: usage count, KPI, baseline capture and lock',
    description: 'Creates a capability measuring active incidents of the last 30 days and a manual KPI, runs two assessments and checks: the count equals a direct GlideAggregate count (PIV-018.08), score = actual ÷ target, the manual value is used and becomes the baseline (PIV-024.09, PIV-025.01), and the baseline does not change on the second run (PIV-025.05).',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-assessment-run-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize();
    cap.setValue('name', '[ATF] Incident usage'); cap.setValue('source', 'store_app'); cap.setValue('installed', true); cap.setValue('active', true);
    cap.setValue('measure_table', 'incident'); cap.setValue('measure_filter', 'active=true'); cap.setValue('date_field', 'sys_created_on');
    cap.setValue('days_back', 30); cap.setValue('target_value', 100); cap.setValue('weight', 1);
    var capId = cap.insert();
    var out = new GlideRecord('x_enno_pivot_business_outcome');
    out.initialize();
    out.setValue('capability', capId); out.setValue('objective', 'ATF manual KPI'); out.setValue('kpi', '[ATF] Manual KPI');
    out.setValue('direction', 'lower_better'); out.setValue('measurement_type', 'manual'); out.setValue('target', 50); out.setValue('period', 'monthly');
    out.setValue('manual_value', 72); out.setValue('manual_value_date', new GlideDateTime().getValue().split(' ')[0]);
    var outId = out.insert();

    var first = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'first run completes', shouldbe: true, value: first.ok });
    var ga = new GlideAggregate('incident');
    ga.addEncodedQuery('active=true');
    var from = new GlideDateTime(); from.addDaysUTC(-30);
    ga.addQuery('sys_created_on', '>=', from.getValue());
    ga.addAggregate('COUNT'); ga.query();
    var expected = ga.next() ? Number(ga.getAggregate('COUNT')) : 0;
    var res = new GlideRecord('x_enno_pivot_result');
    res.addQuery('assessment', first.sysId); res.addQuery('capability', capId); res.query();
    assertEqual({ name: 'one result for the capability', shouldbe: true, value: res.next() });
    assertEqual({ name: 'PIVOT count equals list count', shouldbe: expected, value: Number(res.getValue('actual_value')) });
    assertEqual({ name: 'score = actual / target x 100 (capped)', shouldbe: Math.round(Math.min(100, expected)), value: Number(res.getValue('score')) });

    out.get(outId);
    assertEqual({ name: 'manual value becomes the baseline', shouldbe: 72, value: Number(out.getValue('baseline')) });
    out.setValue('manual_value', 60); out.update();
    var second = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'second run completes', shouldbe: true, value: second.ok });
    out.get(outId);
    assertEqual({ name: 'baseline unchanged by later runs', shouldbe: 72, value: Number(out.getValue('baseline')) });
    assertEqual({ name: 'current value from the second run', shouldbe: 60, value: Number(out.getValue('current_value')) });
    stepResult.setOutputMessage('Count ' + expected + ', baseline 72 kept, current 60.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-baseline-lock'],
    name: 'PIVOT – Business owner cannot change a locked baseline',
    description: 'PIV-025.02 / .05: an outcome with a baseline is updated by a test user with only x_enno_pivot.business_owner; the change is refused and the baseline stays.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-baseline-lock-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize(); cap.setValue('name', '[ATF] Baseline capability'); cap.setValue('source', 'store_app'); cap.setValue('active', true);
    var capId = cap.insert();
    var out = new GlideRecord('x_enno_pivot_business_outcome');
    out.initialize();
    out.setValue('capability', capId); out.setValue('objective', 'ATF baseline lock'); out.setValue('kpi', '[ATF] Baseline lock');
    out.setValue('direction', 'higher_better'); out.setValue('measurement_type', 'manual'); out.setValue('target', 200); out.setValue('baseline', 120);
    outputs.record_id = out.insert();
    outputs.table = 'x_enno_pivot_business_outcome';
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-baseline-lock-user'],
        firstName: 'ATF',
        lastName: 'Business Owner',
        fieldValues: {},
        groups: [],
        roles: ['522249df388c4eed9cd2569ff4faf273'],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-baseline-lock-try'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var out = new GlideRecord('x_enno_pivot_business_outcome');
    out.addQuery('kpi', '[ATF] Baseline lock');
    out.orderByDesc('sys_created_on');
    out.query();
    if (!out.next()) return false;
    var id = out.getUniqueValue();
    out.setValue('owner', gs.getUserID());
    out.setValue('baseline', 110);
    out.update();
    var check = new GlideRecord('x_enno_pivot_business_outcome');
    check.get(id);
    assertEqual({ name: 'baseline still 120', shouldbe: 120, value: Number(check.getValue('baseline')) });
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
