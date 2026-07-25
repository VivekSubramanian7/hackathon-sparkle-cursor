import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/campaigns/")({
  head: () => ({
    meta: [
      { title: "Open campaigns - No Cap" },
      { name: "description", content: "Browse open UGC pools from DTC brands. Apply to campaigns and earn from a transparent, results-based split." },
      { property: "og:title", content: "Open campaigns - No Cap" },
      { property: "og:description", content: "Browse open UGC pools from DTC brands and apply in one tap." },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const { state } = useDemoStore();
  const open = state.campaigns.filter((c) =>
    ["recruiting", "live", "funded"].includes(c.status),
  );

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <header className="nc-campaigns-head">
          <p className="nc-eyebrow">For creators</p>
          <h1>Open campaigns</h1>
          <p className="nc-sub">
            Real briefs from DTC brands. One pool, one formula. Baseline plus a share sized to what your content actually drives.
          </p>
        </header>

        {open.length === 0 ? (
          <div className="nc-empty">
            <p>No open campaigns right now. Check back soon.</p>
          </div>
        ) : (
          <ul className="nc-campaign-grid">
            {open.map((c) => {
              const seatsLeft = Math.max(0, c.maxSeats - c.seatsFilled);
              return (
                <li key={c.id} className="nc-campaign-card">
                  <div className="nc-campaign-top">
                    <span className="nc-chip">{c.brandName}</span>
                    <span className={`nc-chip nc-chip-${c.mode}`}>
                      {c.mode === "yolo" ? "Open · one tap" : "Surgical · review"}
                    </span>
                  </div>
                  <h2>{c.title}</h2>
                  <p className="nc-campaign-brief">{c.brief}</p>
                  <dl className="nc-campaign-meta">
                    <div><dt>Pool</dt><dd>€{c.poolEur.toLocaleString()}</dd></div>
                    <div><dt>Target CPA</dt><dd>€{c.targetCpa}</dd></div>
                    <div><dt>Seats</dt><dd>{seatsLeft.toLocaleString()} left</dd></div>
                    <div><dt>Split</dt><dd>{Math.round(c.weights.signups * 100)}% signups · {Math.round(c.weights.impressions * 100)}% views</dd></div>
                  </dl>
                  <div className="nc-campaign-cta">
                    <Link to="/campaigns/$id" params={{ id: c.id }} className="nc-btn-primary">
                      View & apply
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