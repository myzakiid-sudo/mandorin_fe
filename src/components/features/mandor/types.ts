export type MandorSummary = {
  id: string;
  name: string;
  image: string;
  specialty: string;
  projects: string;
  projectCount: number;
  experienceYears?: number;
  tier: "Gold" | "Silver" | "Bronze";
  rating: number;
  isReady: boolean;
};

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  year: string;
  image: string;
  location: string;
  status: string;
  duration: string;
  area: string;
  details: string;
};

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type MandorDetail = {
  name: string;
  shortBio: string;
  longBio: string[];
  reason: string;
  experience: string;
  completedProjects: string;
  heroImage: string;
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
};

export type ViewerRole = "client" | "mandor";
