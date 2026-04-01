"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type UploadStep = "pick" | "preview";

type UploadPortfolioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
};

export default function UploadPortfolioModal({
  isOpen,
  onClose,
  onConfirm,
}: UploadPortfolioModalProps) {
  const [uploadStep, setUploadStep] = useState<UploadStep>("pick");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleSave = () => {
    if (selectedFile) {
      onConfirm(selectedFile);
      handleClose(); // Tutup setelah simpan
    }
  };

  const handleBack = () => {
    setUploadStep("pick");
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

      <div className="relative w-full max-w-[50rem] overflow-hidden rounded-[1.5rem] bg-[#ececef] shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.16)]">
        {/* Header Modal */}
        <div className="flex h-[4rem] items-center bg-[var(--blue-dark)] px-4 text-white md:px-6">
          <div className="w-1/4">
            {uploadStep === "preview" && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center"
              >
                <Image
                  src="/images/icons/icon-uploadproject-back.svg"
                  alt="Kembali"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </button>
            )}
          </div>

          <p className="w-2/4 text-center text-[1.25rem] font-semibold">
            Unggah Portofolio
          </p>

          <div className="flex w-1/4 justify-end">
            {uploadStep === "preview" && (
              <button
                type="button"
                onClick={handleSave}
                className="text-[1.125rem] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-45 hover:opacity-80 text-[var(--orange-normal)]"
              >
                Simpan
              </button>
            )}
          </div>
        </div>

        {/* Tahap 1: Pick File */}
        {uploadStep === "pick" && (
          <div className="flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center">
            <Image
              src="/images/icons/icon-uploadproject-photovideo.svg"
              alt="Ikon foto dan video"
              width={112}
              height={112}
              className="h-28 w-28 object-contain"
              priority
            />

            <p className="mt-5 text-[1.75rem] font-medium leading-[2.5rem] text-[var(--text-black)]">
              Tarik foto portofolio Anda ke sini
            </p>

            <button
              type="button"
              onClick={handleChooseFile}
              className="mt-6 inline-flex h-[3.5rem] min-w-[20rem] items-center justify-center rounded-[0.75rem] bg-[var(--orange-normal)] px-8 text-[1.5rem] font-semibold leading-[2.25rem] text-white transition-colors hover:bg-[var(--orange-dark)]"
            >
              Pilih dari Komputer
            </button>
          </div>
        )}

        {/* Tahap 2: Preview Hasil Unggah */}
        {uploadStep === "preview" && (
          <div className="relative min-h-[28rem] bg-[#d9d9dc] flex justify-center items-center overflow-hidden">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview Portofolio"
                fill
                unoptimized
                className="object-contain"
              />
            )}

            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center px-5 gap-4">
               <button
                  type="button"
                  onClick={handleChooseFile}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 transition-transform hover:scale-105 shadow-md"
                  title="Ganti Gambar"
                >
                  <Image
                    src="/images/icons/ganti-gambar.svg"
                    alt="Ganti gambar"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </button>
            </div>
          </div>
        )}

        {/* Tombol Tutup X (Kanan Atas) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
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
