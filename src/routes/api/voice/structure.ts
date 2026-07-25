import { createFileRoute } from "@tanstack/react-router";
import { structureCampaignDraft } from "@/domain/structure";

export const Route = createFileRoute("/api/voice/structure")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "ELEVENLABS_API_KEY not configured" },
            { status: 503 },
          );
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
        }
        const audio = form.get("audio") as unknown as Blob | File | null;
        if (!audio || typeof (audio as Blob).arrayBuffer !== "function") {
          return Response.json({ error: "Missing 'audio' file" }, { status: 400 });
        }
        const size = (audio as Blob).size;
        if (!size || size < 2048) {
          return Response.json({ error: "Recording is empty or too short" }, { status: 400 });
        }
        if (size > 25 * 1024 * 1024) {
          return Response.json({ error: "Recording too large (max 25MB)" }, { status: 413 });
        }

        // Forward to ElevenLabs STT
        const upstream = new FormData();
        const filename = (audio as File).name || "recording.wav";
        upstream.append("file", audio as Blob, filename);
        upstream.append("model_id", process.env.ELEVENLABS_STT_MODEL || "scribe_v1");
        upstream.append("tag_audio_events", "false");
        upstream.append("diarize", "false");

        const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
          method: "POST",
          headers: { "xi-api-key": apiKey },
          body: upstream,
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error("ElevenLabs STT failed", res.status, body);
          return Response.json(
            { error: `Transcription failed (${res.status})`, detail: body.slice(0, 500) },
            { status: 502 },
          );
        }

        const data = (await res.json()) as { text?: string };
        const transcript = (data.text || "").trim();
        if (!transcript) {
          return Response.json({ error: "Empty transcript" }, { status: 422 });
        }
        const draft = structureCampaignDraft(transcript);
        return Response.json({ transcript, draft });
      },
    },
  },
});