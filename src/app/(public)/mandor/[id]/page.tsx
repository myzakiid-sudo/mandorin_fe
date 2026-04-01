import ContractorDetailContent from "@/components/features/mandor/contractor-detail-content";
import { mapForemanToContractorDetail } from "@/components/features/mandor/foreman-mapper";
import { contractorById } from "@/components/features/mandor/data";
import DetailNotFound from "@/components/features/mandor/detail-not-found";
import { getForemanById } from "@/lib/foreman-api";

export default async function MandorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const foreman = await getForemanById(id);
  const contractor = foreman
    ? mapForemanToContractorDetail(foreman)
    : contractorById[id];

  if (!contractor) {
    return <DetailNotFound />;
  }

  return <ContractorDetailContent contractorId={id} contractor={contractor} />;
}
