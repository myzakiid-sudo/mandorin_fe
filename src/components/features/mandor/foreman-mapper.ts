import type { ForemanProfile } from "@/lib/foreman-api";

import type { MandorDetail, MandorSummary } from "./types";

const FALLBACK_IMAGE = "/images/mandor/mandor-rio%20prasetyaa.png";

const resolveTier = (experience: number): "Gold" | "Silver" | "Bronze" => {
  if (experience >= 10) return "Gold";
  if (experience >= 5) return "Silver";
  return "Bronze";
};

export const mapForemanToMandorSummary = (
  item: ForemanProfile,
): MandorSummary => {
  const experienceYears = Number(item.experience) || 0;

  return {
    id: String(item.id),
    name: item.name,
    image: item.avatar || FALLBACK_IMAGE,
    specialty: item.field || "Spesialis Konstruksi",
    projects: item.field || "Layanan Konstruksi",
    projectCount: 0,
    experienceYears,
    tier: resolveTier(experienceYears),
    rating: 5,
    isReady: true,
  };
};

export const mapForemanToMandorDetail = (
  item: ForemanProfile,
): MandorDetail => {
  const experienceYears = Number(item.experience) || 0;
  const firstParagraph =
    item.bio?.trim() ||
    `Spesialis ${item.field || "konstruksi"} dengan pengalaman ${experienceYears} tahun.`;
  const secondParagraph =
    item.strength?.trim() ||
    "Siap membantu proyek Anda dengan komunikasi transparan dan pengerjaan tepat waktu.";

  const longBio =
    firstParagraph === secondParagraph
      ? [firstParagraph]
      : [firstParagraph, secondParagraph];

  return {
    name: item.name,
    shortBio: firstParagraph,
    longBio,
    reason: secondParagraph,
    experience: `${experienceYears}+ tahun pengalaman`,
    completedProjects:
      experienceYears > 0 ? `${experienceYears}+ tahun pengalaman` : "-",
    heroImage: item.avatar || FALLBACK_IMAGE,
    portfolio: item.portfolio
      ? [
          {
            id: "api-portfolio",
            title: item.field || "Portofolio Proyek",
            description: `Portofolio ${item.name}`,
            year: String(new Date().getFullYear()),
            image: item.portfolio,
            location: item.address || "Lokasi proyek belum tersedia",
            status: "Selesai",
            duration: "-",
            area: "-",
            details:
              item.bio?.trim() ||
              "Detail portofolio belum tersedia dari backend.",
          },
        ]
      : [],
    testimonials: [],
  };
};
