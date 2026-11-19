import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

// PIV-055.04 / PIV-059 / PIV-060 – entry points for the Now Assist skill (Now Assist panel) and the Virtual Agent
// "Ask PIVOT" topic. Every method runs as the signed-in user: PIVOT roles and ACLs decide what is returned, and
// x_enno_pivot.ai_enabled = false switches everything off. Changes from chat need confirm() after the user clicks Confirm.
ScriptInclude({
    $id: Now.ID['si-pivot-ai'],
    name: 'PivotAI',
    apiName: 'x_enno_pivot.PivotAI',
    description: 'PIVOT AI entry points for Virtual Agent and Now Assist: ask(question) → { ok, answer, items, confirm }; confirm(confirmObject) → { ok, note | error }; explain(table, sysId, text) → { ok, what, why, next, label } or { ask: true, error }; answerText(result) → plain text for a chat reply.',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    script: `var PivotAI = Class.create();
PivotAI.prototype = {
    initialize: function () {},
    _api: function () { return require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts'); },
    ask: function (question) { return this._api().vaAsk(String(question || '')); },
    confirm: function (confirmObject) {
        var c = typeof confirmObject === 'string' ? JSON.parse(confirmObject) : confirmObject;
        return this._api().vaConfirm(c);
    },
    explain: function (table, sysId, text) { return this._api().panelExplain(String(table || ''), String(sysId || ''), String(text || '')); },
    answerText: function (r) {
        if (!r) return 'PIVOT could not answer right now.';
        if (r.what) return r.label + '\\nWhat: ' + r.what + '\\nWhy it matters: ' + r.why + '\\nSuggested next step: ' + r.next + '\\n' + (r.footer || '');
        var t = r.answer || r.error || r.note || '';
        var base = gs.getProperty('glide.servlet.uri') + 'x_enno_pivot_workspace.do';
        var items = r.items || [];
        for (var i = 0; i < items.length; i++) {
            var ref = String(items[i].ref || '');
            var link = /^PVO/.test(ref) ? base + '?view=opportunities&opp=' + ref : ref.indexOf('view:') === 0 ? base : '';
            t += '\\n- ' + (/^PVO/.test(ref) ? ref + ' ' : '') + items[i].label + (link ? ' (' + link + ')' : '');
        }
        if (r.label) t = r.label + '\\n' + t;
        return t;
    },
    type: 'PivotAI'
};`,
})
