import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteShell } from "@/components/site-chrome";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/creator/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts - No Cap" },
      { name: "description", content: "Every settled pool you were part of. Gross, 7% platform fee, and your net." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CreatorPayouts,
});

function CreatorPayouts() {
  const { state } = useDemoStore();
  const lines = useMemo(
    () =>
      state.ledger
        .filter((l) => l.creatorId === "creator_demo")
        .map((l) => ({ l, c: state.campaigns.find((c) => c.id === l.campaignId) })),
    [state.ledger, state.campaigns],
  );

  const totalNet = lines.reduce((s, x) => s + x.l.netEur, 0);

  return (
    <SiteShell>
      <main className="nc-campaigns">
        <header className="nc-campaigns-head">
          <p className="nc-eyebrow">Creator · Ledger</p>
          <h1>Your payouts</h1>
          <p className="nc-sub">One line per settled pool. Formula is published; 7% platform fee is transparent.</p>
        </header>

        {lines.length === 0 ? (
          <div className="nc-empty">
            <p>No payouts yet. Once a pool settles, your line lands here.</p>
            <Link to="/campaigns" className="nc-btn nc-btn-primary">Find campaigns</Link>
          </div>
        ) : (
          <>
            <table className="nc-hq-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Gross</th>
                  <th>Fee (7%)</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ l, c }) => (
                  <tr key={l.campaignId}>
                    <td><b>{c?.title ?? l.campaignId}</b><br /><span className="nc-note">{c?.brandName}</span></td>
                    <td>€{l.grossEur.toFixed(2)}</td>
                    <td>€{l.feeEur.toFixed(2)}</td>
                    <td><b>€{l.netEur.toFixed(2)}</b></td>
                  </tr>
                ))}
                <tr className="nc-hq-total">
                  <td>Total net</td>
                  <td></td>
                  <td></td>
                  <td><b>€{totalNet.toFixed(2)}</b></td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </main>
    </SiteShell>
  );
}