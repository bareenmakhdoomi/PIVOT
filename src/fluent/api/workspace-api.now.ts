import '@servicenow/sdk/global'
import { RestApi, Acl } from '@servicenow/sdk/core'
import { viewer } from '../roles/roles.now'
import { bootstrap, action } from '../../server/pivot/workspace-api'

// PIV-063 – the PIVOT workspace reads and writes through this Scripted REST API only.
// URIs: GET /api/x_enno_pivot/v1/workspace/bootstrap · POST /api/x_enno_pivot/v1/workspace/action
// Every PIVOT role contains viewer; what each user may change is decided by the table/field ACLs
// (GlideRecordSecure) and the role checks in the handler.
export const workspaceApiAcl = Acl({
    $id: Now.ID['acl-rest-workspace'],
    type: 'rest_endpoint',
    name: 'x_enno_pivot_workspace_api',
    operation: 'execute',
    roles: [viewer],
    adminOverrides: false,
    active: true,
    description: 'Only users with a PIVOT role can call the PIVOT workspace API.',
})

RestApi({
    $id: Now.ID['rest-workspace'],
    name: 'PIVOT Workspace',
    serviceId: 'workspace',
    shortDescription: 'Data and actions for the PIVOT workspace UI page. Internal to PIVOT.',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [workspaceApiAcl],
    versions: [{ $id: Now.ID['rest-workspace-v1'], version: 1, isDefault: true, shortDescription: 'First version' }],
    routes: [
        {
            $id: Now.ID['rest-workspace-bootstrap'],
            name: 'bootstrap',
            method: 'GET',
            path: '/bootstrap',
            script: bootstrap,
            version: 1,
            enforceAcl: [workspaceApiAcl],
            shortDescription: 'Everything the workspace shows for the current user (ACLs applied).',
        },
        {
            $id: Now.ID['rest-workspace-action'],
            name: 'action',
            method: 'POST',
            path: '/action',
            script: action,
            version: 1,
            enforceAcl: [workspaceApiAcl],
            shortDescription: 'One user action (accept, reject, assign, note, scores, reorder, outcome, capability, family, property).',
        },
    ],
})
