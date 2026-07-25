import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";

type Role = "creator" | "brand";
type Mode = "signin" | "signup";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role === "brand" ? "brand" : "creator") as Role,
    mode: (search.mode === "signup" ? "signup" : "signin") as Mode,
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
  const { role, mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const isCreator = role === "creator";
  const otherRole: Role = isCreator ? "brand" : "creator";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setOk(null);
    try {
      if (mode === "signup") {
        const cleanHandle = handle.trim().replace(/^@/, "");
        if (isCreator && !cleanHandle) throw new Error("Add your video UGC platform handle.");
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role,
              ugc_platform: isCreator ? platform.toLowerCase() : "n/a",
              ugc_handle: isCreator ? cleanHandle : "brand",
            },
          },
        });
        if (error) throw error;
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session) {
          setOk("Account created — you're signed in.");
          setTimeout(() => navigate({ to: "/" }), 700);
        } else {
          setOk("Check your email to confirm your account.");
        }
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

  const roleLabel = isCreator ? "Creator" : "Brand";

  return (
    <SiteShell>
      <section className="nc-section" style={{ paddingTop: 48 }}>
        <div className="nc-wrap">
          <div className="nc-auth-split">
            <aside className={`nc-auth-aside ${isCreator ? "creator" : "brand"}`}>
              {isCreator ? (
                <>
                  <div className="nc-auth-quote">
                    <p>“I applied to a Snitch pool on Sunday, posted Tuesday, and the split settled by the weekend. Baseline hit before the top-line ever moved.”</p>
                    <div className="nc-auth-quote-by"><b>Aarav M.</b><span>Menswear creator · Mumbai</span></div>
                  </div>
                  <div className="nc-auth-logos">
                    <span>Snitch</span><span>BlissClub</span><span>The Pant Project</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="nc-auth-quote">
                    <p>“No Cap cut our creator ops from a spreadsheet to one brief. We fund the pool, Scout finds fit, and the split does the rest.”</p>
                    <div className="nc-auth-quote-by"><b>Lena K.</b><span>Head of Growth · Skincare DTC</span></div>
                  </div>
                  <div className="nc-auth-logos">
                    <span>Magic Spoon</span><span>Quince</span><span>KoRo</span><span>Purelei</span>
                  </div>
                </>
              )}
            </aside>
            <form className="nc-auth-form" onSubmit={onSubmit}>
              <span className="nc-eyebrow">{isCreator ? "For creators" : "For brands"}</span>
              <h1 className="nc-auth-title">
                {mode === "signup"
                  ? <>Sign up for your <span className="hl">{roleLabel}</span> account</>
                  : <>Sign in to your <span className="hl">{roleLabel}</span> account</>}
              </h1>

              <div className="nc-field"><label>Your email address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isCreator ? "you@creator.com" : "you@brand.com"} />
              </div>
              <div className="nc-field"><label>Password</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>

              {mode === "signup" && isCreator && (
                <div className="row2">
                  <div className="nc-field"><label>Video UGC platform</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                      {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="nc-field"><label>Your handle on {platform}</label>
                    <input type="text" required value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" />
                  </div>
                </div>
              )}

              {error && <p className="nc-form-note" style={{ color: "var(--nc-coral)" }}>{error}</p>}
              {ok && <p className="nc-form-note" style={{ color: "var(--nc-accent)" }}>{ok}</p>}

              <button type="submit" disabled={loading} className="nc-btn nc-btn-primary nc-auth-cta">
                {loading ? "Working…" : mode === "signup" ? "Continue" : "Continue"}
              </button>

              <div className="nc-auth-links">
                {mode === "signin" ? (
                  <>
                    <p>No account yet?{" "}
                      <button type="button" onClick={() => setMode("signup")} className="nc-login-btn">Join now</button>
                    </p>
                    <p>{isCreator ? "Are you a Brand?" : "Are you a Creator?"}{" "}
                      <Link to="/login" search={{ role: otherRole, mode: "signin" }} className="nc-login">
                        Log in here instead
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <p>Already have an account?{" "}
                      <button type="button" onClick={() => setMode("signin")} className="nc-login-btn">Log in</button>
                    </p>
                    <p>{isCreator ? "Want to sign up as a Brand?" : "Want to sign up as a Creator?"}{" "}
                      <Link to="/login" search={{ role: otherRole, mode: "signup" }} className="nc-login">
                        Switch here
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}