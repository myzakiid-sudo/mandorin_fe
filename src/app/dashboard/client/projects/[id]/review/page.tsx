"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";
import BackgroundCircles from "@/components/ui/background-circles";

export default function ClientProjectReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState<"yes" | "no" | "">("");
  const [review, setReview] = useState("");

  const canSubmit = useMemo(
    () => rating > 0 && recommendation !== "" && review.trim().length > 0,
    [rating, recommendation, review],
  );

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    router.push(`/dashboard/client/projects/${params?.id}/review/success`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--white-normal-hover)]">
      <PublicNavbar />

      <main className="relative mx-auto flex w-full max-w-[90rem] flex-1 items-center justify-center overflow-hidden px-5 py-10 md:px-10 xl:px-[6.25rem]">
        <BackgroundCircles />

        <section className="relative z-10 w-full max-w-[26rem] rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-6 shadow-[0_0.5rem_1.25rem_rgba(0,0,0,0.08)] md:p-7">
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
            disabled={!canSubmit}
            className="mt-5 inline-flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-normal-hover)] disabled:cursor-not-allowed disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]"
          >
            Kirim
          </button>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
