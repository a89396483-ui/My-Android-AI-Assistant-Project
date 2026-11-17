# AI Buddy — Nine-role business team

## Team structure
AI Buddy will contain eight internal specialist roles coordinated by one Manager role. ChatGPT is the ninth collaborator, acting as an external reviewer when Ashraf shares code/results or grants a supported integration. These are roles, not necessarily nine separate paid models. Start with one approved model and role-specific instructions; add separate models only if tests justify cost.

## Eight internal roles
1. **AI Buddy Manager** — plans work, assigns tasks, tracks dependencies and approvals.
2. **Opportunity Finder** — researches public business opportunities and records source links.
3. **Customer Inbox Agent** — reads authorized inbound messages, classifies them and drafts replies.
4. **Software Builder** — plans and creates software in isolated feature branches.
5. **QA & Security Agent** — runs tests and reviews privacy, secrets and code risks.
6. **Marketing Agent** — creates platform-specific campaigns and content.
7. **Sales Agent** — prepares proposals, demos and follow-ups using approved prices and facts.
8. **Finance & Operations Agent** — tracks received payments, expenses, refunds and net profit.

## Ninth collaborator: ChatGPT Reviewer
Reviews supplied code, diffs, test results and plans. GitHub connection alone does not mean ChatGPT continuously watches the running app, inbox, or background jobs. Visibility depends on the specific authorized integration and shared evidence.

## Workflow
Opportunity Finder -> Manager qualification -> Software Builder -> QA -> Marketing -> Sales -> Customer Inbox -> Finance -> Manager report. ChatGPT reviews code and evidence at agreed checkpoints.

## Autonomy
Default is draft-only. Higher autonomy must be explicitly configured. Opt-outs, complaints, unusual requests, uncertain claims, contracts, refunds, spending, merges and production deploys require human review/approval.

## Build sequence
1. Role/task contracts, shared task queue, audit log and pause switch.
2. Public opportunity research and CRM.
3. Authorized inbox read/classify and reply drafts.
4. Isolated software generation, tests and sample-data demos.
5. Marketing and sales drafts.
6. Owner-approved sending and persistent records.
7. Limited routine automation only after real tests.

## Reality check
The system can automate research, drafts, coding assistance, tests and routine workflows, but cannot guarantee leads, sales, profit, perfect code or continuous operation. Every agent must report what it actually did and what remains blocked.
