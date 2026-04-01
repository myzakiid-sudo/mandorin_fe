import { notFound } from "next/navigation";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";

type BookingRequest = {
  id: string;
  fullName: string;
  surveyDate: string;
  surveyTime: string;
  email: string;
  whatsapp: string;
  city: string;
  projectAddress: string;
  message: string;
  status: "pending" | "agreed";
};

const bookingRequestById: Record<string, BookingRequest> = {
  "1": {
    id: "1",
    fullName: "Anak Agung Hendrico",
    surveyDate: "27 April 2026",
    surveyTime: "09:00",
    email: "hendrico@gmail.com",
    whatsapp: "081365517979",
    city: "Kota Malang",
    projectAddress: "Jl. Simpang Borobudur No. 45, Kec. Lowokwaru, Kota Malang",
    message: "Mau merenovasi dapur",
    status: "pending",
  },
  "2": {
    id: "2",
    fullName: "Sri Rahayu",
    surveyDate: "18 April 2026",
    surveyTime: "10:30",
    email: "sri.rahayu@gmail.com",
    whatsapp: "081234567890",
    city: "Kota Malang",
    projectAddress: "Jl. Candi Panggung No. 12, Kec. Lowokwaru, Kota Malang",
    message: "Renovasi kamar mandi utama",
    status: "agreed",
  },
  "3": {
    id: "3",
    fullName: "Budi Santoso",
    surveyDate: "10 Juni 2026",
    surveyTime: "08:00",
    email: "budi.santoso@gmail.com",
    whatsapp: "082145678901",
    city: "Kota Malang",
    projectAddress: "Jl. Galunggung No. 8, Kec. Klojen, Kota Malang",
    message: "Renovasi kamar tidur",
    status: "pending",
  },
};

type ReadonlyInputProps = {
  label: string;
  value: string;
};

function ReadonlyInput({ label, value }: ReadonlyInputProps) {
  return (
    <label className="flex flex-col gap-[0.5rem]">
      <span className="text-[1rem] font-medium leading-[1.5rem] text-[var(--text-black)] md:text-[1.125rem] md:leading-[1.75rem]">
        {label}
      </span>
      <input
        value={value}
        readOnly
        className="h-[2.5rem] rounded-[0.375rem] border border-[var(--black-light-active)] bg-white px-[0.75rem] text-[0.938rem] leading-[1.375rem] text-[var(--text-black)] outline-none md:h-[2.75rem] md:text-[1rem] md:leading-[1.5rem]"
      />
    </label>
  );
}

export default async function MandorPesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookingRequest = bookingRequestById[id];

  if (!bookingRequest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[1rem] border border-[var(--black-light)] bg-[var(--white-normal)] px-[1rem] py-[1.25rem] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.06)] md:px-[3rem] md:py-[2rem]">
          <h1 className="text-center text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)] md:text-[2.25rem] md:leading-[3rem]">
            Booking Jadwal Mandor
          </h1>

          <form className="mx-auto mt-[1.5rem] grid max-w-[65rem] grid-cols-1 gap-[0.875rem] md:mt-[2rem] md:grid-cols-2 md:gap-[1rem]">
            <div className="md:col-span-2">
              <ReadonlyInput
                label="Nama Lengkap"
                value={bookingRequest.fullName}
              />
            </div>

            <ReadonlyInput
              label="Tanggal Survei"
              value={bookingRequest.surveyDate}
            />
            <ReadonlyInput
              label="Waktu yang Diinginkan"
              value={bookingRequest.surveyTime}
            />

            <ReadonlyInput label="Alamat Email" value={bookingRequest.email} />
            <ReadonlyInput
              label="Nomor WhatsApp"
              value={bookingRequest.whatsapp}
            />

            <div className="md:col-span-2">
              <ReadonlyInput
                label="Kota / Wilayah"
                value={bookingRequest.city}
              />
            </div>

            <div className="md:col-span-2">
              <ReadonlyInput
                label="Alamat Lengkap Proyek"
                value={bookingRequest.projectAddress}
              />
            </div>

            <div className="md:col-span-2">
              <ReadonlyInput
                label="Detail Kebutuhan (Pesan)"
                value={bookingRequest.message}
              />
            </div>

            {bookingRequest.status === "pending" && (
              <>
                <p className="text-[0.75rem] leading-[1.125rem] text-[var(--text-muted)] md:col-span-2 md:text-[0.875rem] md:leading-[1.25rem]">
                  Dengan mengirim formulir ini, Anda setuju bahwa data di atas akan
                  digunakan untuk keperluan survei dan jadwal konsultasi.
                </p>

                <div className="mt-[0.25rem] flex flex-col items-center gap-[0.625rem] md:col-span-2">
                  <a
                    href={`/dashboard/mandor/pesanan/${id}/target`}
                    className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[#2e2e31] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-black"
                  >
                    Setuju
                  </a>

                  <button
                    type="button"
                    className="inline-flex h-[2.5rem] w-full max-w-[18rem] items-center justify-center rounded-[0.5rem] bg-[var(--red-normal)] text-[0.938rem] font-semibold leading-[1.375rem] text-white transition-colors hover:bg-[#c81d1d]"
                  >
                    Tidak Setuju
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
