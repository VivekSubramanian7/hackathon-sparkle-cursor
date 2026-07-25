import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";
import { maxSeats } from "@/domain/structure";
import { VoiceAgent, type VoiceAgentResult } from "@/components/voice-agent";

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
  const [phase, setPhase] = useState<"voice" | "fund">("voice");
  const [agentPhase, setAgentPhase] = useState<"voice" | "review">("voice");
  // Re-mount VoiceAgent when we want to force it back into review mode
  const [agentKey, setAgentKey] = useState(0);
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

  function applyAgent(r: VoiceAgentResult) {
    setTitle(r.title);
    setBrandName(r.brandName);
    setBrief(r.brief);
    setGuidelines(r.guidelines);
    setPoolEur(r.poolEur);
    setTargetCpa(r.targetCpa);
    setSignupWeight(r.signupWeight);
    setMode(r.mode);
    setPhase("fund");
  }

  function absorbAgent(r: VoiceAgentResult) {
    if (r.title) setTitle(r.title);
    if (r.brandName) setBrandName(r.brandName);
    if (r.brief) setBrief(r.brief);
    if (r.guidelines) setGuidelines(r.guidelines);
    if (r.poolEur) setPoolEur(r.poolEur);
    if (r.targetCpa) setTargetCpa(r.targetCpa);
    if (typeof r.signupWeight === "number") setSignupWeight(r.signupWeight);
    if (r.mode) setMode(r.mode);
  }

  function currentAsAgent(): VoiceAgentResult {
    return { title, brandName, brief, guidelines, poolEur, targetCpa, signupWeight, mode };
  }

  async function pay() {
    if (!brief.trim()) {
      toast.error("Add a brief before funding");
      setPhase("voice");
      setAgentPhase("review");
      setAgentKey((k) => k + 1);
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
      setPhase("voice");
      setAgentPhase("voice");
      setAgentKey((k) => k + 1);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="nc-wizard">
      <section className="nc-wizard-body">
        {phase === "voice" ? (
          <VoiceAgent
            key={agentKey}
            initial={currentAsAgent()}
            initialPhase={agentPhase}
            onDone={applyAgent}
            onCancel={(current) => {
              absorbAgent(current);
              // Force VoiceAgent into review-form mode with the data preserved.
              setAgentPhase("review");
              setAgentKey((k) => k + 1);
            }}
          />
        ) : (
          <div className="nc-form nc-pay">
            <p className="nc-eyebrow">Brand · Fund escrow</p>
            <h2>Fund one pool. Let results split the rest.</h2>
            <dl className="nc-summary">
              <div><dt>Campaign</dt><dd>{title || "Untitled"}</dd></div>
              <div><dt>Brand</dt><dd>{brandName || "Your brand"}</dd></div>
              <div><dt>Pool</dt><dd>€{poolEur.toLocaleString()}</dd></div>
              <div><dt>Target CPA</dt><dd>€{targetCpa}</dd></div>
              <div><dt>Cap</dt><dd>{seats.toLocaleString()} seats</dd></div>
              <div><dt>Mode</dt><dd>{mode === "yolo" ? "Yolo (open)" : "Surgical (review)"}</dd></div>
              <div><dt>Weights</dt><dd>{Math.round(signupWeight * 100)}% signups · {Math.round((1 - signupWeight) * 100)}% impressions</dd></div>
              <div><dt>Platform fee</dt><dd>7% at settle</dd></div>
            </dl>
            <p className="nc-note">Mock escrow for the demo. No card is charged.</p>
            <div className="nc-actions">
              <button
                className="nc-btn-ghost"
                onClick={() => {
                  setPhase("voice");
                  setAgentPhase("review");
                  setAgentKey((k) => k + 1);
                }}
                disabled={paying}
              >
                Back to review
              </button>
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