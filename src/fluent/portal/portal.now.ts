import '@servicenow/sdk/global'
import { Record, JsInclude, SPWidgetDependency, SPWidget, SPTheme, SPPage, ServicePortal } from '@servicenow/sdk/core'
import { viewer } from '../roles/roles.now'

// PIV-064 – PIVOT Service Portal: https://<instance>/x_enno_pivot  (page x_enno_pivot_home)
// The portal shows the same Concept 27 workspace as the UI page, with the same REST API and ACLs.
// No iframe: the workspace code is a UI script loaded through a widget dependency.

// UI script generated from src/client by scripts/build-portal-bundle.mjs (runs before every build)
export const portalScript = Record({
    $id: Now.ID['pivot-portal-ui-script'],
    table: 'sys_ui_script',
    data: {
        name: 'pivot_portal',
        description: 'PIVOT workspace for Service Portal (generated – edit src/client, then build).',
        script: Now.include('./generated/pivot-portal.bundle.js'),
        active: true,
        global: false,
        ui_type: '10',
        use_scoped_format: false,
    },
})

const portalJs = JsInclude({
    $id: Now.ID['pivot-portal-js-include'],
    name: 'PIVOT portal workspace',
    sysUiScript: portalScript,
})

const portalDependency = SPWidgetDependency({
    $id: Now.ID['pivot-portal-dependency'],
    name: 'x_enno_pivot_workspace_dependency',
    jsIncludes: [{ order: 100, include: portalJs }],
})

export const workspaceWidget = SPWidget({
    $id: Now.ID['pivot-portal-widget'],
    name: 'PIVOT Workspace',
    id: 'x_enno_pivot_workspace',
    description: 'The PIVOT workspace (Concept 27) for the PIVOT portal. Data comes from the PIVOT workspace REST API.',
    htmlTemplate: Now.include('./widget/template.html'),
    clientScript: Now.include('./widget/client.js'),
    customCss: Now.include('./widget/styles.scss'),
    dependencies: [portalDependency],
    roles: [viewer],
    hasPreview: false,
})

// Theme without the stock header and footer: the PIVOT sidebar is the portal navigation.
export const pivotTheme = SPTheme({
    $id: Now.ID['pivot-portal-theme'],
    name: 'PIVOT',
    fixedHeader: false,
    fixedFooter: false,
    customCss: '$body-bg: #f4f6fb;\n$navbar-inverse-bg: #1f2a6b;\n$brand-primary: #4f5bd5;',
})

export const pivotHome = SPPage({
    pageId: 'x_enno_pivot_home',
    title: 'PIVOT',
    shortDescription: 'PIVOT workspace – all ten views. Requires a PIVOT role.',
    public: false,
    roles: [viewer],
    css: '.x-enno-pivot-page{padding:0!important;margin:0!important;width:100%;max-width:none}\n.x-enno-pivot-page .row{margin:0}\n.x-enno-pivot-page [class*="col-"]{padding:0}',
    containers: [
        {
            $id: Now.ID['pivot-portal-home-container'],
            name: 'PIVOT workspace',
            width: 'container-fluid',
            cssClass: 'x-enno-pivot-page',
            semanticTag: 'main',
            order: 1,
            rows: [
                {
                    $id: Now.ID['pivot-portal-home-row'],
                    order: 1,
                    columns: [
                        {
                            $id: Now.ID['pivot-portal-home-column'],
                            size: 12,
                            order: 1,
                            instances: [{ $id: Now.ID['pivot-portal-home-instance'], widget: workspaceWidget, order: 1 }],
                        },
                    ],
                },
            ],
        },
    ],
})

export const pivotPortal = ServicePortal({
    $id: Now.ID['pivot-portal'],
    title: 'PIVOT',
    urlSuffix: 'x_enno_pivot',
    homePage: pivotHome,
    theme: pivotTheme,
    hidePortalName: false,
})
