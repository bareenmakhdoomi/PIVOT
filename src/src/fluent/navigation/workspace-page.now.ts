import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import workspacePage from '../../client/index.html'

// The PIVOT workspace (design Concept 27) – one React UI page
UiPage({
    $id: Now.ID['pivot-workspace-page'],
    endpoint: 'x_enno_pivot_workspace.do',
    description: 'PIVOT workspace (Concept 27)',
    category: 'general',
    html: workspacePage,
    direct: true,
})
