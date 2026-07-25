import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/creator/active")({
  head: () => ({
    meta: [
      { title: "Active missions - No Cap" },
      { name: "description", content: "Your active UGC missions. Brief, guidelines, and your unique tracking code." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CreatorActive,
});

function CreatorActive() {
  const { state } = useDemoStore();
  const active = useMemo(
    () =>
      state.participations
        .filter((p) => p.creatorId === "creator_demo" && (p.state === "joined" || p.state === "accepted"))
        .map((p) => ({ p, c: state.campaigns.find((c) => c.id === p.campaignId) }))
        .filter((x) => !!x.c),
    [state.participations, state.campaigns],
  );

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <header className="nc-campaigns-head">
          <p className="nc-eyebrow">Creator · Mission kit</p>
          <h1>Active missions</h1>
          <p className="nc-sub">Every pool you're in. Post honestly. We track results via your unique link.</p>
        </header>

        {active.length === 0 ? (
          <div className="nc-empty">
            <p>No active missions. Browse open campaigns to join a pool.</p>
            <Link to="/campaigns" className="nc-btn nc-btn-primary">Browse open campaigns</Link>
          </div>
        ) : (
          <ul className="nc-campaign-grid">
            {active.map(({ p, c }) => (
              <li key={p.id} className="nc-campaign-card">
                <div className="nc-campaign-top">
                  <span className="nc-chip">{c!.brandName}</span>
                  <span className="nc-chip">{p.state}</span>
                </div>
                <h2>{c!.title}</h2>
                <p className="nc-campaign-brief">{c!.brief}</p>
                {c!.guidelines ? <p className="nc-note">{c!.guidelines}</p> : null}
                <p className="nc-note">Tracking code: <code>{p.trackingCode}</code></p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </SiteShell>
  );
}