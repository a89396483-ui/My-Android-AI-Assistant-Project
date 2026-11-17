# Nova, Music Video Studio and Music Promotion Boundaries

## Nova — song creation
Nova is the separately named song-generation feature/provider concept. Its responsibility is original song creation: song concept, lyrics, composition/arrangement and, only when a supported provider is connected, generated singing/audio. The existing /song route currently generates lyrics through the configured text AI gateway; it does not generate a finished sung recording or instrumental track.

## Music Video Studio — visual production
Takes an owner-selected, authorized song and creates storyboards, visual concepts, short video previews, lyric overlays and alternate vertical edits. It must show estimates and obtain approval before paid generation.

## Music Promotion Agent — campaign management
Creates campaign plans, captions, release calendars, hook tests, creator-collaboration drafts and analytics reviews. It may submit posts only through an approved official integration and only after owner approval.

## Separation requirements
- Separate assets, job queues, budgets, permissions, analytics and customer workspaces.
- No automatic reuse of one artist's private assets in another artist's campaign.
- A song can be passed from Nova to Video Studio only after the owner selects it.
- A video can be passed from Studio to Promotion only after the owner approves it.
- Every paid action requires a fresh cost estimate and explicit approval.
- No fake engagement, guaranteed FYP, impersonation or unlicensed source material.
