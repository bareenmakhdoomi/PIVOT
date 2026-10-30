import '@servicenow/sdk/global'
import { UiPolicy, DataPolicy, ClientScript } from '@servicenow/sdk/core'

// PIV-032.03 – Rejection reason appears and is mandatory when the state is Rejected (form).
UiPolicy({
    $id: Now.ID['uip-opportunity-rejected'],
    table: 'x_enno_pivot_opportunity',
    shortDescription: 'PIVOT – Rejected opportunity: rejection reason shown and mandatory',
    conditions: 'state=rejected',
    reverseIfFalse: true,
    onLoad: true,
    actions: [{ field: 'rejection_reason', visible: true, mandatory: true, readOnly: 'ignore' }],
})

// PIV-032.03 AC 3 – the same rule for list edits, imports and web services (the business rule also checks every save).
DataPolicy({
    $id: Now.ID['dp-opportunity-rejected'],
    table: 'x_enno_pivot_opportunity',
    shortDescription: 'PIVOT – Rejected opportunity needs a rejection reason',
    conditions: 'state=rejected',
    active: true,
    applyToImportSets: true,
    applyToSOAP: true,
    useAsUiPolicyOnClient: false,
    reverseIfFalse: true,
    inherit: false,
    rules: { rejection_reason: { $id: Now.ID['dp-opportunity-rejected-reason'], mandatory: true, readOnly: 'ignore' } },
})

// PIV-032.03 AC 2 – the save is blocked with the story's message.
ClientScript({
    $id: Now.ID['cs-opportunity-rejection-submit'],
    table: 'x_enno_pivot_opportunity',
    name: 'PIVOT – Block save of a rejected opportunity without a reason',
    type: 'onSubmit',
    uiType: 'all',
    active: true,
    isolateScript: true,
    script: `function onSubmit() {
    if (g_form.getValue('state') == 'rejected' && !g_form.getValue('rejection_reason').trim()) {
        g_form.clearMessages();
        g_form.addErrorMessage('Please enter a rejection reason');
        g_form.showFieldMsg('rejection_reason', 'Please enter a rejection reason', 'error');
        return false;
    }
    return true;
}`,
})

// PIV-032.01 – State offers only the allowed next states (the business rule enforces the same flow on the server).
// Done or Rejected: only "Reopen" (back to New).
ClientScript({
    $id: Now.ID['cs-opportunity-state-flow'],
    table: 'x_enno_pivot_opportunity',
    name: 'PIVOT – Opportunity state flow',
    type: 'onLoad',
    uiType: 'all',
    active: true,
    isolateScript: true,
    script: `function onLoad() {
    if (g_form.isNewRecord()) return;
    var NEXT = { open: ['accepted', 'rejected'], accepted: ['in_progress', 'done', 'rejected'], in_progress: ['done', 'accepted', 'rejected'], done: ['open'], rejected: ['open'] };
    var LABEL = { open: 'New', accepted: 'Accepted', in_progress: 'In progress', done: 'Done', rejected: 'Rejected' };
    var now = g_form.getValue('state');
    var next = NEXT[now];
    if (!next) return;
    g_form.clearOptions('state');
    g_form.addOption('state', now, LABEL[now]);
    for (var i = 0; i < next.length; i++) {
        var v = next[i];
        g_form.addOption('state', v, (now == 'done' || now == 'rejected') && v == 'open' ? 'Reopen' : LABEL[v]);
    }
    g_form.setValue('state', now);
}`,
})
