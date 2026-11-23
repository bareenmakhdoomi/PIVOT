import '@servicenow/sdk/global'
import { UiPolicy } from '@servicenow/sdk/core'

UiPolicy({
    $id: Now.ID['uip-result-reason-readonly'],
    table: 'x_enno_pivot_result',
    shortDescription: 'PIVOT – Result reason is read-only',
    onLoad: true,
    global: true,
    uiType: 'all',
    actions: [{ field: 'reason', readOnly: true }],
})
