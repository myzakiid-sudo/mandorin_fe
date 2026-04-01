"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { AppButton } from "@/components/ui/app-button";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { TableStateRow } from "@/components/ui/table-state-row";
import { useAuth } from "@/context/auth-context";
import type { Appointment } from "@/lib/appointment-api";
import { getClientDisplayByUserId } from "@/lib/client-api";
import {
  type MandorOrderPhase,
  resolveMandorOrderPhase,
} from "@/lib/mandor-order-flow";
import { useAppointments } from "@/hooks/use-appointments";
import { useAsyncQuery } from "@/hooks/use-async-query";

type OrderTab = "berlangsung" | "selesai";

const isCompletedStatus = (status: Appointment["status"]) =>
  status === "SELESAI" || status === "DITOLAK";

const formatDate = (rawDate: string) => {
  const parsed = new Date(rawDate);

  if (Number.isNaN(parsed.getTime())) {
    return rawDate;
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const ORDER_TAB_OPTIONS: Array<{ value: OrderTab; label: string }> = [
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
];

const getOrderPhaseClassName = (phase: MandorOrderPhase) => {
  if (phase === "approved") {
    return "bg-[var(--green-normal)] text-[var(--text-white)]";
  }

  if (phase === "proposal_submitted") {
    return "bg-[var(--orange-normal)] text-[var(--text-white)]";
  }

  if (phase === "client_approved") {
    return "bg-[var(--blue-normal-active)] text-[var(--text-white)]";
  }

  return "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]";
};

export default function MandorPesananPage() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderTab>("berlangsung");
  const handleAuthError = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  const {
    data: appointments,
    loading,
    error: errorMessage,
  } = useAppointments({ onAuthError: handleAuthError });

  const clientIds = useMemo(
    () =>
      Array.from(
        new Set(
          appointments
            .map((item) => item.client_id)
            .filter((id) => Number.isFinite(id)),
        ),
      ),
    [appointments],
  );

  const lookupKey = useMemo(() => clientIds.join(","), [clientIds]);

  const { data: clientLookupRaw } = useAsyncQuery<
    Record<number, { name: string; avatar: string | null }>
  >({
    initialData: {},
    enabled: clientIds.length > 0,
    deps: [lookupKey, appointments],
    queryFn: async () => {
      const entries = await Promise.all(
        clientIds.map(async (clientId) => {
          const clientFromAppointment = appointments.find(
            (item) => item.client_id === clientId,
          );

          if (clientFromAppointment?.client_name) {
            return [
              clientId,
              {
                name: clientFromAppointment.client_name,
                avatar: clientFromAppointment.client_avatar ?? null,
              },
            ] as const;
          }

          const client = await getClientDisplayByUserId(String(clientId));

          return [
            clientId,
            {
              name: client?.name?.trim() || `Client #${clientId}`,
              avatar: client?.avatar?.trim() || null,
            },
          ] as const;
        }),
      );

      return Object.fromEntries(entries);
    },
  });

  const clientLookup = useMemo(
    () => (clientIds.length ? clientLookupRaw : {}),
    [clientIds.length, clientLookupRaw],
  );

  const orderList = useMemo(
    () =>
      appointments
        .filter((appointment) =>
          activeTab === "berlangsung"
            ? !isCompletedStatus(appointment.status)
            : isCompletedStatus(appointment.status),
        )
        .map((order) => {
          const phase = resolveMandorOrderPhase(
            String(order.id),
            order.status === "DISETUJUI" ? "approved" : "pending",
          );

          return {
            ...order,
            phase,
          };
        }),
    [activeTab, appointments],
  );

  const statusLabel: Record<MandorOrderPhase, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    proposal_submitted: "Proposal Dikirim",
    client_approved: "Disetujui Klien",
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[0.75rem] bg-[var(--white-normal)] p-[1rem] md:p-[1.5rem]">
          <h1 className="text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)]">
            Riwayat Pesanan
          </h1>

          <SegmentedTabs
            value={activeTab}
            options={ORDER_TAB_OPTIONS}
            onChange={setActiveTab}
            className="mt-[0.75rem]"
          />

          <div className="mt-[1rem] overflow-hidden rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse">
                <thead className="bg-[var(--orange-normal)] text-[var(--text-white)]">
                  <tr>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Nama
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Tanggal
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Status
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-right text-[1.125rem] font-semibold leading-[1.75rem]">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <TableStateRow
                      colSpan={4}
                      message="Memuat data pesanan..."
                    />
                  ) : null}

                  {!loading && errorMessage ? (
                    <TableStateRow
                      colSpan={4}
                      tone="danger"
                      message={errorMessage}
                    />
                  ) : null}

                  {!loading && !errorMessage && !orderList.length ? (
                    <TableStateRow
                      colSpan={4}
                      message="Belum ada data pesanan."
                    />
                  ) : null}

                  {!loading &&
                    !errorMessage &&
                    orderList.map((order) => {
                      const clientSummary = clientLookup[order.client_id];
                      const clientName =
                        clientSummary?.name || `Client #${order.client_id}`;
                      const clientAvatar =
                        clientSummary?.avatar || "/images/logo-mandorin.svg";

                      return (
                        <tr
                          key={`${activeTab}-${order.id}`}
                          className="border-t border-[var(--black-light)]"
                        >
                          <td className="px-[1rem] py-[0.5rem]">
                            <div className="flex items-center gap-[0.75rem]">
                              <div className="relative h-[2.75rem] w-[2.75rem] overflow-hidden rounded-full">
                                <Image
                                  src={clientAvatar}
                                  alt={clientName}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <p className="text-[1.125rem] font-medium leading-[1.75rem] text-[var(--text-black)]">
                                  {clientName}
                                </p>
                                <p className="text-[0.875rem] leading-[1.25rem] text-[var(--text-muted)]">
                                  {order.location}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-[1rem] py-[0.5rem] text-[1.125rem] leading-[1.75rem] text-[var(--text-secondary)]">
                            {formatDate(order.date)}
                          </td>

                          <td className="px-[1rem] py-[0.5rem]">
                            <span
                              className={`inline-flex min-w-[6.5rem] justify-center rounded-[0.5rem] px-[0.875rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] ${getOrderPhaseClassName(order.phase)}`}
                            >
                              {statusLabel[order.phase]}
                            </span>
                          </td>

                          <td className="px-[1rem] py-[0.5rem] text-right">
                            {order.phase === "pending" ? (
                              <Link
                                href={`/dashboard/mandor/pesanan/${order.id}`}
                                className="inline-flex min-w-[6.75rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                              >
                                Detail
                              </Link>
                            ) : order.phase === "approved" ? (
                              <Link
                                href={`/dashboard/mandor/pesanan/${order.id}/target`}
                                className="inline-flex min-w-[6.75rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                              >
                                Buat Proposal
                              </Link>
                            ) : order.phase === "proposal_submitted" ? (
                              <AppButton type="button" disabled variant="ghost">
                                Menunggu Klien
                              </AppButton>
                            ) : (
                              <Link
                                href={`/dashboard/mandor/projects/${order.id}`}
                                className="inline-flex min-w-[6.75rem] justify-center rounded-[0.5rem] border border-[var(--orange-normal)] bg-white px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
                              >
                                Masuk Proyek
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="h-[12rem] w-full bg-[var(--white-normal)] md:h-[14rem]" />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
