import Image from "next/image";
import Link from "next/link";

import type { ContractorDetail } from "./types";

type ContractorDetailPortfolioProps = {
  contractorId: string;
  contractor: ContractorDetail;
};

export default function ContractorDetailPortfolio({
  contractorId,
  contractor,
}: ContractorDetailPortfolioProps) {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24 xl:px-[6.25rem]">
      <h2 className="text-center text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
        Rekam Jejak & Portofolio {contractor.name}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {contractor.portfolio.map((item) => (
          <Link
            key={item.id}
            href={`/mandor/${contractorId}/portfolio/${item.id}`}
            aria-label={`Lihat detail proyek ${item.title}`}
            className="group relative overflow-hidden rounded-[1.25rem] bg-black"
          >
            <div className="relative h-[14rem] w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-black/10 px-4 pb-4 pt-8 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/70 px-3 py-1 text-xs font-semibold leading-5">
                  {item.title}
                </span>
                <span className="rounded-full border border-white/70 px-3 py-1 text-xs font-semibold leading-5">
                  {item.year}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-sm leading-6 text-white/90">
                  {item.description}
                </p>
                <span className="text-lg leading-none">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
