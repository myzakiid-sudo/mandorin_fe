"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import PublicNavbar from "@/components/features/public/navbar";
import { useAuth } from "@/context/auth-context";
import {
  AppointmentAuthError,
  getAppointmentById,
} from "@/lib/appointment-api";
import { createProposal, ProposalAuthError } from "@/lib/proposal-api";

function InputTarget({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  rows,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-[0.5rem]">
      <span className="text-[0.938rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1rem]">
        {label}
      </span>
      {type === "textarea" ? (
        <textarea
          rows={rows || 3}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] py-2 text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:text-[1rem]"
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          placeholder={placeholder}
          required={required}
          className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:h-[2.75rem] md:text-[1rem]"
        />
      )}
    </label>
  );
}

export default function TargetTahapanPengerjaanPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { clearSession } = useAuth();

  const [title, setTitle] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [field, setField] = useState("");
  const [budget, setBudget] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [terms, setTerms] = useState("");
  const [mainStages, setMainStages] = useState(["", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStageChange = (index: number, value: string) => {
    setMainStages((prev) =>
      prev.map((stage, stageIndex) => (stageIndex === index ? value : stage)),
    );
  };

  const handleAddStage = () => {
    setMainStages((prev) => [...prev, ""]);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const orderId = String(params?.id ?? "");
    const parsedBudget = Number(budget);

    if (!orderId) {
      setErrorMessage("ID pesanan tidak valid.");
      return;
    }

    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setErrorMessage("Budget proposal harus berupa angka lebih dari 0.");
      return;
    }

    if (!photoFile) {
      setErrorMessage("Foto proposal wajib diunggah.");
      return;
    }

    const stageLines = mainStages
      .map((stage) => stage.trim())
      .filter(Boolean)
      .map((stage, index) => `${index + 1}. ${stage}`);

    const proposalContent = [
      content.trim(),
      stageLines.length ? `Urutan Tahapan:\n${stageLines.join("\n")}` : "",
      terms.trim() ? `Syarat Tahapan:\n${terms.trim()}` : "",
      surveyDate ? `Tanggal Survei: ${surveyDate}` : "",
      whatsAppNumber.trim() ? `Kontak WhatsApp: ${whatsAppNumber.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let clientId = Number(searchParams.get("clientId") ?? "");
      let foremanId = Number(searchParams.get("foremanId") ?? "");

      const hasValidIds =
        Number.isFinite(clientId) &&
        clientId > 0 &&
        Number.isFinite(foremanId) &&
        foremanId > 0;

      if (!hasValidIds) {
        const appointment = await getAppointmentById(orderId);
        clientId = Number(appointment.client_id);
        foremanId = Number(appointment.foreman_id);
      }

      if (!Number.isFinite(clientId) || clientId <= 0) {
        throw new Error("ID Klien wajib diisi");
      }

      if (!Number.isFinite(foremanId) || foremanId <= 0) {
        throw new Error("ID Mandor wajib diisi");
      }

      const payload = new FormData();
      payload.set("budget", String(parsedBudget));
      payload.set("deadline", `${deadline}T00:00:00.000Z`);
      payload.set("field", field);
      payload.set("title", title);
      payload.set("content", proposalContent);
      payload.set("location", location);
      payload.set("photo", photoFile);
      payload.set("client_id", String(clientId));
      payload.set("foreman_id", String(foremanId));
      payload.set("clientId", String(clientId));
      payload.set("foremanId", String(foremanId));

      await createProposal(payload);

      router.push(`/dashboard/mandor/pesanan/${orderId}/target/success`);
    } catch (error) {
      if (error instanceof ProposalAuthError) {
        clearSession();
        router.replace("/login");
        return;
      }

      if (error instanceof AppointmentAuthError) {
        setErrorMessage(
          "Data pesanan tidak bisa diakses. Buka ulang dari halaman detail pesanan.",
        );
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengirim proposal. Coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[65rem] rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.5rem] py-[2rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[4rem] md:py-[3rem]">
          <h1 className="text-center text-[1.5rem] font-semibold leading-[2rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
            Target Tahapan Pengerjaan
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-[2rem] flex flex-col gap-[1.25rem]"
          >
            <InputTarget
              label="Nama Proyek"
              name="title"
              value={title}
              onChange={setTitle}
              required
            />

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <InputTarget
                label="Tanggal Survei"
                name="surveyDate"
                type="date"
                value={surveyDate}
                onChange={setSurveyDate}
              />
              <InputTarget
                label="Target Tanggal Selesai"
                name="deadline"
                type="date"
                value={deadline}
                onChange={setDeadline}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <InputTarget
                label="Alamat Lengkap Proyek"
                name="location"
                value={location}
                onChange={setLocation}
                required
              />
              <InputTarget
                label="Nomor WhatsApp"
                name="whatsApp"
                value={whatsAppNumber}
                onChange={setWhatsAppNumber}
              />
            </div>

            <div className="grid grid-cols-1 gap-[1.25rem] md:grid-cols-2">
              <InputTarget
                label="Bidang Pekerjaan"
                name="field"
                value={field}
                onChange={setField}
                placeholder="Contoh: Atap & Plafon"
                required
              />
              <InputTarget
                label="Budget Proposal"
                name="budget"
                type="number"
                value={budget}
                onChange={setBudget}
                placeholder="Contoh: 25000000"
                required
              />
            </div>

            <label className="flex flex-col gap-[0.5rem]">
              <span className="text-[0.938rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1rem]">
                Foto Proposal
              </span>
              <input
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                required
                className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:h-[2.75rem] md:text-[1rem]"
              />
              <span className="text-[0.75rem] text-[var(--text-muted)]">
                {photoFile ? photoFile.name : "Belum ada file dipilih"}
              </span>
            </label>

            <InputTarget
              label="Deskripsi Pekerjaan"
              name="content"
              type="textarea"
              rows={4}
              value={content}
              onChange={setContent}
              required
            />

            <div className="mt-4 flex flex-col gap-[1.25rem]">
              <h3 className="text-[1.125rem] font-semibold text-[var(--text-black)]">
                Urutan Tahapan
              </h3>

              {mainStages.map((stage, index) => (
                <label
                  key={`tahapan-${index + 1}`}
                  className="flex flex-col gap-[0.5rem]"
                >
                  <span className="text-[0.938rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1rem]">
                    Tahapan {index + 1}
                  </span>
                  <input
                    type="text"
                    value={stage}
                    onChange={(event) =>
                      handleStageChange(index, event.target.value)
                    }
                    placeholder="Isi tahapan pengerjaan"
                    className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)] md:h-[2.75rem] md:text-[1rem]"
                  />
                </label>
              ))}

              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex h-[2.5rem] w-full items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] text-[0.875rem] font-semibold text-[var(--orange-normal)] transition-colors hover:bg-[var(--orange-light)] sm:max-w-[13rem]"
              >
                + Tambah Tahapan
              </button>
            </div>

            <InputTarget
              label="Syarat Tahapan"
              name="terms"
              type="textarea"
              rows={2}
              value={terms}
              onChange={setTerms}
            />

            {errorMessage ? (
              <p className="text-[0.875rem] text-[var(--red-normal)]">
                {errorMessage}
              </p>
            ) : null}

            <p className="mt-2 text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:text-[0.875rem]">
              Menyimpan formulir ini berarti menetapkan target pengerjaan yang
              akan dipantau secara berkala melalui laporan progres harian di
              aplikasi Mandorin.
            </p>

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[3.25rem] w-full rounded-[0.5rem] bg-[var(--orange-normal)] text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] sm:max-w-[18rem]"
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
