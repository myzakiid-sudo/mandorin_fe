"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import PublicNavbar from "@/components/features/public/navbar";
import BackgroundCircles from "@/components/ui/background-circles";
import { useAuth } from "@/context/auth-context";
import {
  createReview,
  deleteReview,
  getReviews,
  ReviewAuthError,
  type Review,
} from "@/lib/review-api";

export default function ClientProjectReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { authSession, clearSession } = useAuth();
  const foremanIdFromQuery = searchParams.get("foremanId")?.trim() ?? "";
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState<"yes" | "no" | "">("");
  const [review, setReview] = useState("");
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMyReviews = async () => {
      if (!authSession?.userId) {
        return;
      }

      try {
        const data = await getReviews(authSession.userId);

        if (cancelled) {
          return;
        }

        setMyReviews(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ReviewAuthError) {
          clearSession();
          router.replace("/login");
          return;
        }
      }
    };

    loadMyReviews();

    return () => {
      cancelled = true;
    };
  }, [authSession?.userId, clearSession, router]);

  const canSubmit = useMemo(
    () => rating > 0 && recommendation !== "" && review.trim().length > 0,
    [rating, recommendation, review],
  );

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    const clientId = Number(authSession?.userId);
    const foremanId = Number(foremanIdFromQuery);

    if (!Number.isFinite(clientId) || clientId <= 0) {
      setActionError("Sesi user tidak valid. Silakan login ulang.");
      return;
    }

    if (!Number.isFinite(foremanId) || foremanId <= 0) {
      setActionError(
        "Data mandor tidak valid. Kembali ke detail proyek lalu coba lagi.",
      );
      return;
    }

    setActionError("");
    setActionMessage("");
    setIsSubmitting(true);

    try {
      const created = await createReview({
        content: `${review.trim()}\nRekomendasi: ${recommendation === "yes" ? "Yes" : "No"}`,
        client_id: clientId,
        foreman_id: foremanId,
        score: rating,
      });

      setMyReviews((prev) => [created, ...prev]);
      router.push(`/dashboard/client/projects/${params?.id}/review/success`);
    } catch (error) {
      if (error instanceof ReviewAuthError) {
        clearSession();
        router.replace("/login");
        return;
      }

      setActionError(
        error instanceof Error ? error.message : "Gagal mengirim review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm("Hapus review ini?");
    if (!confirmed) {
      return;
    }

    setActionError("");
    setActionMessage("");
    setDeletingId(reviewId);

    try {
      await deleteReview(String(reviewId));
      setMyReviews((prev) => prev.filter((item) => item.id !== reviewId));
      setActionMessage("Review berhasil dihapus.");
    } catch (error) {
      if (error instanceof ReviewAuthError) {
        clearSession();
        router.replace("/login");
        return;
      }

      setActionError(
        error instanceof Error ? error.message : "Gagal menghapus review.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--white-normal-hover)]">
      <PublicNavbar />

      <main className="relative mx-auto flex w-full max-w-[90rem] flex-1 items-center justify-center overflow-hidden px-5 py-10 md:px-10 xl:px-[6.25rem]">
        <BackgroundCircles />

        <section className="relative z-10 w-full max-w-[30rem] rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-6 shadow-[0_0.5rem_1.25rem_rgba(0,0,0,0.08)] md:p-7">
          <h1 className="text-[2rem] font-semibold leading-[2.5rem] text-[var(--blue-dark)]">
            Penilaian keseluruhan
          </h1>

          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Pilih rating ${star}`}
                onClick={() => setRating(star)}
                className={`h-auto w-auto min-w-0 border-none bg-transparent p-0 text-[1.5rem] leading-none ${star <= rating ? "text-[#f4b300]" : "text-[#d0d0d0]"}`}
              >
                ★
              </button>
            ))}
          </div>

          <p className="mt-4 text-[1rem] leading-[1.5rem] text-[var(--text-black)] md:text-[1.125rem]">
            Apakah Anda akan merekomendasikan mandor ini ke teman?
          </p>

          <div className="mt-2 flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-[0.938rem] text-[var(--text-black)] md:text-[1rem]">
              <input
                type="radio"
                name="recommendation"
                checked={recommendation === "yes"}
                onChange={() => setRecommendation("yes")}
                className="h-4 w-4 accent-[var(--orange-normal)]"
              />
              Yes
            </label>

            <label className="inline-flex items-center gap-2 text-[0.938rem] text-[var(--text-black)] md:text-[1rem]">
              <input
                type="radio"
                name="recommendation"
                checked={recommendation === "no"}
                onChange={() => setRecommendation("no")}
                className="h-4 w-4 accent-[var(--orange-normal)]"
              />
              No
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-2">
            <span className="text-[1rem] font-medium text-[var(--text-black)] md:text-[1.125rem]">
              Ulasan Anda
            </span>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              rows={4}
              className="resize-none rounded-[0.375rem] border border-[var(--black-light)] bg-white px-3 py-2 text-[0.938rem] text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
            />
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="mt-5 inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-normal-hover)] disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
          >
            {isSubmitting ? "Mengirim..." : "Kirim"}
          </button>

          {actionMessage ? (
            <p className="mt-3 text-[0.875rem] text-[var(--green-normal)]">
              {actionMessage}
            </p>
          ) : null}

          {actionError ? (
            <p className="mt-3 text-[0.875rem] text-[var(--red-normal)]">
              {actionError}
            </p>
          ) : null}

          <div className="mt-6 border-t border-[var(--black-light)] pt-4">
            <h2 className="text-[1rem] font-semibold text-[var(--text-black)]">
              Review Saya
            </h2>

            {myReviews.length ? (
              <div className="mt-3 space-y-2">
                {myReviews.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[0.5rem] border border-[var(--black-light)] bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.875rem] font-semibold text-[var(--text-black)]">
                        Skor: {item.score}/5
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex h-[1.875rem] items-center justify-center rounded-[0.375rem] border border-[var(--red-normal)] px-3 text-[0.75rem] font-semibold text-[var(--red-normal)] disabled:cursor-not-allowed disabled:border-[var(--btn-disabled-text)] disabled:text-[var(--btn-disabled-text)]"
                      >
                        {deletingId === item.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                    <p className="mt-1 text-[0.813rem] text-[var(--text-secondary)]">
                      {item.content}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[0.813rem] text-[var(--text-muted)]">
                Belum ada review.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
