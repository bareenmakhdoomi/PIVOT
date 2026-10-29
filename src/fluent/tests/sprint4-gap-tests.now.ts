import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// PIV-028.09 / PIV-029.07 – the six gap rules with the story examples
Test({
    $id: Now.ID['atf-gap-rules'],
    name: 'PIVOT – Gap rules (shelfware, idle, low adoption, not measured, weak outcome, adoption potential)',
    description: 'Thresholds utilization 60, low score 40, high usage 70. Licensed not installed → Shelfware. Utilization 45 → Idle licences, 60 → none. No purchase count → note. Score 32 → Low adoption, 40 → none. Licensed, installed, no score → Not measured. Score 85 with a below-target outcome → Weak outcome. Low volume expected → no Low adoption, with a note. Score 30 on an important active outcome → Adoption potential. Shelfware text from the template.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-gap-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var L = { utilization: 60, lowScore: 40, highUsage: 70 };
    var cap = function (o) { var c = { name: 'X', licensed: false, installed: true, score: null, utilization: null, purchased: null, allocated: null }; for (var k in o) c[k] = o[k]; return c; };
    var out = function (o) { var c = { kpi: 'KPI A', status: 'not_measured', active: true, important: false, lowVolume: false, current: 100, target: 200 }; for (var k in o) c[k] = o[k]; return c; };
    var types = function (c, outs, l) { var g = R.evaluateGaps(cap(c), outs || [], l || L).gaps, t = []; for (var i = 0; i < g.length; i++) t.push(g[i].type); return t.sort().join(','); };
    assertEqual({ name: 'licensed, not installed → Shelfware', shouldbe: 'shelfware', value: types({ licensed: true, installed: false, purchased: 100, utilization: 80 }) });
    assertEqual({ name: 'not licensed → no Shelfware', shouldbe: '', value: types({ licensed: false, installed: true, score: 80 }) });
    assertEqual({ name: 'utilization 45 → Idle licences', shouldbe: 'idle_licences', value: types({ licensed: true, installed: true, score: 80, purchased: 100, utilization: 45 }) });
    assertEqual({ name: 'utilization 60 (= threshold) → none', shouldbe: '', value: types({ licensed: true, installed: true, score: 80, purchased: 100, utilization: 60 }) });
    assertEqual({ name: 'threshold 70, utilization 65 → Idle licences', shouldbe: 'idle_licences', value: types({ licensed: true, installed: true, score: 80, purchased: 100, utilization: 65 }, [], { utilization: 70, lowScore: 40, highUsage: 70 }) });
    assertEqual({ name: 'no purchase count → note', shouldbe: 'Utilization not calculated: no purchase count', value: R.evaluateGaps(cap({ licensed: true, installed: true, score: 80, purchased: 0 }), [], L).notes[0] });
    assertEqual({ name: 'score 32 → Low adoption', shouldbe: 'low_adoption', value: types({ score: 32 }) });
    assertEqual({ name: 'score 40 (= threshold) → none', shouldbe: '', value: types({ score: 40 }) });
    assertEqual({ name: 'no score → Not measured', shouldbe: 'not_measured', value: types({ licensed: true, installed: true, score: null, purchased: 10, utilization: 90 }) });
    assertEqual({ name: 'score 85, outcome below target → Weak outcome', shouldbe: 'weak_outcome', value: types({ score: 85 }, [out({ status: 'below_target' })]) });
    assertEqual({ name: 'score 85, outcome on target → none', shouldbe: '', value: types({ score: 85 }, [out({ status: 'on_target' })]) });
    var lv = R.evaluateGaps(cap({ score: 25 }), [out({ lowVolume: true })], L);
    assertEqual({ name: 'low volume expected → no gap', shouldbe: 0, value: lv.gaps.length });
    assertEqual({ name: 'low volume expected → note', shouldbe: 'Low adoption skipped: low volume expected', value: lv.notes[0] });
    assertEqual({ name: 'important outcome → Adoption potential', shouldbe: 'adoption_potential,low_adoption', value: types({ score: 30 }, [out({ important: true })]) });
    assertEqual({ name: 'inactive outcome ignored', shouldbe: 'low_adoption', value: types({ score: 30 }, [out({ important: true, active: false })]) });
    var cfg = R.gapConfig('');
    assertEqual({ name: 'Shelfware text', shouldbe: 'Hardware Asset Management is licensed but not installed. You are paying for a product you are not using.', value: R.fillTemplate(cfg.shelfware.text, { capability: 'Hardware Asset Management' }) });
    assertEqual({ name: 'Shelfware defaults value 4', shouldbe: 4, value: cfg.shelfware.value });
    assertEqual({ name: 'Shelfware defaults effort 3', shouldbe: 3, value: cfg.shelfware.effort });
    stepResult.setOutputMessage('All gap rule examples passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

// PIV-031.07 – priority, reason and score validation
Test({
    $id: Now.ID['atf-priority-rules'],
    name: 'PIVOT – Opportunity priority, reason and score checks',
    description: '(4 + 2) ÷ 2 = 3; (5 + 3) ÷ 3 = 2.67; empty impact: 4 ÷ 2 = 2 "no outcome data, impact not counted". Reason "(4 + 3) ÷ 2 = 3.5 – high value, low effort". Weight 2 on value → 5.5. Impact from outcome status: below 3, on target 1, improved 0, not measured empty. Effort 0 refused; empty impact allowed.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-priority-rules-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    assertEqual({ name: '(4 + 2) ÷ 2', shouldbe: 3, value: R.priorityOf(4, 2, 2) });
    assertEqual({ name: '(5 + 3) ÷ 3', shouldbe: 2.67, value: R.priorityOf(5, 3, 3) });
    assertEqual({ name: 'empty impact 4 ÷ 2', shouldbe: 2, value: R.priorityOf(4, null, 2) });
    assertEqual({ name: 'reason', shouldbe: '(4 + 3) ÷ 2 = 3.5 – high value, low effort', value: R.priorityReason(4, 3, 2, R.priorityOf(4, 3, 2)) });
    assertEqual({ name: 'reason, no outcome data', shouldbe: '4 ÷ 2 = 2 – no outcome data, impact not counted', value: R.priorityReason(4, null, 2, R.priorityOf(4, null, 2)) });
    assertEqual({ name: 'weight 2 on value', shouldbe: 5.5, value: R.priorityOf(4, 3, 2, 2, 1) });
    assertEqual({ name: 'below target → impact 3', shouldbe: 3, value: R.impactFromStatus('below_target') });
    assertEqual({ name: 'on target → impact 1', shouldbe: 1, value: R.impactFromStatus('on_target') });
    assertEqual({ name: 'improved → impact 0', shouldbe: 0, value: R.impactFromStatus('improved') });
    assertEqual({ name: 'not measured → empty impact', shouldbe: true, value: R.impactFromStatus('not_measured') === null });
    assertEqual({ name: 'effort 0 refused', shouldbe: 'Effort must be between 1 and 5', value: R.validateScores(4, '', 0).effort });
    assertEqual({ name: 'empty impact allowed', shouldbe: true, value: !R.validateScores(4, '', 2).business_impact });
    assertEqual({ name: 'threshold 150 refused', shouldbe: 'Threshold must be a whole number from 0 to 100', value: R.validateProperty('utilization_threshold', 150, {}).error });
    stepResult.setOutputMessage('All priority examples passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
