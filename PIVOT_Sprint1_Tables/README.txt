PIVOT Sprint 1 – tables, properties, forms, admin modules (PIV-002 … PIV-005, PIV-008, B7 properties)
Copy the "src" folder over pivot-app\src (replace navigation\menu.now.ts). New files only otherwise.
  src/fluent/tables/*.now.ts        7 tables from design B3, each with sys_domain (domain separation / MSP)
                                   auto-numbers PVC (capability), PVA (assessment), PVO (opportunity)
  src/fluent/properties/*.now.ts    9 x_enno_pivot properties, read = viewer, write = admin
  src/fluent/forms/forms.now.ts     default platform forms for the 7 tables (admin fallback)
  src/fluent/navigation/menu.now.ts Workspace + admin modules (Capabilities, Needs mapping, Assessments,
                                   Opportunities, Business Outcomes, Properties) – every list module filtered
Not yet included: table ACLs (PIV-007, next step) – until then only admins can read PIVOT records.
Verified: npm run build passes with SDK 4.13.6.
