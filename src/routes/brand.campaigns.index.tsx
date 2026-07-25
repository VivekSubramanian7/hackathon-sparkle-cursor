import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/brand/campaigns/")({
  head: () => ({
    meta: [
      { title: "Your campaigns - No Cap" },
      { name: "description", content: "Every pool you've funded, from draft to settled." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandCampaignsList,
});

function BrandCampaignsList() {
  const { state } = useDemoStore();
  const campaigns = state.campaigns;

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <header className="nc-campaigns-head">
          <p className="nc-eyebrow">Brand · HQ</p>
          <h1>Your campaigns</h1>
          <p className="nc-sub">
            Every pool you've funded. Drive the demo: advance, simulate results, settle.
          </p>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/brand/create" className="nc-btn nc-btn-primary">+ New campaign</Link>
          </div>
        </header>

        {campaigns.length === 0 ? (
          <div className="nc-empty">
            <p>No campaigns yet. Fund your first pool.</p>
          </div>
        ) : (
          <ul className="nc-campaign-grid">
            {campaigns.map((c) => {
              const seatsLeft = Math.max(0, c.maxSeats - c.seatsFilled);
              return (
                <li key={c.id} className="nc-campaign-card">
                  <div className="nc-campaign-top">
                    <span className="nc-chip">{c.brandName}</span>
                    <span className="nc-chip">{c.status}</span>
                  </div>
                  <h2>{c.title}</h2>
                  <p className="nc-campaign-brief">{c.brief}</p>
                  <dl className="nc-campaign-meta">
                    <div><dt>Pool</dt><dd>€{c.poolEur.toLocaleString()}</dd></div>
                    <div><dt>Seats</dt><dd>{c.seatsFilled}/{c.maxSeats}</dd></div>
                    <div><dt>Mode</dt><dd>{c.mode}</dd></div>
                    <div><dt>Left</dt><dd>{seatsLeft}</dd></div>
                  </dl>
                  <div className="nc-campaign-cta">
                    <Link to="/brand/campaigns/$id" params={{ id: c.id }} className="nc-btn nc-btn-primary">
                      Open HQ
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </SiteShell>
  );
}