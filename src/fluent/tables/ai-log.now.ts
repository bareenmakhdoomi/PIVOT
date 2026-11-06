import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, ReferenceColumn, MultiLineTextColumn, DomainIdColumn } from '@servicenow/sdk/core'

// PIV-054.06 – every AI suggestion or answer and the user's decision (accepted, edited, rejected, …).
// Written by the PIVOT server code only; PIVOT admins read it (list "AI usage" and Settings > AI features).
export const x_enno_pivot_ai_log = Table({
    name: 'x_enno_pivot_ai_log',
    label: 'AI Log',
    schema: {
        skill: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Skill', default: 'explain',
            choices: {
                explain: { label: 'Explain this finding', sequence: 10 }, briefing: { label: 'Assessment briefing', sequence: 20 },
                scores: { label: 'Suggest scores', sequence: 30 }, owner: { label: 'Suggest owner', sequence: 40 },
                owners_bulk: { label: 'Suggest owners (roadmap)', sequence: 50 }, plan: { label: 'Draft action plan', sequence: 60 },
                ask: { label: 'Ask PIVOT', sequence: 70 }, chat_action: { label: 'Chat action', sequence: 80 }, test: { label: 'Provider test', sequence: 90 },
            },
        }),
        record: StringColumn({ label: 'Record', maxLength: 40, hint: 'Opportunity or assessment number' }),
        suggestion: MultiLineTextColumn({ label: 'Suggestion', maxLength: 4000 }),
        decision: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Decision', default: 'shown',
            choices: {
                shown: { label: 'Shown', sequence: 10 }, accepted: { label: 'Accepted', sequence: 20 }, edited: { label: 'Edited', sequence: 30 },
                rejected: { label: 'Rejected', sequence: 40 }, skipped: { label: 'Skipped', sequence: 50 }, cancelled: { label: 'Cancelled', sequence: 60 },
                failed: { label: 'Failed', sequence: 70 },
            },
        }),
        decision_detail: StringColumn({ label: 'Decision detail', maxLength: 1000 }),
        user: ReferenceColumn({ label: 'User', referenceTable: 'sys_user' }),
        channel: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Channel', default: 'workspace',
            choices: { workspace: { label: 'Workspace', sequence: 10 }, va: { label: 'Virtual Agent', sequence: 20 }, panel: { label: 'Now Assist panel', sequence: 30 }, run: { label: 'Assessment run', sequence: 40 }, test: { label: 'Test script', sequence: 50 } },
        }),
        source: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Text from', default: 'now_assist',
            choices: { now_assist: { label: 'Now Assist', sequence: 10 }, rules: { label: 'PIVOT rules (AI answer not used)', sequence: 20 } },
        }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
