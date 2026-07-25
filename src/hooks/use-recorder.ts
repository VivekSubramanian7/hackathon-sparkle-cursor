import { useCallback, useEffect, useRef, useState } from "react";

// Web Audio recorder that captures mono PCM and encodes a self-contained WAV
// so every clip is decodable on any browser (Safari's MP4 fragments break STT).

type Recorder = {
  isRecording: boolean;
  isSupported: boolean;
  seconds: number;
  level: number; // 0..1 running peak, for waveform
  levels: number[]; // rolling history
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  cancel: () => void;
};

function encodeWav(chunks: Float32Array[], sampleRate: number, targetRate = 16000): Blob {
  // Concatenate
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const merged = new Float32Array(total);
  let off = 0;
  for (const c of chunks) {
    merged.set(c, off);
    off += c.length;
  }
  // Downsample naive (linear) to targetRate
  const ratio = sampleRate / targetRate;
  const outLen = Math.floor(merged.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const idx = i * ratio;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, merged.length - 1);
    const frac = idx - i0;
    out[i] = merged[i0] * (1 - frac) + merged[i1] * frac;
  }
  // PCM16
  const buffer = new ArrayBuffer(44 + out.length * 2);
  const view = new DataView(buffer);
  const writeStr = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + out.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, out.length * 2, true);
  let o = 44;
  for (let i = 0; i < out.length; i++, o += 2) {
    let s = Math.max(-1, Math.min(1, out[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export function useRecorder(): Recorder {
  const [isRecording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const levelsRef = useRef<number[]>([]);

  const isSupported =
    typeof window !== "undefined" &&
    !!navigator?.mediaDevices?.getUserMedia &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

  const tick = useCallback(() => {
    setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    nodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    nodeRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    chunksRef.current = [];
    levelsRef.current = [];
    setLevels([]);
    setSeconds(0);
    setLevel(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const node = ctx.createScriptProcessor(4096, 1, 1);
      nodeRef.current = node;
      node.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(input));
        // Peak level
        let peak = 0;
        for (let i = 0; i < input.length; i++) {
          const v = Math.abs(input[i]);
          if (v > peak) peak = v;
        }
        setLevel(peak);
        levelsRef.current.push(peak);
        if (levelsRef.current.length > 48) levelsRef.current.shift();
        setLevels([...levelsRef.current]);
      };
      source.connect(node);
      node.connect(ctx.destination);
      startRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
      setRecording(true);
    } catch (e) {
      setError((e as Error).message || "Microphone access denied");
      cleanup();
      setRecording(false);
    }
  }, [cleanup, tick]);

  const stop = useCallback(async () => {
    if (!ctxRef.current) return null;
    const sr = ctxRef.current.sampleRate;
    const chunks = chunksRef.current;
    cleanup();
    setRecording(false);
    if (!chunks.length) return null;
    const blob = encodeWav(chunks, sr);
    if (blob.size < 2048) return null;
    return blob;
  }, [cleanup]);

  const cancel = useCallback(() => {
    cleanup();
    setRecording(false);
    chunksRef.current = [];
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);

  return { isRecording, isSupported, seconds, level, levels, error, start, stop, cancel };
}