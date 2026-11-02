import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

// PIV-033.01 – PivotRoadmap.generate(assessmentId): rebuilds the Now / Next / Later roadmap for one assessment.
// The logic lives in src/server/pivot/roadmap.ts (also used as step 8 of every assessment run).
ScriptInclude({
    $id: Now.ID['si-pivot-roadmap'],
    name: 'PivotRoadmap',
    apiName: 'x_enno_pivot.PivotRoadmap',
    description: 'Roadmap generation for PIVOT: generate(assessmentId) places every active opportunity in Now, Next or Later by priority and numbers it within the phase. Returns { ok, created, updated, removed, now, next, later, message }.',
    accessibleFrom: 'package_private',
    active: true,
    script: `var PivotRoadmap = Class.create();
PivotRoadmap.prototype = {
    initialize: function () {},
    generate: function (assessmentId) {
        var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/roadmap.ts');
        return R.generate(assessmentId);
    },
    type: 'PivotRoadmap'
};`,
})
