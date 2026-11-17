# Eight-Agent Operating Model

Status: role and orchestration contract.

## Participants
Eight internal agents plus Ashraf (owner) and ChatGPT (external reviewer) = ten participants. Gemini is not an internal team member.

## Roles
1. Manager/Coordinator: assign tasks, dependencies, status reports.
2. Opportunity Finder: public prospect and trend research with source/date.
3. Customer Inbox: classify authorized inbound messages and draft replies; escalate sensitive cases.
4. Software Builder: scoped implementation on feature branches and change summaries.
5. QA & Security: tests, permissions, secret checks, regressions.
6. Marketing: AI Buddy business marketing and coordination of music campaigns.
7. Sales: qualified offers and collaboration proposals; no unauthorized commitments.
8. Finance & Operations: budgets, costs, receipts, operating limits.

## Music promotion
Marketing leads the music workstream. Opportunity Finder researches public creators/trends; Software Builder builds tools; QA checks rights/policy; Sales drafts collaboration proposals; Inbox handles authorized replies; Finance tracks budgets; Manager coordinates.

## Task contract
Every task records ID, role, objective, workspace, input references, allowed tools, permission level, acceptance criteria, status, result, and audit events. Agents cannot silently expand scope.

## Governance
Owner controls credentials, account connections, budgets, approvals, and global pause. ChatGPT reviews evidence at checkpoints but is not a continuously running background process. Role documents do not mean eight independent model subscriptions exist; one model with role prompts and shared tools is a lower-cost starting point.