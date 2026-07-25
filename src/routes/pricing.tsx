import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFaq, PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Take rate on the funded pool | No Cap" },
      { name: "description", content: "No per-seat fees, no per-creator rate cards. No Cap takes a transparent share of the funded pool — the same variable-cost logic we apply to creator payouts applies to us." },
      { property: "og:title", content: "No Cap pricing — a share of the pool, not a subscription" },
      { property: "og:description", content: "Fund the pool, publish the formula, pay a transparent take rate on what settles." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    tag: "FREE",
    name: "Free",
    take: "$0",
    sub: "1 free campaign / month",
    who: "Small DTC brands finding their first creator flywheel. Run one funded pool a month, on us — same baseline + split mechanics, no take rate.",
    perks: [
      "1 live pool per month",
      "Baseline + performance-split payouts",
      "Tracked clicks or views as split metric",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    tag: "GROWTH",
    name: "Growth",
    take: "7%",
    sub: "of each campaign budget",
    who: "Brands running always-on UGC pools. Fund as many pools as you need — we take a flat 7% of each campaign budget, deducted at funding.",
    perks: [
      "Unlimited concurrent pools",
      "Attributed conversions as split metric",
      "Marketplace + private brief distribution",
      "Priority tracking & reconciliation",
    ],
    cta: "Start a pool",
    highlight: true,
  },
  {
    tag: "ENTERPRISE",
    name: "Enterprise",
    take: "Custom",
    sub: "tailored to your program",
    who: "Large DTC programs that need AI influencers, negotiated take rates, and dedicated operators against committed quarterly pool volume.",
    perks: [
      "AI influencers & synthetic UGC",
      "Negotiated volume-tiered take rate",
      "Custom attribution windows",
      "Dedicated pool operator + SLA on settlement",
    ],
    cta: "Contact sales",
  },
];

const faqs = [
  { q: "What's actually free on the Free plan?", a: "One funded pool per month for small brands starting out. Same baseline + performance-split mechanics as the paid tiers — we just don't take a cut on that campaign." },
  { q: "Do you charge per seat or per creator?", a: "No. There are no per-seat, per-user, or per-creator fees. On Growth we take 7% of each campaign budget; on Free we take nothing." },
  { q: "When is the 7% deducted on Growth?", a: "At pool funding. The number you see in the campaign is the true spend cap; nothing else gets added downstream." },
  { q: "What if a creator earns only the baseline?", a: "Baseline is always paid on post. Our take is calculated on the funded campaign budget up front, not on the residual — so paying baseline-only creators doesn't change what you owe us." },
  { q: "What does Enterprise unlock beyond Growth?", a: "AI influencers and synthetic UGC, a negotiated take rate against committed quarterly pool volume, custom attribution windows, and a dedicated pool operator with an SLA on payout settlement." },
];

function PricingPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Pricing"
        title={<>A share of the pool. <span className="hl">Not</span> a subscription.</>}
        lead="No per-seat pricing, no per-creator rate cards. Fund a pool, publish the formula, and pay a transparent take on what's committed."
      />
      <section className="nc-section">
        <div className="nc-wrap">
          <div className="nc-market-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {tiers.map((t) => (
              <div key={t.name} className="nc-mini-card" style={{ padding: 28, borderColor: t.highlight ? "rgba(255,95,31,0.5)" : undefined }}>
                <span className="nc-mc-label" style={{ color: t.highlight ? "var(--nc-accent)" : undefined }}>{t.tag}</span>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, marginBottom: 6 }}>{t.name}</h3>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, marginTop: 10 }}>{t.take}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--nc-cream-soft)", marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.sub}</div>
                <p style={{ color: "var(--nc-cream-dim)", fontSize: 14.5, margin: "16px 0 18px" }}>{t.who}</p>
                <div style={{ borderTop: "1px solid var(--nc-line)", paddingTop: 14, marginBottom: 18 }}>
                  {t.perks.map((p) => (
                    <div key={p} style={{ fontSize: 14, color: "var(--nc-cream-dim)", padding: "6px 0", display: "flex", gap: 10 }}>
                      <span style={{ color: "var(--nc-accent)" }}>+</span><span>{p}</span>
                    </div>
                  ))}
                </div>
                <Link className={`nc-btn ${t.highlight ? "nc-btn-primary" : "nc-btn-ghost"}`} to={t.cta === "Contact sales" || t.cta === "Talk to us" ? "/contact" : "/start"} style={{ width: "100%", justifyContent: "center" }}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageFaq
        title="Pricing questions we hear most"
        items={faqs}
      />
    </SiteShell>
  );
}