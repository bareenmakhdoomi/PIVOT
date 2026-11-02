import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

// PIV-032.02 – Assigned to on an opportunity: with an assignment group, only active members of that group;
// without one, any active user. Used as the advanced reference qualifier of x_enno_pivot_opportunity.assigned_to.
ScriptInclude({
    $id: Now.ID['si-opportunity-refqual'],
    name: 'PivotOpportunityRefQual',
    apiName: 'x_enno_pivot.PivotOpportunityRefQual',
    description: 'Reference qualifier for Assigned to on PIVOT opportunities (members of the assignment group).',
    accessibleFrom: 'package_private',
    active: true,
    script: `var PivotOpportunityRefQual = Class.create();
PivotOpportunityRefQual.prototype = {
    initialize: function () {},
    assignedTo: function (current) {
        var group = current ? current.getValue('assignment_group') : '';
        if (!group) return 'active=true';
        var ids = [];
        var m = new GlideRecord('sys_user_grmember');
        m.addQuery('group', group);
        m.addQuery('user.active', true);
        m.query();
        while (m.next()) ids.push(m.getValue('user'));
        return ids.length ? 'active=true^sys_idIN' + ids.join(',') : 'sys_id=-1';
    },
    type: 'PivotOpportunityRefQual'
};`,
})
