"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { useAuth } from "@/context/auth-context";
import { addProjectReport, ProjectAuthError } from "@/lib/project-api";

export default function CreateProgressPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { clearSession } = useAuth();
  const id = String(params?.id ?? "");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await addProjectReport(id, {
        title: title.trim(),
        content: content.trim(),
        photo: photo.trim(),
      });

      router.push(`/dashboard/mandor/projects/${id}`);
    } catch (error) {
      if (error instanceof ProjectAuthError) {
        clearSession();
        router.replace("/login");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan progres harian.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[50rem] rounded-[0.75rem] border border-[var(--black-light)] bg-white p-[1rem] md:p-[1.5rem]">
          <h1 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[1.75rem]">
            Tambah Progres Harian
          </h1>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                Judul Progres
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                Deskripsi
              </span>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="rounded-[0.5rem] border border-[var(--black-light)] px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                URL Foto
              </span>
              <input
                required
                type="url"
                value={photo}
                onChange={(event) => setPhoto(event.target.value)}
                className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
              />
            </label>

            {errorMessage ? (
              <p className="text-[0.875rem] text-[var(--red-normal)]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/mandor/projects/${id}`)}
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--black-light)] px-4 text-[0.938rem] font-semibold text-[var(--text-secondary)]"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Progres"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
