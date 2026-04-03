import MandorDetailContent from "@/components/features/mandor/mandor-detail-content";
import { mapForemanToMandorDetail } from "@/components/features/mandor/foreman-mapper";
import DetailNotFound from "@/components/features/mandor/detail-not-found";
import { getPublicClientDisplayByUserId } from "@/lib/client-api";
import { getForemanById } from "@/lib/foreman-api";
import { getPublicReviews } from "@/lib/review-api";

const toPositiveNumber = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};

export default async function MandorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const foreman = await getForemanById(id);

  if (!foreman) {
    return <DetailNotFound />;
  }

  const mandor = mapForemanToMandorDetail(foreman);

  const candidateForemanIds = Array.from(
    new Set(
      [
        toPositiveNumber(id),
        toPositiveNumber(foreman.id),
        toPositiveNumber(foreman.user_id),
      ].filter((value): value is number => Boolean(value)),
    ),
  );

  const [reviewsByCandidate, latestReviews] = await Promise.all([
    Promise.all(
      candidateForemanIds.map((candidateId) =>
        getPublicReviews(String(candidateId)),
      ),
    ),
    getPublicReviews(),
  ]);

  const mergedReviews = [...reviewsByCandidate.flat(), ...latestReviews];
  const matchedReviews = mergedReviews
    .filter((review, index, allReviews) => {
      const firstIndex = allReviews.findIndex((item) => item.id === review.id);
      if (firstIndex !== index) {
        return false;
      }

      const reviewForemanId = toPositiveNumber(review.foreman_id);
      return Boolean(
        reviewForemanId && candidateForemanIds.includes(reviewForemanId),
      );
    })
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  const uniqueClientIds = Array.from(
    new Set(matchedReviews.map((review) => review.client_id).filter(Boolean)),
  );

  const clientLookupEntries = await Promise.all(
    uniqueClientIds.map(async (clientId) => {
      const profile = await getPublicClientDisplayByUserId(String(clientId));

      return [clientId, profile] as const;
    }),
  );

  const clientLookup = new Map(clientLookupEntries);

  const testimonials = matchedReviews.map((review) => ({
    id: String(review.id),
    quote: review.content?.trim() || "Pelanggan memberikan ulasan positif.",
    name:
      clientLookup.get(review.client_id)?.name?.trim() ||
      `Pelanggan #${review.client_id}`,
    role: "Pelanggan Mandorin",
    avatar:
      clientLookup.get(review.client_id)?.avatar?.trim() ||
      "/images/logo-mandorin.svg",
  }));

  return (
    <MandorDetailContent
      mandorId={id}
      mandor={{
        ...mandor,
        testimonials,
      }}
    />
  );
}
