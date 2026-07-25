import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/campaigns/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Campaign · ${params.id} - No Cap` },
      { name: "description", content: "Apply to this open UGC campaign. Baseline plus a share of the pool, sized to what your content drives." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state, yoloJoin, surgicalApply } = useDemoStore();

  const campaign = useMemo(
    () => state.campaigns.find((c) => c.id === id),
    [state.campaigns, id],
  );
  const myParticipation = useMemo(
    () => state.participations.find((p) => p.campaignId === id && p.creatorId === "creator_demo"),
    [state.participations, id],
  );

  if (!campaign) {
    return (
      <SiteShell>
        <main className="nc-campaigns">
          <div className="nc-empty">
            <h1>Campaign not found</h1>
            <p>This campaign might have closed or the link is off.</p>
            <Link to="/campaigns" className="nc-btn-primary">Browse open campaigns</Link>
          </div>
        </main>
      </SiteShell>
    );
  }

  const seatsLeft = Math.max(0, campaign.maxSeats - campaign.seatsFilled);
  const canJoin = ["recruiting", "live", "funded"].includes(campaign.status);

  function apply() {
    if (!campaign) return;
    if (myParticipation) {
      toast.info("You already applied to this pool");
      return;
    }
    if (campaign.mode === "yolo") {
      if (seatsLeft <= 0) {
        toast.error("This pool is full");
        return;
      }
      yoloJoin(campaign.id);
      toast.success("You are in. Tracking link generated.");
    } else {
      surgicalApply(campaign.id);
      toast.success("Application sent. Brand will review.");
    }
  }

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <button
          type="button"
          className="nc-back"
          onClick={() => navigate({ to: "/campaigns" })}
        >
          ← All campaigns
        </button>

        <article className="nc-campaign-detail">
          <header>
            <p className="nc-eyebrow">{campaign.brandName} · {campaign.status}</p>
            <h1>{campaign.title}</h1>
          </header>

          <section className="nc-campaign-section">
            <h2>The brief</h2>
            <p>{campaign.brief}</p>
          </section>

          {campaign.guidelines ? (
            <section className="nc-campaign-section">
              <h2>Guidelines</h2>
              <p>{campaign.guidelines}</p>
            </section>
          ) : null}

          <section className="nc-campaign-section">
            <h2>The pool</h2>
            <dl className="nc-campaign-meta nc-campaign-meta-lg">
              <div><dt>Pool</dt><dd>€{campaign.poolEur.toLocaleString()}</dd></div>
              <div><dt>Target CPA</dt><dd>€{campaign.targetCpa}</dd></div>
              <div><dt>Seats</dt><dd>{seatsLeft.toLocaleString()} of {campaign.maxSeats.toLocaleString()} left</dd></div>
              <div><dt>Split</dt><dd>{Math.round(campaign.weights.signups * 100)}% signups · {Math.round(campaign.weights.impressions * 100)}% views</dd></div>
              <div><dt>Mode</dt><dd>{campaign.mode === "yolo" ? "Yolo · one-tap join" : "Surgical · brand review"}</dd></div>
              <div><dt>Runs until</dt><dd>{new Date(campaign.endsAt).toLocaleDateString()}</dd></div>
            </dl>
          </section>

          <section className="nc-campaign-apply">
            {myParticipation ? (
              <div className="nc-apply-status">
                <p><b>Status:</b> {myParticipation.state}</p>
                <p className="nc-note">Your tracking code: <code>{myParticipation.trackingCode}</code></p>
              </div>
            ) : (
              <button
                className="nc-btn-primary nc-btn-lg"
                onClick={apply}
                disabled={!canJoin}
              >
                {campaign.mode === "yolo" ? "Join this pool" : "Apply to this pool"}
              </button>
            )}
            <p className="nc-note">
              Baseline set by our Manager agent based on your category and geography. Payouts split from what your content drives above baseline.
            </p>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}