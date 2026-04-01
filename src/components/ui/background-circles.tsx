import Image from "next/image";

export default function BackgroundCircles() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* ── Dekorasi Kiri Atas (Biru) ── */}
      <Image
        src="/images/dekorasi/bulet-biru.svg"
        alt=""
        width={400}
        height={400}
        priority
        className="absolute -left-12 -top-12 h-auto w-[16rem] opacity-90 md:-left-16 md:-top-16 md:w-[24rem] object-contain"
      />

      {/* ── Dekorasi Kanan Bawah (Oren) ── */}
      <Image
        src="/images/dekorasi/bulet-oren.svg"
        alt=""
        width={480}
        height={480}
        priority
        className="absolute -bottom-16 -right-16 h-auto w-[20rem] opacity-90 md:-bottom-24 md:-right-24 md:w-[28rem] object-contain"
      />
    </div>
  );
}
