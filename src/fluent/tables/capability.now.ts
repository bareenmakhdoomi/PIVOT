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
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:global.getNextObjNumberPadded();' }),
        name: StringColumn({ label: 'Name', maxLength: 100, mandatory: true, hint: 'Set by discovery' }),
        product_family: ChoiceColumn({
            label: 'Product family',
            hint: 'Empty = listed in Needs mapping',
            dropdown: 'dropdown_with_none',
            choices: {
                // PIV-002.04: lowercase values, readable labels (the workspace keeps its short column names from rules.ts FAMILIES)
                itsm: { label: 'IT Service Management', sequence: 10 }, itom: { label: 'IT Operations Management', sequence: 20 },
                itam: { label: 'IT Asset Management', sequence: 30 }, hrsd: { label: 'HR Service Delivery', sequence: 40 },
                csm: { label: 'Customer Service Management', sequence: 50 }, secops: { label: 'Security Operations', sequence: 60 },
                spm: { label: 'Strategic Portfolio Management', sequence: 70 }, platform: { label: 'Platform', sequence: 80 }, other: { label: 'Other', sequence: 90 },
            },
        }),
        source: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Source', default: 'manual',
            hint: 'Set by discovery (subscription = licence / entitlement); Manual for capabilities an admin adds by hand.',
            choices: { subscription: { label: 'Subscription (entitlement)', sequence: 10 }, store_app: { label: 'Store app', sequence: 20 }, plugin: { label: 'Plugin', sequence: 30 }, manual: { label: 'Manual', sequence: 40 } },
        }),
        licensed: BooleanColumn({ label: 'Licensed', default: 'false' }),
        installed: BooleanColumn({ label: 'Installed', default: 'false' }),
        entitled_count: IntegerColumn({ label: 'Entitled (purchased) count', hint: 'Copied by discovery from the subscription purchased count.' }),
        allocated_count: IntegerColumn({ label: 'Allocated count' }),
        app_scope: StringColumn({ label: 'App scope', maxLength: 100 }),
        source_id: StringColumn({ label: 'Source ID', maxLength: 255, hint: 'Set by discovery: subscription sys_id, app scope or plugin ID. Used to match re-runs.' }),
        seed_applied: BooleanColumn({ label: 'Starter settings applied', default: 'false', hint: 'Set by discovery when PIVOT filled the proposed starter measurement settings (PIV-015). They are applied only once.' }),
        version: StringColumn({ label: 'Version', maxLength: 40, hint: 'Installed version of the app or plugin. Set by discovery.' }),
        linked_app: ReferenceColumn({ label: 'Linked app', referenceTable: 'x_enno_pivot_capability', referenceQual: 'installed=true', hint: 'Links a licence to the installed-app capability that delivers it' }),
        measure_table: TableNameColumn({ label: 'Measure table', hint: 'The table PIVOT counts records in to measure usage (GlideAggregate COUNT).' }),
        measure_filter: ConditionsColumn({ label: 'Measure filter', dependent: 'measure_table' }),
        date_field: FieldNameColumn({ label: 'Date field', dependent: 'measure_table', default: 'sys_created_on' }),
        days_back: IntegerColumn({ label: 'Days back', default: '30', hint: 'Look-back window in whole days (1–365). Only records whose date field falls in this window are counted.' }),
        target_value: DecimalColumn({ label: 'Target value', hint: 'Empty = Not Measured' }),
        weight: IntegerColumn({ label: 'Weight', default: '1' }),
        active: BooleanColumn({ label: 'Active', default: 'true' }),
        last_discovered: DateTimeColumn({ label: 'Last discovered' }),
        not_found: BooleanColumn({ label: 'Not found', default: 'false', hint: 'True when discovery no longer finds it. Never deleted.' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
