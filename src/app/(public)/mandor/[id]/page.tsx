import ContractorDetailContent from "@/components/features/mandor/contractor-detail-content";
import { contractorById } from "@/components/features/mandor/data";
import DetailNotFound from "@/components/features/mandor/detail-not-found";

export default async function MandorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contractor = contractorById[id];

  if (!contractor) {
    return <DetailNotFound />;
  }

  return <ContractorDetailContent contractorId={id} contractor={contractor} />;
}
