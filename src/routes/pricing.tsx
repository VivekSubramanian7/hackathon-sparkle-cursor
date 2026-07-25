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
    tag: "STARTER",
    name: "Single pool",
    take: "8%",
    sub: "of the funded pool",
    who: "One-off launch or seasonal push. Fund a pool, open applications, settle when the tracking window closes.",
    perks: [
      "One live pool at a time",
      "Baseline + performance-split payouts",
      "Tracked clicks or views as split metric",
      "Email support",
    ],
    cta: "Start a pool",
  },
  {
    tag: "GROWTH",
    name: "Always-on pools",
    take: "6%",
    sub: "of the funded pool",
    who: "Rolling creator campaigns with new applications every week. The pool tops up, the formula stays published.",
    perks: [
      "Unlimited concurrent pools",
      "Attributed conversions as split metric",
      "Marketplace + private brief distribution",
      "Priority tracking & reconciliation",
    ],
    cta: "Talk to us",
    highlight: true,
  },
  {
    tag: "SCALE",
    name: "Custom",
    take: "Custom",
    sub: "on committed volume",
    who: "Brands running six-figure quarterly creator budgets that want a negotiated take rate against committed pool volume.",
    perks: [
      "Volume-tiered take rate",
      "Custom attribution windows",
      "Dedicated pool operator",
      "SLA on payout settlement",
    ],
    cta: "Contact sales",
  },
];

const faqs = [
  { q: "Do you charge per seat or per creator?", a: "No. There are no per-seat, per-user, or per-creator fees. Our take is a percentage of the funded pool — the same variable-cost logic we apply to creator payouts applies to us." },
  { q: "When is the take rate deducted?", a: "At pool funding. The number you see in the campaign is the true spend cap; nothing else gets added downstream." },
  { q: "What if a creator earns only the baseline?", a: "Baseline is always paid on post. Our take is calculated on the funded pool up front, not on the residual — so paying baseline-only creators doesn't change what you owe us." },
  { q: "Is the take rate negotiable at higher volume?", a: "Yes — the Scale tier exists specifically for brands committing to a rolling pool volume. Reach out for terms." },
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
          <p className="nc-form-note" style={{ textAlign: "center", marginTop: 32 }}>
            Illustrative pricing — reach out for current terms as we pressure-test the model with early brands.
          </p>
        </div>
      </section>
      <PageFaq
        title="Pricing questions we hear most"
        items={faqs}
      />
    </SiteShell>
  );
}