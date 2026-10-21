PIVOT Sprint 1 – access controls (PIV-007) and test users (PIV-009)
1. Copy src\fluent\security\table-acls.now.ts into pivot-app\src\fluent\security\  → npm run build → npm run deploy
   50 ACLs from the access matrix (design B10):
   - Read (row + all fields): every PIVOT role on all 7 tables
   - Create / write / delete: PIVOT admin on Capability, Assessment, Opportunity, Roadmap Item, Business Outcome; delete also on Result tables
   - Analyst: write state, assigned_to, value, effort, business_impact, rejection_reason on Opportunity; sequence on Roadmap Item
   - Business owner: create outcomes; write only outcomes they own; never the baseline (admin only, audited)
   - Result and Outcome Result: written by the assessment run only
2. Run PivotTestUsers_BackgroundScript.js in Scripts - Background (dev instance only) → 4 test users, one role each.
Verified: npm run build passes with SDK 4.13.6. Test script parses as ES3.
