export type MandorOrderFlowState = {
  approved: boolean;
  proposalSubmitted: boolean;
  clientApproved: boolean;
};

export type MandorOrderPhase =
  | "pending"
  | "approved"
  | "proposal_submitted"
  | "client_approved";

const STORAGE_KEY = "mandorin-mandor-order-flow-v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readFlowMap = (): Record<string, MandorOrderFlowState> => {
  if (typeof localStorage === "undefined") {
    return {};
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return {};
    }

    const nextMap: Record<string, MandorOrderFlowState> = {};

    for (const [id, value] of Object.entries(parsed)) {
      if (!isRecord(value)) {
        continue;
      }

      nextMap[id] = {
        approved: Boolean(value.approved),
        proposalSubmitted: Boolean(value.proposalSubmitted),
        clientApproved: Boolean(value.clientApproved),
      };
    }

    return nextMap;
  } catch {
    return {};
  }
};

const writeFlowMap = (map: Record<string, MandorOrderFlowState>) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

export const getMandorOrderFlow = (
  orderId: string,
): MandorOrderFlowState | null => {
  const map = readFlowMap();
  return map[orderId] ?? null;
};

export const setMandorOrderFlow = (
  orderId: string,
  patch: Partial<MandorOrderFlowState>,
) => {
  const map = readFlowMap();
  const current = map[orderId] ?? {
    approved: false,
    proposalSubmitted: false,
    clientApproved: false,
  };

  map[orderId] = {
    approved: patch.approved ?? current.approved,
    proposalSubmitted: patch.proposalSubmitted ?? current.proposalSubmitted,
    clientApproved: patch.clientApproved ?? current.clientApproved,
  };

  writeFlowMap(map);
};

export const resolveMandorOrderPhase = (
  orderId: string,
  fallback: "pending" | "approved",
): MandorOrderPhase => {
  const flow = getMandorOrderFlow(orderId);

  if (!flow) {
    return fallback;
  }

  if (flow.clientApproved) {
    return "client_approved";
  }

  if (flow.proposalSubmitted) {
    return "proposal_submitted";
  }

  if (flow.approved) {
    return "approved";
  }

  return "pending";
};
