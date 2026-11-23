import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { admin } from '../roles/roles.now'

Test({
    $id: Now.ID['atf-stry0015321-capability-measurement-validation'],
    name: 'PIVOT - Validate Capability measurement settings',
    description: 'As an admin, invalid settings return field-specific errors and are not saved; valid settings save with the next-assessment confirmation.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015321-capability-measurement-validation-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize();
    cap.setValue('name', '[ATF] STRY0015321 measurement validation ' + gs.generateGUID());
    cap.setValue('source', 'manual');
    cap.setValue('measure_table', 'incident');
    cap.setValue('measure_filter', 'active=true');
    cap.setValue('date_field', 'sys_created_on');
    cap.setValue('days_back', 30);
    cap.setValue('weight', 1);
    cap.setValue('target_value', 100);
    outputs.record_id = cap.insert();
    outputs.table = 'x_enno_pivot_capability';
    assertEqual({ name: 'test Capability created', shouldbe: true, value: !!outputs.record_id });
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-stry0015321-capability-measurement-validation-admin'],
        firstName: 'ATF',
        lastName: 'Measurement Admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015321-capability-measurement-validation-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var id = outputs.record_id;
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var read = function() { var g = new GlideRecord('x_enno_pivot_capability'); return g.get(id) ? g : null; };
    var fields = function(overrides) {
        var f = { measure_table: 'incident', measure_filter: 'active=true', date_field: 'sys_created_on', days_back: '30', weight: '1', target: '100' };
        Object.keys(overrides).forEach(function(k) { f[k] = overrides[k]; });
        return f;
    };
    var reject = function(label, override, field, message) {
        var before = read();
        var beforeTarget = before.getValue('target_value'), beforeDays = before.getValue('days_back'), beforeWeight = before.getValue('weight'), beforeTable = before.getValue('measure_table');
        var r = W.runActionWithNote({ action: 'updateCapability', id: id, fields: fields(override) });
        assertEqual({ name: label + ' is rejected', shouldbe: false, value: !!r.ok });
        assertEqual({ name: label + ' field message', shouldbe: message, value: r.errors && r.errors[field] });
        var after = read();
        assertEqual({ name: label + ' does not save measure table', shouldbe: beforeTable, value: after.getValue('measure_table') });
        assertEqual({ name: label + ' does not save target', shouldbe: beforeTarget, value: after.getValue('target_value') });
        assertEqual({ name: label + ' does not save days back', shouldbe: beforeDays, value: after.getValue('days_back') });
        assertEqual({ name: label + ' does not save weight', shouldbe: beforeWeight, value: after.getValue('weight') });
    };
    reject('unknown measure table', { measure_table: 'incdent' }, 'measure_table', 'Table incdent does not exist on this instance');
    reject('days back zero', { days_back: '0' }, 'days_back', 'Enter 1 to 365 days.');
    reject('days back above maximum', { days_back: '400' }, 'days_back', 'Enter 1 to 365 days.');
    reject('weight above maximum', { weight: '9' }, 'weight', 'Enter a weight from 1 to 5.');
    reject('zero target', { target: '0' }, 'target', 'Enter a number above 0, or leave empty for Not Measured.');
    reject('text target', { target: 'not-a-number' }, 'target', 'Enter a number above 0, or leave empty for Not Measured.');
    reject('non-finite target', { target: 'Infinity' }, 'target', 'Enter a number above 0, or leave empty for Not Measured.');

    var saved = W.runActionWithNote({ action: 'updateCapability', id: id, fields: fields({ target: '125' }) });
    assertEqual({ name: 'valid settings save', shouldbe: true, value: !!saved.ok });
    assertEqual({ name: 'valid settings confirmation', shouldbe: 'Saved. New settings are used from the next assessment run.', value: saved.note });
    var afterSave = read();
    assertEqual({ name: 'valid target is stored', shouldbe: '125', value: afterSave.getValue('target_value') });
    afterSave.deleteRecord();
    stepResult.setOutputMessage('Invalid measurement settings show field errors and remain unsaved; valid settings save with the expected confirmation.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
