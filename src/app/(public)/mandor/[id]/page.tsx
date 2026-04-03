import MandorDetailContent from "@/components/features/mandor/mandor-detail-content";
import { mapForemanToMandorDetail } from "@/components/features/mandor/foreman-mapper";
import DetailNotFound from "@/components/features/mandor/detail-not-found";
import { getForemanById } from "@/lib/foreman-api";

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

  return <MandorDetailContent mandorId={id} mandor={mandor} />;
}
