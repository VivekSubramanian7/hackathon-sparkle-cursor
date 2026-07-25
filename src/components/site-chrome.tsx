import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
      </div>
    </div>
  );
}

export function SiteNav() {
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
                <Link to="/start"><b>Start a campaign</b><span>Fund a pool and open applications</span></Link>
              </div>
            </div>
            <div className="nc-group">
              <button type="button" className="nc-group-trigger">
                For Creators <span className="nc-caret">▾</span>
              </button>
              <div className="nc-group-menu">
                <Link to="/creators"><b>Creator marketplace</b><span>Real people, one published formula</span></Link>
                <Link to="/start"><b>Apply to pools</b><span>Baseline + a share sized to results</span></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="nc-navright">
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
          <p>No lying about the split — pooled, performance-based influencer budgets for DTC brands.</p>
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