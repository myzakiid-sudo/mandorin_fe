import ContractorListSection from "@/components/features/mandor/contractor-list-section";
import { mapForemanToContractorSummary } from "@/components/features/mandor/foreman-mapper";
import { getForemanList } from "@/lib/foreman-api";

export default async function MandorPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name = "" } = await searchParams;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const foremanList = await getForemanList(normalizedName);
  const contractors = foremanList.map(mapForemanToContractorSummary);

  return (
    <ContractorListSection
      contractors={contractors}
      currentSearchName={normalizedName}
    />
  );
}
