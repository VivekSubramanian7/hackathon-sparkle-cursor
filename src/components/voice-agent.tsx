import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Waveform } from "@/components/waveform";
import { useRecorder } from "@/hooks/use-recorder";
import {
  parseAmount,
  parseCpa,
  parseMode,
  parseWeight,
} from "@/domain/structure";

export type VoiceAgentResult = {
  title: string;
  brandName: string;
  brief: string;
  guidelines: string;
  poolEur: number;
  targetCpa: number;
  signupWeight: number;
  mode: "yolo" | "surgical";
};

type Field = keyof VoiceAgentResult;

type Question = {
  field: Field;
  prompt: string;
  label: string;
  parse: (t: string, cur: VoiceAgentResult) => Partial<VoiceAgentResult> | null;
};

const DEFAULTS: VoiceAgentResult = {
  title: "",
  brandName: "",
  brief: "",
  guidelines:
    "Disclose partnership (#ad / Werbung) per platform rules. Keep the pitch honest to your voice; No Cap tracks results via your unique link.",
  poolEur: 10000,
  targetCpa: 10,
  signupWeight: 0.7,
  mode: "yolo",
};

const QUESTIONS: Question[] = [
  {
    field: "brandName",
    label: "Brand",
    prompt: "Hi, I'm Scout from No Cap. Let's set up your campaign. First, what's your brand name?",
    parse: (t) => ({ brandName: t.replace(/[.!?]+$/, "").trim() }),
  },
  {
    field: "title",
    label: "Campaign title",
    prompt: "Nice. Give this campaign a short title, like 'Cinnamon launch' or 'Summer refresh'.",
    parse: (t) => ({ title: t.replace(/[.!?]+$/, "").trim() }),
  },
  {
    field: "brief",
    label: "Brief",
    prompt: "In one breath, tell me what you're selling and who it's for. Creators will see this.",
    parse: (t) => ({ brief: t.trim() }),
  },
  {
    field: "poolEur",
    label: "Pool budget",
    prompt: "How much do you want to put in the pool, in euros? For example, 10000, or 15k.",
    parse: (t) => {
      const n = parseAmount(t);
      if (!n || n < 100) return null;
      return { poolEur: n };
    },
  },
  {
    field: "signupWeight",
    label: "Weights",
    prompt: "Do you care more about signups, more about reach, or a mix? You can also say a percent, like 70% signups.",
    parse: (t) => {
      const w = parseWeight(t);
      if (w == null) return null;
      return { signupWeight: w };
    },
  },
  {
    field: "mode",
    label: "Mode",
    prompt: "Last one. Open the pool to any creator instantly, or review applications first? Say yolo or surgical.",
    parse: (t) => {
      const m = parseMode(t);
      if (!m) return null;
      return { mode: m };
    },
  },
];

type Turn = { role: "scout" | "you"; text: string };

