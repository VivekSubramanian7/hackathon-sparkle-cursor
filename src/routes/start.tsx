import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start a pool campaign - capped budget, uncapped upside | No Cap" },
      { name: "description", content: "Set a total budget, pick the split metric, and get creators applying in days. Zero per-creator negotiation, capped total spend, uncapped upside for top performers." },
      { property: "og:title", content: "Start a No Cap pool - fund it, open it, split by results" },
      { property: "og:description", content: "Launch a performance-split influencer campaign in one brief. No card required." },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <PageHero
        eyebrow="Start a campaign"
        title={<>Fund a pool. <span className="hl">Open</span> applications.</>}
        lead="Tell us about your brand and the campaign you want to run. We'll spin up a pool, help you set the baseline and the split metric, and get creators applying."
      />
      <section className="nc-section">
        <div className="nc-wrap">
          {sent ? (
            <div className="nc-form-card" style={{ textAlign: "center" }}>
              <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: 28, margin: 0 }}>Got it - we'll be in touch.</h3>
              <p style={{ color: "var(--nc-cream-dim)" }}>A No Cap operator will reach out within one business day to set up your first pool.</p>
            </div>
          ) : (
            <form
              className="nc-form-card"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="row2">
                <div><label>Brand name</label><input required placeholder="e.g. Sage Botanicals" /></div>
                <div><label>Category</label>
                  <select defaultValue="Skincare">
                    {["Skincare","Supplements","Apparel","Home & Kitchen","Pet","Food & Beverage","Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="row2">
                <div><label>Work email</label><input type="email" required placeholder="you@brand.com" /></div>
                <div><label>Pool budget</label><input type="text" placeholder="$10,000" /></div>
              </div>
              <div><label>What do you want the split to reward?</label>
                <select defaultValue="Tracked clicks">
                  <option>Tracked clicks</option>
                  <option>Attributed conversions</option>
                  <option>Verified views</option>
                </select>
              </div>
              <div><label>Tell us about the campaign</label>
                <textarea placeholder="Launch window, product, creator segment you're testing…" />
              </div>
              <button type="submit" className="nc-btn nc-btn-primary" style={{ justifySelf: "center", marginTop: 8 }}>
                Request a pool
              </button>
              <p className="nc-form-note">No card required. We'll walk you through the first campaign live.</p>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}