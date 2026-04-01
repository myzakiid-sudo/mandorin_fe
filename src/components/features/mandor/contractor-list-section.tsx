"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { contractorList } from "./data";

const tierOptions = ["Semua", "Gold", "Silver", "Bronze"] as const;

const tierClassName: Record<"Gold" | "Silver" | "Bronze", string> = {
  Gold: "bg-[#b48a1f] text-white",
  Silver: "bg-[#7f7f7f] text-white",
  Bronze: "bg-[#a7673d] text-white",
};

const heroRotation = [
  { id: "rio-prasetya", years: "15+", name: "Rio Prasetya" },
  { id: "aris-setiawan", years: "7+", name: "Aris Setiawan" },
  { id: "budiwarman", years: "5+", name: "Budiwarman" },
  { id: "ahmad-zaelani", years: "12+", name: "Ahmad Zaelani" },
  { id: "nanang-sherman", years: "8+", name: "Nanang Suherman" },
  { id: "bambang", years: "8+", name: "Bambang" },
] as const;

export default function ContractorListSection() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<(typeof tierOptions)[number]>("Semua");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroProfiles = useMemo(
    () =>
      heroRotation.map((item) => {
        const contractor = contractorList.find((value) => value.id === item.id);

        return {
          id: item.id,
          years: item.years,
          name: item.name,
          image:
            contractor?.image ?? "/images/mandor/mandor-rio%20prasetyaa.png",
        };
      }),
    [],
  );

  useEffect(() => {
    if (heroProfiles.length < 2) return;

    const rotationTimer = window.setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroProfiles.length);
    }, 3500);

    return () => window.clearInterval(rotationTimer);
  }, [heroProfiles.length]);

  const filteredContractors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contractorList.filter((contractor) => {
      const isTierMatch = tier === "Semua" ? true : contractor.tier === tier;
      const isQueryMatch =
        query.length === 0
          ? true
          : contractor.name.toLowerCase().includes(query) ||
            contractor.specialty.toLowerCase().includes(query);

      return isTierMatch && isQueryMatch;
    });
  }, [search, tier]);

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-[var(--blue-dark)]">
        <div className="mx-auto w-full max-w-[90rem] overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeHeroIndex * 100}%)` }}
          >
            {heroProfiles.map((profile, index) => (
              <div key={profile.id} className="w-full shrink-0">
                <div className="grid w-full gap-10 px-5 pb-10 pt-8 md:px-10 md:pb-12 md:pt-12 xl:grid-cols-[1.05fr_0.95fr] xl:px-[6.25rem]">
                  <div className="self-center">
                    <h1 className="max-w-[16ch] text-[2rem] font-bold leading-[1.25] text-[var(--text-yellow)] md:text-[3rem]">
                      Solusi Terpercaya untuk Membangun dan Renovasi Hunian Anda
                    </h1>
                    <p className="mt-4 max-w-[34rem] text-[1rem] leading-7 text-white/90 md:text-[1.125rem]">
                      Wujudkan hunian impian Anda di Malang dengan mandor
                      terverifikasi, kontrak digital yang sah, dan laporan
                      progres harian langsung ke ponsel Anda.
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex items-center">
                        {[
                          "/images/beranda/tertimoni-cewe.png",
                          "/images/beranda/testimoni-cowo-1.png",
                          "/images/beranda/testimoni-cowo-2.png",
                        ].map((avatar, avatarIndex) => (
                          <Image
                            key={avatar}
                            src={avatar}
                            alt="Pemilik rumah"
                            width={52}
                            height={52}
                            className={`h-12 w-12 rounded-full border-2 border-white object-cover ${
                              avatarIndex === 0 ? "" : "-ml-4"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[1rem] font-medium text-white">
                        10.000+ Pemilik Rumah Puas
                      </p>
                    </div>

                    <div className="mt-8">
                      <p className="text-[2.25rem] font-bold leading-none text-white">
                        {profile.years}
                      </p>
                      <p className="text-[1rem] text-white/90">
                        Tahun Pengalaman
                      </p>
                    </div>
                  </div>

                  <div className="relative mx-auto w-full max-w-[30rem] self-end">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={620}
                      height={760}
                      priority={index === 0}
                      className="mx-auto h-auto w-full object-contain"
                    />

                    <div className="absolute bottom-5 left-1/2 flex w-[17rem] -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#f0e4d5] px-3 py-2.5 shadow-[0_0.75rem_1.5rem_rgba(0,0,0,0.2)] md:bottom-8 md:left-12 md:translate-x-0">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-[0.875rem] font-semibold leading-tight text-[var(--text-black)]">
                          {profile.name}
                        </p>
                        <p className="text-[0.75rem] leading-tight text-[var(--orange-normal)]">
                        <Image
                          src="/images/icons/icon-5bintang.svg"
                          alt="Rating 5 Bintang"
                          width={60}
                          height={12}
                        />
                        </p>
                      </div>
                        <Image
                          src="/images/icons/icon-panahkanan.svg"
                          alt="arrow"
                          width={18}
                          height={18}
                          aria-hidden="true"
                        />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[90rem] px-5 py-12 md:px-10 md:py-16 xl:px-[6.25rem]">
        <header className="mx-auto max-w-[46rem] text-center">
          <h2 className="text-[2rem] font-semibold leading-tight text-[var(--text-black)] md:text-[2.375rem]">
            Mitra Mandor Berpengalaman
          </h2>
          <p className="mt-3 text-[1rem] leading-7 text-[var(--text-secondary)] md:text-[1.125rem]">
            Temukan mandor ahli dengan portofolio teruji untuk mewujudkan hunian
            impian Anda.
          </p>
        </header>

        <div className="mx-auto mt-8 flex w-full max-w-[34rem] flex-col gap-3 sm:flex-row">
          <label
            htmlFor="search-mandor"
            className="flex flex-1 items-center gap-2 rounded-xl border border-[#c8c8c8] bg-white px-3"
          >
            <Image
              src="/images/icons/icon-pencarian.svg"
              alt="Search"
              width={20}
              height={20}
              className="h-5 w-5 opacity-50"
              aria-hidden="true"
            />
            <input
              id="search-mandor"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau layanan"
              className="h-11 w-full bg-transparent text-[0.95rem] text-[var(--text-black)] outline-none placeholder:text-[var(--text-secondary)]"
            />
          </label>

          <div className="relative sm:w-[10rem]">
            <select
              aria-label="Filter level mandor"
              value={tier}
              onChange={(event) =>
                setTier(event.target.value as (typeof tierOptions)[number])
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#c8c8c8] bg-white px-4 pr-9 text-[0.95rem] text-[var(--text-black)] outline-none"
            >
              {tierOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "Semua" ? "Filter" : option}
                </option>
              ))}
            </select>
            <Image
              src="/images/icons/icon-dropdown.svg"
              alt="Dropdown"
              width={16}
              height={16}
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredContractors.map((contractor) => (
            <article
              key={contractor.id}
              className="group relative overflow-hidden rounded-[1.25rem] border border-[#f0af5f] bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full border border-[var(--orange-normal)] bg-white px-3 py-1 text-[0.75rem] font-medium leading-none text-[var(--orange-normal)]">
                  {contractor.projectCount} Proyek
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[0.75rem] font-medium leading-none ${tierClassName[contractor.tier]}`}
                >
                  {contractor.tier}
                </span>
              </div>

              <div className="relative h-[16rem] w-full overflow-hidden rounded-xl bg-white md:h-[17rem]">
                <div className="relative h-full w-full">
                  <Image
                    src={contractor.image}
                    alt={contractor.name}
                    fill
                    className="object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-[1rem] bg-white px-3 py-2">
                <Image
                  src={contractor.image}
                  alt={`${contractor.name} avatar`}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full bg-white object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[1rem] font-semibold leading-tight text-[var(--text-black)]">
                    {contractor.name}
                  </h3>
                  <p className="truncate text-[0.8rem] leading-tight text-[var(--text-secondary)]">
                    {contractor.specialty}
                  </p>
                </div>

                {contractor.isReady ? (
                  <Link
                    href={`/mandor/${contractor.id}`}
                    aria-label={`Lihat detail ${contractor.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[1rem] font-bold text-[var(--text-black)] transition-colors hover:bg-[var(--orange-light)]"
                  >
                    <Image src="/images/icons/icon-panahkanan.svg" alt="Go" width={16} height={16} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-label={`Detail ${contractor.name} belum tersedia`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--white-normal)] text-[1rem] text-[var(--text-secondary)]"
                  >
                    <Image src="/images/icons/icon-panahkanan.svg" alt="Go disabled" width={16} height={16} className="opacity-40" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredContractors.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d5d5d5] bg-white px-5 py-8 text-center text-[var(--text-secondary)]">
            Mandor tidak ditemukan. Coba kata kunci lain atau ganti filter.
          </div>
        ) : null}
      </section>
    </main>
  );
}
