"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { TableQueryStateRows } from "@/components/ui/table-query-state-rows";
import { useAuth } from "@/context/auth-context";
import {
  isAppointmentCompletedStatus,
  normalizeAppointmentStatus,
  type Appointment,
} from "@/lib/appointment-api";
import { getForemanById } from "@/lib/foreman-api";
import {
  type Proposal,
  normalizeProposalStatus,
  resolveProposalForOrder,
} from "@/lib/proposal-api";
import { formatDateId } from "@/lib/utils";
import { useAppointments } from "@/hooks/use-appointments";
import { useAsyncQuery } from "@/hooks/use-async-query";
import { useProposals } from "@/hooks/use-proposals";

type OrderTab = "berlangsung" | "selesai";

const isCompletedStatus = (status: Appointment["status"]) =>
  isAppointmentCompletedStatus(status);

const getStatusLabel = (status: Appointment["status"]) => {
  const normalized = normalizeAppointmentStatus(status);

  if (normalized === "DISETUJUI") {
    return "Disetujui";
  }

  if (normalized === "DITOLAK") {
    return "Ditolak";
  }

  if (normalized === "SELESAI") {
    return "Selesai";
  }

  return "Menunggu";
};

const ORDER_TAB_OPTIONS: Array<{ value: OrderTab; label: string }> = [
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
];

const getStatusClassName = (status: Appointment["status"]) => {
  const normalized = normalizeAppointmentStatus(status);

  if (normalized === "DISETUJUI") {
    return "bg-[var(--green-normal)] text-[var(--text-white)]";
  }

  if (normalized === "DITOLAK") {
    return "bg-[var(--red-normal)] text-[var(--text-white)]";
  }

  return "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]";
};

const getProposalStatusMeta = (status?: string) => {
  const normalizedStatus = normalizeProposalStatus(status);

  if (normalizedStatus === "DIBAYAR") {
    return {
      label: "Dibayar",
      className: "bg-[var(--blue-normal-active)] text-[var(--text-white)]",
    };
  }

  if (normalizedStatus === "DISETUJUI") {
    return {
      label: "Disetujui",
      className: "bg-[var(--green-normal)] text-[var(--text-white)]",
    };
  }

  if (normalizedStatus === "DITOLAK") {
    return {
      label: "Ditolak",
      className: "bg-[var(--red-normal)] text-[var(--text-white)]",
    };
  }

  if (normalizedStatus === "MENUNGGU PERSETUJUAN") {
    return {
      label: "Menunggu",
      className: "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]",
    };
  }

  return null;
};

