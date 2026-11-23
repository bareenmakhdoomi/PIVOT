import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// PIV-002.07 / PIV-051 – default Capability columns include discovery status details.
List({
    table: 'x_enno_pivot_capability',
    view: default_view,
    columns: ['name', 'product_family', 'licensed', 'installed', 'active', 'not_found', 'last_discovered'],
})
