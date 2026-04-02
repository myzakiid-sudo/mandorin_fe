"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { AppButton } from "@/components/ui/app-button";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { TableQueryStateRows } from "@/components/ui/table-query-state-rows";
import { useAuth } from "@/context/auth-context";
import {
  isAppointmentCompletedStatus,
  normalizeAppointmentStatus,
  type Appointment,
} from "@/lib/appointment-api";
import { getClientDisplayByUserId } from "@/lib/client-api";
import {
  isProposalApprovedStatus,
  isProposalPendingStatus,
  resolveProposalForOrder,
} from "@/lib/proposal-api";
import { formatDateId } from "@/lib/utils";
import { useAppointments } from "@/hooks/use-appointments";
import { useAsyncQuery } from "@/hooks/use-async-query";
import { useProposals } from "@/hooks/use-proposals";

type MandorOrderPhase =
  | "pending"
  | "approved"
  | "proposal_submitted"
  | "client_approved"
  | "completed"
  | "rejected";

type OrderTab = "berlangsung" | "selesai";

const isCompletedStatus = (status: Appointment["status"]) =>
  isAppointmentCompletedStatus(status);

const ORDER_TAB_OPTIONS: Array<{ value: OrderTab; label: string }> = [
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
];

const resolvePhaseFromServer = (
  appointmentStatus: Appointment["status"],
  proposalStatus?: string,
): MandorOrderPhase => {
  const normalizedAppointmentStatus =
    normalizeAppointmentStatus(appointmentStatus);

  if (normalizedAppointmentStatus === "SELESAI") {
    return "completed";
  }

  if (normalizedAppointmentStatus === "DITOLAK") {
    return "rejected";
  }

  if (normalizedAppointmentStatus !== "DISETUJUI") {
    return "pending";
  }

  if (isProposalApprovedStatus(proposalStatus)) {
    return "client_approved";
  }

  if (isProposalPendingStatus(proposalStatus)) {
    return "proposal_submitted";
  }

  return "approved";
};

const getOrderPhaseClassName = (phase: MandorOrderPhase) => {
  if (phase === "completed") {
    return "bg-[var(--green-normal)] text-[var(--text-white)]";
  }

  if (phase === "rejected") {
    return "bg-[var(--red-normal)] text-[var(--text-white)]";
  }

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

  const { data: proposals } = useProposals({ onAuthError: handleAuthError });

  const orderList = useMemo(
    () =>
      appointments
        .filter((appointment) =>
          activeTab === "berlangsung"
            ? !isCompletedStatus(appointment.status)
            : isCompletedStatus(appointment.status),
        )
        .map((order) => {
          const matchedProposal = resolveProposalForOrder(order, proposals);
          const phase = resolvePhaseFromServer(
            order.status,
            matchedProposal?.status,
          );

          return {
            ...order,
            phase,
          };
        }),
    [activeTab, appointments, proposals],
  );

  const statusLabel: Record<MandorOrderPhase, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    proposal_submitted: "Proposal Dikirim",
    client_approved: "Disetujui Klien",
    completed: "Selesai",
    rejected: "Ditolak",
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
                  <TableQueryStateRows
                    loading={loading}
                    error={errorMessage}
                    isEmpty={!orderList.length}
                    colSpan={4}
                    loadingMessage="Memuat data pesanan..."
                    emptyMessage="Belum ada data pesanan."
                  />

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
                            {formatDateId(order.date)}
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
                                href={`/dashboard/mandor/pesanan/${order.id}/target?clientId=${order.client_id}&foremanId=${order.foreman_id}`}
                                className="inline-flex min-w-[6.75rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                              >
                                Buat Proposal
                              </Link>
                            ) : order.phase === "proposal_submitted" ? (
                              <AppButton type="button" disabled variant="ghost">
                                Menunggu Klien
                              </AppButton>
                            ) : order.phase === "rejected" ? (
                              <AppButton type="button" disabled variant="ghost">
                                Ditolak
                              </AppButton>
                            ) : (
                              <Link
                                href="/dashboard/mandor/projects"
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
