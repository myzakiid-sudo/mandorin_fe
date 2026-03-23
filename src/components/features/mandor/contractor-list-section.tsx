import Image from "next/image";
import Link from "next/link";

import { contractorList } from "./data";

export default function ContractorListSection() {
  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <section className="mx-auto w-full max-w-[90rem] px-5 py-12 md:px-10 md:py-16 xl:px-[6.25rem]">
        <header className="mx-auto max-w-[48rem] text-center">
          <h1 className="text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
            Mitra Mandor Berpengalaman
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)] md:text-lg">
            Halaman ini sementara dipakai sebagai contractor list kasar sebelum
            versi final dirilis.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {contractorList.map((contractor) => (
            <article
              key={contractor.id}
              className="rounded-[1.5rem] border border-[#f2cfab] bg-white p-6 shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#eef1ff]">
                  <Image
                    src={contractor.image}
                    alt={contractor.name}
                    fill
                    className="object-cover object-[70%_20%]"
                    sizes="5rem"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-semibold leading-8 text-[var(--text-black)]">
                    {contractor.name}
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {contractor.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {contractor.projects}
                  </p>
                  <p className="text-sm font-semibold leading-6 text-[var(--orange-normal)]">
                    {"★".repeat(contractor.rating)}
                  </p>
                </div>

                {contractor.isReady ? (
                  <Link
                    href={`/mandor/${contractor.id}`}
                    aria-label={`Lihat detail ${contractor.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--orange-normal)] text-white transition-colors hover:bg-[var(--orange-dark)]"
                  >
                    →
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-label={`Detail ${contractor.name} belum tersedia`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--white-normal-active)] text-[var(--text-secondary)]"
                  >
                    →
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
