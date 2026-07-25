import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — No Cap" },
      { name: "description", content: "Terms of service for brands funding pools and creators applying into No Cap campaigns." },
      { property: "og:title", content: "Terms — No Cap" },
      { property: "og:description", content: "Ground rules for pools, baselines, and payouts." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Terms of service" title={<>Ground rules for the pool.</>} />
      <section className="nc-section">
        <div className="nc-wrap nc-prose">
          <h3>Brands</h3>
          <p>Funded pool amounts are held for the duration of the campaign. Baseline payouts are non-refundable once a creator is approved and posts. Remaining pool funds settle by the published split formula against the tracked metric on the brief.</p>
          <h3>Creators</h3>
          <p>Baseline is guaranteed on post. Performance share is paid when the tracking window closes. Creators agree not to manipulate the tracked metric via bots, click farms, or paid amplification not disclosed on the brief.</p>
          <h3>Formula</h3>
          <p>payout(creator) = baseline + (creator_result ÷ total_results) × remaining_pool. This formula is fixed for a campaign once creators are approved.</p>
          <p>This is a mockup prototype for a hackathon — not a binding agreement.</p>
        </div>
      </section>
    </SiteShell>
  );
}