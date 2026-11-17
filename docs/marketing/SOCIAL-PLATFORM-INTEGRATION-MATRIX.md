# Social Platform Integration Matrix

Status: implementation checklist. Confirm current eligibility and permissions for each app/account.

| Platform | Organic publishing route | Main gates |
|---|---|---|
| Facebook Pages | Meta Graph API where approved | Meta app, Page authorization, permissions and review |
| Instagram | Instagram Graph API for eligible professional accounts | Professional account, linked Page, scopes and media rules |
| TikTok | Content Posting API for eligible apps/accounts | OAuth, scopes, app review/audit, account eligibility and media rules |
| YouTube | YouTube Data API upload | OAuth, quota, upload rules; unverified projects may be restricted |
| X | X API subject to current access tier | Developer app, OAuth scopes, endpoint access, rate limits and possible fees |

Ads are separate: Meta Ads/Marketing API, TikTok Ads, and Google Ads require separate access and authorization. Do not assume organic posting permission includes ads management.

## Adapter contract
Each adapter must support OAuth start/callback with CSRF validation, token refresh/revoke, media validation, publish or manual-action fallback, confirmed post ID/URL/status, supported analytics, rate limits, retries, and duplicate protection.

## Security
Never request passwords in chat. Store tokens encrypted server-side with least-privilege scopes. Disconnect revokes/deletes token references. Do not expose tokens to browser code. Never mark a post published without a platform receipt.

## Fallback
If direct publishing is unavailable, export media, caption, hashtags, and exact manual steps. Label it manual posting required.