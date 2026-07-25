import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFaq, PageHero, SiteShell } from "@/components/site-chrome";

const px = (id: number, w = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const creators = [
  { id: 15676271, name: "Camila R.", handle: "@camila.streetstyle", cats: "Fashion · Beauty", followers: "184K", tag: "TOP 5%" },
  { id: 30805103, name: "Noah W.", handle: "@noah.builds", cats: "Home · DIY", followers: "62K", tag: "NEW" },
  { id: 38285050, name: "Aria K.", handle: "@aria.everyday", cats: "Lifestyle · Wellness", followers: "241K", tag: "TOP 5%" },
  { id: 13929184, name: "Devon P.", handle: "@devon.pours", cats: "Food & Beverage", followers: "88K", tag: "OPEN" },
  { id: 8294854, name: "Sana M.", handle: "@sanaskin", cats: "Skincare", followers: "156K", tag: "TOP 5%" },
  { id: 35035634, name: "Kai T.", handle: "@kai.trains", cats: "Fitness · Supplements", followers: "104K", tag: "OPEN" },
  { id: 24454074, name: "Mila V.", handle: "@milavero", cats: "Apparel · Style", followers: "73K", tag: "NEW" },
  { id: 20524458, name: "Ren S.", handle: "@renshoots", cats: "Pet · Lifestyle", followers: "51K", tag: "OPEN" },
  { id: 25810873, name: "Jules E.", handle: "@jules.eats", cats: "Food & Beverage", followers: "97K", tag: "OPEN" },
  { id: 27409697, name: "Priya S.", handle: "@priya.pets", cats: "Pet", followers: "42K", tag: "NEW" },
  { id: 15647620, name: "Maya C.", handle: "@maya.wears", cats: "Apparel", followers: "128K", tag: "TOP 5%" },
  { id: 8294855, name: "Theo A.", handle: "@theopours", cats: "Beverage", followers: "58K", tag: "OPEN" },
];

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Creators — one published split, no per-creator rate cards | No Cap" },
      { name: "description", content: "Meet creators opted into pool campaigns. Same baseline plus a share of the pool for everyone, sized to the tracked metric on the brief. No individually-negotiated fees." },
      { property: "og:title", content: "No Cap creators — same formula, sized to real results" },
      { property: "og:description", content: "Browse creators in the pool. One published split formula for every applicant, every campaign." },
    ],
  }),
  component: CreatorsPage,
});

function CreatorsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Creator marketplace"
        title={<>Real people. <span className="hl">Same formula</span> for every one of them.</>}
        lead="Creators opted into pool campaigns. No individual rate cards — everyone is paid the same baseline plus a share of the pool sized to tracked results."
      />
      <section className="nc-section">
        <div className="nc-wrap">
          <div className="nc-market-filter" style={{ justifyContent: "center", marginBottom: 32 }}>
            {["All", "Skincare", "Fitness", "Home", "Food", "Pet", "Apparel", "Beauty"].map((c, i) => (
              <span key={c} className={`chip${i === 0 ? " on" : ""}`}>{c}</span>
            ))}
          </div>
          <div className="nc-market-grid">
            {creators.map((c) => (
              <div key={c.id} className="nc-creator-card">
                <span className="nc-creator-tag">
                  {c.tag === "TOP 5%" ? <span className="g">● {c.tag}</span> : c.tag}
                </span>
                <img className="nc-creator-photo" src={px(c.id)} alt={`${c.name} — creator`} loading="lazy" />
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
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link className="nc-btn nc-btn-primary" to="/start">Open a pool to these creators</Link>
          </div>
        </div>
      </section>
      <PageFaq
        title="Creator questions we hear most"
        items={[
          { q: "Am I locked into a rate before I post?", a: "No. There is no per-creator rate card. You earn the published baseline for posting, plus a share of the pool sized to the tracked metric on the brief." },
          { q: "Can I earn zero above baseline?", a: "Yes — if your post drives no tracked activity, you still keep baseline but earn nothing extra. Upside on the other side is uncapped." },
          { q: "Do I have to be exclusive to No Cap?", a: "No. You can run brand deals anywhere else. Pool campaigns just replace the negotiation step for the brands that opt in." },
          { q: "Who owns the content I post?", a: "You do, unless the brief explicitly negotiates usage rights — in which case that's spelled out on the campaign before you apply." },
        ]}
      />
    </SiteShell>
  );
}