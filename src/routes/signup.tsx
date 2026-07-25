import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up - Creator or Brand | No Cap" },
      { name: "description", content: "Pick your role to get started on No Cap. Creators apply into pools; brands fund pools and open applications." },
      { property: "og:title", content: "Join No Cap - one pool, one formula, one payout" },
      { property: "og:description", content: "Pick your role to get started." },
    ],
  }),
  component: SignupPicker,
});

function SignupPicker() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Welcome to No Cap"
        title={<>Pick your role to <span className="hl">get started</span>.</>}
        lead="One pool, one published formula, one payout - however you're joining."
      />
      <section className="nc-section">
        <div className="nc-wrap">
          <div className="nc-role-picker">
            <Link to="/login" search={{ role: "creator", mode: "signup" }} className="nc-role-card">
              <div className="nc-role-art nc-role-art-creator" aria-hidden="true">
                <span>🎬</span><span>🎤</span>
              </div>
              <b>I'm a Creator</b>
              <p>Apply into funded pools, post to your video UGC platform, and get paid a baseline plus a share sized to results.</p>
              <span className="nc-role-cta">Sign up as a Creator →</span>
            </Link>
            <Link to="/login" search={{ role: "brand", mode: "signup" }} className="nc-role-card">
              <div className="nc-role-art nc-role-art-brand" aria-hidden="true">
                <span>📈</span><span>💻</span>
              </div>
              <b>I'm a Brand</b>
              <p>Fund a pool, open applications, and watch the split rebalance live - no per-creator negotiation, capped total spend.</p>
              <span className="nc-role-cta">Sign up as a Brand →</span>
            </Link>
          </div>
          <p className="nc-form-note" style={{ textAlign: "center", marginTop: 24 }}>
            Already have an account?{" "}
            <Link to="/login" search={{ role: "creator", mode: "signin" }} className="nc-login">Log in</Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}