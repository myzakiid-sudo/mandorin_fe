import { redirect } from "next/navigation";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ mandorId: string }>;
}) {
  const { mandorId } = await params;
  redirect(
    `/dashboard/client/pesanan?mandorId=${encodeURIComponent(mandorId)}`,
  );
}
