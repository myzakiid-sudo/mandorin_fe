"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/features/public/navbar";
import { useAuth } from "@/context/auth-context";
import {
  payProposal,
  ProposalForbiddenError,
  getProposalById,
  isProposalApprovedStatus,
  isProposalRejectedStatus,
  normalizeProposalStatus,
  ProposalAuthError,
  type Proposal,
  updateProposalStatus,
} from "@/lib/proposal-api";
import { formatCurrencyIdr, formatDateId } from "@/lib/utils";

function ReadonlyTargetInput({
  label,
  value,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  type?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-[0.5rem]">
      <span className="text-[0.938rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1rem]">
        {label}
      </span>
      {type === "textarea" ? (
        <textarea
          rows={rows || 3}
          value={value}
          readOnly
          className="rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] py-2 text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:text-[1rem] cursor-default"
        />
      ) : (
        <input
          type={type}
          value={value}
          readOnly
          className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:h-[2.75rem] md:text-[1rem] cursor-default"
        />
      )}
    </label>
  );
}

export default function ClientTargetPengerjaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const { clearSession } = useAuth();
  const orderId = String(params?.id ?? "");
  const proposalIdFromQuery = searchParams.get("proposalId")?.trim() ?? "";
  const proposalId = proposalIdFromQuery || orderId;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSavingDecision, setIsSavingDecision] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const isProposalApproved = isProposalApprovedStatus(proposal?.status);
  const isProposalRejected = isProposalRejectedStatus(proposal?.status);
  const isDecisionFinal = isProposalApproved || isProposalRejected;
  const canProceedToProjects = isProposalApproved;

  useEffect(() => {
    let isCancelled = false;

    const loadProposal = async () => {
      setLoading(true);
      setErrorMessage("");

      if (!proposalId) {
        setErrorMessage("ID proposal tidak valid.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProposalById(proposalId);
        if (isCancelled) {
          return;
        }

        setProposal(data);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof ProposalAuthError) {
          clearSession();
          router.replace("/login");
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat detail proposal.",
        );
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadProposal();

    return () => {
      isCancelled = true;
    };
  }, [clearSession, proposalId, router]);

  const handleApproveAndPayProposal = async () => {
    if (!proposal || isPaying || isSavingDecision || isDecisionFinal) {
      return;
    }

    setIsPaying(true);
    setErrorMessage("");

    try {
      const paymentResult = await payProposal(String(proposal.id));

      if (
        paymentResult.status &&
        isProposalApprovedStatus(paymentResult.status)
      ) {
        setProposal((prev) =>
          prev
            ? {
                ...prev,
                status: normalizeProposalStatus(
                  paymentResult.status ?? undefined,
                ),
              }
            : prev,
        );
      }

      if (paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
        return;
      }

      const refreshedProposal = await getProposalById(String(proposal.id));
      setProposal(refreshedProposal);

      if (!isProposalApprovedStatus(refreshedProposal.status)) {
        const orderInfo = paymentResult.orderId
          ? ` (Order ID: ${paymentResult.orderId})`
          : "";
        setErrorMessage(
          `Sesi pembayaran berhasil dibuat${orderInfo}, tetapi URL Midtrans belum tersedia dari API. Hubungi backend untuk memastikan field payment_url dikirim pada respons /proposals/:id/pay.`,
        );
      }
    } catch (error) {
      if (error instanceof ProposalAuthError) {
        setErrorMessage(
          error.message ||
            "Sesi login bermasalah untuk aksi pembayaran. Silakan login ulang lalu coba lagi.",
        );
        return;
      }

      if (error instanceof ProposalForbiddenError) {
        setErrorMessage(
          error.message || "Aksi pembayaran tidak diizinkan untuk akun ini.",
        );
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal membuat sesi pembayaran Midtrans.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleRejectProposal = async () => {
    if (!orderId || !proposal || isSavingDecision || isDecisionFinal) {
      return;
    }

    setIsSavingDecision(true);
    setErrorMessage("");

    try {
      const updated = await updateProposalStatus(
        String(proposal.id),
        "DITOLAK",
      );
      setProposal(updated);

      router.push("/dashboard/client/pesanan");
    } catch (error) {
      if (error instanceof ProposalAuthError) {
        setErrorMessage(
          error.message ||
            "Sesi login bermasalah untuk aksi ini. Silakan login ulang lalu coba lagi.",
        );
        return;
      }

      if (error instanceof ProposalForbiddenError) {
        setErrorMessage(
          error.message ||
            "Aksi tidak diizinkan. Pastikan Anda login sebagai client pemilik proposal.",
        );
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menolak proposal.",
      );
    } finally {
      setIsSavingDecision(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center text-[var(--text-muted)]">
            Memuat data proposal...
          </section>
        </main>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
        <PublicNavbar />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
          <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center">
            <p className="text-[var(--red-normal)]">
              {errorMessage || "Data proposal tidak ditemukan."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/client/pesanan")}
              className="mt-5 inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] sm:w-auto"
            >
              Kembali ke Pesanan
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.5rem] py-[2rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[4rem] md:py-[3rem]">
          <h1 className="text-center text-[1.5rem] font-semibold leading-[2rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
            Target Tahapan Pengerjaan
          </h1>

          <div className="mt-[2rem] flex flex-col gap-[1.25rem]">
            <ReadonlyTargetInput label="Nama Proyek" value={proposal.title} />

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <ReadonlyTargetInput
                label="Target Tanggal Selesai"
                value={formatDateId(proposal.deadline, "long")}
              />
              <ReadonlyTargetInput
                label="Budget Proposal"
                value={formatCurrencyIdr(Number(proposal.budget) || 0)}
              />
            </div>

            <ReadonlyTargetInput
              label="Alamat Lengkap Proyek"
              value={proposal.location}
            />

            <ReadonlyTargetInput
              label="Bidang Pekerjaan"
              value={proposal.field}
            />

            <ReadonlyTargetInput
              label="Deskripsi Pekerjaan"
              type="textarea"
              rows={5}
              value={proposal.content}
            />

            <ReadonlyTargetInput
              label="Foto Proposal"
              value={proposal.photo || "-"}
            />

            <p className="mt-2 text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:text-[0.875rem] mb-6 border-b pb-8 border-transparent">
              Klik tombol Setuju dan Bayar untuk membuat sesi pembayaran dan
              melanjutkan ke halaman Midtrans.
            </p>

            {errorMessage ? (
              <p className="text-[0.875rem] text-[var(--red-normal)]">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
              <button
                type="button"
                onClick={handleApproveAndPayProposal}
                className="inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--green-normal)] px-5 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] sm:max-w-[14rem]"
                disabled={isPaying || isSavingDecision || isDecisionFinal}
              >
                {isPaying
                  ? "Membuat Pembayaran..."
                  : isDecisionFinal
                    ? "Keputusan Tersimpan"
                    : "Setuju dan Bayar"}
              </button>

              <button
                type="button"
                onClick={handleRejectProposal}
                className="inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--red-normal)] px-5 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--red-dark)] disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] sm:max-w-[11rem]"
                disabled={isSavingDecision || isDecisionFinal}
              >
                {isSavingDecision
                  ? "Menyimpan..."
                  : isDecisionFinal
                    ? "Keputusan Tersimpan"
                    : "Tolak"}
              </button>
            </div>

            {canProceedToProjects ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/client/projects")}
                  className="inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] bg-white px-5 text-[0.938rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)] sm:max-w-[23rem]"
                >
                  Lanjut ke Proyek Saya
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
