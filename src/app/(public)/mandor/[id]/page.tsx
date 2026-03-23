import ContractorDetailHero from "@/components/features/mandor/contractor-detail-hero";
import ContractorDetailPortfolio from "@/components/features/mandor/contractor-detail-portfolio";
import ContractorDetailReason from "@/components/features/mandor/contractor-detail-reason";
import ContractorDetailTestimonials from "@/components/features/mandor/contractor-detail-testimonials";
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

  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <ContractorDetailHero contractor={contractor} />
      <ContractorDetailPortfolio contractorId={id} contractor={contractor} />
      <ContractorDetailReason contractor={contractor} />
      <ContractorDetailTestimonials contractor={contractor} />
    </main>
  );
}
