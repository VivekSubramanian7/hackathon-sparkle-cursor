import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — No Cap" },
      { name: "description", content: "Talk to the No Cap team about running a performance-split influencer pool for your brand." },
      { property: "og:title", content: "Contact No Cap" },
      { property: "og:description", content: "Talk to us about running a pool campaign." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <PageHero eyebrow="Contact" title={<>Talk to <span className="hl">us.</span></>} lead="Question about the split, the marketplace, or how a pool works for your category? Send a note." />
      <section className="nc-section">
        <div className="nc-wrap">
          <form className="nc-form-card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="row2">
              <div><label>Name</label><input required /></div>
              <div><label>Email</label><input type="email" required /></div>
            </div>
            <div><label>Message</label><textarea required /></div>
            <button type="submit" className="nc-btn nc-btn-primary" style={{ justifySelf: "center" }}>
              {sent ? "Sent — talk soon" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}