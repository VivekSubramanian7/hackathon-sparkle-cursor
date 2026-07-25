## Goal
Make the new Scout voice UI the campaign creation page. Remove the old 5-step wizard (Speak / Brief / Economics / Mode / Fund) and the standalone `VoiceStep` recorder.

## New flow on `/brand/create`
1. **Scout voice stage** (default): the minimal centered waveform UI already built in `VoiceAgent`.
2. **Review draft**: the existing `ReviewForm` inside `VoiceAgent` (shown after the last question or when the user taps "Switch to text").
3. **Fund**: a single fund panel (pool summary + "Fund €X pool" button) that appears after the user accepts the review.

"Switch to text" in the voice stage jumps straight to the review form with all partial answers preserved - no intermediate wizard steps.

## Changes

### `src/routes/brand.create.tsx`
- Delete the `Step` type, `step` state, `<ol class="nc-stepper">` header, and all `{step === N && ...}` blocks (brief, economics, mode, fund wizard, `WizardNav`, `SwitchToVoice`, `VoiceStep`, `fillSample`, `applyDraft`, `transcript` state).
- Keep the shared campaign state (title, brandName, brief, guidelines, poolEur, targetCpa, signupWeight, mode, paying) and `pay()`.
- Render `<VoiceAgent>` always. Track a local `phase: "voice" | "fund"`.
  - `onDone(r)` → apply results, switch to `fund`.
  - `onCancel(current)` → absorb partial answers, force `VoiceAgent` into its review-form state so the user can finish typing (achieved by passing an `initialPhase="review"` prop to `VoiceAgent`, see below).
- Fund panel: reuse the existing `nc-form nc-pay` summary block and `pay()` handler. "Back" returns to `VoiceAgent` in review mode.

### `src/components/voice-agent.tsx`
- Add optional `initialPhase?: "voice" | "review"` prop. When `"review"`, skip straight to the review form regardless of answered questions.
- No other behavior changes; the voice stage UI stays as-is.

### Cleanup
- Remove unused imports left behind in `brand.create.tsx` (`Waveform`, `useRecorder`, `CampaignDraft`, `toast` if unused).
- Leave `src/components/waveform.tsx` in place (not touched by this change).

## Out of scope
- No visual redesign of the Scout stage or review form.
- No change to auth, DemoStore, or the `pay()` mock escrow behavior.
- Stepper/wizard styles in `styles.css` stay (harmless dead CSS); can be pruned later.