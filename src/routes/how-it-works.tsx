import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFaq, PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How No Cap works — Fund a pool, split by tracked results" },
      { name: "description", content: "Five steps: fund the pool, open applications, approve creators, split everything above baseline by tracked results, settle payouts. One published formula, no per-creator negotiation." },
      { property: "og:title", content: "How No Cap works — one pool, one published split formula" },
      { property: "og:description", content: "Fund a pool, open applications, and let tracked clicks, conversions, or views decide the split." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  const steps = [
    { n: "01 — FUND", h: "Fund the pool", p: "Set a total campaign budget and a baseline every accepted creator earns for posting. The baseline comes out of the pool first; whatever remains becomes the performance split." },
    { n: "02 — OPEN", h: "Open applications", p: "Publish a brief with the metric that will drive the split — tracked clicks, attributed conversions, or verified views. Creators from your list, a public brief, or the marketplace apply in." },
    { n: "03 — APPROVE", h: "Approve who fits", p: "You approve creators; they post on their own channel, on their own timeline. No individual rate cards, no side deals — the formula is the same for everyone." },
    { n: "04 — SPLIT", h: "Pool splits by result", p: "As tracked performance data lands, everything above baseline divides in proportion to what each creator actually drove. The split rebalances every time new data comes in." },
    { n: "05 — PAYOUT", h: "Payouts settle", p: "Baseline is paid on post. Performance share settles when the tracking window closes. Every creator sees the same math on the same brief." },
  ];
  return (
    <SiteShell>
      <PageHero
        eyebrow="How it works"
        title={<>One pool. One formula. <span className="hl">Zero</span> per-creator negotiation.</>}
        lead="No Cap replaces individually-negotiated influencer fees with a funded, performance-split pool. Here's the end-to-end flow."
      />
      <section className="nc-section">
        <div className="nc-wrap nc-prose">
          {steps.map((s) => (
            <div key={s.n} style={{ marginBottom: 28 }}>
              <h3>{s.n}</h3>
              <h2 style={{ marginTop: 6 }}>{s.h}</h2>
              <p>{s.p}</p>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link className="nc-btn nc-btn-primary" to="/start">Start a campaign</Link>
          </div>
        </div>
      </section>
      <PageFaq
        title="How the flow actually works"
        items={[
          { q: "Who sets the baseline payout?", a: "You do, per campaign. Baseline is the guaranteed floor every accepted creator earns for posting — it comes out of the pool before the performance split runs." },
          { q: "What counts as a 'result' in the split?", a: "You pick the metric when you fund the pool: tracked clicks, attributed conversions, or verified views. It's published on the brief so every creator sees the same rule." },
          { q: "When does the pool actually settle?", a: "Baseline pays on post. The performance share settles when the tracking window closes, using verified pixels, UTM parameters, and platform APIs." },
          { q: "Can I cap how many creators join?", a: "Yes — set a creator cap when you fund the pool. Applications beyond the cap are waitlisted; the split formula stays the same." },
          { q: "What if no creator drives results?", a: "Baseline is still paid on every accepted post. The performance pool simply doesn't distribute — you never spend above the funded cap." },
        ]}
      />
    </SiteShell>
  );
}