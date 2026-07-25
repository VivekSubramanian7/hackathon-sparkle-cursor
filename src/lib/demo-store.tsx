import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { maxSeats, settle, type SettleLine } from "@/domain/structure";

export type CampaignStatus =
  | "draft"
  | "funded"
  | "recruiting"
  | "live"
  | "measuring"
  | "settled"
  | "cancelled";

export type Campaign = {
  id: string;
  title: string;
  brandName: string;
  brief: string;
  guidelines: string;
  status: CampaignStatus;
  mode: "yolo" | "surgical";
  poolEur: number;
  targetCpa: number;
  weights: { signups: number; impressions: number };
  maxSeats: number;
  seatsFilled: number;
  startsAt: string;
  endsAt: string;
};

export type Participation = {
  id: string;
  campaignId: string;
  creatorId: string;
  state: "joined" | "applied" | "accepted" | "rejected";
  trackingCode: string;
};

export type MetricEvent = { campaignId: string; creatorId: string; signups: number; impressions: number };
export type LedgerLine = SettleLine & { campaignId: string };

type State = {
  campaigns: Campaign[];
  participations: Participation[];
  metrics: MetricEvent[];
  ledger: LedgerLine[];
  role: "brand" | "creator";
};

const KEY = "nocap-demo-v1";
const DEMO_CREATOR = "creator_demo";

function seed(): State {
  return {
    role: "brand",
    campaigns: [
      {
        id: "camp_seed_1",
        title: "Magic Spoon summer refresh",
        brandName: "Magic Spoon",
        brief: "Push our new cinnamon flavor with real breakfast moments. UGC only, no scripts.",
        guidelines: "Disclose partnership (#ad). Show the box, taste, and reaction. 15-30s.",
        status: "settled",
        mode: "yolo",
        poolEur: 20000,
        targetCpa: 10,
        weights: { signups: 0.7, impressions: 0.3 },
        maxSeats: 2000,
        seatsFilled: 42,
        startsAt: new Date(Date.now() - 14 * 864e5).toISOString(),
        endsAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      },
    ],
    participations: [],
    metrics: [],
    ledger: [],
  };
}

function load(): State {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as State;
  } catch {
    return seed();
  }
}

function save(state: State) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

