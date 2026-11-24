import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015244-opportunity-choices'],
    name: 'PIVOT - Opportunity type and state choices',
    description: 'Type choices include lowercase adoption and license values with readable labels. State choices New (stored value open), In progress, Accepted, Rejected and Done. New opportunities default to New (open).',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015244-opportunity-choices-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var choiceLabel = function(field, value) {
        var choice = new GlideRecord('sys_choice');
        choice.addQuery('name', 'x_enno_pivot_opportunity');
        choice.addQuery('element', field);
        choice.addQuery('value', value);
        choice.addQuery('language', 'en');
        choice.query();
        return choice.next() ? choice.getValue('label') : '';
    };
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize();
    cap.setValue('name', '[ATF] STRY0015244 capability');
    cap.setValue('source', 'manual');
    var capId = cap.insert();

    var opp = new GlideRecord('x_enno_pivot_opportunity');
    opp.newRecord(); // newRecord applies the dictionary defaults (initialize does not)
    opp.setValue('capability', capId);
    opp.setValue('type', 'adoption');
    var oppId = opp.insert();
    var saved = new GlideRecord('x_enno_pivot_opportunity');
    saved.get(oppId);

    assertEqual({ name: 'adoption choice label', shouldbe: 'Adoption', value: choiceLabel('type', 'adoption') });
    assertEqual({ name: 'license choice label', shouldbe: 'License', value: choiceLabel('type', 'license') });
    assertEqual({ name: 'new state label', shouldbe: 'New', value: choiceLabel('state', 'open') });
    assertEqual({ name: 'in progress state label', shouldbe: 'In progress', value: choiceLabel('state', 'in_progress') });
    assertEqual({ name: 'accepted state label', shouldbe: 'Accepted', value: choiceLabel('state', 'accepted') });
    assertEqual({ name: 'rejected state label', shouldbe: 'Rejected', value: choiceLabel('state', 'rejected') });
    assertEqual({ name: 'done state label', shouldbe: 'Done', value: choiceLabel('state', 'done') });
    assertEqual({ name: 'new opportunity defaults to New', shouldbe: 'open', value: saved.getValue('state') });

    if (oppId) { var delOpp = new GlideRecord('x_enno_pivot_opportunity'); if (delOpp.get(oppId)) delOpp.deleteRecord(); }
    if (capId) { var delCap = new GlideRecord('x_enno_pivot_capability'); if (delCap.get(capId)) delCap.deleteRecord(); }
    stepResult.setOutputMessage('Opportunity type and state choice checks passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
