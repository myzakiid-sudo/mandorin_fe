"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { useAuth } from "@/context/auth-context";
import {
  AppointmentAuthError,
  getAppointmentById,
  normalizeAppointmentStatus,
  type Appointment,
  updateAppointmentStatus,
} from "@/lib/appointment-api";
import { getClientDisplayByUserId } from "@/lib/client-api";
import {
  isProposalApprovedStatus,
  isProposalPendingStatus,
  resolveProposalForOrder,
} from "@/lib/proposal-api";
import { formatDateId } from "@/lib/utils";
import { useProposals } from "@/hooks/use-proposals";

type MandorOrderPhase =
  | "pending"
  | "approved"
  | "proposal_submitted"
  | "client_approved"
  | "completed"
  | "rejected";

type ReadonlyInputProps = {
  label: string;
  value: string;
};

function ReadonlyInput({ label, value }: ReadonlyInputProps) {
  return (
    <label className="flex flex-col gap-[0.5rem]">
      <span className="text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1.125rem] md:leading-[1.75rem]">
        {label}
      </span>
      <input
        value={value}
        readOnly
        className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:h-[2.75rem] md:text-[1rem] md:leading-[1.5rem]"
      />
    </label>
  );
}

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

export default function MandorPesananDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { clearSession } = useAuth();
  const id = String(params?.id ?? "");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: proposals } = useProposals({
    enabled: Boolean(
      appointment &&
      normalizeAppointmentStatus(appointment.status) === "DISETUJUI",
    ),
    deps: [
      appointment?.id,
      appointment?.status,
      appointment?.client_id,
      appointment?.foreman_id,
      appointment?.location,
    ],
    onAuthError: () => {
      clearSession();
      router.replace("/login");
    },
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadDetail = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await getAppointmentById(id);
        if (controller.signal.aborted) {
          return;
        }

        setAppointment(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof AppointmentAuthError) {
          clearSession();
          setErrorMessage("Sesi login berakhir. Silakan login ulang.");
          router.replace("/login");
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Data pesanan tidak ditemukan.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadDetail();
    } else {
      setLoading(false);
      setErrorMessage("ID pesanan tidak valid.");
    }

    return () => controller.abort();
  }, [clearSession, id, router]);

  useEffect(() => {
    if (!appointment) {
      setClientName("");
      return;
    }

    const fallbackName =
      appointment.client_name || `Client #${appointment.client_id}`;
    setClientName(fallbackName);

    let cancelled = false;

    const loadClientName = async () => {
      if (appointment.client_name) {
        return;
      }

      const client = await getClientDisplayByUserId(
        String(appointment.client_id),
      );

      if (cancelled || !client?.name?.trim()) {
        return;
      }

      setClientName(client.name.trim());
    };

    loadClientName();

    return () => {
      cancelled = true;
    };
  }, [appointment]);

  const handleUpdateStatus = async (status: "DISETUJUI" | "DITOLAK") => {
    if (!appointment) {
      return;
    }

    setIsUpdating(true);
    setErrorMessage("");

    try {
      const updated = await updateAppointmentStatus(
        String(appointment.id),
        status,
      );
      setAppointment(updated);
      router.replace("/dashboard/mandor/pesanan");
    } catch (error) {
      if (error instanceof AppointmentAuthError) {
        clearSession();
        setErrorMessage("Sesi login berakhir. Silakan login ulang.");
        router.replace("/login");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status janji temu.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[2rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <div className="rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center text-[var(--text-muted)]">
            Memuat detail pesanan...
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[2rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <div className="rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center text-[var(--red-normal)]">
            {errorMessage || "Data pesanan tidak ditemukan."}
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const matchedProposal = resolveProposalForOrder(appointment, proposals);
  const currentPhase = resolvePhaseFromServer(
    appointment.status,
    matchedProposal?.status,
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-[1rem] py-[1.25rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[3rem] md:py-[2rem]">
          <h1 className="text-center text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)] md:text-[2.25rem] md:leading-[3rem]">
            Booking Jadwal Mandor
          </h1>

          <form className="mx-auto mt-[1.5rem] grid max-w-[65rem] grid-cols-1 gap-[0.875rem] md:mt-[2rem] md:grid-cols-2 md:gap-[1rem]">
            <div className="md:col-span-2">
              <ReadonlyInput label="Lokasi" value={appointment.location} />
            </div>

            <ReadonlyInput
              label="Tanggal"
              value={formatDateId(appointment.date, "long")}
            />
            <ReadonlyInput label="Waktu" value={appointment.time} />

            <ReadonlyInput label="Status" value={appointment.status} />
            <ReadonlyInput
              label="Nama Client"
              value={clientName || `Client #${appointment.client_id}`}
            />
            <ReadonlyInput
              label="Client ID"
              value={String(appointment.client_id)}
            />

            <div className="md:col-span-2">
              <ReadonlyInput
                label="Foreman ID"
                value={String(appointment.foreman_id)}
              />
            </div>

            <div className="md:col-span-2">
              <ReadonlyInput label="Catatan" value={appointment.note || "-"} />
            </div>

            {errorMessage ? (
              <p className="text-[0.75rem] leading-[1.125rem] text-[var(--red-normal)] md:col-span-2 md:text-[0.875rem] md:leading-[1.25rem]">
                {errorMessage}
              </p>
            ) : null}

            {currentPhase === "pending" && (
              <>
                <p className="text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:col-span-2 md:text-[0.875rem] md:leading-[1.25rem]">
                  Dengan mengirim formulir ini, Anda setuju bahwa data di atas
                  akan digunakan untuk keperluan survei dan jadwal konsultasi.
                </p>

                <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("DISETUJUI")}
                    className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[#2e2e31] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-black"
                  >
                    {isUpdating ? "Memproses..." : "Setuju"}
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("DITOLAK")}
                    className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--red-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-[#c81d1d]"
                  >
                    {isUpdating ? "Memproses..." : "Tidak Setuju"}
                  </button>
                </div>
              </>
            )}

            {currentPhase === "approved" && (
              <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                <span className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--green-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white">
                  Disetujui
                </span>

                <Link
                  href={`/dashboard/mandor/pesanan/${id}/target?clientId=${appointment.client_id}&foremanId=${appointment.foreman_id}`}
                  className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-[var(--orange-dark)]"
                >
                  Buat Proposal
                </Link>
              </div>
            )}

            {currentPhase === "proposal_submitted" && (
              <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                <span className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white">
                  Proposal Dikirim
                </span>

                <button
                  type="button"
                  disabled
                  className="inline-flex h-[2.5rem] w-full max-w-[18rem] cursor-not-allowed items-center justify-center rounded-[0.5rem] bg-[var(--btn-disabled-bg)] text-[0.938rem] font-semibold leading-[1.375rem] text-[var(--btn-disabled-text)]"
                >
                  Menunggu Persetujuan Klien
                </button>
              </div>
            )}

            {currentPhase === "client_approved" && (
              <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                <span className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--blue-normal-active)] text-[0.938rem] font-semibold leading-[1.375rem] text-white">
                  Disetujui Klien
                </span>

                <Link
                  href="/dashboard/mandor/projects"
                  className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-[var(--orange-dark)]"
                >
                  Masuk Proyek
                </Link>
              </div>
            )}

            {currentPhase === "completed" && (
              <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                <span className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--green-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white">
                  Selesai
                </span>

                <Link
                  href="/dashboard/mandor/projects"
                  className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] bg-white text-[0.938rem] font-semibold leading-[1.375rem] text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)]"
                >
                  Lihat Proyek
                </Link>
              </div>
            )}

            {currentPhase === "rejected" && (
              <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                <span className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--red-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white">
                  Ditolak
                </span>
              </div>
            )}
          </form>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
