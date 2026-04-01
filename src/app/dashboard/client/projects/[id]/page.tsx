import Link from "next/link";

import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

const milestoneSteps = [
  {
    id: 1,
    title: "Pembongkaran & Persiapan Area",
    date: "16-04-2026",
    progress: 100,
  },
  {
    id: 2,
    title: "Instalasi Jalur Air dan Listrik",
    date: "24-04-2026",
    progress: 100,
  },
  {
    id: 3,
    title: "Pemasangan Lantai dan Dinding",
    date: "03-05-2026",
    progress: 100,
  },
  {
    id: 4,
    title: "Finishing Kitchen Set",
    date: "10-05-2026",
    progress: 100,
  },
];

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allMilestonesDone = milestoneSteps.every(
    (step) => step.progress === 100,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[1rem] border border-[var(--black-light)] bg-white px-[1.25rem] py-[1.5rem] md:px-[2rem] md:py-[2rem]">
          <h1 className="text-[1.5rem] font-semibold text-[var(--text-black)] md:text-[2rem]">
            Tahapan Project (Milestone)
          </h1>

          <ol className="relative mt-6 border-s-2 border-[var(--black-light)] ps-6">
            {milestoneSteps.map((step) => (
              <li key={step.id} className="mb-5 last:mb-0">
                <span className="absolute -start-[0.72rem] mt-1 inline-flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full border-2 border-white bg-[var(--green-normal)]" />

                <article className="rounded-[0.75rem] border border-[var(--black-light)] bg-[var(--white-normal-hover)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-[1rem] font-semibold text-[var(--text-black)] md:text-[1.125rem]">
                      Tahapan {step.id}: {step.title}
                    </h2>
                    <span className="inline-flex rounded-full bg-[var(--green-normal)] px-3 py-1 text-[0.75rem] font-semibold text-white">
                      {step.progress}%
                    </span>
                  </div>

                  <p className="mt-1 text-[0.875rem] text-[var(--text-secondary)]">
                    Selesai pada: {step.date}
                  </p>
                </article>
              </li>
            ))}
          </ol>

          {allMilestonesDone ? (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/dashboard/client/projects/${id}/review`}
                className="inline-flex h-[2.75rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-4 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-normal-hover)]"
              >
                Beri Rating
              </Link>
            </div>
          ) : null}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
