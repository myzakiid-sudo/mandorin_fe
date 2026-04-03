import Image from "next/image";
import Link from "next/link";

import type { MandorDetail } from "./types";

type MandorDetailHeroProps = {
  mandor: MandorDetail;
};

export default function MandorDetailHero({
  mandor,
}: MandorDetailHeroProps) {
  return (
    <section className="bg-[#ececec]">
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-0 pt-8 md:px-10 md:pt-10 xl:px-[6.25rem]">
        <Link
          href="/mandor"
          className="inline-flex items-center text-sm font-semibold text-[var(--orange-normal)] hover:text-[var(--orange-dark)]"
        >
          ← Kembali ke Daftar Mandor
        </Link>

        <div className="mt-6 grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_1.05fr]">
          <div className="pb-4 md:pb-16">
            <h1 className="text-[2.25rem] font-semibold leading-tight text-[#21315f] md:text-[3.25rem]">
              {mandor.name}
            </h1>
            <p className="mt-4 max-w-[34rem] text-base leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
              {mandor.shortBio}
            </p>
          </div>

          <div className="relative mx-auto h-[26rem] w-full max-w-[30rem] md:h-[36rem] md:max-w-[34rem]">
            <Image
              src={mandor.heroImage}
              alt={mandor.name}
              fill
              className="object-contain object-bottom"
              sizes="(min-width: 768px) 34rem, 100vw"
              priority
            />
          </div>
        </div>

        <article className="relative z-10 mx-auto -mb-8 mt-4 w-full rounded-[1.5rem] bg-[var(--blue-dark)] px-6 py-7 text-white shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.15)] md:-mb-12 md:px-10 md:py-9">
          <h2 className="text-3xl font-semibold leading-tight">
            {mandor.name}
          </h2>
          <div className="mt-4 space-y-5 text-[1.0625rem] leading-8 text-[var(--white-normal-hover)]">
            {mandor.longBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
