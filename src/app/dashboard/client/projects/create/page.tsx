"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
import { useAuth } from "@/context/auth-context";
import { createProject, ProjectAuthError } from "@/lib/project-api";

export default function CreateProjectPage() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const budgetNumber = Number(budget);
    if (!Number.isFinite(budgetNumber) || budgetNumber <= 0) {
      setErrorMessage("Budget harus berupa angka lebih dari 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createProject({
        field,
        title,
        content,
        budget: budgetNumber,
        deadline: `${deadline}T00:00:00.000Z`,
        location,
        status: "SEDANG BERJALAN",
      });

      router.push(`/dashboard/client/projects/${created.id}`);
    } catch (error) {
      if (error instanceof ProjectAuthError) {
        clearSession();
        router.replace("/login");
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Gagal membuat proyek.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="mx-auto max-w-[50rem] rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal)] p-[1rem] md:p-[1.5rem]">
          <h1 className="text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)]">
            Buat Proyek Baru
          </h1>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
                Judul Proyek
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
                  Bidang
                </span>
                <input
                  required
                  value={field}
                  onChange={(event) => setField(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
                  Lokasi
                </span>
                <input
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
                  Budget
                </span>
                <input
                  required
                  type="number"
                  min={1}
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
                  Deadline
                </span>
                <input
                  required
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="h-[2.75rem] rounded-[0.5rem] border border-[var(--black-light)] px-3"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-medium text-[var(--text-black)]">
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

            {errorMessage ? (
              <p className="text-[0.875rem] text-[var(--red-normal)]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/client/projects")}
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] border border-[var(--black-light)] px-4 text-[0.938rem] font-semibold text-[var(--text-secondary)]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
              >
                {isSubmitting ? "Menyimpan..." : "Buat Proyek"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
