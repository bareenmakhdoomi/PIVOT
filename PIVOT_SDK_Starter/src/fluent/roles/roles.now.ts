import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// PIVOT roles (design B10). admin contains analyst and viewer; business_owner contains viewer.
export const viewer = Role({
    name: 'x_enno_pivot.viewer',
    description: 'Reads all PIVOT data and the workspace. Cannot change anything.',
})
export const analyst = Role({
    name: 'x_enno_pivot.analyst',
    description: 'Works opportunities (accept, reject with reason, assign, done, scores) and reorders the roadmap.',
    containsRoles: [viewer],
})
export const business_owner = Role({
    name: 'x_enno_pivot.business_owner',
    description: 'Creates and maintains own business outcomes, KPIs and targets (not baselines).',
    containsRoles: [viewer],
})
export const admin = Role({
    name: 'x_enno_pivot.admin',
    description: 'Everything in PIVOT: measurement settings, family mapping, baselines, properties and Run Now.',
    containsRoles: [analyst, viewer],
})
