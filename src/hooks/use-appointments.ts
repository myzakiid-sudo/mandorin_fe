"use client";

import { useCallback } from "react";

import {
  AppointmentAuthError,
  type Appointment,
  getAppointments,
} from "@/lib/appointment-api";
import { useAsyncQuery } from "@/hooks/use-async-query";

type UseAppointmentsOptions = {
  onAuthError?: () => void;
  fallbackMessage?: string;
};

export function useAppointments({
  onAuthError,
  fallbackMessage = "Gagal memuat daftar pesanan.",
}: UseAppointmentsOptions = {}) {
  const queryFn = useCallback(async () => {
    return getAppointments();
  }, []);

  const mapError = useCallback(
    (error: unknown) => {
      if (error instanceof AppointmentAuthError) {
        onAuthError?.();
        return "Sesi login berakhir. Silakan login ulang.";
      }

      return error instanceof Error ? error.message : fallbackMessage;
    },
    [fallbackMessage, onAuthError],
  );

  return useAsyncQuery<Appointment[]>({
    initialData: [],
    queryFn,
    mapError,
  });
}
