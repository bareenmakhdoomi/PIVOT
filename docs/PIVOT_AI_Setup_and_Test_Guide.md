---
title: "PIVOT AI features – setup, access and test guide"
subtitle: "Sprint 6 (PIV-054 to PIV-061) · scope x_enno_pivot"
---

# 1. Instance check (PIV-054.01)

The build instance (enablenowincdemo1) was checked on 6 Nov 2026.

| Plugin / app | Scope | Status |
|---|---|---|
| Generative AI Controller | sn_generative_ai 14.2.3 | Active |
| AI Skill Kit (Now Assist Skill Kit) | sn_skill_builder 9.2.4 | Active |
| Now Assist in Virtual Agent ("ServiceNow Otto for Virtual Agent") | sn_nowassist_va 21.0.13 | Active |
| Now Assist Core | now_assist_core 28.12.10 | Active |

A test prompt from the PIVOT scope through Generative AI Controller answered "ready" in about 1 second (PIV-054.02 AC 1). Nothing is missing, so the AI work is built on this instance. The first call added the cross-scope privilege "PIVOT → sn_generative_ai.LLMClient (execute)" automatically.

# 2. How the AI features work

PIVOT reads its own records as the signed-in user and gives only those facts to the approved LLM. Every number in the AI answer is checked against the facts. When a number is not in the record, or the answer is too long, PIVOT shows its own rule-based text with the label "PIVOT rules · AI answer not used". AI never saves anything: a person clicks Save, Assign, Add as a note or Confirm, and PIVOT's rules still calculate priority and the roadmap column.

The switch `x_enno_pivot.ai_enabled` turns every AI feature off. With it off there are no AI buttons, no Ask PIVOT and no briefing, and runs and emails work as before.

Every AI answer and the user's decision is stored in the AI Log table (`x_enno_pivot_ai_log`). Admins see it in PIVOT › AI usage and as counts with the accept rate in Settings › AI features.

# 3. Access table (PIV-054.04, used by PIV-061.03)

| Feature | No PIVOT role | Viewer | Business owner | Analyst | Admin |
|---|---|---|---|---|---|
| Explain this finding | — (no data) | ✓ | ✓ | ✓ | ✓ |
| Add explanation / plan as a note | — | — | — | ✓ | ✓ |
| Suggest scores, owner, owners, action plan | — | — ("Only analysts and admins can ask for AI suggestions.") | — | ✓ | ✓ |
| Assessment briefing (read, generate) | — | ✓ | ✓ | ✓ | ✓ |
| Ask PIVOT questions | — ("You do not have access to PIVOT…") | ✓ (own access) | ✓ | ✓ | ✓ |
| Assign / accept from chat | — | — | — | ✓ | ✓ |
| Run PIVOT from chat | — | — | — | — ("Only PIVOT admins can start a run.") | ✓ |
| Test AI, AI usage | — | — | — | — | ✓ |

# 4. Set up the Now Assist panel skill (PIV-055.04)

The logic is already in PIVOT. The skill only passes the record to PIVOT and shows the answer.

1. Open **AI Skill Kit** (Now Assist Skill Kit) and create a skill named **Explain PIVOT finding**, in the PIVOT application scope.
2. Inputs: the record the user is looking at (table and sys_id) and the user's message.
3. Add a **Script** tool named *PIVOT explain* with this script:

```
(function (inputs) {
    var ai = new x_enno_pivot.PivotAI();
    var r = ai.explain(inputs.table, inputs.sys_id, inputs.message);
    return { text: ai.answerText(r) };
})(inputs);
```

4. Prompt: "Return the tool output text exactly as written. Do not add, change or calculate anything."
5. Roles: `x_enno_pivot.viewer` (every PIVOT role contains it). Publish the skill and turn it on for the **Now Assist panel**.
6. Test: open an opportunity and type "explain this finding" → the same explanation as the workspace. On a record that is not an opportunity the answer is "Which opportunity do you mean? Open it, or give its number (PVO…)."

