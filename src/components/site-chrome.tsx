import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function Wordmark() {
  return (
    <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" className="nc-wordmark" aria-label="No Cap" role="img">
      <text x="60" y="205" fontFamily="Instrument Serif, Georgia, serif" fontWeight="400" fontSize="200" fill="currentColor">No Cap</text>
      <rect x="64" y="235" width="240" height="14" rx="7" fill="#CFFF04" />
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
        <Link to="/" className="nc-logo">
          <Wordmark />
        </Link>
        <div className="nc-navlinks">
          <Link to="/how-it-works">How it works</Link>
          <Link to="/creators">Creators</Link>
          <Link to="/thesis">Thesis</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div className="nc-navright">
          <Link className="nc-login" to="/login">Login</Link>
          <Link className="nc-btn nc-btn-primary" to="/start">Start for free</Link>
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
            <Link to="/thesis">Thesis</Link>
            <Link to="/faq">FAQ</Link>
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
        <span>Mockup landing page — figures and creator handles shown are illustrative, not real customer data.</span>
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