import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/voice/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 503 });
        }
        let body: { text?: string; voiceId?: string };
        try {
          body = (await request.json()) as { text?: string; voiceId?: string };
        } catch {
          return Response.json({ error: "Expected JSON body" }, { status: 400 });
        }
        const text = (body.text || "").trim();
        if (!text) return Response.json({ error: "Missing 'text'" }, { status: 400 });
        if (text.length > 1200) {
          return Response.json({ error: "Text too long" }, { status: 413 });
        }
        const voiceId =
          body.voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
        const modelId = process.env.ELEVENLABS_TTS_MODEL || "eleven_turbo_v2_5";

        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "content-type": "application/json",
              accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text,
              model_id: modelId,
              voice_settings: { stability: 0.4, similarity_boost: 0.75 },
            }),
          },
        );
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error("ElevenLabs TTS failed", res.status, detail);
          return Response.json(
            { error: `TTS failed (${res.status})`, detail: detail.slice(0, 500) },
            { status: 502 },
          );
        }
        return new Response(res.body, {
          headers: {
            "content-type": "audio/mpeg",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});