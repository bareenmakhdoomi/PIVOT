import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// PIV-033.07 – phase boundaries 0.9 / 1 / 1.9 / 2 and a Rejected opportunity, through PivotRoadmap.generate()
Test({
    $id: Now.ID['atf-roadmap-boundaries'],
    name: 'PIVOT – Roadmap phase boundaries',
    description: 'Priorities 0.9, 1, 1.9 and 2 → Later, Next, Next, Now. A Rejected opportunity gets no roadmap item. An unknown assessment creates nothing and returns "Assessment not found".',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-roadmap-boundaries-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var asm = new GlideRecord('x_enno_pivot_assessment');
    asm.newRecord(); asm.setValue('status', 'complete'); asm.setValue('trigger', 'run_now');
    var asmId = asm.insert();
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.newRecord(); cap.setValue('name', '[ATF] Roadmap capability'); cap.setValue('source', 'manual'); cap.setValue('active', true);
    var capId = cap.insert();
    var mk = function (type, priority, state) {
        var o = new GlideRecord('x_enno_pivot_opportunity');
        o.newRecord();
        o.setValue('capability', capId); o.setValue('type', type); o.setValue('state', state);
        o.setValue('short_description', '[ATF] Roadmap ' + priority); o.setValue('priority', priority);
        return o.insert();
    };
    var p09 = mk('shelfware', 0.9, 'open'), p1 = mk('idle_licences', 1, 'open'), p19 = mk('low_adoption', 1.9, 'open'), p2 = mk('not_measured', 2, 'open');
    var rej = mk('weak_outcome', 3, 'open');
    var r = new GlideRecord('x_enno_pivot_opportunity'); r.get(rej); r.setValue('state', 'rejected'); r.setValue('rejection_reason', 'Rejected by the ATF roadmap test'); r.update();
    var res = new x_enno_pivot.PivotRoadmap().generate(asmId);
    assertEqual({ name: 'generate ok', shouldbe: true, value: res.ok });
    var phase = function (oppId) { var i = new GlideRecord('x_enno_pivot_roadmap_item'); i.addQuery('opportunity', oppId); i.query(); return i.next() ? i.getValue('phase') + '/' + i.getValue('assessment') : 'none'; };
    assertEqual({ name: '0.9 → Later', shouldbe: 'later/' + asmId, value: phase(p09) });
    assertEqual({ name: '1 → Next', shouldbe: 'next/' + asmId, value: phase(p1) });
    assertEqual({ name: '1.9 → Next', shouldbe: 'next/' + asmId, value: phase(p19) });
    assertEqual({ name: '2 → Now', shouldbe: 'now/' + asmId, value: phase(p2) });
    assertEqual({ name: 'Rejected → no item', shouldbe: 'none', value: phase(rej) });
    var count = new GlideAggregate('x_enno_pivot_roadmap_item'); count.addAggregate('COUNT'); count.query(); count.next();
    var before = count.getAggregate('COUNT');
    var bad = new x_enno_pivot.PivotRoadmap().generate('00000000000000000000000000000000');
    assertEqual({ name: 'unknown assessment message', shouldbe: 'Assessment not found', value: bad.message });
    var count2 = new GlideAggregate('x_enno_pivot_roadmap_item'); count2.addAggregate('COUNT'); count2.query(); count2.next();
    assertEqual({ name: 'unknown assessment creates nothing', shouldbe: before, value: count2.getAggregate('COUNT') });
    stepResult.setOutputMessage('Roadmap boundaries and exclusions passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
