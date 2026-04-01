"use client";

import { useEffect, useMemo, useState } from "react";

type UseAsyncQueryOptions<TData> = {
  enabled?: boolean;
  initialData: TData;
  deps?: ReadonlyArray<unknown>;
  queryFn: () => Promise<TData>;
  mapError?: (error: unknown) => string;
};

export function useAsyncQuery<TData>({
  enabled = true,
  initialData,
  deps = [],
  queryFn,
  mapError,
}: UseAsyncQueryOptions<TData>) {
  const [data, setData] = useState<TData>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [reloadSeed, setReloadSeed] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const nextData = await queryFn();

        if (cancelled) {
          return;
        }

        setData(nextData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = mapError
          ? mapError(error)
          : error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat data.";

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, reloadSeed, ...deps]);

  const refetch = useMemo(
    () => () => {
      setReloadSeed((prev) => prev + 1);
    },
    [],
  );

  return {
    data,
    setData,
    loading,
    error,
    setError,
    refetch,
  };
}
