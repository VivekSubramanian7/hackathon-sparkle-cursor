import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { Waveform } from "@/components/waveform";
import { useRecorder } from "@/hooks/use-recorder";
import { useDemoStore } from "@/lib/demo-store";
import { maxSeats, type CampaignDraft } from "@/domain/structure";

export const Route = createFileRoute("/brand/create")({
  head: () => ({
    meta: [
      { title: "Create a campaign - No Cap" },
      { name: "description", content: "Speak your brief. Fund one pool. Let tracked results split what's above baseline." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CreatePage,
});

type Step = 0 | 1 | 2 | 3 | 4;

function CreatePage() {
  return (
    <SiteShell>
      <main className="nc-create">
        <CreateWizard />
      </main>
    </SiteShell>
  );
}

function CreateWizard() {
  const navigate = useNavigate();
  const { createDraft, fundCampaign } = useDemoStore();
  const [step, setStep] = useState<Step>(0);
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brief, setBrief] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [poolEur, setPoolEur] = useState<number>(10000);
  const [targetCpa, setTargetCpa] = useState<number>(10);
  const [signupWeight, setSignupWeight] = useState<number>(0.7);
  const [mode, setMode] = useState<"yolo" | "surgical">("yolo");
  const [paying, setPaying] = useState(false);

  const seats = maxSeats(poolEur, targetCpa);

  function applyDraft(d: CampaignDraft) {
    if (d.title && !title) setTitle(d.title);
    setBrief(d.brief || "");
    if (d.guidelines && !guidelines) setGuidelines(d.guidelines);
    if (typeof d.poolEur === "number" && d.poolEur > 0) setPoolEur(d.poolEur);
    if (typeof d.targetCpa === "number" && d.targetCpa > 0) setTargetCpa(d.targetCpa);
    if (typeof d.signupWeight === "number") setSignupWeight(d.signupWeight);
  }

  function fillSample() {
    const sample =
      "Launch campaign for Magic Spoon cinnamon flavor. Pool of 15000 EUR with a target CPA of 12. We want signups from breakfast lovers, and some awareness on TikTok and Reels.";
    setTranscript(sample);
    applyDraft({
      title: "Magic Spoon cinnamon launch",
      brief: sample,
      guidelines:
        "Disclose partnership (#ad / Werbung). 15-30s UGC, show the box and a real breakfast moment.",
      poolEur: 15000,
      targetCpa: 12,
      signupWeight: 0.7,
    });
    toast.success("Sample brief loaded");
    setStep(1);
  }

  async function pay() {
    if (!brief.trim()) {
      toast.error("Add a brief before funding");
      return;
    }
    setPaying(true);
    try {
      const c = createDraft({
        title: title || "Untitled campaign",
        brandName: brandName || "Your brand",
        brief,
        guidelines,
        mode,
        poolEur,
        targetCpa,
        signupWeight,
      });
      toast.loading("Escrowing pool...", { id: "fund" });
      await fundCampaign(c.id);
      toast.success("Pool funded - campaign is recruiting", { id: "fund" });
      navigate({ to: "/brand/create", search: {} });
      setStep(0);
      setTranscript("");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="nc-wizard">
      <header className="nc-wizard-head">
        <p className="nc-eyebrow">Brand · New campaign</p>
        <h1>Fund one pool. Let results split the rest.</h1>
        <ol className="nc-stepper">
          {["Speak", "Brief", "Economics", "Mode", "Fund"].map((label, i) => (
            <li key={label} className={i === step ? "is-current" : i < step ? "is-done" : ""}>
              <span>{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </header>

      <section className="nc-wizard-body">
        {step === 0 && (
          <VoiceStep
            onTranscript={(t, d) => {
              setTranscript(t);
              applyDraft(d);
              setStep(1);
            }}
            onSkip={() => setStep(1)}
            onSample={fillSample}
          />
        )}

        {step === 1 && (
          <div className="nc-form">
            {transcript && (
              <p className="nc-transcript">
                <span>Heard:</span> "{transcript.slice(0, 220)}{transcript.length > 220 ? "..." : ""}"
              </p>
            )}
            <label>
              Campaign title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cinnamon launch" />
            </label>
            <label>
              Brand name
              <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Your brand" />
            </label>
            <label>
              Brief
              <textarea rows={5} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="What are we selling, to whom, and how?" />
            </label>
            <label>
              Creator guidelines
              <textarea rows={3} value={guidelines} onChange={(e) => setGuidelines(e.target.value)} placeholder="Disclosure, tone, must-mentions..." />
            </label>
            <WizardNav onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={!!brief.trim()} />
          </div>
        )}

        {step === 2 && (
          <div className="nc-form">
            <div className="nc-econ-grid">
              <label>
                Pool (EUR)
                <input
                  type="number"
                  min={100}
                  value={poolEur}
                  onChange={(e) => setPoolEur(Math.max(0, Number(e.target.value)))}
                />
              </label>
              <label>
                Target CPA (EUR)
                <input
                  type="number"
                  min={1}
                  value={targetCpa}
                  onChange={(e) => setTargetCpa(Math.max(1, Number(e.target.value)))}
                />
              </label>
              <label className="nc-slider">
                Weight: signups <b>{Math.round(signupWeight * 100)}%</b> · impressions <b>{Math.round((1 - signupWeight) * 100)}%</b>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={signupWeight}
                  onChange={(e) => setSignupWeight(Number(e.target.value))}
                />
              </label>
            </div>
            <p className="nc-econ-hint">
              Cap: <b>{seats.toLocaleString()} seats</b> at €{targetCpa}/CPA · Platform fee 7% deducted at settle
            </p>
            <WizardNav onBack={() => setStep(1)} onNext={() => setStep(3)} canNext={poolEur > 0 && targetCpa > 0} />
          </div>
        )}

        {step === 3 && (
          <div className="nc-form">
            <div className="nc-mode-grid">
              <button type="button" className={`nc-mode-card ${mode === "yolo" ? "is-active" : ""}`} onClick={() => setMode("yolo")}>
                <b>Yolo</b>
                <span>Open pool. First-come creators join instantly, cap enforced.</span>
              </button>
              <button type="button" className={`nc-mode-card ${mode === "surgical" ? "is-active" : ""}`} onClick={() => setMode("surgical")}>
                <b>Surgical</b>
                <span>Applications only. Manager reviews and accepts up to the cap.</span>
              </button>
            </div>
            <WizardNav onBack={() => setStep(2)} onNext={() => setStep(4)} canNext />
          </div>
        )}

        {step === 4 && (
          <div className="nc-form nc-pay">
            <h2>Fund escrow</h2>
            <dl className="nc-summary">
              <div><dt>Pool</dt><dd>€{poolEur.toLocaleString()}</dd></div>
              <div><dt>Target CPA</dt><dd>€{targetCpa}</dd></div>
              <div><dt>Cap</dt><dd>{seats.toLocaleString()} seats</dd></div>
              <div><dt>Mode</dt><dd>{mode === "yolo" ? "Yolo (open)" : "Surgical (review)"}</dd></div>
              <div><dt>Weights</dt><dd>{Math.round(signupWeight * 100)}% signups · {Math.round((1 - signupWeight) * 100)}% impressions</dd></div>
              <div><dt>Platform fee</dt><dd>7% at settle</dd></div>
            </dl>
            <p className="nc-note">Mock escrow for the demo. No card is charged.</p>
            <div className="nc-actions">
              <button className="nc-btn-ghost" onClick={() => setStep(3)} disabled={paying}>Back</button>
              <button className="nc-btn-primary" onClick={pay} disabled={paying}>
                {paying ? "Funding..." : `Fund €${poolEur.toLocaleString()} pool`}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function WizardNav({ onBack, onNext, canNext }: { onBack: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <div className="nc-actions">
      <button className="nc-btn-ghost" onClick={onBack}>Back</button>
      <button className="nc-btn-primary" onClick={onNext} disabled={!canNext}>Continue</button>
    </div>
  );
}

function VoiceStep({
  onTranscript,
  onSkip,
  onSample,
}: {
  onTranscript: (transcript: string, draft: CampaignDraft) => void;
  onSkip: () => void;
  onSample: () => void;
}) {
  const rec = useRecorder();
  const [busy, setBusy] = useState(false);

  async function handleStop() {
    const blob = await rec.stop();
    if (!blob) {
      toast.error("Recording too short - try again");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "recording.wav");
      const res = await fetch("/api/voice/structure", { method: "POST", body: form });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(err.error || `Transcription failed (${res.status})`);
        return;
      }
      const data = (await res.json()) as { transcript: string; draft: CampaignDraft };
      toast.success("Draft filled from voice");
      onTranscript(data.transcript, data.draft);
    } catch (e) {
      toast.error((e as Error).message || "Voice pipeline failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nc-voice">
      <div className="nc-voice-card">
        <div className="nc-voice-visual">
          <Waveform levels={rec.levels} active={rec.isRecording} />
          <div className="nc-voice-timer">{rec.isRecording ? `${rec.seconds}s` : busy ? "Transcribing..." : "Tap to record"}</div>
        </div>
        <div className="nc-actions nc-voice-actions">
          {!rec.isRecording ? (
            <button className="nc-btn-primary" onClick={() => rec.start()} disabled={busy || !rec.isSupported}>
              {rec.isSupported ? "Start recording" : "Mic unavailable"}
            </button>
          ) : (
            <button className="nc-btn-primary" onClick={handleStop}>Stop &amp; transcribe</button>
          )}
          <button className="nc-btn-ghost" onClick={onSkip} disabled={busy}>Skip &amp; type</button>
          <button className="nc-btn-ghost" onClick={onSample} disabled={busy || rec.isRecording}>Fill sample brief</button>
        </div>
        {rec.error && <p className="nc-voice-error">{rec.error}</p>}
      </div>
      <p className="nc-voice-hint">
        Speak your campaign in one breath: what you're selling, pool size, target CPA, whether you care more about signups or reach. ElevenLabs turns it into a structured draft you can edit.
      </p>
    </div>
  );
}