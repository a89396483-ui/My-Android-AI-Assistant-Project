# Marketing & AI Team Test Plan

Status: checklist only. Tests must be implemented and executed before launch.

## Unit tests
- AI Buddy, music, artist, and client workspace isolation.
- Role permissions and task routing.
- Rights gate and media/caption validation.
- Approval expiry and exact-payload matching.
- Budget cap and currency validation.
- Pause switch blocks publishing and spending.
- Idempotency prevents duplicate jobs.
- Retry/backoff and rate-limit handling.
- Token encryption, expiry, revocation, and secret redaction.
- Analytics parsing and missing metrics.

## Integration tests (mock/sandbox first)
- OAuth state/CSRF validation and callback failures.
- Adapter reports success only with confirmed receipt.
- Missing permissions/platform outage returns manual export.
- Paid campaign blocked without fresh spend approval.
- Scheduler restart does not duplicate jobs.
- Disconnect stops future jobs and removes token reference.

## End-to-end acceptance
1. Create separate AI Buddy and Music workspaces.
2. Upload an authorized song and rights confirmation.
3. Create campaign, generate drafts, run QA.
4. Approve one mock post and verify receipt.
5. Confirm no publish while paused or unapproved.
6. Confirm paid campaign blocked until exact budget approval.
7. Confirm analytics remain in correct workspace.
8. Confirm one client cannot read another client's assets/tokens.
9. Confirm audit log for every sensitive action.
10. Confirm manual upload package when platform adapter is unavailable.

## Existing app checks
Run in a suitable environment using the repository package manager: dependency install, test, lint, and production build. Record command, date, exit code, and logs. Do not claim passing until executed. Web build is not proof of Android APK.