export function VoiceAgent({
  initial,
  onDone,
  onCancel,
}: {
  initial?: Partial<VoiceAgentResult>;
  onDone: (r: VoiceAgentResult) => void;
  onCancel: (current: VoiceAgentResult) => void;
}) {
  const rec = useRecorder();
  // Start on the first unanswered field so returning to voice resumes naturally.
  const seeded: VoiceAgentResult = { ...DEFAULTS, ...(initial ?? {}) };
  const firstUnanswered = (() => {
    for (let i = 0; i < QUESTIONS.length; i++) {
      const f = QUESTIONS[i].field;
      const v = seeded[f];
      const empty =
        (typeof v === "string" && !v.trim()) ||
        v === DEFAULTS[f] ||
        v == null;
      if (empty) return i;
    }
    return QUESTIONS.length;
  })();
  const [idx, setIdx] = useState(firstUnanswered);
  const [data, setData] = useState<VoiceAgentResult>(seeded);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spokenRef = useRef<Set<number>>(new Set());
  const [muted, setMuted] = useState(false);

  const done = idx >= QUESTIONS.length;
  const q = QUESTIONS[idx];

  const speak = useCallback(
    async (text: string) => {
      setTurns((t) => [...t, { role: "scout", text }]);
      if (muted) return;
      try {
        setSpeaking(true);
        const res = await fetch("/api/voice/tts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error(`TTS ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        await new Promise<void>((resolve) => {
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
      } finally {
        setSpeaking(false);
      }
    },
    [muted],
  );

  // Speak each question exactly once when we land on it.
  useEffect(() => {
    if (done) return;
    if (spokenRef.current.has(idx)) return;
    spokenRef.current.add(idx);
    void speak(q.prompt);
  }, [idx, done, q, speak]);

  // Farewell + hand off
  useEffect(() => {
    if (!done) return;
    if (spokenRef.current.has(-1)) return;
    spokenRef.current.add(-1);
    void speak("Great, that's everything. I've drafted your campaign. Review the form and hit fund when you're ready.");
  }, [done, speak]);

  async function handleStop() {
    const blob = await rec.stop();
    if (!blob) {
      toast.error("Recording too short - try again");
      return;
    }
    setThinking(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "recording.wav");
      const res = await fetch("/api/voice/structure", { method: "POST", body: form });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(err.error || `Transcription failed (${res.status})`);
        return;
      }
      const j = (await res.json()) as { transcript: string };
      const transcript = (j.transcript || "").trim();
      if (!transcript) {
        toast.error("Didn't catch that - try again");
        return;
      }
      setTurns((t) => [...t, { role: "you", text: transcript }]);
      const patch = q.parse(transcript, data);
      if (!patch) {
        void speak("Hmm, I didn't quite get that. Could you say it again?");
        return;
      }
      setData((d) => ({ ...d, ...patch }));
      setIdx((i) => i + 1);
    } catch (e) {
      toast.error((e as Error).message || "Voice pipeline failed");
    } finally {
      setThinking(false);
    }
  }

  function skipQuestion() {
    setTurns((t) => [...t, { role: "you", text: "(skipped, using default)" }]);
    setIdx((i) => i + 1);
  }

  function stopAudio() {
    audioRef.current?.pause();
    setSpeaking(false);
  }

  return (
    <div className="nc-agent">
      <header className="nc-agent-head">
        <div>
          <p className="nc-eyebrow">Scout · Voice intake</p>
          <h2>{done ? "Review your draft" : q.label}</h2>
        </div>
        <div className="nc-agent-progress">
          {QUESTIONS.map((qq, i) => (
            <span key={qq.field} className={i < idx ? "is-done" : i === idx ? "is-current" : ""} />
          ))}
        </div>
      </header>

      <div className="nc-agent-transcript" aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} className={`nc-agent-turn is-${t.role}`}>
            <span className="nc-agent-who">{t.role === "scout" ? "Scout" : "You"}</span>
            <p>{t.text}</p>
          </div>
        ))}
        {speaking && <div className="nc-agent-turn is-scout is-typing"><span className="nc-agent-who">Scout</span><p>...</p></div>}
      </div>

      {!done && (
        <div className="nc-voice-card">
          <div className="nc-voice-visual">
            <Waveform levels={rec.levels} active={rec.isRecording} />
            <div className="nc-voice-timer">
              {rec.isRecording
                ? `${rec.seconds}s`
                : thinking
                  ? "Transcribing..."
                  : speaking
                    ? "Scout is speaking..."
                    : "Tap to answer"}
            </div>
          </div>
          <div className="nc-actions nc-voice-actions">
            {!rec.isRecording ? (
              <button
                className="nc-btn-primary"
                onClick={() => rec.start()}
                disabled={thinking || speaking || !rec.isSupported}
              >
                {rec.isSupported ? "Answer" : "Mic unavailable"}
              </button>
            ) : (
              <button className="nc-btn-primary" onClick={handleStop}>Stop &amp; send</button>
            )}
            <button className="nc-btn-ghost" onClick={skipQuestion} disabled={thinking || rec.isRecording}>
              Skip
            </button>
            {speaking ? (
              <button className="nc-btn-ghost" onClick={stopAudio}>Stop voice</button>
            ) : (
              <button className="nc-btn-ghost" onClick={() => setMuted((m) => !m)}>
                {muted ? "Unmute Scout" : "Mute Scout"}
              </button>
            )}
            <button
              className="nc-btn-ghost"
              onClick={() => onCancel(data)}
              disabled={rec.isRecording}
            >
              Switch to form (keep answers)
            </button>
          </div>
          {rec.error && <p className="nc-voice-error">{rec.error}</p>}
        </div>
      )}

      {done && (
        <ReviewForm
          data={data}
          onChange={setData}
          onAccept={() => onDone(data)}
          onRestart={() => {
            spokenRef.current = new Set();
            setData(DEFAULTS);
            setTurns([]);
            setIdx(0);
          }}
          onCancel={() => onCancel(data)}
        />
      )}
    </div>
  );
}

function ReviewForm({
  data,
  onChange,
  onAccept,
  onRestart,
  onCancel,
}: {
  data: VoiceAgentResult;
  onChange: (d: VoiceAgentResult) => void;
  onAccept: () => void;
  onRestart: () => void;
  onCancel: () => void;
}) {
  const set = <K extends keyof VoiceAgentResult>(k: K, v: VoiceAgentResult[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="nc-form nc-agent-review">
      <label>
        Brand
        <input value={data.brandName} onChange={(e) => set("brandName", e.target.value)} />
      </label>
      <label>
        Campaign title
        <input value={data.title} onChange={(e) => set("title", e.target.value)} />
      </label>
      <label>
        Brief
        <textarea rows={4} value={data.brief} onChange={(e) => set("brief", e.target.value)} />
      </label>
      <label>
        Guidelines
        <textarea rows={3} value={data.guidelines} onChange={(e) => set("guidelines", e.target.value)} />
      </label>
      <div className="nc-econ-grid">
        <label>
          Pool (EUR)
          <input
            type="number"
            min={100}
            value={data.poolEur}
            onChange={(e) => set("poolEur", Math.max(0, Number(e.target.value)))}
          />
        </label>
        <label>
          Target CPA (EUR)
          <input
            type="number"
            min={1}
            value={data.targetCpa}
            onChange={(e) => set("targetCpa", Math.max(1, Number(e.target.value)))}
          />
        </label>
        <label className="nc-slider">
          Signups <b>{Math.round(data.signupWeight * 100)}%</b> · Reach <b>{Math.round((1 - data.signupWeight) * 100)}%</b>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={data.signupWeight}
            onChange={(e) => set("signupWeight", Number(e.target.value))}
          />
        </label>
      </div>
      <div className="nc-mode-grid">
        <button
          type="button"
          className={`nc-mode-card ${data.mode === "yolo" ? "is-active" : ""}`}
          onClick={() => set("mode", "yolo")}
        >
          <b>Yolo</b>
          <span>Open pool. First-come creators join instantly.</span>
        </button>
        <button
          type="button"
          className={`nc-mode-card ${data.mode === "surgical" ? "is-active" : ""}`}
          onClick={() => set("mode", "surgical")}
        >
          <b>Surgical</b>
          <span>Applications only. Manager reviews and accepts.</span>
        </button>
      </div>
      <div className="nc-actions">
        <button className="nc-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="nc-btn-ghost" onClick={onRestart}>Redo voice</button>
        <button className="nc-btn-primary" onClick={onAccept} disabled={!data.brief.trim() || data.poolEur <= 0}>
          Accept &amp; continue to fund
        </button>
      </div>
    </div>
  );
}