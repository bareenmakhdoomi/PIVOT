(function runMailScript(current, template, email, email_action, event) {
    var esc = function (s) { return String(s === null || s === undefined ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var num = current.getValue('number'), st = current.getValue('status'), failed = st == 'failed';
    var sc = current.getValue('overall_score'), has = sc !== null && sc !== '' && !failed;
    var score = has ? String(Math.round(parseFloat(sc) * 10) / 10) : 'Not available';
    var change = 'First run';
    var prev = new GlideRecord('x_enno_pivot_assessment');
    prev.addQuery('status', 'IN', 'complete,complete_with_warnings');
    prev.addQuery('sys_id', '!=', current.getUniqueValue());
    prev.addQuery('sys_created_on', '<=', current.getValue('sys_created_on'));
    prev.orderByDesc('sys_created_on');
    prev.setLimit(1);
    prev.query();
    if (!has) change = 'Not available';
    else if (prev.next() && prev.getValue('overall_score')) {
        var d = Math.round((parseFloat(sc) - parseFloat(prev.getValue('overall_score'))) * 10) / 10;
        change = (d === 0 ? 'Unchanged' : (d > 0 ? 'Up ' : 'Down ') + Math.abs(d)) + ' since ' + prev.getValue('number');
    }
    var log = [];
    try { log = JSON.parse(current.getValue('log') || '[]'); } catch (e) { log = []; }
    var warns = 0, err = '', upd = '0';
    for (var i = 0; i < log.length; i++) {
        var l = log[i] || {};
        if (l.level == 'warn') warns++;
        if (l.level == 'error') { err = l.message; if (!failed) warns++; }
        var m = /^gaps: \d+ opportunities \((\d+) updated/.exec(l.message || '');
        if (m) upd = m[1];
    }
    var created = current.getValue('opportunities_created') || '0';
    email.setSubject('PIVOT run ' + (failed ? 'failed' : 'complete') + ': ' + num + (has ? ', score ' + score : ''));
    var link = gs.getProperty('glide.servlet.uri') + 'x_enno_pivot_workspace.do?view=assessments&run=' + encodeURIComponent(num);
    var row = function (k, v) { return '<tr><td style="padding:4px 16px 4px 0;color:#5b6b85">' + k + '</td><td style="padding:4px 0"><b>' + esc(v) + '</b></td></tr>'; };
    var h = '<p>PIVOT assessment ' + esc(num) + ' has ' + (failed ? 'failed.' : 'finished.') + '</p><table style="border-collapse:collapse;font-size:14px">';
    h += row('Assessment', num) + row('Status', current.getDisplayValue('status')) + row('Platform Value Score', score) + row('Change', change);
    if (!failed) h += row('Opportunities raised', created) + row('Opportunities updated', upd) + row('Warnings', String(warns));
    h += row(failed ? 'Failed at' : 'Completed', current.getDisplayValue('sys_updated_on')) + '</table>';
    if (failed) h += '<p><b>Error:</b> ' + esc(err || 'See the run log.') + '</p>';
    h += '<p><a href="' + link + '">Open in PIVOT</a></p>';
    template.print(h);
})(current, template, email, email_action, event);
