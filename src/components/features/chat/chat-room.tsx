"use client";

import Image from "next/image";
import { useState } from "react";
import PublicNavbar from "@/components/features/public/navbar";

const DUMMY_CHATS = [
  {
    id: "rio",
    name: "Rio Prasetya",
    msg: "Aman Mas Rico. Kemarin sudah...",
    time: "12:30",
    avatar: "/images/auth/login/login-illustration.png",
    count: 0,
  },
  {
    id: "asep1",
    name: "Asep Permana",
    msg: "Oke, makasi pak",
    time: "12:36",
    avatar: "/images/auth/login/login-illustration.png",
    count: 0,
  },
  {
    id: "asep2",
    name: "Asep Permana",
    msg: "Saya Setuju pak",
    time: "07:50",
    avatar: "/images/auth/login/login-illustration.png",
    count: 1,
  },
];

export default function ChatRoom({ role }: { role: "client" | "mandor" }) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [activeChatId, setActiveChatId] = useState("rio");
  const [messageText, setMessageText] = useState("");
  const counterpartLabel = role === "mandor" ? "klien" : "mandor";

  const activeChat = DUMMY_CHATS.find((c) => c.id === activeChatId);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#FEF6EE]">
      <PublicNavbar />

      <main className="flex-1 flex overflow-hidden border-t border-[var(--black-light-active)]">
        {/* SIDEBAR LEFT */}
        <aside className="w-full max-w-[22rem] bg-white border-r border-[var(--black-light-active)] flex flex-col h-full shrink-0">
          {/* Tabs Filter */}
          <div className="p-4 flex items-center gap-2">
            <button
              onClick={() => setActiveTab("Semua")}
              className={`h-[2.5rem] rounded-[2rem] px-5 font-semibold text-[0.875rem] transition-colors ${
                activeTab === "Semua"
                  ? "bg-[var(--orange-normal)] text-white"
                  : "bg-[var(--black-light)] text-[var(--text-black)] hover:bg-[#e4e4e6]"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab("Belum dibaca")}
              className={`h-[2.5rem] rounded-[2rem] px-5 font-semibold text-[0.875rem] transition-colors ${
                activeTab === "Belum dibaca"
                  ? "bg-[var(--orange-normal)] text-white"
                  : "bg-[var(--black-light)] text-[var(--text-black)] hover:bg-[#e4e4e6]"
              }`}
            >
              Belum dibaca
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4 border-b border-[var(--black-light-active)]">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari.."
                className="w-full h-[2.5rem] rounded-[2rem] border border-[var(--black-light-active)] px-4 text-[0.875rem] outline-none transition-colors focus:border-[var(--orange-normal)]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex justify-center items-center pointer-events-none">
                <Image
                  src="/images/icons/icon-chat-cari.svg"
                  alt="Cari"
                  width={20}
                  height={20}
                />
              </span>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {DUMMY_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-3 p-4 border-b border-[var(--black-light-active)] transition-colors text-left ${
                  activeChatId === chat.id
                    ? "bg-[#e4e4e6]/50"
                    : "hover:bg-[#f9f9fa]"
                }`}
              >
                <div className="relative">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover w-[2.75rem] h-[2.75rem]"
                  />
                  {chat.count > 0 && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--orange-normal)] text-[0.625rem] font-bold text-white border-2 border-white">
                      {chat.count}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-[0.938rem] text-[var(--text-black)] truncate">
                      {chat.name}
                    </h4>
                    {chat.count === 0 && (
                      <span className="text-[0.7rem] text-[var(--text-muted)]">
                        ✔
                      </span>
                    )}
                  </div>
                  <p className="text-[0.75rem] text-[var(--text-muted)] truncate">
                    {chat.msg}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* CHAT AREA RIGHT */}
        <section className="flex-1 relative flex flex-col bg-[#FAF9F5]">
          {/* Watermark Logo Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05]">
            <Image
              src="/images/logo-mandorin.svg"
              alt="MandorIn Background Watermark"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] font-medium">
              {`Pilih chat ${counterpartLabel} untuk mulai mengobrol`}
            </div>
          ) : (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 relative z-10">
                {/* Dummy Bubble 1 (Bot / Other) */}
                <div className="flex max-w-[75%] mt-4 relative">
                  <div className="bg-white rounded-[1rem] rounded-tl-none px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[var(--black-light-active)]">
                    <p className="text-[0.938rem] leading-[1.5rem] text-[var(--text-black)]">
                      Siang Mas Rico. Gimana progres renovasi dapur di rumah
                      hari ini? Kemarin saya lihat lantainya sudah mulai
                      dipasang sebagian ya?
                    </p>
                  </div>
                </div>

                {/* Dummy Bubble 2 (User / Self) */}
                <div className="flex max-w-[75%] self-end">
                  <div className="bg-[var(--orange-normal)] rounded-[1rem] rounded-tr-none px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative">
                    <p className="text-[0.938rem] leading-[1.5rem] text-white">
                      Siang Mas Rico. Betul Mas, untuk area lantai utama dapur
                      sudah beres kemarin sore. Hari ini tim saya fokus buat
                      pasang kabinet atas sama instalasi pipa wastafel yang
                      baru.
                    </p>
                    <span className="absolute bottom-1 right-3 text-[0.65rem] text-white/80">
                      12:36 ✔
                    </span>
                  </div>
                </div>

                {/* Dummy Bubble 3 (Bot / Other) */}
                <div className="flex max-w-[75%] mt-4">
                  <div className="bg-white rounded-[1rem] rounded-tl-none px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[var(--black-light-active)]">
                    <p className="text-[0.938rem] leading-[1.5rem] text-[var(--text-black)]">
                      Oh oke mantap. Mas, mau tanya soal stop kontak yang buat
                      oven kemarin. Jadi digeser kan ya posisinya? Saya agak
                      khawatir kalau terlalu dekat sama saluran air wastafelnya.
                    </p>
                  </div>
                </div>

                {/* Dummy Bubble 4 (User / Self) */}
                <div className="flex max-w-[40%] self-end mt-2">
                  <div className="bg-[var(--orange-normal)] rounded-[1rem] rounded-tr-none px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative">
                    <p className="text-[0.938rem] leading-[1.5rem] text-white">
                      Aman Mas Rico.
                    </p>
                    <span className="absolute bottom-1 right-3 text-[0.65rem] text-white/80">
                      12:36 ✔
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Input Field Bottom */}
              <div className="p-4 md:p-6 bg-transparent relative z-10 w-full flex items-center justify-center">
                <div className="bg-white border border-[var(--black-light-active)] shadow-sm rounded-[2rem] flex items-center w-full max-w-[50rem] px-2 h-[3.5rem]">
                  <button className="h-10 w-10 shrink-0 flex items-center justify-center text-[var(--orange-normal)] hover:bg-[var(--orange-normal)] hover:text-white rounded-full transition-colors font-bold text-xl overflow-hidden p-2">
                    <Image
                      src="/images/icons/icont-chat.tambah.svg"
                      alt="Tambah File"
                      width={24}
                      height={24}
                    />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Pesanmu.."
                    className="flex-1 bg-transparent px-3 text-[0.938rem] outline-none text-[var(--text-black)] placeholder:text-[var(--text-muted)]"
                  />
                  <button className="h-10 w-10 shrink-0 flex items-center justify-center text-[var(--orange-normal)] hover:bg-[var(--orange-normal)] hover:text-white rounded-full transition-colors overflow-hidden p-2">
                    <Image
                      src="/images/icons/icon-caht-kirim.svg"
                      alt="Kirim"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
