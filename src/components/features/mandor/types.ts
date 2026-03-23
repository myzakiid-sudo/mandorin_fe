export type ContractorSummary = {
  id: string;
  name: string;
  image: string;
  specialty: string;
  projects: string;
  rating: number;
  isReady: boolean;
};

export type PortfolioItem = {
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

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type ContractorDetail = {
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
