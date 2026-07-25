import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useDemoStore } from "@/lib/demo-store";
import { toast } from "sonner";

function Wordmark() {
  return (
    <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" className="nc-wordmark" aria-label="No Cap" role="img">
      <text x="60" y="205" fontFamily="Instrument Serif, Georgia, serif" fontWeight="400" fontSize="200" fill="currentColor">No Cap</text>
      <rect x="64" y="235" width="240" height="14" rx="7" fill="#FF5F1F" />
    </svg>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="nc-root">
      <div className="nc-stars" aria-hidden="true" />
      <div className="nc-content">
        <SiteNav />
        {children}
        <SiteFooter />
        <DemoBar />
      </div>
    </div>
  );
}

export function SiteNav() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const meta = (user?.user_metadata ?? {}) as { role?: string; ugc_handle?: string; ugc_platform?: string };
  const displayName = meta.ugc_handle && meta.ugc_handle !== "brand" ? `@${meta.ugc_handle}` : (user?.email ?? "");
  const initial = (displayName || user?.email || "?").replace(/^@/, "").charAt(0).toUpperCase();
  const roleLabel = meta.role === "brand" ? "Brand" : meta.role === "creator" ? "Creator" : "Account";

  return (
    <nav className="nc-nav">
      <div className="nc-nav-inner">
        <div className="nc-nav-left">
          <Link to="/" className="nc-logo">
            <Wordmark />
          </Link>
          <span className="nc-nav-divider" aria-hidden="true" />
          <div className="nc-nav-groups">
            <div className="nc-group">
              <button type="button" className="nc-group-trigger">
                For Brands <span className="nc-caret">▾</span>
              </button>
              <div className="nc-group-menu">
                <Link to="/how-it-works"><b>How it works</b><span>The pool → split → payout flow</span></Link>
                <Link to="/pricing"><b>Pricing</b><span>Take rate on the funded pool</span></Link>
                <Link to="/brand/create"><b>Create a campaign</b><span>Speak your brief, fund the pool</span></Link>
                <Link to="/brand/campaigns"><b>Your campaigns</b><span>HQ: advance, simulate, settle</span></Link>
              </div>
            </div>
            <div className="nc-group">
              <button type="button" className="nc-group-trigger">
                For Creators <span className="nc-caret">▾</span>
              </button>
              <div className="nc-group-menu">
                <Link to="/creators"><b>Creator marketplace</b><span>Real people, one published formula</span></Link>
                <Link to="/campaigns"><b>Open campaigns</b><span>Browse briefs and apply in one tap</span></Link>
                <Link to="/creator/active"><b>Active missions</b><span>Your mission kit + tracking codes</span></Link>
                <Link to="/creator/payouts"><b>Payouts</b><span>Gross, 7% fee, net</span></Link>
                <Link to="/start"><b>Get started</b><span>Baseline + a share sized to results</span></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="nc-navright">
          {loading ? null : user ? (
            <div className="nc-group nc-login-group">
              <button type="button" className="nc-group-trigger nc-user-trigger">
                <span className="nc-user-avatar" aria-hidden="true">{initial}</span>
                <span className="nc-user-name">{displayName}</span>
                <span className="nc-caret">▾</span>
              </button>
              <div className="nc-group-menu nc-login-menu">
                <div className="nc-login-label">{roleLabel.toUpperCase()}</div>
                <div className="nc-user-email">{user.email}</div>
                <button type="button" className="nc-menu-btn" onClick={handleSignOut}>
                  <b>Sign out</b>
                </button>
              </div>
            </div>
          ) : (
          <>
          <div className="nc-group nc-login-group">
            <button type="button" className="nc-group-trigger nc-login-trigger">
              Login <span className="nc-caret">▾</span>
            </button>
            <div className="nc-group-menu nc-login-menu">
              <div className="nc-login-label">LOGIN AS A</div>
              <Link to="/login" search={{ role: "creator", mode: "signin" }}>
                <span className="nc-login-ico" aria-hidden="true">✎</span>
                <b>Creator</b>
              </Link>
              <Link to="/login" search={{ role: "brand", mode: "signin" }}>
                <span className="nc-login-ico" aria-hidden="true">🎙</span>
                <b>Brand</b>
              </Link>
            </div>
          </div>
          <Link className="nc-btn nc-btn-primary" to="/signup">Get access →</Link>
          </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="nc-footer">
      <div className="nc-wrap nc-footer-grid">
        <div className="nc-footer-brand">
          <Link to="/" className="nc-logo"><Wordmark /></Link>
          <p>No lying about the split - pooled, performance-based influencer budgets for DTC brands.</p>
        </div>
        <div className="nc-footer-cols">
          <div className="nc-footer-col">
            <h5>Product</h5>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/creators">Creators</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/thesis">Thesis</Link>
          </div>
          <div className="nc-footer-col">
            <h5>Company</h5>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="nc-wrap nc-footer-bottom">
        <span>© No Cap, 2026.</span>
        <span>No lying about the split.</span>
      </div>
    </footer>
  );
}

function DemoBar() {
  const { state, setRole, resetDemo } = useDemoStore();
  const navigate = useNavigate();
  return (
    <div className="nc-demobar" role="region" aria-label="Demo controls">
      <span className="nc-demobar-label">Demo</span>
      <div className="nc-demobar-toggle">
        <button
          type="button"
          className={state.role === "brand" ? "is-on" : ""}
          onClick={() => {
            setRole("brand");
            navigate({ to: "/brand/campaigns" });
          }}
        >
          Brand
        </button>
        <button
          type="button"
          className={state.role === "creator" ? "is-on" : ""}
          onClick={() => {
            setRole("creator");
            navigate({ to: "/campaigns" });
          }}
        >
          Creator
        </button>
      </div>
      <button
        type="button"
        className="nc-demobar-reset"
        onClick={() => {
          resetDemo();
          toast.success("Demo reset");
        }}
      >
        Reset
      </button>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <header className="nc-hero nc-hero-slim">
      <div className="nc-wrap nc-inner">
        <span className="nc-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </header>
  );
}

export function PageFaq({ items, title }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="nc-section">
      <div className="nc-wrap">
        <div className="nc-section-head">
          <span className="nc-eyebrow">Frequently asked</span>
          <h2>{title ?? "Answers, in plain English."}</h2>
        </div>
        <div className="nc-faq">
          {items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}