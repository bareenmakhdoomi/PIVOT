import '@servicenow/sdk/global'
import { Acl, UiPage } from '@servicenow/sdk/core'
import { viewer } from '../roles/roles.now'

UiPage({
    $id: Now.ID['pivot-plugins-page'],
    endpoint: 'x_enno_pivot_plugins.do',
    description: 'Capability plugin list with discovery empty state',
    category: 'general',
    direct: true,
    processingScript: `(function() {
    var plugins = new GlideRecordSecure('x_enno_pivot_capability');
    plugins.addQuery('source', 'plugin');
    plugins.orderBy('name');
    plugins.setLimit(1);
    plugins.query();
    if (plugins.hasNext()) {
        response.sendRedirect('x_enno_pivot_capability_list.do?sysparm_query=source%3Dplugin%5EORDERBYname');
    }
})();`,
    html: '<html><head><title>Plugins</title></head><body><main><h1>Plugins</h1><p>No plugins discovered yet. Run an assessment to populate this list.</p></main></body></html>',
})

Acl({
    $id: Now.ID['pivot-plugins-page-read'],
    type: 'ui_page',
    name: 'x_enno_pivot_plugins',
    operation: 'read',
    roles: [viewer],
    adminOverrides: false,
    active: true,
    description: 'Only PIVOT viewers can open the Plugins list.',
})
