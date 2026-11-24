import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

const guidance = 'Link an installed app so shelfware can be detected'

ClientScript({
    $id: Now.ID['cs-capability-linked-app-guidance-load'],
    name: 'Show linked app guidance for licensed capabilities',
    table: 'x_enno_pivot_capability',
    type: 'onLoad',
    uiType: 'all',
    active: true,
    description: 'Shows a non-blocking message when a licensed Capability has no linked installed app.',
    script: `function onLoad() {
    var licensed = g_form.getValue('licensed');
    var linkedApp = g_form.getValue('linked_app');
    g_form.hideFieldMsg('linked_app', true);
    if ((licensed === '1' || licensed === 'true') && !linkedApp) {
        g_form.showFieldMsg('linked_app', '${guidance}', 'info');
    }
}`,
})

ClientScript({
    $id: Now.ID['cs-capability-linked-app-guidance-licensed'],
    name: 'Update linked app guidance when license status changes',
    table: 'x_enno_pivot_capability',
    type: 'onChange',
    field: 'licensed',
    uiType: 'all',
    active: true,
    description: 'Refreshes linked app guidance when a Capability is marked licensed or unlicensed.',
    script: `function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) return;
    g_form.hideFieldMsg('linked_app', true);
    if ((newValue === '1' || newValue === 'true') && !g_form.getValue('linked_app')) {
        g_form.showFieldMsg('linked_app', '${guidance}', 'info');
    }
}`,
})

ClientScript({
    $id: Now.ID['cs-capability-linked-app-guidance-link'],
    name: 'Update linked app guidance when app link changes',
    table: 'x_enno_pivot_capability',
    type: 'onChange',
    field: 'linked_app',
    uiType: 'all',
    active: true,
    description: 'Removes linked app guidance when a licensed Capability is linked to an installed app.',
    script: `function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) return;
    g_form.hideFieldMsg('linked_app', true);
    if (!newValue && (g_form.getValue('licensed') === '1' || g_form.getValue('licensed') === 'true')) {
        g_form.showFieldMsg('linked_app', '${guidance}', 'info');
    }
}`,
})

ClientScript({
    $id: Now.ID['cs-capability-linked-app-guidance-submit'],
    name: 'Show linked app guidance when licensed Capability is saved',
    table: 'x_enno_pivot_capability',
    type: 'onSubmit',
    uiType: 'all',
    active: true,
    description: 'Displays non-blocking linked app guidance on save when a licensed Capability has no linked app.',
    script: `function onSubmit() {
    g_form.hideFieldMsg('linked_app', true);
    if ((g_form.getValue('licensed') === '1' || g_form.getValue('licensed') === 'true') && !g_form.getValue('linked_app')) {
        g_form.showFieldMsg('linked_app', '${guidance}', 'info');
    }
    return true;
}`,
})
