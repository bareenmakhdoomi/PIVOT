import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const clearFilterOnTableChange = BusinessRule({
    $id: 'clear_filter_on_table_change',
    name: 'Clear Measure Filter on Table Change',
    table: 'x_enno_pivot_capability',
    when: 'before',
    action: ['insert', 'update'], // <--- Fixed: Captures both new records and existing records
    active: true, 
    condition: 'current.measure_table.changes()', 
    description: 'Clears the old measure filter and warns the user when the measure table is changed and saved.',
    script: `(function executeRule(current, previous /*null when async*/) {
    
    // AC3: Clear the old filter and warn the user
    current.measure_filter = '';
    gs.addInfoMessage('The Measure table was changed. Please rebuild your Measure filter.');

})(current, previous);`
})