import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — No Cap" },
      { name: "description", content: "How No Cap collects, stores, and uses data for pool campaigns, creator applications, and performance tracking." },
      { property: "og:title", content: "Privacy — No Cap" },
      { property: "og:description", content: "How we handle brand and creator data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Privacy" title={<>Data, tracking, and the pool.</>} />
      <section className="nc-section">
        <div className="nc-wrap nc-prose">
          <p>No Cap collects the minimum data needed to run pool campaigns: brand contact details, campaign settings, creator applications, posted content links, and the tracked performance signal you select for the split.</p>
          <h3>What we track</h3>
          <p>For the performance split, we track only the metric published on your campaign brief — clicks via UTMs, attributed conversions via a pixel you install, or verified views via platform APIs. We do not sell personal data to third parties.</p>
          <h3>Retention</h3>
          <p>Campaign data is retained for the life of your account plus 12 months for tax and payout audit purposes. You can request deletion at any time by contacting support.</p>
          <h3>Contact</h3>
          <p>Privacy questions: privacy@nocap.example. This is a mockup page for a hackathon prototype; treat as illustrative.</p>
        </div>
      </section>
    </SiteShell>
  );
}