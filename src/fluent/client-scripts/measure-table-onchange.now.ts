import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

export const measureTableOnChange = ClientScript({
    $id: 'measure_table_onchange_script',
    name: 'Update Measure Filter Guidance',
    table: 'x_enno_pivot_capability',
    type: 'onChange',
    uiType: 'all',
    field: 'measure_table',
    active: true,
    description: 'Shows guidance for the measure filter when no measure table is selected.',
    script: `function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading) {
        return;
    }

    if (newValue === '') {
        g_form.setReadOnly('measure_filter', true);
        g_form.showFieldMsg('measure_filter', 'Select a measure table first.', 'info');
    } else {
        g_form.setReadOnly('measure_filter', false);
        g_form.hideFieldMsg('measure_filter');
    }
}`
})

export const measureFilterOnLoad = ClientScript({
    $id: 'measure_filter_onload_script',
    name: 'Show Measure Filter Guidance',
    table: 'x_enno_pivot_capability',
    type: 'onLoad',
    uiType: 'all',
    active: true,
    description: 'Prompts the analyst to select a measure table before building a measure filter.',
    script: `function onLoad() {
    var hasMeasureTable = !!g_form.getValue('measure_table');
    g_form.setReadOnly('measure_filter', !hasMeasureTable);
    if (!hasMeasureTable) {
        g_form.showFieldMsg('measure_filter', 'Select a measure table first.', 'info');
    }
}`
})