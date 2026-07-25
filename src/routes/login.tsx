import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Manage your pool campaigns | No Cap" },
      { name: "description", content: "Sign in to run pool campaigns, review applicants, and watch the performance split rebalance as tracked results land." },
      { property: "og:title", content: "Log in to No Cap" },
      { property: "og:description", content: "Manage pools, applicants, and the live performance split." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <PageHero eyebrow="Login" title={<>Welcome back.</>} lead="Sign in to manage pools, review applicants, and see the split rebalance live." />
      <section className="nc-section">
        <div className="nc-wrap">
          <form
            className="nc-form-card"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div><label>Email</label><input type="email" required placeholder="you@brand.com" /></div>
            <button type="submit" className="nc-btn nc-btn-primary" style={{ justifySelf: "center" }}>
              {sent ? "Check your inbox" : "Send magic link"}
            </button>
            <p className="nc-form-note">
              New to No Cap? <Link to="/start" className="nc-login">Start a campaign →</Link>
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}