## What's already done
- Domain helpers (`src/domain/structure.ts`): parsing, `maxSeats`, `settle` — pure, no framework imports.
- `DemoStore` (`src/lib/demo-store.tsx`): all entities + actions (`createDraft`, `fundCampaign`, `yoloJoin`, `surgicalApply`, `advanceDemo`, `ingestMockMetrics`, `settleCampaign`, `setRole`, `resetDemo`), localStorage `nocap-demo-v1`, seed with a settled fixture, provider mounted in `__root.tsx`.
- ElevenLabs voice pipeline: `/api/voice/structure` (STT + `structureCampaignDraft`), `/api/voice/tts`, Scout voice agent wizard at `/brand/create`, fund → escrow → navigate to `/campaigns/$id`.
- Creator-facing browse + apply: `/campaigns` list, `/campaigns/$id` join/apply with tracking code.

## What's still missing from the spec

### 1. Brand HQ screen (biggest gap)
`/campaigns/$id` today is creator-only (Join/Apply). The pitch script needs a brand-side control panel to drive the demo. Add a brand HQ view (either merged into `/campaigns/$id` gated by `state.role === "brand"`, or a new `/brand/campaigns.$id.tsx`) with:
- Seats filled / cap, applicants list.
- **Surgical accept / reject** buttons per applicant (missing store actions — add `surgicalAccept(cid, pid)` and `surgicalReject(cid, pid)` with cap enforcement; spec lists them but they aren't implemented).
- **Advance demo** button (`recruiting → live → measuring`).
- **Simulate results** button (`ingestMockMetrics`).
- **Settle** button (`settleCampaign`) — show per-creator ledger with 7% fee after.

### 2. Role switcher + Reset demo in shell
Sidebar/nav lacks the role switch and reset. Add a small "Demo" control in `SiteShell` (or a floating dev bar) with:
- Toggle `state.role` between Brand / Creator (drives which view `/campaigns/$id` renders and which nav items surface).
- **Reset demo** button calling `resetDemo()`.

### 3. Creator surfaces beyond browse
Spec calls out three creator screens; today only Discover exists via `/campaigns`. Add:
- `/creator/active` — participations for `creator_demo` in `joined/accepted` state, showing mission kit (brief + guidelines + tracking code).
- `/creator/payouts` — ledger lines from `state.ledger` grouped by campaign, gross / fee / net.
- (Optional per spec) `/creator/profile` — connector toggles writing flags into the store.

### 4. Brand list view
`/brand/campaigns` (list of the brand's own campaigns with status chips + link into HQ). Currently `/campaigns` mixes both audiences.

### 5. Idempotent settle + cap-violation toasts
- Guard `settleCampaign` so calling twice doesn't duplicate ledger lines (current code already filters by cid — verify and add a toast).
- `yoloJoin` silently no-ops when full; surface a toast at the call site (detail page already does; audit other entry points).

### 6. Domain tests
Add unit tests for `structureCampaignDraft` (EUR/CPA/weights from sample transcripts) and thin coverage for `settle` + `maxSeats`. Spec lists this under Testing.

### 7. README polish (submission notes)
- Problem one-liner, demo URL placeholder.
- Sponsor tools: ElevenLabs (real); note Stripe/social as mocked.
- Run + reset instructions, `ELEVENLABS_API_KEY` env.
- Confirm `LICENSE` exists.

### 8. Small nits
- `/brand/create` fund step: on failure/empty brief it kicks back to review — good. Confirm double-fund is guarded.
- Voice failure fallback copy: add a "Fill sample brief" button for offline rehearsals (spec §7).

## Suggested build order (fits pitch script)
1. HQ view + surgical accept/reject + advance/simulate/settle buttons.
2. Role switcher + Reset demo in shell.
3. Creator active + payouts pages.
4. Brand campaigns list.
5. Tests + README + sample-brief fallback.

## Clarifying question
Do you want the brand HQ merged into `/campaigns/$id` (role-switched view) or split into a separate `/brand/campaigns/$id` route? The spec uses split URLs; the current code has a single unified route. I'll default to **split routes** (matches spec) unless you say otherwise.