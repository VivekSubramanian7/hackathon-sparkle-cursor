import { useEffect, useRef } from "react";

type Props = {
  level: number; // live 0..1 (mic peak)
  speaking?: boolean; // Scout is talking
  active?: boolean; // user is recording
  size?: number;
};

const WAVES = [
  { freq: 1.0, speed: 1.6, amp: 1.0, alpha: 0.95 },
  { freq: 1.6, speed: -1.1, amp: 0.65, alpha: 0.55 },
  { freq: 2.3, speed: 0.8, amp: 0.4, alpha: 0.3 },
];

export function ScoutWaveform({ level, speaking, active, size = 340 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const levelRef = useRef(0);
  const speakingRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { speakingRef.current = !!speaking; }, [speaking]);
  useEffect(() => { activeRef.current = !!active; }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = size;
    const height = Math.round(size * 0.32);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const accent = getComputedStyle(canvas).getPropertyValue("--nc-accent").trim() || "#FF5F1F";
    const ink = "#111";
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, ink);
    gradient.addColorStop(0.5, accent);
    gradient.addColorStop(1, ink);

    let spring = 0;
    let vel = 0;
    const K = 90;
    const D = 14;
    let phase = 0;
    let breathe = 0;
    let raf = 0;
    let last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Target amplitude: mic level when recording, simulated when Scout speaks, else idle
      let target = 0;
      if (activeRef.current) {
        const l = levelRef.current;
        target = l > 0.015 ? Math.min(1, Math.sqrt(l) * 2.2) : 0;
      } else if (speakingRef.current) {
        // Gentle simulated pulse while Scout talks
        target = 0.45 + 0.35 * Math.abs(Math.sin(now / 220));
      }

      const force = K * (target - spring) - D * vel;
      vel += force * dt;
      spring += vel * dt;
      if (spring < 0) spring = 0;

      breathe += dt * 1.2;
      const idle = (0.08 + 0.05 * Math.sin(breathe)) * (1 - spring);
      const amplitude = (spring * 0.85 + idle) * (height / 2 - 4);
      phase += dt * (reduced ? 0.3 : 1.5 + spring * 2.5);

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.shadowColor = accent;
      ctx.shadowBlur = 6 + spring * 18;

      const midY = height / 2;
      for (const w of WAVES) {
        ctx.beginPath();
        ctx.globalAlpha = w.alpha;
        ctx.strokeStyle = gradient;
        for (let x = 0; x <= width; x += 2) {
          const t = x / width;
          const envelope = Math.sin(Math.PI * t);
          const y =
            midY +
            Math.sin(t * Math.PI * 2 * w.freq * 2 + phase * w.speed * Math.PI) *
              amplitude *
              w.amp *
              envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={canvasRef} className="nc-scout-wave" aria-hidden="true" />;
}