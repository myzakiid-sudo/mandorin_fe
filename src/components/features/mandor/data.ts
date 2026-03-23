import type { ContractorDetail, ContractorSummary } from "./types";

export const contractorList: ContractorSummary[] = [
  {
    id: "rio-prasetya",
    name: "Rio Prasetya",
    image: "/images/mandor/mandor-rio%20prasetya.png",
    specialty: "Spesialis renovasi rumah minimalis",
    projects: "50+ proyek selesai",
    rating: 5,
    isReady: true,
  },
  {
    id: "aris-setiawan",
    name: "Aris Setiawan",
    image: "/images/mandor/mandor-rio%20prasetya.png",
    specialty: "Spesialis interior dan plumbing",
    projects: "34+ proyek selesai",
    rating: 5,
    isReady: false,
  },
  {
    id: "ahmad-zaelani",
    name: "Ahmad Zaelani",
    image: "/images/mandor/mandor-rio%20prasetya.png",
    specialty: "Spesialis renovasi fasad rumah",
    projects: "28+ proyek selesai",
    rating: 5,
    isReady: false,
  },
];

export const contractorById: Record<string, ContractorDetail> = {
  "rio-prasetya": {
    name: "Rio Prasetya",
    shortBio:
      "Spesialis bangun rumah minimalis dan penambahan lantai. Telah sukses menyelesaikan 50+ proyek dengan tingkat kepuasan pelanggan yang tinggi.",
    longBio: [
      "Rio Prasetya adalah mandor terverifikasi dan berpengalaman di Malang, spesialis dalam renovasi rumah modern dan pembangunan hunian minimalis. Dengan keahlian mendalam dalam manajemen material dan struktur bangunan, ia menawarkan layanan konstruksi yang teliti dan disesuaikan dengan kebutuhan setiap pemilik rumah.",
      "Dikenal karena pendekatannya yang transparan dan disiplin, Rio selalu mengutamakan komunikasi aktif melalui laporan progres harian. Ia merupakan mitra mandor senior di platform kami yang berkomitmen untuk menjaga standar keamanan kerja serta kualitas finishing yang presisi di setiap proyeknya.",
      "Rio memberikan solusi pembangunan yang tenang, jujur, dan berkualitas tinggi yang bisa Anda percayakan sepenuhnya.",
    ],
    reason:
      "Rio Prasetya adalah mandor berlisensi yang berdedikasi untuk memberikan hasil pembangunan berbasis standar teknis yang kokoh, dengan memprioritaskan keamanan dan kenyamanan pemilik rumah. Dengan pengalaman lebih, ia memastikan setiap detail konstruksi direncanakan dengan matang agar hunian Anda terbangun dengan sempurna dan tenang.",
    experience: "15+ tahun pengalaman",
    completedProjects: "50+ proyek selesai",
    heroImage: "/images/mandor/mandor-rio%20prasetya.png",
    portfolio: [
      {
        id: "porto-1",
        title: "Bangun Rumah",
        description: "Proyek renovasi kabin bergaya minimalis.",
        year: "2026",
        image: "/images/mandor/rumah-1.png",
        location: "Kec. Kedungkandang, Kota Malang",
        status: "Selesai (100%)",
        duration: "4 Bulan",
        area: "90 m²",
        details:
          "Proyek renovasi kabin bergaya minimalis di area suburban. Fokus pada penggunaan material kayu ramah lingkungan dengan finishing cat putih yang bersih untuk kesan luas dan hangat. Pengerjaan mencakup penguatan struktur atap, pemasangan jendela besar untuk ventilasi silang, dan optimasi ruang terbuka hijau di sekeliling rumah.",
      },
      {
        id: "porto-2",
        title: "Bangun Rumah",
        description: "Proyek pembangunan rumah tinggal.",
        year: "2025",
        image: "/images/mandor/rumah-2.png",
        location: "Kec. Lowokwaru, Kota Malang",
        status: "Selesai (100%)",
        duration: "10 Bulan",
        area: "250 m²",
        details:
          "Proyek pembangunan rumah tinggal dua lantai dengan konsep klasik modern yang megah. Fokus pengerjaan meliputi struktur bangunan yang kokoh, fasad menggunakan bata ekspos berkualitas tinggi, dan finishing interior yang elegan. Desain ini mengutamakan kenyamanan dengan ruang tamu luas dan pencahayaan alami maksimal.",
      },
      {
        id: "porto-3",
        title: "Bangun Rumah",
        description: "Proyek pembangunan rumah tinggal.",
        year: "2025",
        image: "/images/mandor/rumah-3.png",
        location: "Kec. Klojen, Kota Malang",
        status: "Selesai (100%)",
        duration: "2 Bulan",
        area: "25 m²",
        details:
          "Transformasi area dapur lama menjadi ruang masak modern dengan konsep open space yang terhubung ke ruang makan. Fokus pengerjaan mencakup pemasangan kitchen set kustom dengan material finishing HPL premium, instalasi sistem pencahayaan LED tersembunyi, serta optimasi tata letak peralatan dapur untuk alur kerja yang lebih efisien dan nyaman.",
      },
    ],
    testimonials: [
      {
        id: "t-1",
        quote:
          "Sangat terbantu bisa pantau progres renovasi dapur lewat foto harian di aplikasi tanpa harus bolak-balik ke lokasi proyek.",
        name: "Sari Rahayu",
        role: "Ibu Rumah Tangga",
        avatar: "/images/beranda/tertimoni-cewe.png",
      },
      {
        id: "t-2",
        quote:
          "Awalnya takut tertipu, tapi di Mandorin ada kontrak digitalnya. Jadi merasa aman karena semua kesepakatan tertulis jelas dan sah secara hukum.",
        name: "Budi Santoso",
        role: "Karyawan Swasta",
        avatar: "/images/beranda/testimoni-cowo-1.png",
      },
      {
        id: "t-3",
        quote:
          "Mandornya benar-benar ahli dan komunikatif. Portofolionya asli, pengerjaan rapi, dan yang paling penting selesai tepat waktu sesuai jadwal.",
        name: "Anak Agung Hendrico",
        role: "Pilot",
        avatar: "/images/beranda/testimoni-cowo-2.png",
      },
    ],
  },
};
