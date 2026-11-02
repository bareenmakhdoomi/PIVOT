import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// PIV-032 – default columns of the Opportunity list (Opportunities, My Opportunities, Gap no longer detected)
List({
    table: 'x_enno_pivot_opportunity',
    view: default_view,
    columns: ['number', 'short_description', 'capability', 'type', 'state', 'priority', 'assignment_group', 'assigned_to'],
})
