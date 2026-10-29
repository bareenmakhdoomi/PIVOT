import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// PIV-026.09 / PIV-027.07 – improvement % and outcome status examples from the stories
Test({
    $id: Now.ID['atf-outcome-improvement-status'],
    name: 'PIVOT – Outcome improvement % and status rules',
    description: 'Higher is better: baseline 100, target 200 → actual 150 = 50% Improved, 250 = 150% On target, 90 = -10% Below target, 200 On target, 100 Below target. Lower is better: baseline 100, target 60 → 80 = 50% Improved, 110 = -25% Below target, 55 On target. Target equals baseline → empty improvement. No actual, no baseline or no target → Not Measured.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-outcome-improvement-status-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var H = function (b, t) { return { direction: 'higher_better', baseline: b, target: t }; };
    var L = function (b, t) { return { direction: 'lower_better', baseline: b, target: t }; };
    assertEqual({ name: 'higher 150 → 50%', shouldbe: 50, value: R.outcomeStatus(H(100, 200), 150).improvement });
    assertEqual({ name: 'higher 150 → Improved', shouldbe: 'improved', value: R.outcomeStatus(H(100, 200), 150).status });
    assertEqual({ name: 'higher 250 → 150% (not capped)', shouldbe: 150, value: R.outcomeStatus(H(100, 200), 250).improvement });
    assertEqual({ name: 'higher 250 → On target', shouldbe: 'on_target', value: R.outcomeStatus(H(100, 200), 250).status });
    assertEqual({ name: 'higher 90 → -10%', shouldbe: -10, value: R.outcomeStatus(H(100, 200), 90).improvement });
    assertEqual({ name: 'higher 200 → On target', shouldbe: 'on_target', value: R.outcomeStatus(H(100, 200), 200).status });
    assertEqual({ name: 'higher 100 → Below target', shouldbe: 'below_target', value: R.outcomeStatus(H(100, 200), 100).status });
    assertEqual({ name: 'lower 80 → 50%', shouldbe: 50, value: R.outcomeStatus(L(100, 60), 80).improvement });
    assertEqual({ name: 'lower 80 → Improved', shouldbe: 'improved', value: R.outcomeStatus(L(100, 60), 80).status });
    assertEqual({ name: 'lower 110 → -25%', shouldbe: -25, value: R.outcomeStatus(L(100, 60), 110).improvement });
    assertEqual({ name: 'lower 110 → Below target', shouldbe: 'below_target', value: R.outcomeStatus(L(100, 60), 110).status });
    assertEqual({ name: 'lower 55 → On target', shouldbe: 'on_target', value: R.outcomeStatus(L(100, 60), 55).status });
    assertEqual({ name: 'one decimal place', shouldbe: 32.9, value: R.outcomeStatus(L(100, 30), 77).improvement });
    assertEqual({ name: 'target = baseline → empty', shouldbe: true, value: R.outcomeStatus(H(100, 100), 150).improvement === null });
    assertEqual({ name: 'target = baseline reason', shouldbe: 'Target equals baseline', value: R.outcomeStatus(H(100, 100), 150).reason });
    assertEqual({ name: 'no actual → Not Measured', shouldbe: 'not_measured', value: R.outcomeStatus(H(100, 200), null).status });
    assertEqual({ name: 'no actual → empty improvement', shouldbe: true, value: R.outcomeStatus(H(100, 200), null).improvement === null });
    assertEqual({ name: 'no baseline → Not Measured', shouldbe: 'not_measured', value: R.outcomeStatus(H(null, 200), 150).status });
    assertEqual({ name: 'no target → Not Measured', shouldbe: 'No target set', value: R.outcomeStatus(H(100, null), 150).reason });
    stepResult.setOutputMessage('All improvement and outcome status examples passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
