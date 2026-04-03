import MandorListSection from "@/components/features/mandor/mandor-list-section";
import { mapForemanToMandorSummary } from "@/components/features/mandor/foreman-mapper";
import { getForemanList } from "@/lib/foreman-api";

export default async function MandorPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name = "" } = await searchParams;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const foremanList = await getForemanList(normalizedName);
  const mandors = foremanList.map(mapForemanToMandorSummary);

  return (
    <MandorListSection mandors={mandors} currentSearchName={normalizedName} />
  );
}
