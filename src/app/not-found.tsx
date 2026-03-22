import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-6 py-10"
      style={{ backgroundColor: "var(--white-normal)" }}
    >
      <section
        className="w-full max-w-[44rem] rounded-2xl border p-6 md:p-10 text-center shadow-sm"
        style={{ borderColor: "var(--black-light)", backgroundColor: "white" }}
      >
        <div className="mx-auto mb-6 w-full max-w-[22rem]">
          <Image
            src="/images/states/error/not-found-illustration.png"
            alt="Halaman tidak ditemukan"
            width={352}
            height={352}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <h1
          className="text-[1.75rem] leading-[2.25rem] font-semibold mb-2"
          style={{ color: "var(--text-black)" }}
        >
          Halaman tidak ditemukan
        </h1>
        <p
          className="text-[1rem] leading-[1.5rem] mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg px-6 h-[3rem] text-[1rem] leading-[1.5rem] font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--orange-normal)", color: "white" }}
        >
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}