export default function ClientPesananPage() {
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

  const foremanIds = useMemo(
    () =>
      Array.from(
        new Set(
          appointments
            .map((item) => item.foreman_id)
            .filter((id) => Number.isFinite(id)),
        ),
      ),
    [appointments],
  );

  const lookupKey = useMemo(() => foremanIds.join(","), [foremanIds]);

  const { data: foremanLookup } = useAsyncQuery<
    Record<number, { name: string; avatar: string | null }>
  >({
    initialData: {},
    enabled: foremanIds.length > 0,
    deps: [lookupKey],
    queryFn: async () => {
      const entries = await Promise.all(
        foremanIds.map(async (foremanId) => {
          const foreman = await getForemanById(String(foremanId));

          return [
            foremanId,
            {
              name: foreman?.name?.trim() || `Mandor #${foremanId}`,
              avatar: foreman?.avatar?.trim() || null,
            },
          ] as const;
        }),
      );

      return Object.fromEntries(entries);
    },
  });

  const { data: proposals } = useProposals({ onAuthError: handleAuthError });

  const proposalByOrder = useMemo(() => {
    const mapping: Record<string, Proposal | null> = {};

    for (const order of appointments) {
      mapping[String(order.id)] = resolveProposalForOrder(order, proposals);
    }

    return mapping;
  }, [appointments, proposals]);

  const orderList = useMemo(
    () =>
      appointments.filter((appointment) =>
        activeTab === "berlangsung"
          ? !isCompletedStatus(appointment.status)
          : isCompletedStatus(appointment.status),
      ),
    [activeTab, appointments],
  );

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

          <div className="mt-[1rem] space-y-3 md:hidden">
            {loading ? (
              <div className="rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-4 py-3 text-[0.875rem] text-[var(--text-secondary)]">
                Memuat data pesanan...
              </div>
            ) : null}

            {!loading && errorMessage ? (
              <div className="rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-[0.875rem] text-[var(--red-normal)]">
                {errorMessage}
              </div>
            ) : null}

            {!loading && !errorMessage && !orderList.length ? (
              <div className="rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-4 py-3 text-[0.875rem] text-[var(--text-secondary)]">
                Belum ada data pesanan.
              </div>
            ) : null}

            {!loading &&
              !errorMessage &&
              orderList.map((order) => {
                const foremanSummary = foremanLookup[order.foreman_id];
                const foremanName =
                  foremanSummary?.name || `Mandor #${order.foreman_id}`;
                const foremanAvatar =
                  foremanSummary?.avatar || "/images/logo-mandorin.svg";

                const matchedProposal = proposalByOrder[String(order.id)];
                const proposalId = matchedProposal
                  ? String(matchedProposal.id)
                  : "";
                const proposalStatusMeta = getProposalStatusMeta(
                  matchedProposal?.status,
                );
                const canCheckProposal =
                  order.status === "DISETUJUI" && Boolean(proposalId);

                return (
                  <article
                    key={order.id}
                    className="rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal)] p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-[2.75rem] w-[2.75rem] overflow-hidden rounded-full">
                        <Image
                          src={foremanAvatar}
                          alt={foremanName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)]">
                          {foremanName}
                        </p>
                        <p className="mt-0.5 text-[0.813rem] leading-[1.25rem] text-[var(--text-muted)]">
                          {order.location}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-[0.875rem] text-[var(--text-secondary)]">
                      <p>Tanggal: {formatDateId(order.date)}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex min-w-[4.875rem] justify-center rounded-[0.5rem] px-[0.875rem] py-[0.375rem] text-[0.875rem] font-semibold leading-[1.25rem] ${getStatusClassName(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>

                      {proposalStatusMeta ? (
                        <span
                          className={`inline-flex h-[2rem] min-w-[6rem] items-center justify-center rounded-[0.5rem] px-[0.75rem] text-[0.75rem] font-semibold ${proposalStatusMeta.className}`}
                        >
                          {proposalStatusMeta.label}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      {canCheckProposal ? (
                        <Link
                          href={`/dashboard/client/pesanan/${order.id}/target${proposalId ? `?proposalId=${proposalId}` : ""}`}
                          className="inline-flex h-[2.5rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[0.875rem] text-[0.938rem] font-semibold text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                        >
                          Cek Proposal
                        </Link>
                      ) : (
                        <span className="inline-flex h-[2.5rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--btn-disabled-bg)] px-[0.875rem] text-[0.938rem] font-semibold text-[var(--btn-disabled-text)]">
                          Cek Proposal
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
          </div>

          <div className="mt-[1rem] hidden overflow-hidden rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse">
                <thead className="bg-[var(--orange-normal)] text-[var(--text-white)]">
                  <tr>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Nama
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Tanggal
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Status
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-right text-[1rem] font-semibold leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.75rem]">
                      Proposal
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
                      const foremanSummary = foremanLookup[order.foreman_id];
                      const foremanName =
                        foremanSummary?.name || `Mandor #${order.foreman_id}`;
                      const foremanAvatar =
                        foremanSummary?.avatar || "/images/logo-mandorin.svg";

                      const matchedProposal = proposalByOrder[String(order.id)];
                      const proposalId = matchedProposal
                        ? String(matchedProposal.id)
                        : "";
                      const proposalStatusMeta = getProposalStatusMeta(
                        matchedProposal?.status,
                      );
                      const canCheckProposal =
                        order.status === "DISETUJUI" && Boolean(proposalId);

                      return (
                        <tr
                          key={order.id}
                          className="border-t border-[var(--black-light)] last:border-b-0"
                        >
                          <td className="px-[1rem] py-[0.5rem]">
                            <div className="flex items-center gap-[0.75rem]">
                              <div className="relative h-[2.75rem] w-[2.75rem] overflow-hidden rounded-full">
                                <Image
                                  src={foremanAvatar}
                                  alt={foremanName}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <p className="text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)] lg:text-[1.125rem] lg:leading-[1.75rem]">
                                  {foremanName}
                                </p>
                                <p className="text-[0.875rem] leading-[1.25rem] text-[var(--text-muted)]">
                                  {order.location}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-[1rem] py-[0.5rem] text-[1rem] leading-[1.5rem] text-[var(--text-secondary)] lg:text-[1.125rem] lg:leading-[1.75rem]">
                            {formatDateId(order.date)}
                          </td>

                          <td className="px-[1rem] py-[0.5rem]">
                            <span
                              className={`inline-flex min-w-[4.875rem] justify-center rounded-[0.5rem] px-[0.875rem] py-[0.375rem] text-[0.938rem] font-semibold leading-[1.5rem] lg:text-[1rem] ${getStatusClassName(order.status)}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>

                          <td className="px-[1rem] py-[0.5rem] text-right">
                            <div className="flex items-center justify-end gap-2">
                              {proposalStatusMeta ? (
                                <span
                                  className={`inline-flex h-[2.25rem] min-w-[6.25rem] items-center justify-center rounded-[0.5rem] px-[0.75rem] text-[0.813rem] font-semibold ${proposalStatusMeta.className}`}
                                >
                                  {proposalStatusMeta.label}
                                </span>
                              ) : null}

                              {canCheckProposal ? (
                                <Link
                                  href={`/dashboard/client/pesanan/${order.id}/target${proposalId ? `?proposalId=${proposalId}` : ""}`}
                                  className="inline-flex h-[2.5rem] min-w-[7.5rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[0.875rem] text-[0.938rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)] lg:text-[1rem]"
                                >
                                  Cek Proposal
                                </Link>
                              ) : (
                                <span className="inline-flex h-[2.5rem] min-w-[7.5rem] items-center justify-center rounded-[0.5rem] bg-[var(--btn-disabled-bg)] px-[0.875rem] text-[0.938rem] font-semibold leading-[1.5rem] text-[var(--btn-disabled-text)] lg:text-[1rem]">
                                  Cek Proposal
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
