# No Cap

**Don't waste money on ads. Let influencers sell for you.**

No Cap is UGC go-to-market for D2C product brands. A brand funds **one pool**
instead of negotiating dozens of flat fees. Creators join, post, and the pool
splits by tracked results using a published formula. Variable cost, not
guesswork.

- Live demo: https://nocap.ink

## How it works

1. **Scout** (brand-side voice agent) collects the brief by voice and structures
   it into a campaign: pool, target CPA, signup/impression weights, mode.
2. Cap is derived from the pool: `maxSeats = floor(pool / targetCPA)`.
3. Brand funds escrow. Campaign goes `draft → funded → recruiting`.
4. Creators join in **Yolo** mode (one tap, first-come to the cap) or apply in
   **Surgical** mode (brand accepts/rejects). Each gets a tracking code.
5. Campaign advances `recruiting → live → measuring`, results come in, and
   settle splits the pool by weighted score with a 7% platform fee.

## Screens

| Route | What it does |
| --- | --- |
| `/` | Landing, thesis, split calculator |
| `/brand/create` | Scout voice wizard → review form → fund escrow |
| `/brand/campaigns` | Brand's campaigns with status chips |
| `/brand/campaigns/$id` | Brand HQ: applicants, advance, simulate, settle |
| `/campaigns` | Creator-facing pool discovery |
| `/campaigns/$id` | Join / apply, mission kit, tracking code |
| `/creator/active` | Active missions with brief + tracking code |
| `/creator/payouts` | Ledger: gross, 7% fee, net |
| `/pricing` | Free / Growth (7%) / Enterprise |

## Sponsor tools

- **ElevenLabs** (real integration): speech-to-text (`scribe_v1`) for the brand
  brief and text-to-speech for Scout's voice. Endpoints live at
  `src/routes/api/voice/structure.ts` and `src/routes/api/voice/tts.ts`.
- **Mocked for the demo**: payments/escrow (no card is charged), social platform
  metrics (`ingestMockMetrics` generates deterministic results).

## Architecture

- `src/domain/structure.ts` — pure helpers: transcript → campaign draft,
  `maxSeats`, `settle`. No framework imports.
- `src/lib/demo-store.tsx` — React context store holding campaigns,
  participations, metrics and ledger; persisted to `localStorage`
  (`nocap-demo-v1`). Settle is idempotent.
- `src/routes/` — TanStack Start file-based routing, including server routes
  under `src/routes/api/`.

## Running locally

Requires Node.js 20+ (or Bun).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Environment:

```sh
ELEVENLABS_API_KEY=...        # required for Scout voice (STT + TTS)
ELEVENLABS_STT_MODEL=scribe_v1 # optional override
```

Without the key the voice endpoints return 503 and Scout falls back to the
typed review form, so the demo still runs end to end.

## Resetting the demo

The floating demo bar (bottom of every page) has a **Brand / Creator** role
toggle and a **Reset demo** button that restores the seeded state. You can also
clear the `nocap-demo-v1` key from `localStorage`.

## Built with

- TanStack Start (React 19, Vite 7)
- TypeScript
- Tailwind CSS v4
- ElevenLabs STT + TTS

## License

MIT - see [LICENSE](./LICENSE).
