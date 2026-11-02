import '@servicenow/sdk/global'
import { ScheduledScript, ScriptAction, ScriptInclude, UiAction, Record } from '@servicenow/sdk/core'
import { weeklyJob } from '../../server/pivot/assessment'
import { admin } from '../roles/roles.now'

// PIV-034.01 – PivotAssessment.run(assessmentId): one entry point for every run type.
// The orchestration lives in src/server/pivot/assessment.ts.
ScriptInclude({
    $id: Now.ID['si-pivot-assessment'],
    name: 'PivotAssessment',
    apiName: 'x_enno_pivot.PivotAssessment',
    description: 'PIVOT assessment orchestrator. run(assessmentId) runs a Queued assessment through discover, measure, score, outcomes, gaps, priority, roadmap and notify. queue(trigger) creates a Queued assessment; runNow() queues one and fires x_enno_pivot.run_assessment.',
    accessibleFrom: 'package_private',
    active: true,
    script: `var PivotAssessment = Class.create();
PivotAssessment.prototype = {
    initialize: function () {
        this.engine = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    },
    run: function (assessmentId) {
        return this.engine.run(assessmentId);
    },
    queue: function (trigger) {
        return this.engine.queueAssessment(trigger || 'run_now', gs.getUserID());
    },
    runNow: function () {
        return this.engine.startRunNow(gs.getUserID());
    },
    type: 'PivotAssessment'
};`,
})

// PIV-035.01 – weekly run, Sunday 02:00 instance time. Admins change day and time on the scheduled job (PIV-035.02).
export const weeklyAssessment = ScheduledScript({
    $id: Now.ID['pivot-job-weekly-assessment'],
    name: 'PIVOT weekly assessment',
    active: true,
    frequency: 'weekly',
    dayOfWeek: 'sunday',
    executionTime: { hours: 2, minutes: 0, seconds: 0 },
    script: weeklyJob,
})

// PIV-036.01 – event for on-demand runs; parm1 = assessment sys_id, parm2 = user who started it.
Record({
    $id: Now.ID['event-run-assessment'],
    table: 'sysevent_register',
    data: {
        event_name: 'x_enno_pivot.run_assessment',
        suffix: 'run_assessment',
        table: 'x_enno_pivot_assessment',
        description: 'Runs one PIVOT assessment in the background. parm1: assessment sys_id (Queued). parm2: sys_id of the user who started it.',
        fired_by: 'PIVOT Run Now (list button "Run assessment now" and the workspace)',
    },
})
// Run complete / failed (the notify step and a failed run fire them; the emails come with PIV-042).
Record({
    $id: Now.ID['event-run-complete'],
    table: 'sysevent_register',
    data: {
        event_name: 'x_enno_pivot.run_complete',
        suffix: 'run_complete',
        table: 'x_enno_pivot_assessment',
        description: 'A PIVOT assessment finished. parm1: assessment sys_id. parm2: run email recipients (property admin_group).',
        fired_by: 'PIVOT assessment, step notify',
    },
})
Record({
    $id: Now.ID['event-run-failed'],
    table: 'sysevent_register',
    data: {
        event_name: 'x_enno_pivot.run_failed',
        suffix: 'run_failed',
        table: 'x_enno_pivot_assessment',
        description: 'A PIVOT assessment failed. parm1: assessment sys_id. parm2: run email recipients (property admin_group).',
        fired_by: 'PIVOT assessment, when a step fails',
    },
})

// PIV-036.02 – the script action runs the assessment off the user's session.
ScriptAction({
    $id: Now.ID['sa-run-assessment'],
    name: 'PIVOT – Run assessment (event)',
    eventName: 'x_enno_pivot.run_assessment',
    active: true,
    description: 'Calls PivotAssessment.run(parm1). Empty parm1: logs "No assessment id supplied" and does nothing.',
    script: `(function () {
    require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts').onRunEvent(String(event.parm1 || ''));
})();`,
})

// PIV-036.03 / .04 / .05 / .06 – "Run assessment now" list banner button, PIVOT admins only.
// It is a client action: the classic list only submits server actions for selected rows ("No records selected").
// The click posts runNow to the PIVOT API (same rules as the workspace: admins only, one run at a time), shows the
// answer as a message on the list (no reload, so the message stays) – the run itself happens in the background.
UiAction({
    $id: Now.ID['ua-run-assessment-now'],
    table: 'x_enno_pivot_assessment',
    name: 'Run assessment now',
    actionName: 'pivot_run_assessment_now',
    active: true,
    list: { showBannerButton: true },
    // List banner buttons follow the platform's own (e.g. "New"): Show insert and Show update on, Show query off.
    showInsert: true,
    showUpdate: true,
    showQuery: false,
    client: { isClient: true, isUi16Compatible: true, isUi11Compatible: true, onClick: 'pivotRunAssessmentNow()' },
    isolateScript: false,
    roles: [admin],
    hint: 'Starts a PIVOT assessment in the background. Only one assessment can run at a time.',
    order: 100,
    script: `function pivotRunAssessmentNow() {
    var show = function (text, type) {
        try { GlideUI.get().clearOutputMessages(); GlideUI.get().addOutputMessage({ msg: text, type: type, preventDuplicates: true }); }
        catch (e) { alert(text); }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/x_enno_pivot/v1/workspace/action', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-UserToken', window.g_ck || '');
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        var body = null;
        try { body = JSON.parse(xhr.responseText); } catch (e) { body = null; }
        var r = body && body.result ? body.result : body;
        if (xhr.status === 200 && r && r.ok) show(r.note || 'Assessment started. Refresh this list to see progress.', 'info');
        else if (xhr.status === 403) show('Only PIVOT admins can start an assessment.', 'error');
        else show((r && r.error) || 'The assessment could not be started.', 'error');
    };
    xhr.send(JSON.stringify({ action: 'runNow' }));
    return false;
}`,
})
