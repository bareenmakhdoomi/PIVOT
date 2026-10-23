import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'
import { viewer, admin } from '../roles/roles.now'

// PIVOT system properties (design B7). Only x_enno_pivot.* properties – global properties are never changed (certification rule).
const access = { read: [viewer], write: [admin] }

Property({ $id: Now.ID['prop-utilization-threshold'], name: 'x_enno_pivot.utilization_threshold', type: 'integer', value: 60, roles: access,
    description: 'Idle licence threshold (%). An Idle licences opportunity is raised when licence utilization is below this. Applies from the next assessment run.' })
Property({ $id: Now.ID['prop-low-score-threshold'], name: 'x_enno_pivot.low_score_threshold', type: 'integer', value: 40, roles: access,
    description: 'Low adoption threshold (score 0–100). Low adoption / adoption potential when the score is below this. Applies from the next assessment run.' })
Property({ $id: Now.ID['prop-high-usage-threshold'], name: 'x_enno_pivot.high_usage_threshold', type: 'integer', value: 70, roles: access,
    description: 'High usage threshold (score 0–100) used by the weak outcome rule. Applies from the next assessment run.' })
Property({ $id: Now.ID['prop-default-days-back'], name: 'x_enno_pivot.default_days_back', type: 'integer', value: 30, roles: access,
    description: 'Default look-back in days for new capabilities.' })
Property({ $id: Now.ID['prop-priority-now'], name: 'x_enno_pivot.priority_now', type: 'string', value: '2', roles: access,
    description: 'Priority at or above this goes to Now. Must be higher than Priority for Next.' })
Property({ $id: Now.ID['prop-priority-next'], name: 'x_enno_pivot.priority_next', type: 'string', value: '1', roles: access,
    description: 'Priority at or above this (and below Now) goes to Next; below it goes to Later.' })
Property({ $id: Now.ID['prop-slow-capability-seconds'], name: 'x_enno_pivot.slow_capability_seconds', type: 'integer', value: 60, roles: access,
    description: 'Log a warning when measuring one capability takes longer than this many seconds.' })
Property({ $id: Now.ID['prop-admin-group'], name: 'x_enno_pivot.admin_group', type: 'string', value: 'PIVOT Admins', roles: access,
    description: 'Group that receives the "PIVOT run complete" and "PIVOT run failed" emails.' })
Property({ $id: Now.ID['prop-ai-enabled'], name: 'x_enno_pivot.ai_enabled', type: 'boolean', value: true, roles: access,
    description: 'Turns all PIVOT AI features (Now Assist) on or off. PIVOT works fully without them.' })
Property({ $id: Now.ID['prop-max-run-minutes'], name: 'x_enno_pivot.max_run_minutes', type: 'integer', value: 30, roles: access,
    description: 'Maximum assessment run time in minutes (PIV-022). Capabilities not measured when the limit is reached are Not Measured with reason "Run time limit reached". 0 = no limit.' })
Property({ $id: Now.ID['prop-timing-log'], name: 'x_enno_pivot.timing_log', type: 'boolean', value: false, roles: access,
    description: 'When true, the assessment run log shows how long each measured capability took (PIV-022.02). Slow capabilities are always logged.' })
