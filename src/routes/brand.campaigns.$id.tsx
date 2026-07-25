import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/brand/campaigns/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `HQ · ${params.id} - No Cap` },
      { name: "description", content: "Brand HQ: manage applicants, advance the campaign, simulate results, and settle the pool." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandHQ,
});

function BrandHQ() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const {
    state,
    advanceDemo,
    ingestMockMetrics,
    settleCampaign,
    surgicalAccept,
    surgicalReject,
  } = useDemoStore();

  const campaign = useMemo(
    () => state.campaigns.find((c) => c.id === id),
    [state.campaigns, id],
  );
  const participations = useMemo(
    () => state.participations.filter((p) => p.campaignId === id),
    [state.participations, id],
  );
  const ledger = useMemo(
    () => state.ledger.filter((l) => l.campaignId === id),
    [state.ledger, id],
  );
  const metrics = useMemo(
    () => state.metrics.filter((m) => m.campaignId === id),
    [state.metrics, id],
  );

  if (!campaign) {
    return (
      <SiteShell>
        <main className="nc-campaigns">
          <div className="nc-empty">
            <h1>Campaign not found</h1>
            <Link to="/brand/campaigns" className="nc-btn nc-btn-primary">Back to your campaigns</Link>
          </div>
        </main>
      </SiteShell>
    );
  }

  const seatsLeft = Math.max(0, campaign.maxSeats - campaign.seatsFilled);
  const totalGross = ledger.reduce((s, l) => s + l.grossEur, 0);
  const totalFee = ledger.reduce((s, l) => s + l.feeEur, 0);
  const totalNet = ledger.reduce((s, l) => s + l.netEur, 0);

  function handleAdvance() {
    advanceDemo(campaign!.id);
    toast.success(`Advanced from ${campaign!.status}`);
  }
  function handleSimulate() {
    ingestMockMetrics(campaign!.id);
    toast.success("Mock metrics ingested");
  }
  function handleSettle() {
    if (metrics.length === 0) {
      toast.error("Simulate results first");
      return;
    }
    settleCampaign(campaign!.id);
    toast.success("Settled. Ledger written with 7% fee.");
  }

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <button type="button" className="nc-back" onClick={() => navigate({ to: "/brand/campaigns" })}>
          ← Your campaigns
        </button>

        <article className="nc-campaign-detail">
          <header>
            <p className="nc-eyebrow">{campaign.brandName} · HQ · {campaign.status}</p>
            <h1>{campaign.title}</h1>
          </header>

          <section className="nc-campaign-section">
            <h2>The pool</h2>
            <dl className="nc-campaign-meta nc-campaign-meta-lg">
              <div><dt>Pool</dt><dd>€{campaign.poolEur.toLocaleString()}</dd></div>
              <div><dt>Target CPA</dt><dd>€{campaign.targetCpa}</dd></div>
              <div><dt>Seats</dt><dd>{campaign.seatsFilled}/{campaign.maxSeats} ({seatsLeft} left)</dd></div>
              <div><dt>Mode</dt><dd>{campaign.mode}</dd></div>
              <div><dt>Split</dt><dd>{Math.round(campaign.weights.signups * 100)}% signups · {Math.round(campaign.weights.impressions * 100)}% views</dd></div>
              <div><dt>Status</dt><dd>{campaign.status}</dd></div>
            </dl>
          </section>

          <section className="nc-campaign-section">
            <h2>Demo controls</h2>
            <div className="nc-actions" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                className="nc-btn nc-btn-primary"
                onClick={handleAdvance}
                disabled={!["recruiting", "live"].includes(campaign.status)}
              >
                Advance ({campaign.status === "recruiting" ? "→ live" : campaign.status === "live" ? "→ measuring" : "done"})
              </button>
              <button
                className="nc-btn nc-btn-ghost"
                onClick={handleSimulate}
                disabled={campaign.status === "settled"}
              >
                Simulate results
              </button>
              <button
                className="nc-btn nc-btn-primary"
                onClick={handleSettle}
                disabled={campaign.status === "settled" || metrics.length === 0}
              >
                Settle pool
              </button>
            </div>
          </section>

          <section className="nc-campaign-section">
            <h2>Applicants & participants ({participations.length})</h2>
            {participations.length === 0 ? (
              <p className="nc-note">No one has joined or applied yet.</p>
            ) : (
              <ul className="nc-hq-list">
                {participations.map((p) => (
                  <li key={p.id} className="nc-hq-row">
                    <div>
                      <b>{p.creatorId}</b>
                      <span className="nc-note" style={{ marginLeft: 8 }}>
                        {p.state} · <code>{p.trackingCode}</code>
                      </span>
                    </div>
                    {campaign.mode === "surgical" && p.state === "applied" ? (
                      <div className="nc-actions" style={{ gap: "0.5rem" }}>
                        <button
                          className="nc-btn nc-btn-primary"
                          onClick={() => {
                            if (seatsLeft <= 0) {
                              toast.error("Cap reached");
                              return;
                            }
                            surgicalAccept(campaign.id, p.id);
                            toast.success("Accepted");
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="nc-btn nc-btn-ghost"
                          onClick={() => {
                            surgicalReject(campaign.id, p.id);
                            toast("Rejected");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {ledger.length > 0 ? (
            <section className="nc-campaign-section">
              <h2>Settlement ledger (7% platform fee)</h2>
              <table className="nc-hq-table">
                <thead>
                  <tr>
                    <th>Creator</th>
                    <th>Gross</th>
                    <th>Fee</th>
                    <th>Net</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((l) => (
                    <tr key={l.creatorId}>
                      <td><b>{l.creatorId}</b></td>
                      <td>€{l.grossEur.toFixed(2)}</td>
                      <td>€{l.feeEur.toFixed(2)}</td>
                      <td><b>€{l.netEur.toFixed(2)}</b></td>
                    </tr>
                  ))}
                  <tr className="nc-hq-total">
                    <td>Totals</td>
                    <td>€{totalGross.toFixed(2)}</td>
                    <td>€{totalFee.toFixed(2)}</td>
                    <td>€{totalNet.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          ) : null}
        </article>
      </main>
    </SiteShell>
  );
}