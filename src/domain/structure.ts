// Pure-TS helpers for the No Cap demo. No framework imports.

export type CampaignDraft = {
  title?: string;
  brief: string;
  guidelines?: string;
  poolEur?: number;
  targetCpa?: number;
  signupWeight?: number; // 0..1
};

const CURRENCY_RE = /(?:€|eur|euros?)\s*([\d]+(?:[.,]\d+)?)\s*(k|thousand|m|million)?|([\d]+(?:[.,]\d+)?)\s*(k|thousand|m|million)?\s*(?:€|eur|euros?)/gi;

function normalizeAmount(numStr: string, mult?: string): number {
  const n = parseFloat(numStr.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  const m = (mult || "").toLowerCase();
  if (m === "k" || m === "thousand") return Math.round(n * 1000);
  if (m === "m" || m === "million") return Math.round(n * 1_000_000);
  return Math.round(n);
}

function findAmounts(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(CURRENCY_RE)) {
    const num = m[1] ?? m[3];
    const mult = m[2] ?? m[4];
    if (num) out.push(normalizeAmount(num, mult));
  }
  return out;
}

function findCpa(text: string): number | undefined {
  // "target CPA of 12", "12 EUR per signup", "€8 per sign up"
  const re = /(?:cpa|per\s+(?:signup|sign\s?up|conversion|install))[^\d€]{0,20}([\d]+(?:[.,]\d+)?)/i;
  const m = re.exec(text);
  if (m) return normalizeAmount(m[1]);
  const re2 = /([\d]+(?:[.,]\d+)?)\s*(?:€|eur|euros?)\s*(?:per|\/)\s*(?:signup|sign\s?up|conversion|install)/i;
  const m2 = re2.exec(text);
  if (m2) return normalizeAmount(m2[1]);
  return undefined;
}

function firstSentences(text: string, n: number): string {
  const parts = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  return parts.slice(0, n).join(" ");
}

function guessTitle(text: string): string | undefined {
  const m = /(?:campaign|launch|drop|promo|for)\s+(?:for\s+)?([A-Z][\w&' -]{2,40})/.exec(text);
  if (m) return m[1].trim();
  return undefined;
}

export function structureCampaignDraft(transcript: string): CampaignDraft {
  const text = (transcript || "").trim();
  if (!text) return { brief: "" };

  const amounts = findAmounts(text);
  const targetCpa = findCpa(text);

  // Pool = largest EUR amount that isn't the CPA
  let poolEur: number | undefined;
  const poolCandidates = amounts.filter((a) => a !== targetCpa && a >= 100);
  if (poolCandidates.length) poolEur = Math.max(...poolCandidates);

  // Weight heuristic: signups vs reach
  const lc = text.toLowerCase();
  const signupKw = (lc.match(/\b(signup|sign\s?up|conversion|install|trial|order|purchase|sale)\b/g) || []).length;
  const reachKw = (lc.match(/\b(reach|impression|view|awareness|brand|eyeballs)\b/g) || []).length;
  let signupWeight = 0.7;
  if (signupKw + reachKw > 0) {
    signupWeight = Math.max(0.3, Math.min(0.9, (signupKw + 1) / (signupKw + reachKw + 2)));
    signupWeight = Math.round(signupWeight * 10) / 10;
  }

  const guidelines =
    "Disclose partnership (#ad / Werbung) per platform rules. Keep the pitch honest to your voice; No Cap tracks results via your unique link.";

  return {
    title: guessTitle(text),
    brief: firstSentences(text, 5) || text,
    guidelines,
    poolEur,
    targetCpa,
    signupWeight,
  };
}

export function maxSeats(poolEur: number, targetCpa: number): number {
  if (!poolEur || !targetCpa || targetCpa <= 0) return 0;
  return Math.floor(poolEur / targetCpa);
}

// ---------- Single-field parsers for the conversational voice agent ----------

export function parseAmount(text: string): number | undefined {
  const amounts = findAmounts(text);
  if (amounts.length) return Math.max(...amounts);
  const m = /([\d]+(?:[.,]\d+)?)\s*(k|thousand|m|million)?/i.exec(text);
  if (m) return normalizeAmount(m[1], m[2]);
  return undefined;
}

export function parseCpa(text: string): number | undefined {
  const cpa = findCpa(text);
  if (cpa) return cpa;
  return parseAmount(text);
}

export function parseWeight(text: string): number | undefined {
  const lc = text.toLowerCase();
  const pct = /([\d]{1,3})\s*%/.exec(lc);
  if (pct) {
    const n = Math.max(0, Math.min(100, parseInt(pct[1], 10)));
    return Math.round(n) / 100;
  }
  const signupKw = /\b(signup|sign\s?up|conversion|install|sale|order|purchase|trial)\b/.test(lc);
  const reachKw = /\b(reach|impression|view|awareness|brand|eyeballs)\b/.test(lc);
  if (signupKw && !reachKw) return 0.8;
  if (reachKw && !signupKw) return 0.3;
  if (/both|balanced|mix|even/.test(lc)) return 0.5;
  return undefined;
}

export function parseMode(text: string): "yolo" | "surgical" | undefined {
  const lc = text.toLowerCase();
  if (/\byolo\b|open|first[- ]?come|instantly|anyone/.test(lc)) return "yolo";
  if (/surgical|review|apply|application|curated|hand[- ]?pick|select/.test(lc)) return "surgical";
  return undefined;
}

// Weighted settlement across participants. Returns per-creator ledger lines with 7% fee.
export type SettleInput = {
  poolEur: number;
  weights: { signups: number; impressions: number };
  feeRate?: number; // default 0.07
  participants: Array<{ creatorId: string; signups: number; impressions: number }>;
};
export type SettleLine = { creatorId: string; grossEur: number; feeEur: number; netEur: number };

export function settle({ poolEur, weights, feeRate = 0.07, participants }: SettleInput): SettleLine[] {
  if (!participants.length || poolEur <= 0) return [];
  const totalSignups = participants.reduce((s, p) => s + p.signups, 0) || 1;
  const totalImp = participants.reduce((s, p) => s + p.impressions, 0) || 1;
  return participants.map((p) => {
    const share =
      weights.signups * (p.signups / totalSignups) +
      weights.impressions * (p.impressions / totalImp);
    const gross = Math.round(poolEur * share * 100) / 100;
    const fee = Math.round(gross * feeRate * 100) / 100;
    const net = Math.round((gross - fee) * 100) / 100;
    return { creatorId: p.creatorId, grossEur: gross, feeEur: fee, netEur: net };
  });
}