"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const queryFnRef = useRef(queryFn);
  const mapErrorRef = useRef(mapError);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    mapErrorRef.current = mapError;
  }, [mapError]);

  const depsSignature = useMemo(() => {
    return deps
      .map((value, index) => {
        if (value == null) {
          return `${index}:null`;
        }

        if (typeof value === "string" || typeof value === "number") {
          return `${index}:${String(value)}`;
        }

        if (typeof value === "boolean") {
          return `${index}:${value ? "1" : "0"}`;
        }

        try {
          return `${index}:${JSON.stringify(value)}`;
        } catch {
          return `${index}:${String(value)}`;
        }
      })
      .join("|");
  }, [deps]);

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
        const nextData = await queryFnRef.current();

        if (cancelled) {
          return;
        }

        setData(nextData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = mapErrorRef.current
          ? mapErrorRef.current(error)
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
  }, [enabled, reloadSeed, depsSignature]);

  const refetch = useCallback(() => {
    setReloadSeed((prev) => prev + 1);
  }, []);

  return {
    data,
    setData,
    loading,
    error,
    setError,
    refetch,
  };
}
