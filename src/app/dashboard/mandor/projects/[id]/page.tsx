import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/features/public/navbar";
import PublicFooter from "@/components/features/public/footer";

const timelineSteps = [
  { title: "Persiapan & Fondasi", date: "16-04-2026 07:30:00", status: "completed" },
  { title: "Struktur Utama & Dinding", date: "1-05-2026 12:30:00", status: "completed" },
  { title: "Konstruksi Atap", date: "", status: "current" },
  { title: "Instalasi & MEP", date: "", status: "upcoming" },
  { title: "Finishing & Interior", date: "15-05-2026 16:30:00", status: "upcoming" },
];

const progressReports = [
  {
    id: 1,
    date: "Rabu, 17 Juni 2026",
    image: "/images/auth/login/login-illustration.png", // placeholder
    desc: "Proses pengecatan seluruh dinding ruang tamu telah selesai dilakukan dengan total 3 lapis pengecatan untuk hasil warna yang maksimal. Hari ini tim fokus pada pembersihan sisa-sisa percikan cat pada lantai granit dan mulai memasang kembali penutup saklar serta stop kontak.",
  },
  {
    id: 2,
    date: "Selasa, 16 Juni 2026",
    image: "/images/auth/login/login-illustration.png", // placeholder
    desc: "Hari ini tim fokus pada pembersihan sisa bongkaran dinding dan memulai pemasangan keramik dinding area dapur. Progres pengerjaan berjalan sesuai jadwal dengan total capaian 15% dari keseluruhan tahap renovasi interior. Material tambahan berupa semen instan telah tiba di lokasi.",
  },
  {
    id: 3,
    date: "Senin, 15 Juni 2026",
    image: "/images/auth/login/login-illustration.png", // placeholder
    desc: "Hari ini tim fokus pada distribusi material batu batako ke titik area dinding luar bangunan. Material batako dengan ukuran standar telah tiba di lokasi dalam kondisi baik dan siap digunakan. Pemasangan baris pertama dinding luar sedang berlangsung untuk menentukan kelurusan presisi struktural.",
  },
];

export default function DailyProgressPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 w-full mx-auto max-w-[90rem]">
        {/* Header Profile Section */}
        <div className="border-b border-[var(--black-light-active)]">
          <div className="px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2.5rem] xl:px-[6.25rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-mandorin.svg" // fallback avatar
                alt="Rio Prasetya"
                width={64}
                height={64}
                className="rounded-full object-cover w-[4rem] h-[4rem] border border-[var(--black-light)]"
              />
              <div>
                <h2 className="text-[1.25rem] md:text-[1.5rem] font-semibold text-[var(--text-black)]">
                  Rio Prasetya
                </h2>
                <p className="text-[0.875rem] md:text-[1rem] text-[var(--text-secondary)]">
                  Renovasi Interior & Konstruksi Atap
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/mandor/chat"
                className="hidden md:inline-flex h-[2.5rem] items-center justify-center rounded-[2rem] bg-[var(--orange-normal)] px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)] shadow-sm"
              >
                Pesan
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <section className="px-[1rem] py-[2rem] md:px-[2.5rem] md:py-[4rem] xl:px-[6.25rem] flex flex-col items-center">
          <h1 className="text-[1.5rem] md:text-[2rem] font-bold text-[var(--text-black)] mb-[3rem]">
            Timeline Utama Pengerjaan
          </h1>

          <div className="relative w-full max-w-[65rem] flex justify-between items-start mt-[1.5rem]">
            {/* Horizontal Line Connector */}
            <div className="absolute top-[2.5rem] left-[5%] right-[5%] h-[4px] bg-[#d9d9d9] -z-10" />
            <div
              className="absolute top-[2.5rem] left-[5%] h-[4px] bg-[var(--green-normal)] -z-10"
              style={{ width: "45%" }} // mockup line progress
            />

            {timelineSteps.map((step, idx) => {
              const boxStyle =
                step.status === "completed" || step.status === "current"
                  ? "border-[var(--orange-normal)] shadow-sm"
                  : "border-[var(--black-light)] opacity-70";
              const iconBg =
                step.status === "completed" || step.status === "current"
                  ? "bg-[var(--orange-normal)] text-white"
                  : "bg-[#d9d9d9] text-white";

              return (
                <div key={idx} className="relative flex flex-col items-center flex-1 max-w-[12rem] px-2 text-center group">
                  <div className={`absolute -top-[1.25rem] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${iconBg} shadow-sm border-2 border-white`}>
                    <Image src="/images/icons/icon-progres-centang.svg" alt="Selesai" width={16} height={16} />
                  </div>
                  <div className={`mt-2 w-full h-[6.5rem] bg-white rounded-xl border flex flex-col items-center justify-center p-3 transition-transform ${boxStyle}`}>
                    <span className="text-[0.875rem] md:text-[0.938rem] font-medium leading-[1.25rem] text-[var(--text-black)] mb-1">
                      {step.title}
                    </span>
                    {step.date && (
                      <span className="text-[0.65rem] md:text-[0.75rem] text-[var(--text-muted)]">
                        {step.date}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Button: Unggah Progres */}
        <div className="w-full flex justify-end px-[1rem] md:px-[2.5rem] xl:px-[6.25rem] mb-[1.5rem]">
            <button className="h-[2.75rem] inline-flex items-center justify-center rounded-[0.5rem] border border-[var(--orange-normal)] text-[var(--orange-normal)] px-6 text-[0.938rem] font-semibold transition-colors hover:bg-[var(--orange-normal)] hover:text-white shadow-sm">
                + Tambah Progres Harian
            </button>
        </div>

        {/* Daily Progress Cards Background */}
        <div className="bg-[#FAF9F5] w-full px-[1rem] py-[3rem] md:px-[2.5rem] xl:px-[6.25rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[80rem] mx-auto">
            {progressReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-[var(--black-light-active)] h-fit"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[1rem] font-bold text-[var(--text-black)]">
                      Rio Prasetya
                    </h3>
                    <p className="text-[0.875rem] text-[var(--text-muted)]">
                      {report.date}
                    </p>
                  </div>
                  <button className="text-[var(--text-black)] p-1 hover:opacity-70">
                    <Image src="/images/icons/icon-progres-panahlengkung.svg" alt="Bagikan" width={20} height={20} />
                  </button>
                </div>

                {/* Card Image */}
                <div className="relative w-full h-[10rem] mb-4 bg-gray-200 rounded-xl overflow-hidden">
                  <Image
                    src={report.image}
                    alt={report.date}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Content */}
                <p className="text-[0.875rem] leading-[1.4rem] text-[var(--text-secondary)] text-justify">
                  <span className="font-bold text-[var(--text-black)]">Rio Prasetya </span>
                  {report.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
