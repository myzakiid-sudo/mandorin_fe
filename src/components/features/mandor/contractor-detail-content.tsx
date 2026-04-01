"use client";

import { useSyncExternalStore } from "react";

import type { ContractorDetail, ViewerRole } from "./types";
import ContractorDetailHero from "./contractor-detail-hero";
import ContractorDetailPortfolio from "./contractor-detail-portfolio";
import ContractorDetailReason from "./contractor-detail-reason";
import ContractorDetailTestimonials from "./contractor-detail-testimonials";

type ContractorDetailContentProps = {
  contractorId: string;
  contractor: ContractorDetail;
};

export default function ContractorDetailContent({
  contractorId,
  contractor,
}: ContractorDetailContentProps) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const storedRole = isHydrated ? localStorage.getItem("role") : null;
  const viewerRole: ViewerRole = storedRole === "mandor" ? "mandor" : "client";

  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <ContractorDetailHero contractor={contractor} />
      <ContractorDetailPortfolio
        contractorId={contractorId}
        contractor={contractor}
      />
      <ContractorDetailReason
        contractorId={contractorId}
        contractor={contractor}
        viewerRole={viewerRole}
      />
      <ContractorDetailTestimonials contractor={contractor} />
    </main>
  );
}