# 5. Set up the "Ask PIVOT" Virtual Agent topic (PIV-059.01, PIV-060)

1. In **Virtual Agent Designer** create an **LLM topic** named **Ask PIVOT** in the PIVOT scope.
2. Description: "Answers questions about PIVOT, the platform value app: the Platform Value Score and how it changed, idle or unused licences and shelfware, opportunities assigned to me, when PIVOT last ran and if it worked, what is not measured, what to do first. Also assigns or accepts a PIVOT opportunity and starts a PIVOT run. Not for passwords, incidents, requests or costs."
3. Example questions: what is our platform value score · how are we doing · which licences are we not using · what is assigned to me in PIVOT · when did PIVOT last run · what is not measured · what should we do first · run PIVOT now · assign HRSD fulfiller licences to R. Mehta · accept the HRSD fulfiller licences finding.
4. Topic variable `question` = the user's question. Add a **Script action** "Ask PIVOT":

```
(function execute() {
    var ai = new x_enno_pivot.PivotAI();
    var r = ai.ask(vaInputs.question);
    vaVars.pivot_answer = ai.answerText(r);
    vaVars.pivot_confirm = r.confirm ? JSON.stringify(r.confirm) : '';
})();
```

5. **Bot response (text)**: the variable `pivot_answer`.
6. **Decision**: when `pivot_confirm` is not empty → **Static choice** "Confirm" / "Cancel".
   * Confirm → Script action: `var r = new x_enno_pivot.PivotAI().confirm(vaVars.pivot_confirm); vaVars.pivot_answer = r.ok ? r.note : r.error;` → Bot response `pivot_answer`.
   * Cancel → Bot response "Cancelled. Nothing was changed."
7. Test: "what is our platform value score?" starts Ask PIVOT; "reset my password" does not. Changes made after Confirm are written to the opportunity's work notes as "Changed from Virtual Agent by (user): …".

# 6. Tests (PIV-061)

| Story | How | Pass when |
|---|---|---|
| 061.01 Test set | `PivotAIAccuracy_Test_BackgroundScript.js` creates 20 [AI TEST] findings: all 6 finding types, 6 stale, 14 unassigned, 4 long names | "20 samples, 6 of 6 finding types" in the output |
| 061.02 Numbers | Same script: runs Explain on each, checks numbers, required numbers and banned words; prints a DEFECT with prompt, answer and expected facts for each failure; removes the test records | "20 of 20 AI answers match the records" |
| 061.03 Access | Impersonate the 4 test users (no role, viewer, analyst, admin) and try every feature | Results match the access table above |
| 061.04 AI off | Set AI features off, Run Now, open the Dashboard, an opportunity, the run dialog and Help | Run Complete, email without a briefing, no AI buttons, panel or Ask PIVOT |
| 061.05 Demo | Sponsor review using the demo script below | Sponsor sign-off; feedback logged as Sprint 7 or v1.1 stories |

# 7. Demo script for the sponsor (PIV-061.05)

1. **Briefing** – Assessments › open the latest run: the briefing sits above the step log with its AI label; the same text is in the run email.
2. **Explain this finding** – open an idle-licence opportunity › Explain this finding › Add as a note.
3. **Suggest scores** – Suggest scores › Put these in the form › change effort › Save scores: PIVOT recalculates priority; the log shows "edited".
4. **Suggest owner / owners** – Suggest owner › Assign; then Roadmap › Suggest owners › accept two, skip the rest › Finish.
5. **Draft action plan** – Draft action plan › Add plan as a note "(AI draft, reviewed)".
6. **Ask PIVOT** – Help & Support › Ask PIVOT › "How are we doing?", "Which licences are we not using?", then "what will licences cost next year?" (PIVOT says it does not have that information).
7. **Chat actions** – Virtual Agent: "assign … to …" › Confirm; show the work note. Then Settings › AI features: switch off, show the buttons are gone, switch on again.
