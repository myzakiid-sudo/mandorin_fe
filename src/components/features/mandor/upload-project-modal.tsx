"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { ContractorDetail } from "./types";

type UploadStep = "pick" | "preview" | "describe" | "success";

type UploadProjectModalProps = {
  contractor: ContractorDetail;
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadProjectModal({
  contractor,
  isOpen,
  onClose,
}: UploadProjectModalProps) {
  const [uploadStep, setUploadStep] = useState<UploadStep>("pick");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLocation, setProjectLocation] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetFlow = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setUploadStep("pick");
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectDescription("");
    setProjectLocation("");
  };

  const handleClose = () => {
    onClose();
    resetFlow();
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setUploadStep("preview");
  };

  const handleNext = () => {
    if (uploadStep === "pick" && selectedFile) {
      setUploadStep("preview");
      return;
    }

    if (uploadStep === "preview") {
      setUploadStep("describe");
    }
  };

  const handleBack = () => {
    if (uploadStep === "preview") {
      setUploadStep("pick");
      return;
    }

    if (uploadStep === "describe") {
      setUploadStep("preview");
    }
  };

  const handleShare = () => {
    setUploadStep("success");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative max-h-[90vh] w-full max-w-[74rem] overflow-hidden rounded-[1.5rem] bg-[#ececef] shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.16)]">
        <div className="flex h-[4rem] items-center bg-[var(--blue-dark)] px-4 text-white md:px-6">
          <div className="w-1/4">
            {uploadStep === "preview" || uploadStep === "describe" ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center text-lg font-semibold"
              >
                <Image
                  src="/images/icons/icon-uploadproject-back.svg"
                  alt="Kembali"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </button>
            ) : null}
          </div>

          <p className="w-2/4 text-center text-[1.25rem] font-semibold">
            {uploadStep === "success" ? "Project shared" : "Buat Proyek Baru"}
          </p>

          <div className="flex w-1/4 justify-end">
            {uploadStep === "pick" || uploadStep === "preview" ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedFile}
                className="text-[1.125rem] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            ) : null}

            {uploadStep === "describe" ? (
              <button
                type="button"
                onClick={handleShare}
                className="text-[1.125rem] font-semibold"
              >
                Share
              </button>
            ) : null}
          </div>
        </div>

        {uploadStep === "pick" ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center md:min-h-[32rem]">
            <Image
              src="/images/icons/icon-uploadproject-photovideo.svg"
              alt="Ikon foto dan video"
              width={112}
              height={112}
              className="h-28 w-28 object-contain"
              priority
            />

            <p className="mt-5 text-[1.25rem] font-medium leading-[1.75rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
              Tarik foto & video Anda ke sini
            </p>

            <button
              type="button"
              onClick={handleChooseFile}
              className="mt-6 inline-flex h-[3.25rem] w-full max-w-[20rem] items-center justify-center rounded-[0.75rem] bg-[var(--orange-normal)] px-6 text-[1rem] font-semibold leading-[1.5rem] text-white transition-colors hover:bg-[var(--orange-dark)] md:h-[3.5rem] md:min-w-[24rem] md:px-8 md:text-[1.5rem] md:leading-[2rem] lg:text-[1.875rem] lg:leading-[2.25rem]"
            >
              Pilih dari Komputer
            </button>
          </div>
        ) : null}

        {uploadStep === "preview" ? (
          <div className="relative min-h-[24rem] bg-[#d9d9dc] md:min-h-[32rem]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview proyek"
                fill
                unoptimized
                className="object-cover"
              />
            ) : null}

            <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[var(--white-darker)]"
                >
                  <Image
                    src="/images/icons/ganti-gambar.svg"
                    alt="Ganti gambar"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[var(--white-darker)]"
                >
                  <Image
                    src="/images/icons/icon-upploadproject-cari.svg"
                    alt="Cari detail"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </button>
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[var(--white-darker)]"
              >
                <Image
                  src="/images/icons/icon-uploadproject-tumpuk.svg"
                  alt="Layer"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </button>
            </div>
          </div>
        ) : null}

        {uploadStep === "describe" ? (
          <div className="grid min-h-[24rem] max-h-[calc(90vh-4rem)] grid-cols-1 overflow-y-auto md:min-h-[32rem] md:grid-cols-[1.45fr_1fr]">
            <div className="relative min-h-[20rem] bg-[#d9d9dc]">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview proyek"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="px-5 py-5 md:px-6 md:py-6">
              <div className="flex items-center gap-3">
                <Image
                  src={contractor.heroImage}
                  alt={contractor.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <p className="text-[1.25rem] font-semibold leading-[1.75rem] text-[var(--text-black)] md:text-[2rem] md:leading-[2.5rem]">
                  {contractor.name}
                </p>
              </div>

              <textarea
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Jelaskan proyek anda.."
                className="mt-5 min-h-[8rem] w-full rounded-[0.75rem] border border-[var(--white-dark)] bg-transparent p-3 text-[1rem] leading-[1.5rem] text-[var(--text-black)] outline-none placeholder:text-[var(--white-dark-hover)] md:min-h-[11rem] md:text-[1.375rem] md:leading-[2rem] lg:text-[1.75rem] lg:leading-[2.5rem]"
              />

              <div className="mt-5 flex items-center justify-between gap-3 rounded-[0.75rem] border border-transparent px-2 py-2">
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(event) => setProjectLocation(event.target.value)}
                  placeholder="Lokasi anda"
                  className="w-full bg-transparent text-[1rem] leading-[1.5rem] text-[var(--text-black)] outline-none placeholder:text-[var(--white-dark-hover)] md:text-[1.375rem] md:leading-[2rem] lg:text-[1.75rem] lg:leading-[2.5rem]"
                />
                <Image
                  src="/images/icons/icon-lokasi.svg"
                  alt="Lokasi"
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 object-contain"
                />
              </div>
            </div>
          </div>
        ) : null}

        {uploadStep === "success" ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center md:min-h-[32rem]">
            <Image
              src="/images/assets/sucsess.png"
              alt="Project berhasil diunggah"
              width={240}
              height={240}
              className="h-auto w-[15rem] object-contain"
            />
            <p className="mt-4 text-[1.5rem] leading-[2rem] text-[var(--text-black)] md:text-[2.25rem] md:leading-[2.75rem]">
              Proyek telah diunggah
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--orange-normal)] px-8 text-base font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
            >
              Selesai
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          aria-label="Tutup popup upload"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
