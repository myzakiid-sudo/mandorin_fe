"use client";

import { useSyncExternalStore } from "react";

import type { MandorDetail, ViewerRole } from "./types";
import MandorDetailHero from "./mandor-detail-hero";
import MandorDetailPortfolio from "./mandor-detail-portfolio";
import MandorDetailReason from "./mandor-detail-reason";
import MandorDetailTestimonials from "./mandor-detail-testimonials";

type MandorDetailContentProps = {
  mandorId: string;
  mandor: MandorDetail;
};

export default function MandorDetailContent({
  mandorId,
  mandor,
}: MandorDetailContentProps) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const storedRole = isHydrated ? localStorage.getItem("role") : null;
  const viewerRole: ViewerRole = storedRole === "mandor" ? "mandor" : "client";

  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <MandorDetailHero mandor={mandor} />
      <MandorDetailPortfolio mandorId={mandorId} mandor={mandor} />
      <MandorDetailReason
        mandorId={mandorId}
        mandor={mandor}
        viewerRole={viewerRole}
      />
      <MandorDetailTestimonials mandor={mandor} />
    </main>
  );
}
