"use client";

import { useCallback } from "react";

import {
  getProposals,
  ProposalAuthError,
  type Proposal,
} from "@/lib/proposal-api";
import { useAsyncQuery } from "@/hooks/use-async-query";

type UseProposalsOptions = {
  onAuthError?: () => void;
  enabled?: boolean;
  deps?: ReadonlyArray<unknown>;
};

export function useProposals({
  onAuthError,
  enabled = true,
  deps = [],
}: UseProposalsOptions = {}) {
  const queryFn = useCallback(async () => {
    try {
      return await getProposals();
    } catch (error) {
      if (error instanceof ProposalAuthError) {
        onAuthError?.();
        return [];
      }

      throw error;
    }
  }, [onAuthError]);

  return useAsyncQuery<Proposal[]>({
    initialData: [],
    enabled,
    deps,
    queryFn,
  });
}
