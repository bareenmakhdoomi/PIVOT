import '@servicenow/sdk/global'
import { UiPolicy } from '@servicenow/sdk/core'

// PIV-024.02 / .06 – Business Outcome platform form (admin fallback view; the workspace dialog applies the same rules).
UiPolicy({
    $id: Now.ID['uip-outcome-manual'],
    table: 'x_enno_pivot_business_outcome',
    shortDescription: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden',
    conditions: 'measurement_type=manual',
    reverseIfFalse: true,
    onLoad: true,
    actions: [
        { field: 'manual_value', visible: true, mandatory: true, readOnly: 'ignore' },
        { field: 'manual_value_date', visible: true, mandatory: true, readOnly: 'ignore' },
        { field: 'kpi_table', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'kpi_filter', visible: false, mandatory: 'ignore', readOnly: 'ignore' },
        { field: 'kpi_aggregate', visible: false, mandatory: 'ignore', readOnly: 'ignore' },
        { field: 'kpi_field', visible: false, mandatory: false, readOnly: 'ignore' },
    ],
})

UiPolicy({
    $id: Now.ID['uip-outcome-calculated'],
    table: 'x_enno_pivot_business_outcome',
    shortDescription: 'PIVOT – Calculated KPI: table required, manual value hidden',
    conditions: 'measurement_type=calculated',
    reverseIfFalse: true,
    onLoad: true,
    actions: [
        { field: 'kpi_table', visible: true, mandatory: true, readOnly: 'ignore' },
        { field: 'manual_value', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'manual_value_date', visible: false, mandatory: false, readOnly: 'ignore' },
    ],
})

UiPolicy({
    $id: Now.ID['uip-outcome-aggregate-field'],
    table: 'x_enno_pivot_business_outcome',
    shortDescription: 'PIVOT – Sum or average: the field to aggregate is required; hidden for count',
    conditions: 'measurement_type=calculated^kpi_aggregateINsum,avg',
    reverseIfFalse: true,
    onLoad: true,
    actions: [{ field: 'kpi_field', visible: true, mandatory: true, readOnly: 'ignore' }],
})
