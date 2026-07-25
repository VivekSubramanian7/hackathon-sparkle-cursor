import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteShell } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";

type Role = "creator" | "brand";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role === "brand" ? "brand" : "creator") as Role,
  }),
  head: () => ({
    meta: [
      { title: "Log in or sign up — Creators & brands | No Cap" },
      { name: "description", content: "Sign in or create your No Cap account. Creators post to one video UGC platform; brands fund pools and open applications." },
      { property: "og:title", content: "Log in or sign up to No Cap" },
      { property: "og:description", content: "Creators and brands — one pool, one formula, one payout." },
    ],
  }),
  component: LoginPage,
});

const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts"];

function LoginPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const isCreator = role === "creator";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setOk(null);
    try {
      if (mode === "signup") {
        const cleanHandle = handle.trim().replace(/^@/, "");
        if (!cleanHandle) throw new Error("Add your video UGC platform handle.");
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { role, ugc_platform: platform.toLowerCase(), ugc_handle: cleanHandle },
          },
        });
        if (error) throw error;
        setOk("Account created — you're signed in.");
        setTimeout(() => navigate({ to: "/" }), 700);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={isCreator ? "For creators" : "For brands"}
        title={<>{mode === "signup" ? "Create your account." : "Welcome back."}</>}
        lead={isCreator
          ? "Sign up as a creator to apply into pools. One video UGC platform handle is all we need to get you started."
          : "Sign up as a brand to fund pools, open applications, and watch the split rebalance live."}
      />
      <section className="nc-section">
        <div className="nc-wrap">
          <form className="nc-form-card" onSubmit={onSubmit}>
            <div className="nc-role-tabs" role="tablist">
              <button type="button" className={`nc-role-tab${mode === "signup" ? " on" : ""}`} onClick={() => setMode("signup")}>Sign up</button>
              <button type="button" className={`nc-role-tab${mode === "signin" ? " on" : ""}`} onClick={() => setMode("signin")}>Sign in</button>
            </div>

            <div><label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isCreator ? "you@creator.com" : "you@brand.com"} />
            </div>
            <div><label>Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>

            {mode === "signup" && (
              <div className="row2">
                <div><label>Video UGC platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label>Your handle on {platform}</label>
                  <input type="text" required value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" />
                </div>
              </div>
            )}

            {error && <p className="nc-form-note" style={{ color: "var(--nc-coral)" }}>{error}</p>}
            {ok && <p className="nc-form-note" style={{ color: "var(--nc-accent)" }}>{ok}</p>}

            <button type="submit" disabled={loading} className="nc-btn nc-btn-primary" style={{ justifySelf: "center", marginTop: 8 }}>
              {loading ? "Working…" : mode === "signup" ? `Create ${isCreator ? "creator" : "brand"} account` : "Sign in"}
            </button>
            <p className="nc-form-note">
              {mode === "signup" ? "Already have an account?" : "New to No Cap?"}{" "}
              <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="nc-login" style={{ background: "none", border: 0, cursor: "pointer" }}>
                {mode === "signup" ? "Sign in →" : "Create one →"}
              </button>
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}