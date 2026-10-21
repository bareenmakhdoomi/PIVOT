import '@servicenow/sdk/global'
import {
    Table, StringColumn, ChoiceColumn, BooleanColumn, IntegerColumn, DecimalColumn,
    ReferenceColumn, TableNameColumn, ConditionsColumn, FieldNameColumn, DateTimeColumn, DomainIdColumn,
} from '@servicenow/sdk/core'

// PIV-002 Capability – one record per licensed subscription, installed store app or active plugin (design B3)
export const x_enno_pivot_capability = Table({
    name: 'x_enno_pivot_capability',
    label: 'Capability',
    display: 'name',
    audit: true,
    autoNumber: { prefix: 'PVC', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:getNextObjNumberPadded();' }),
        name: StringColumn({ label: 'Name', maxLength: 100, mandatory: true, hint: 'Set by discovery' }),
        product_family: ChoiceColumn({
            label: 'Product family',
            hint: 'Empty = listed in Needs mapping',
            dropdown: 'dropdown_with_none',
            choices: {
                itsm: { label: 'ITSM', sequence: 10 }, itom: { label: 'ITOM', sequence: 20 }, itam: { label: 'ITAM', sequence: 30 },
                hrsd: { label: 'HRSD', sequence: 40 }, csm: { label: 'CSM', sequence: 50 }, secops: { label: 'SecOps', sequence: 60 },
                spm: { label: 'SPM', sequence: 70 }, platform: { label: 'Platform', sequence: 80 }, other: { label: 'Other', sequence: 90 },
            },
        }),
        source: ChoiceColumn({
            label: 'Source', readOnly: true,
            choices: { subscription: { label: 'Subscription', sequence: 10 }, store_app: { label: 'Store app', sequence: 20 }, plugin: { label: 'Plugin', sequence: 30 } },
        }),
        licensed: BooleanColumn({ label: 'Licensed', readOnly: true, default: 'false' }),
        installed: BooleanColumn({ label: 'Installed', readOnly: true, default: 'false' }),
        entitled_count: IntegerColumn({ label: 'Entitled (purchased) count', readOnly: true }),
        allocated_count: IntegerColumn({ label: 'Allocated count', readOnly: true }),
        app_scope: StringColumn({ label: 'App scope', maxLength: 100, readOnly: true }),
        linked_app: ReferenceColumn({ label: 'Linked app', referenceTable: 'x_enno_pivot_capability', referenceQual: 'installed=true', hint: 'Links a licence to the installed-app capability that delivers it' }),
        measure_table: TableNameColumn({ label: 'Measure table' }),
        measure_filter: ConditionsColumn({ label: 'Measure filter', dependent: 'measure_table' }),
        date_field: FieldNameColumn({ label: 'Date field', dependent: 'measure_table', default: 'sys_created_on' }),
        days_back: IntegerColumn({ label: 'Days back', default: '30' }),
        target_value: DecimalColumn({ label: 'Target value', hint: 'Empty = Not Measured' }),
        weight: IntegerColumn({ label: 'Weight', default: '1' }),
        active: BooleanColumn({ label: 'Active', default: 'true' }),
        last_discovered: DateTimeColumn({ label: 'Last discovered', readOnly: true }),
        not_found: BooleanColumn({ label: 'Not found', readOnly: true, default: 'false', hint: 'True when discovery no longer finds it. Never deleted.' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
