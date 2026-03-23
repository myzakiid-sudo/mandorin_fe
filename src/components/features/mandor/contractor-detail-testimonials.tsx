import Image from "next/image";

import type { ContractorDetail } from "./types";

type ContractorDetailTestimonialsProps = {
  contractor: ContractorDetail;
};

export default function ContractorDetailTestimonials({
  contractor,
}: ContractorDetailTestimonialsProps) {
  return (
    <section className="bg-[#ececf3]">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-12 md:px-10 md:py-16 xl:px-[6.25rem]">
        <h2 className="text-center text-3xl font-semibold leading-tight text-[var(--text-black)] md:text-4xl">
          Testimoni Pelanggan
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {contractor.testimonials.map((testimonial) => (
            <article key={testimonial.id} className="text-center">
              <div className="rounded-[1.25rem] bg-white px-5 py-6 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.06)]">
                <p className="text-sm leading-7 text-[var(--text-black)] md:text-base">
                  {testimonial.quote}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--orange-normal)]">
                  ★★★★★
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="3rem"
                  />
                </div>
                <p className="mt-3 text-lg font-semibold leading-7 text-[var(--text-black)]">
                  {testimonial.name}
                </p>
                <p className="text-base leading-7 text-[var(--text-secondary)]">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--blue-normal)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c5c5c5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c5c5c5]" />
        </div>
      </div>
    </section>
  );
}
