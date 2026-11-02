import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// PIV-002.07 – default columns of the Capability list
List({
    table: 'x_enno_pivot_capability',
    view: default_view,
    columns: ['name', 'product_family', 'licensed', 'installed', 'active'],
})