type Ctx = {
  state: State;
  createDraft: (input: {
    title: string;
    brandName: string;
    brief: string;
    guidelines: string;
    mode: "yolo" | "surgical";
    poolEur: number;
    targetCpa: number;
    signupWeight: number;
  }) => Campaign;
  fundCampaign: (id: string) => Promise<void>;
  yoloJoin: (campaignId: string, creatorId?: string) => void;
  surgicalApply: (campaignId: string, creatorId?: string) => void;
  advanceDemo: (id: string) => void;
  ingestMockMetrics: (id: string) => void;
  settleCampaign: (id: string) => void;
  surgicalAccept: (campaignId: string, participationId: string) => void;
  surgicalReject: (campaignId: string, participationId: string) => void;
  setRole: (role: "brand" | "creator") => void;
  resetDemo: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => seed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  const createDraft: Ctx["createDraft"] = useCallback((input) => {
    const c: Campaign = {
      id: id("camp"),
      title: input.title || "Untitled campaign",
      brandName: input.brandName || "Your brand",
      brief: input.brief,
      guidelines: input.guidelines,
      status: "draft",
      mode: input.mode,
      poolEur: input.poolEur,
      targetCpa: input.targetCpa,
      weights: {
        signups: input.signupWeight,
        impressions: Math.max(0, Math.min(1, 1 - input.signupWeight)),
      },
      maxSeats: maxSeats(input.poolEur, input.targetCpa),
      seatsFilled: 0,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 14 * 864e5).toISOString(),
    };
    setState((s) => ({ ...s, campaigns: [c, ...s.campaigns] }));
    return c;
  }, []);

  const fundCampaign: Ctx["fundCampaign"] = useCallback(async (cid) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => (c.id === cid ? { ...c, status: "funded" } : c)),
    }));
    await new Promise((r) => setTimeout(r, 900));
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => (c.id === cid ? { ...c, status: "recruiting" } : c)),
    }));
  }, []);

  const yoloJoin: Ctx["yoloJoin"] = useCallback((cid, creatorId = DEMO_CREATOR) => {
    setState((s) => {
      const camp = s.campaigns.find((c) => c.id === cid);
      if (!camp || camp.seatsFilled >= camp.maxSeats) return s;
      const p: Participation = {
        id: id("part"),
        campaignId: cid,
        creatorId,
        state: "joined",
        trackingCode: `nc-${cid.slice(-4)}-${creatorId.slice(-4)}`,
      };
      return {
        ...s,
        participations: [...s.participations, p],
        campaigns: s.campaigns.map((c) => (c.id === cid ? { ...c, seatsFilled: c.seatsFilled + 1 } : c)),
      };
    });
  }, []);

  const surgicalApply: Ctx["surgicalApply"] = useCallback((cid, creatorId = DEMO_CREATOR) => {
    setState((s) => ({
      ...s,
      participations: [
        ...s.participations,
        {
          id: id("part"),
          campaignId: cid,
          creatorId,
          state: "applied",
          trackingCode: `nc-${cid.slice(-4)}-${creatorId.slice(-4)}`,
        },
      ],
    }));
  }, []);

  const advanceDemo: Ctx["advanceDemo"] = useCallback((cid) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => {
        if (c.id !== cid) return c;
        const next: CampaignStatus =
          c.status === "recruiting" ? "live" : c.status === "live" ? "measuring" : c.status;
        return { ...c, status: next };
      }),
    }));
  }, []);

  const ingestMockMetrics: Ctx["ingestMockMetrics"] = useCallback((cid) => {
    setState((s) => {
      const parts = s.participations.filter(
        (p) => p.campaignId === cid && (p.state === "joined" || p.state === "accepted"),
      );
      const events: MetricEvent[] = parts.map((p, i) => ({
        campaignId: cid,
        creatorId: p.creatorId,
        signups: 40 + ((i * 37) % 180),
        impressions: 12000 + ((i * 1319) % 40000),
      }));
      const filtered = s.metrics.filter((m) => m.campaignId !== cid);
      return { ...s, metrics: [...filtered, ...events] };
    });
  }, []);

  const settleCampaign: Ctx["settleCampaign"] = useCallback((cid) => {
    setState((s) => {
      const camp = s.campaigns.find((c) => c.id === cid);
      if (!camp) return s;
      // Idempotent: if already settled with ledger lines, no-op
      if (s.ledger.some((l) => l.campaignId === cid) && camp.status === "settled") return s;
      const events = s.metrics.filter((m) => m.campaignId === cid);
      const lines = settle({
        poolEur: camp.poolEur,
        weights: camp.weights,
        participants: events.map((e) => ({
          creatorId: e.creatorId,
          signups: e.signups,
          impressions: e.impressions,
        })),
      }).map((l) => ({ ...l, campaignId: cid }));
      const filtered = s.ledger.filter((l) => l.campaignId !== cid);
      return {
        ...s,
        ledger: [...filtered, ...lines],
        campaigns: s.campaigns.map((c) => (c.id === cid ? { ...c, status: "settled" } : c)),
      };
    });
  }, []);

  const surgicalAccept: Ctx["surgicalAccept"] = useCallback((cid, pid) => {
    setState((s) => {
      const camp = s.campaigns.find((c) => c.id === cid);
      if (!camp) return s;
      if (camp.seatsFilled >= camp.maxSeats) return s;
      return {
        ...s,
        participations: s.participations.map((p) =>
          p.id === pid ? { ...p, state: "accepted" } : p,
        ),
        campaigns: s.campaigns.map((c) =>
          c.id === cid ? { ...c, seatsFilled: c.seatsFilled + 1 } : c,
        ),
      };
    });
  }, []);

  const surgicalReject: Ctx["surgicalReject"] = useCallback((cid, pid) => {
    setState((s) => ({
      ...s,
      participations: s.participations.map((p) =>
        p.id === pid && p.campaignId === cid ? { ...p, state: "rejected" } : p,
      ),
    }));
  }, []);

  const setRole: Ctx["setRole"] = useCallback((role) => setState((s) => ({ ...s, role })), []);
  const resetDemo = useCallback(() => setState(seed()), []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      createDraft,
      fundCampaign,
      yoloJoin,
      surgicalApply,
      advanceDemo,
      ingestMockMetrics,
      settleCampaign,
      surgicalAccept,
      surgicalReject,
      setRole,
      resetDemo,
    }),
    [state, createDraft, fundCampaign, yoloJoin, surgicalApply, advanceDemo, ingestMockMetrics, settleCampaign, surgicalAccept, surgicalReject, setRole, resetDemo],
  );

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemoStore must be used inside <DemoStoreProvider>");
  return ctx;
}