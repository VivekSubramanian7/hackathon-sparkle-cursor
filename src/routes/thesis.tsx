import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/thesis")({
  head: () => ({
    meta: [
      { title: "Thesis — Why influencer spend has to go variable | No Cap" },
      { name: "description", content: "A $203B creator economy still runs on flat fees and manual negotiations. Pooled, performance-split payouts turn fixed influencer costs into variable ones tied to tracked outcomes." },
      { property: "og:title", content: "The No Cap thesis — variable-cost influencer spend" },
      { property: "og:description", content: "Why performance-split pools replace flat fees and per-creator affiliate rates for DTC brands." },
    ],
  }),
  component: ThesisPage,
});

function ThesisPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Market thesis"
        title={<>Influencer spend becomes a <span className="hl">variable cost.</span></>}
        lead="Three overlapping growth curves are converging on the same customer: the DTC brand deciding where to spend its next marketing dollar. The mechanism underneath that spend hasn't caught up."
      />
      <section className="nc-section">
        <div className="nc-wrap nc-prose">
          <h3>The macro setup</h3>
          <h2>Three curves, one buyer.</h2>
          <p>
            <strong>E-commerce is still compounding.</strong> Adroit Market Research puts the global
            e-commerce market at $17.1T in 2022, projected to reach $80.5T by 2030 — a 26.5% CAGR.
            Read directionally: more commerce is moving online, and more brands need a way to
            acquire customers there.
          </p>
          <p>
            <strong>The creator economy is scaling faster than e-commerce itself.</strong> Forbes
            (citing INGENIUS Studio) puts the creator economy at $203B in 2025, growing to $848B by
            2032. Creators are now a primary customer-acquisition channel for DTC, not a side
            experiment.
          </p>
          <p>
            <strong>The tooling underneath hasn't caught up.</strong> The software layer that helps
            brands run and measure influencer campaigns — $25.4B in 2024 — is projected to reach
            $97.6B by 2030. Brands are already spending on creators, but they're doing it through
            spreadsheets and DMs.
          </p>

          <h3>The gap</h3>
          <h2>The money moved. The mechanics didn't.</h2>
          <ul>
            <li>Brands negotiate a flat fee with each creator individually, before they've seen a single piece of content.</li>
            <li>There's no way to pay based on what a post actually drives — a creator with a bad-fit audience gets paid the same as one who converts.</li>
            <li>Campaign management lives in spreadsheets and DMs, with no shared system for applications, tracking, or payout.</li>
          </ul>
          <p>
            This is the same "manual chaos" gap Forbes describes on the measurement side (siloed
            data, no way to evaluate creators beyond follower count). No Cap targets the
            transaction layer underneath: how the money actually moves from brand to creator.
          </p>

          <h3>The thesis</h3>
          <h2>Replace individually-negotiated fees with a funded, performance-split pool.</h2>
          <p>
            A brand funds a campaign pool and sets a baseline payout every accepted creator earns
            just for posting — removing the negotiation step entirely. Creators apply into the
            campaign rather than being individually courted. Once content is live, the remaining
            pool splits across creators by tracked performance, so the brand is paying in
            proportion to what actually worked rather than what was promised upfront.
          </p>
          <p>
            This turns influencer spend from a <strong>fixed cost</strong> brands commit to on faith
            into a <strong>variable cost tied to outcomes</strong> — which matters directly to the
            DTC buyer, whose whole operating logic is performance-based acquisition (paid social,
            affiliate, email) rather than brand-style guaranteed placements.
          </p>

          <h3>Why now</h3>
          <h2>Budget is already flowing. It just wants structure.</h2>
          <ul>
            <li>Creator economy growth (to $848B by 2032) means more budget is flowing to creators than ever, and DTC marketers are actively looking for the same performance rigor they apply to every other acquisition channel.</li>
            <li>The influencer-tooling market itself is scaling 4× by 2030 — brands are already budgeting for software here. This isn't a category to create from scratch, it needs a better mechanism inside it.</li>
            <li>Rising e-commerce volume expands the addressable base of campaign-running DTC brands scaling spend across acquisition channels.</li>
          </ul>

          <h3>Open questions we're pressure-testing</h3>
          <ul>
            <li>Take rate / monetization model on the funded pool.</li>
            <li>What performance signal(s) determine the split (clicks, conversions, GMV attribution) and how tracking is verified against creator gaming.</li>
            <li>Minimum viable pool size and creator supply density needed for the marketplace to feel liquid to a first-time brand.</li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}