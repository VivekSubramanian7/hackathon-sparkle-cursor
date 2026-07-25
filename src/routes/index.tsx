import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-chrome";

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

const px = (id: number, w = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

type Category = "All" | "Skincare" | "Fitness" | "Home" | "Food" | "Pet";
const CATEGORIES: Category[] = ["All", "Skincare", "Fitness", "Home", "Food", "Pet"];

const marketCreators: {
  id: number; name: string; handle: string; cats: string;
  followers: string; tag: string; cat: Exclude<Category, "All">;
}[] = [
  { id: 8294854, name: "Sana M.", handle: "@sanaskin", cats: "Skincare", followers: "156K", tag: "TOP 5%", cat: "Skincare" },
  { id: 38285050, name: "Aria K.", handle: "@aria.everyday", cats: "Skincare · Wellness", followers: "241K", tag: "TOP 5%", cat: "Skincare" },
  { id: 35035634, name: "Kai T.", handle: "@kai.trains", cats: "Fitness · Supplements", followers: "104K", tag: "OPEN", cat: "Fitness" },
  { id: 24454074, name: "Marco V.", handle: "@marco.moves", cats: "Fitness · Recovery", followers: "73K", tag: "NEW", cat: "Fitness" },
  { id: 30805103, name: "Noah W.", handle: "@noah.builds", cats: "Home · DIY", followers: "62K", tag: "NEW", cat: "Home" },
  { id: 15676271, name: "Camila R.", handle: "@camila.athome", cats: "Home · Style", followers: "184K", tag: "TOP 5%", cat: "Home" },
  { id: 13929184, name: "Devon P.", handle: "@devon.pours", cats: "Food & Beverage", followers: "88K", tag: "OPEN", cat: "Food" },
  { id: 20524458, name: "Ren S.", handle: "@renshoots", cats: "Food · Home cooks", followers: "51K", tag: "OPEN", cat: "Food" },
  { id: 1108099, name: "Biscuit 🐾", handle: "@biscuitthecorgi", cats: "Pet · Dog lifestyle", followers: "312K", tag: "TOP 5%", cat: "Pet" },
  { id: 46505, name: "Miso 🐈", handle: "@miso.thecat", cats: "Pet · Cat care", followers: "128K", tag: "OPEN", cat: "Pet" },
  { id: 1490908, name: "Bear & Rue", handle: "@bearandrue", cats: "Pet · Two-dog household", followers: "94K", tag: "NEW", cat: "Pet" },
];

const voices = [
  { id: 8294854, tag: "SKINCARE", lift: "+38%" },
  { id: 20524458, tag: "PET", lift: "+22%" },
  { id: 15647620, tag: "APPAREL", lift: "+61%" },
  { id: 13929184, tag: "BEVERAGE", lift: "+29%" },
  { id: 30805103, tag: "HOME & DIY", lift: "+44%" },
  { id: 35035634, tag: "FITNESS", lift: "+31%" },
];

const testimonials = [
  {
    id: 30805103,
    q: "We stopped negotiating rates one creator at a time. A single pool, one formula, and the payout literally follows the traffic.",
    name: "Devon P.",
    role: "Growth Lead, Magic Spoon (US · Cereal DTC)",
  },
  {
    id: 35035634,
    q: "As a creator, I actually see the math. Baseline for showing up, and a real cut of the pool when my post moves.",
    name: "Kai T.",
    role: "Creator · Fitness · 104K on IG",
  },
  {
    id: 38285050,
    q: "First campaign we ran through No Cap, our top applicant wasn't the biggest name — she was the one with the highest CTR, and she got paid for it.",
    name: "Aria K.",
    role: "Founder, BlissClub (India · Activewear DTC)",
  },
];

function Index() {
  const [budget, setBudget] = useState(10000);
  const [baseline, setBaseline] = useState(200);
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [promptTab, setPromptTab] = useState(0);
  const [marketCat, setMarketCat] = useState<Category>("All");
  const prompts = [
    { t: "Launch a product drop", p: "Fund a $12K UGC pool for our new vitamin C serum — 25 skincare creators, split by tracked add-to-carts." },
    { t: "Push a bestseller", p: "Reignite our top SKU with 40 TikTok creators, baseline $150, pool splits on verified 3s views + swipe-ups." },
    { t: "Test a new segment", p: "Open a $6K pool to pet-parent creators for the new chew-toy line, split by attributed conversions." },
  ];

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
    <SiteShell>
      <>
        <header className="nc-hero">
          <div className="nc-wrap nc-inner">
            <span className="nc-eyebrow">For DTC brands running influencer campaigns</span>
            <h1>
              Don't waste money on ads.<br />
              Let <span className="hl">influencers</span> sell for you.
            </h1>
            <p className="lead">
              No Cap turns influencer spend from a fixed cost you commit on faith into a
              variable cost tied to outcomes. Fund one pool, open applications, pay every
              accepted creator a guaranteed baseline — then split the rest by tracked results.
            </p>
            <div className="nc-cta-row">
              <Link className="nc-btn nc-btn-primary" to="/start">Start a campaign</Link>
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

        <section className="nc-logos-strip">
          <div className="nc-wrap">
            <div className="nc-logos-label">Trusted by DTC product brands across the US, Germany &amp; India</div>
            <div className="nc-logos-row">
              {["Magic Spoon", "Quince", "Lovevery", "KoRo", "Purelei", "PrepMyMeal", "BlissClub", "Snitch", "The Pant Project"].map((b) => (
                <span key={b} className="nc-logo-mark">{b}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="nc-pullquote">
          <div className="nc-wrap">
            <div className="nc-pq-brand">● MAGIC SPOON</div>
            <blockquote>
              &ldquo;UGC through influencers worked — but the math never did.
              One pool, one formula, and the payout literally follows the traffic.
              That&rsquo;s how we found No Cap.&rdquo;
            </blockquote>
            <div className="nc-pq-who">
              <img src={px(30805103, 160)} alt="Jordan Weiss" loading="lazy" />
              <div>
                <div className="n">Jordan Weiss</div>
                <div className="r">Head of Growth, Magic Spoon (US · Cereal DTC)</div>
              </div>
            </div>
          </div>
        </section>

        <section className="nc-section">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">From a product goal to a live UGC pool — in one prompt</span>
              <h2>Tell the Scout agent what you&rsquo;re shipping. It drafts the pool.</h2>
              <p>Scout is the brand-side agent. Describe the drop and it proposes the pool size, baseline, tracked metric, and creator shortlist — on the creator side, the Manager agent handles applications, deadlines, and payouts. You approve before anything goes live.</p>
            </div>
            <div className="nc-prompt-tabs">
              {prompts.map((pr, i) => (
                <button key={pr.t} type="button" className={`nc-prompt-tab${i === promptTab ? " on" : ""}`} onClick={() => setPromptTab(i)}>
                  {pr.t}
                </button>
              ))}
            </div>
            <div className="nc-prompt-box">
              <span className="nc-prompt-text">{prompts[promptTab].p}</span>
              <button type="button" className="nc-prompt-send" aria-label="Send">↑</button>
            </div>
            <div className="nc-prompt-foot">
              <Link to="/how-it-works" className="nc-mini-play">▶  Watch the 60-sec walkthrough</Link>
            </div>
          </div>
        </section>

        <section className="nc-platforms">
          <div className="nc-wrap">
            <div className="nc-platforms-label">Available across every UGC surface your DTC brand ships on</div>
            <div className="nc-platforms-row">
              {["TikTok", "Instagram Reels", "YouTube Shorts", "Pinterest", "Threads", "X"].map((p) => (
                <span key={p} className="nc-platform">{p}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="nc-section">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Work with creators who actually respond</span>
              <h2>Generic creator databases flood you with cold profiles. Our pool applicants opt in — they&rsquo;re already interested in your category.</h2>
            </div>
            <div className="nc-respond-stats">
              <div><div className="n">8×</div><div className="l">Applicant response rates</div><div className="s">vs. cold DM outreach</div></div>
              <div><div className="n">3×</div><div className="l">Faster campaign turnaround</div><div className="s">vs. per-creator negotiated deals</div></div>
            </div>
            <div className="nc-respond-orbit" aria-hidden="true">
              <span className="nc-orbit-arc a1" />
              <span className="nc-orbit-arc a2" />
              <span className="nc-orbit-arc a3" />
              <div className="bubble b1"><img src={px(35035634, 140)} alt="" /><span>Count me in</span></div>
              <div className="bubble b2"><img src={px(38285050, 140)} alt="" /><span>Love this — I&rsquo;m in!</span></div>
              <div className="bubble b3"><img src={px(15676271, 140)} alt="" /><span>Applying now</span></div>
              <div className="bubble b4"><img src={px(30805103, 140)} alt="" /><span>This looks great</span></div>
              <div className="bubble b5"><img src={px(8294854, 140)} alt="" /><span>I&rsquo;m interested!</span></div>
              <div className="brief">We&rsquo;d love UGC from you for our vitamin C serum drop — TikTok + Reels. Open a pool?</div>
            </div>
          </div>
        </section>

        <section className="nc-section nc-panel-bg">
          <div className="nc-wrap">
            <div className="nc-feature-two">
              <div className="nc-ft-card">
                <h3>Keep UGC campaigns moving without the manual work</h3>
                <p>Scout (brand side) and Manager (influencer side) surface what needs attention in one action center: pending applicants, missed content deadlines, follow-ups. You approve, they move.</p>
                <div className="nc-ft-mock">
                  <div className="nc-ft-row"><b>Q2 Skincare Drop</b><span className="dot">● Action needed</span></div>
                  <div className="nc-ft-note">21 applied creators · Estimated spend $8.4K (30% under pool cap)</div>
                  <div className="nc-ft-inner">
                    <div className="q">4 creators missed their draft deadline — what next?</div>
                    <div className="opt"><span>A</span><b>Send a reminder to overdue creators</b></div>
                    <div className="opt"><span>B</span><b>Extend the deadline by 5 days</b></div>
                    <div className="opt muted"><span>C</span>Ask the agent to do something else…</div>
                  </div>
                </div>
              </div>
              <div className="nc-ft-card">
                <h3>Fast, compliant payouts — no matter how many creators</h3>
                <p>Onboard once and pay every accepted creator through the No Cap wallet. Baseline settles on post, performance share settles when the tracking window closes.</p>
                <div className="nc-ft-mock stack">
                <div className="nc-ft-name">@sagebotanicals <img src={px(38285050, 120)} alt="" /></div>
                <div className="nc-ft-name">@noah.builds <img src={px(30805103, 120)} alt="" /></div>
                <div className="nc-ft-name">@kai.trains <img src={px(35035634, 120)} alt="" /></div>
                  <div className="nc-ft-wallet">
                    <div><span>23 creators to pay</span><b>$34,550</b></div>
                    <div className="nc-ft-actions">
                      <span className="nc-btn nc-btn-primary sm">Pay with No Cap Wallet</span>
                      <span className="nc-btn nc-btn-ghost sm">Select payment method</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="creators" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-market-head">
              <div className="left">
                <span className="nc-eyebrow">Creator marketplace</span>
                <h2>Real people. Same formula for every one of them.</h2>
                <p>
                  Browse creators already opted into pool campaigns. Everyone you see is paid off
                  the same published split — baseline plus a share of the pool sized to real
                  tracked results.
                </p>
              </div>
              <div className="nc-market-filter">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setMarketCat(c)}
                    className={`chip${marketCat === c ? " on" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="nc-market-grid">
              {marketCreators
                .filter((c) => marketCat === "All" || c.cat === marketCat)
                .map((c) => (
                <div key={c.id} className="nc-creator-card">
                  <span className="nc-creator-tag">
                    {c.tag === "TOP 5%" ? <span className="g">● {c.tag}</span> : c.tag}
                  </span>
                  <img className="nc-creator-photo" src={px(c.id, 600)} alt={`${c.name} — creator`} loading="lazy" />
                  <div className="nc-creator-body">
                    <h4>{c.name}</h4>
                    <div className="meta">{c.handle} · {c.followers}</div>
                    <div className="row">
                      <span className="cats">{c.cats}</span>
                    </div>
                  </div>
                </div>
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

        <section className="nc-section">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Results, not resumes</span>
              <h2>The pool follows the post that actually moves.</h2>
              <p>An illustration of the mechanic: each tile is a category and the relative lift the winning post drove. The split rebalances the moment new performance data lands — bigger movers claim a bigger share of the same pool.</p>
            </div>
            <div className="nc-voices">
              {voices.map((v, i) => (
                <div key={i} className="nc-voice">
                  <img src={px(v.id, 400)} alt="Creator" loading="lazy" />
                  <div className="lbl"><span>{v.tag}</span><b>{v.lift}</b></div>
                </div>
              ))}
            </div>

            <div className="nc-stats" style={{ marginTop: 48 }}>
              <div className="nc-stat">
                <div className="num">0<span className="u">$</span></div>
                <div className="lbl">Per-creator negotiations</div>
              </div>
              <div className="nc-stat">
                <div className="num">1</div>
                <div className="lbl">Published formula, no side deals</div>
              </div>
              <div className="nc-stat">
                <div className="num">100<span className="u">%</span></div>
                <div className="lbl">Baseline paid on every accepted post</div>
              </div>
              <div className="nc-stat">
                <div className="num">∞</div>
                <div className="lbl">No cap on top-performer upside</div>
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

        <section className="nc-section nc-panel-bg">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">From both sides of the pool</span>
              <h2>Brands and creators, running the same math.</h2>
            </div>
            <div className="nc-testi-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="nc-testi">
                  <q>{t.q}</q>
                  <div className="nc-testi-who">
                    <img src={px(t.id, 200)} alt={t.name} loading="lazy" />
                    <div>
                      <div className="n">{t.name}</div>
                      <div className="r">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
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

        <section id="faq" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Frequently asked</span>
              <h2>Everything about the split, in plain English.</h2>
            </div>
            <div className="nc-faq">
              {[
                { q: "Who sets the baseline payout?", a: "Our Scout agent (brand side) sets it for you — benchmarked against current market rates, the creator's geography, and their content category. You approve the number before the pool goes live, so there's no per-creator haggling and every accepted creator sees the same floor on the brief." },
                { q: "What counts as a 'result' in the split?", a: "You pick the metric when you fund the pool: tracked clicks, attributed conversions, or verified views. Whatever you pick, it's published on the campaign brief so every creator sees the same rule." },
                { q: "Can a creator earn zero above baseline?", a: "Yes — if their post drives no tracked activity, they still keep the baseline but earn nothing from the performance pool. The upside is uncapped in the other direction." },
                { q: "How is this different from other influencer platforms?", a: "Other platforms are directories — they hand you a list of creators and leave the negotiation, rate cards, and payout math to you. No Cap replaces that with one funded pool, one published formula, and one settlement: brands cap total spend up front, creators apply into a rule they can see, and the split follows tracked performance. Variable-cost by design, not by spreadsheet." },
                { q: "Do I have to use your creator marketplace?", a: "No. You can open a pool to your own creator list, to a public brief, or to marketplace applicants — the split formula is the same either way." },
              ].map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="thesis" className="nc-section nc-panel-bg">
          <div className="nc-wrap">
            <div className="nc-section-head">
              <span className="nc-eyebrow">Why now</span>
              <h2>Three curves are converging on the same DTC dollar.</h2>
              <p>
                E-commerce is compounding, creator spend is scaling faster than e-commerce itself,
                and the software layer underneath influencer budgets is finally catching up. The
                money is already moving — the mechanism hasn't.
              </p>
            </div>
            <div className="nc-thesis-grid">
              <div className="nc-thesis-card">
                <span className="k">E-commerce</span>
                <div className="n">$80.5T</div>
                <p>Global e-commerce is projected to grow from $17.1T (2022) to $80.5T by 2030 — a 26.5% CAGR of commerce moving online.</p>
                <span className="src">Source: Adroit Market Research</span>
              </div>
              <div className="nc-thesis-card">
                <span className="k">Creator economy</span>
                <div className="n">$848B</div>
                <p>Creator spend scales from $203B in 2025 to $848B by 2032. Creators are now a primary DTC acquisition channel, not a side experiment.</p>
                <span className="src">Source: Forbes / INGENIUS Studio</span>
              </div>
              <div className="nc-thesis-card">
                <span className="k">Influencer tooling</span>
                <div className="n">$97.6B</div>
                <p>The software brands use to run and measure creator campaigns grows ~4× — from $25.4B (2024) to $97.6B by 2030. Budget is shifting to structured tools.</p>
                <span className="src">Source: Grand View Research</span>
              </div>
            </div>
            <p className="nc-form-note" style={{ marginTop: 28 }}>
              <Link to="/thesis" className="nc-login">Read the full No Cap thesis →</Link>
            </p>
          </div>
        </section>

        <section id="get-started" className="nc-section">
          <div className="nc-wrap">
            <div className="nc-cta-banner">
              <h2>Set a budget. Open it up. Let the results decide the split.</h2>
              <div className="nc-cta-row">
                <Link className="nc-btn nc-btn-primary" to="/start">Start a campaign</Link>
                <Link className="nc-btn nc-btn-ghost" to="/contact">Talk to us</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    </SiteShell>
  );
}
