import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Creator = { name: string; score: number };
const initialCreators: Creator[] = [
  { name: "C1", score: 70 },
  { name: "C2", score: 45 },
  { name: "C3", score: 90 },
  { name: "C4", score: 25 },
  { name: "C5", score: 55 },
];

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function Index() {
  const [budget, setBudget] = useState(10000);
  const [baseline, setBaseline] = useState(200);
  const [creators, setCreators] = useState<Creator[]>(initialCreators);

  const { payouts, remaining, over } = useMemo(() => {
    const baselineTotal = baseline * creators.length;
    const rem = budget - baselineTotal;
    if (rem < 0) {
      return { payouts: creators.map(() => baseline), remaining: 0, over: true };
    }
    const total = creators.reduce((s, c) => s + c.score, 0) || 1;
    return {
      payouts: creators.map((c) => baseline + (c.score / total) * rem),
      remaining: rem,
      over: false,
    };
  }, [budget, baseline, creators]);

  return (
    <div className="nc-root">
      <div className="nc-stars" aria-hidden="true" />
      <div className="nc-content">
        <nav className="nc-nav">
          <div className="nc-nav-inner">
            <div className="nc-logo">
              <span className="dot" />
              No Cap
            </div>
            <div className="nc-navlinks">
              <a href="#how">How it works</a>
              <a href="#try">Try the split</a>
              <a href="#compare">Why pooled</a>
              <a href="#fit">Who it's for</a>
            </div>
            <div className="nc-navright">
              <a className="nc-login" href="#">Login</a>
              <a className="nc-btn nc-btn-primary" href="#get-started">Start for free</a>
            </div>
          </div>
        </nav>

        <header className="nc-hero">
          <div className="nc-wrap nc-inner">
            <span className="nc-eyebrow">For DTC brands running influencer campaigns</span>
            <h1>
              Set the budget.<br />
              Let <span className="hl">results</span> split it.
            </h1>
            <p className="lead">
              Fund one campaign pool, open it to creators, and pay every accepted creator a
              guaranteed baseline — plus a share of the pool sized to what their content
              actually drives. No cap, that's the whole formula.
            </p>
            <div className="nc-cta-row">
              <a className="nc-btn nc-btn-primary" href="#get-started">Start a campaign</a>
              <a className="nc-btn nc-btn-ghost" href="#try">Try the live split</a>
            </div>
          </div>

          <div className="nc-hero-visual">
            <div className="nc-floating-chip nc-fc-1">
              <span className="nc-fc-dot" />@sagebotanicals posted — payout updated
            </div>
            <div className="nc-floating-chip nc-fc-2">
              <span className="nc-fc-dot" />Payout sent · $612
            </div>
            <div className="nc-app-card">
              <div className="nc-app-head">
                <div className="nc-app-title">🧴 Skincare Drop — Pool Campaign</div>
                <span className="nc-status-live">LIVE</span>
              </div>
              <div className="nc-app-meta">
                <span>Budget: <b>$12,000</b></span>
                <span>Baseline: <b>$150 / creator</b></span>
                <span>Applied: <b>42 creators</b></span>
              </div>
              {[
                { c: "#8fe3c8", i: "SB", h: "@sagebotanicals", m: "118K followers · Skincare", s: "Posted", p: "$612", cls: "nc-chip-posted" },
                { c: "#f6c66a", i: "MK", h: "@marakeeps", m: "64K followers · Wellness", s: "Posted", p: "$438", cls: "nc-chip-posted" },
                { c: "#ff8a72", i: "RT", h: "@reallytina", m: "29K followers · Beauty", s: "Applied", p: "—", cls: "nc-chip-applied" },
              ].map((r) => (
                <div key={r.i} className="nc-app-row">
                  <div className="nc-avatar" style={{ background: r.c }}>{r.i}</div>
                  <div className="nc-handle">{r.h}<span>{r.m}</span></div>
                  <span className={`nc-chip ${r.cls}`}>{r.s}</span>
                  <span className="nc-payout">{r.p}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="nc-strip">
          <div className="nc-wrap">
            <div className="nc-strip-label">Built for DTC categories running creator campaigns</div>
            <div className="nc-badge-row">
              {["Skincare", "Supplements", "Apparel", "Home & Kitchen", "Pet", "Food & Beverage"].map((b) => (
                <span key={b} className="nc-badge">{b}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="nc-section nc-panel-bg">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">How it works</span>
              <h2>One budget. Open applications. Pay for what performs.</h2>
              <p>No individual rate negotiations, no locking a fee to a creator before you've seen a single post.</p>
            </div>

            <div className="nc-feature-row">
              <div className="nc-feature-text">
                <span className="nc-stepnum">01 — FUND</span>
                <h3>Fund the pool</h3>
                <p>Set a total budget for the campaign and a baseline payout every accepted creator earns just for posting, win or lose on performance.</p>
              </div>
              <div className="nc-mini-card">
                <div className="nc-mc-label">Campaign setup</div>
                <div className="nc-field-mock"><span>Total budget</span><b>$12,000</b></div>
                <div className="nc-field-mock"><span>Baseline / creator</span><b>$150</b></div>
                <div className="nc-field-mock"><span>Creator cap</span><b>50</b></div>
                <div className="nc-divider-note">Remaining pool splits by tracked performance once content is live.</div>
              </div>
            </div>

            <div className="nc-feature-row reverse">
              <div className="nc-feature-text">
                <span className="nc-stepnum">02 — APPLY</span>
                <h3>Creators apply &amp; post</h3>
                <p>Open the campaign to your own list or a public brief. Approve who fits, they post on their own channel and timeline.</p>
              </div>
              <div className="nc-mini-card">
                <div className="nc-mc-label">New applications</div>
                {[
                  { c: "#8fe3c8", i: "JL", h: "@jules.eats", m: "Food & Beverage" },
                  { c: "#f6c66a", i: "DP", h: "@dailypace", m: "Wellness" },
                  { c: "#ff8a72", i: "NK", h: "@nokidding", m: "Home & Kitchen" },
                ].map((r) => (
                  <div key={r.i} className="nc-apply-item">
                    <div className="nc-avatar" style={{ background: r.c }}>{r.i}</div>
                    <div className="nc-handle">{r.h}<span>{r.m}</span></div>
                    <span className="nc-approve-btn">Approve</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nc-feature-row">
              <div className="nc-feature-text">
                <span className="nc-stepnum">03 — SPLIT</span>
                <h3>Pool splits by results</h3>
                <p>Once content is live, everything above baseline divides across creators in proportion to their tracked clicks, views, or conversions.</p>
              </div>
              <div className="nc-mini-card">
                <div className="nc-mc-label">Payout split</div>
                {[
                  { l: "SB", w: 88, v: "$612" },
                  { l: "MK", w: 63, v: "$438" },
                  { l: "RT", w: 34, v: "$241" },
                ].map((r) => (
                  <div key={r.l} className="nc-bar-row">
                    <span className="nc-bar-label">{r.l}</span>
                    <div className="nc-bar-track"><div className="nc-bar-fill" style={{ width: `${r.w}%` }} /></div>
                    <span className="nc-bar-val">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="try" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-splitter-shell">
              <div className="nc-section-head">
                <span className="nc-eyebrow">Try it yourself</span>
                <h2>No cap — every creator sees the same formula</h2>
                <p>No hidden negotiation, no side deals. Drag a creator's performance up or down and watch the pool rebalance in real time.</p>
              </div>

              <div className="nc-splitter">
                <div className="nc-splitter-controls">
                  <div className="nc-field">
                    <label>CAMPAIGN BUDGET</label>
                    <div className="inputwrap">
                      <span>$</span>
                      <input type="number" value={budget} step={500} min={0}
                        onChange={(e) => setBudget(Math.max(0, +e.target.value || 0))} />
                    </div>
                  </div>
                  <div className="nc-field">
                    <label>BASELINE / CREATOR</label>
                    <div className="inputwrap">
                      <span>$</span>
                      <input type="number" value={baseline} step={25} min={0}
                        onChange={(e) => setBaseline(Math.max(0, +e.target.value || 0))} />
                    </div>
                  </div>
                </div>

                <div className="nc-creator-rows">
                  {creators.map((c, i) => (
                    <div key={c.name} className="nc-crow">
                      <span className="nc-cname">{c.name}</span>
                      <input type="range" min={1} max={100} value={c.score}
                        onChange={(e) => {
                          const next = [...creators];
                          next[i] = { ...c, score: +e.target.value };
                          setCreators(next);
                        }} />
                      <span className="nc-cscore">{c.score} pts</span>
                      <span className="nc-cpayout">{fmt(payouts[i])}</span>
                    </div>
                  ))}
                </div>

                {over && (
                  <div className="nc-warn">
                    Baseline total exceeds budget — reduce baseline or raise the pool.
                  </div>
                )}

                <div className="nc-splitter-foot">
                  <span>Remaining pool after baseline: <b>{fmt(remaining)}</b></span>
                  <span>Pool total: <b>{fmt(budget)}</b></span>
                </div>

                <div className="nc-formula-strip">
                  payout(<span className="k">creator</span>) = <span className="v">baseline</span> + ( <span className="k">creator_result</span> ÷ <span className="k">total_results</span> ) × <span className="v">remaining_pool</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="nc-section nc-panel-bg">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Why pooled beats flat-fee</span>
              <h2>Flat rates pay for a post. Pools pay for a result.</h2>
              <p>A flat-fee deal costs the same whether the content flops or takes off. A pool moves the same dollars toward whoever actually earned them.</p>
            </div>
            <div className="nc-compare">
              <div className="nc-compare-col flat">
                <h4>Flat-fee deals</h4>
                {[
                  "Rate is fixed before content exists",
                  "Every creator negotiated one-by-one",
                  "Top performer earns the same as the weakest post",
                  "Budget is fully spent regardless of outcome",
                ].map((t) => (
                  <div key={t} className="nc-compare-row"><span className="mark">–</span><span>{t}</span></div>
                ))}
              </div>
              <div className="nc-compare-col pool">
                <h4>Pool campaigns</h4>
                {[
                  "One budget, one published formula",
                  "Applications open, no per-creator negotiation",
                  "Stronger content earns a larger share of the same pool",
                  "Baseline still protects every accepted creator's floor",
                ].map((t) => (
                  <div key={t} className="nc-compare-row"><span className="mark">+</span><span>{t}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="fit" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Who it's for</span>
              <h2>Built for DTC teams running creator campaigns, not one-off gifting</h2>
            </div>
            <div className="nc-fit-grid">
              {[
                { t: "LAUNCH", h: "New product drops", p: "Open a pool the week of launch and let applications flow in instead of chasing individual creators." },
                { t: "ALWAYS-ON", h: "Ongoing affiliate-style content", p: "Keep a standing pool running so new creators can join and get paid on the same rolling formula." },
                { t: "SEASONAL", h: "Sale & seasonal pushes", p: "Size the pool to the promotion window and let payouts track whichever creators actually move traffic." },
                { t: "TESTING", h: "Testing a new creator segment", p: "The baseline caps downside per creator while the pool naturally surfaces who's worth a direct deal next time." },
              ].map((f) => (
                <div key={f.t} className="nc-fit-card">
                  <span className="tag">{f.t}</span>
                  <h4>{f.h}</h4>
                  <p>{f.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="get-started" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-cta-banner">
              <h2>Set a budget. Open it up. Let the results decide the split.</h2>
              <div className="nc-cta-row">
                <a className="nc-btn nc-btn-primary" href="#">Start a campaign</a>
                <a className="nc-btn nc-btn-ghost" href="#">Talk to us</a>
              </div>
            </div>
          </div>
        </section>

        <footer className="nc-footer">
          <div className="nc-wrap nc-footer-grid">
            <div className="nc-footer-brand">
              <div className="nc-logo"><span className="dot" />No Cap</div>
              <p>No lying about the split — pooled, performance-based influencer budgets for DTC brands.</p>
            </div>
            <div className="nc-footer-cols">
              <div className="nc-footer-col">
                <h5>Product</h5>
                <a href="#how">How it works</a>
                <a href="#try">Try the split</a>
                <a href="#compare">Why pooled</a>
              </div>
              <div className="nc-footer-col">
                <h5>Company</h5>
                <a href="#">Contact</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="nc-wrap nc-footer-bottom">
            <span>© No Cap, 2026.</span>
            <span>Mockup landing page — figures and creator handles shown are illustrative, not real customer data.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
