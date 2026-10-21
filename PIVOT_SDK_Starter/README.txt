PIVOT SDK starter – first slice (PIV-001, PIV-006, PIV-008, PIV-062 placeholder)
Copy the "src" folder over the "src" folder of a project created with:
  npx @servicenow/sdk init --appName "PIVOT" --packageName "pivot" --scopeName "x_enno_pivot" --template "typescript.react"
Delete the sample incident files first (see step 4 of the instructions).
Contents:
  src/fluent/roles/roles.now.ts            4 PIVOT roles with hierarchy
  src/fluent/navigation/menu.now.ts        PIVOT menu: Workspace module + admin Properties module
  src/fluent/navigation/workspace-page.now.ts  UI page x_enno_pivot_workspace.do
  src/fluent/navigation/workspace-acl.now.ts   ACL: UI page readable only with a PIVOT role (certification)
  src/client/*                             placeholder React shell (8 views in a sidebar)
Verified: npm run build passes with SDK 4.13.6.
