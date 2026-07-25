import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Pools, baselines, and the performance split | No Cap" },
      { name: "description", content: "How the baseline works, what counts as a tracked result, why pools beat flat fees and per-creator affiliate rates, and how the split stays gaming-resistant." },
      { property: "og:title", content: "No Cap FAQ — how the pool split actually works" },
      { property: "og:description", content: "Baselines, metrics, affiliate comparisons, and payout math — in plain English." },
    ],
  }),
  component: FaqPage,
});

const faq = [
  { q: "Who sets the baseline payout?", a: "You do, per campaign. Baseline is the guaranteed floor every accepted creator earns for posting — it comes out of the pool before the performance split runs." },
  { q: "What counts as a 'result' in the split?", a: "You pick the metric when you fund the pool: tracked clicks, attributed conversions, or verified views. Whatever you pick, it's published on the campaign brief so every creator sees the same rule." },
  { q: "Can a creator earn zero above baseline?", a: "Yes — if their post drives no tracked activity, they still keep the baseline but earn nothing from the performance pool. The upside is uncapped in the other direction." },
  { q: "How is this different from an affiliate program?", a: "Affiliate is per-creator, per-sale, with rates negotiated one by one. Pool campaigns fix a total budget up front and split what's left of the pool by relative performance — no per-creator rate cards." },
  { q: "How is this different from a flat-fee influencer deal?", a: "A flat-fee deal costs the same whether the content flops or takes off. A pool moves the same dollars toward whoever actually earned them, and never above the pool cap." },
  { q: "Do I have to use your creator marketplace?", a: "No. You can open a pool to your own creator list, to a public brief, or to marketplace applicants — the split formula is the same either way." },
  { q: "How do you prevent gaming of the performance metric?", a: "Split metrics are tracked through verified pixels, UTM parameters, and platform APIs. We publish the exact signal on the brief so every creator sees the rule up front, and we bound the pool so gaming any single metric can't inflate total spend." },
  { q: "What's your take rate?", a: "We're pressure-testing monetization publicly with early brands. Reach out and we'll walk through current terms." },
];

function FaqPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Frequently asked"
        title={<>Everything about the <span className="hl">split</span>, in plain English.</>}
      />
      <section className="nc-section">
        <div className="nc-wrap" style={{ maxWidth: 780 }}>
          <div className="nc-faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}