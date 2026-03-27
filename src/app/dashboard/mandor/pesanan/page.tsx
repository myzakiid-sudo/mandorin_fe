"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";

type OrderTab = "berlangsung" | "selesai";

type MandorOrder = {
  id: number;
  clientName: string;
  projectName: string;
  date: string;
  image: string;
};

const ongoingOrders: MandorOrder[] = [
  {
    id: 1,
    clientName: "Anak Agung Hendrico",
    projectName: "Renovasi Dapur",
    date: "23/10/26",
    image: "/images/beranda/testimoni-cowo-2.png",
  },
  {
    id: 2,
    clientName: "Sri Rahayu",
    projectName: "Renovasi Kamar Mandi",
    date: "16/6/26",
    image: "/images/beranda/tertimoni-cewe.png",
  },
];

const completedOrders: MandorOrder[] = [
  {
    id: 3,
    clientName: "Budi Santoso",
    projectName: "Renovasi Kamar",
    date: "10/6/26",
    image: "/images/beranda/testimoni-cowo-1.png",
  },
];

const tabLabel: Record<OrderTab, string> = {
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

export default function MandorPesananPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("berlangsung");

  const orderList = useMemo(
    () => (activeTab === "berlangsung" ? ongoingOrders : completedOrders),
    [activeTab],
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-[90rem] px-[1rem] py-[1.5rem] md:px-[2.5rem] md:py-[2rem] xl:px-[6.25rem]">
        <section className="rounded-[0.75rem] bg-[var(--white-normal)] p-[1rem] md:p-[1.5rem]">
          <h1 className="text-[1.75rem] font-semibold leading-[2.5rem] text-[var(--text-black)]">
            Riwayat Pesanan
          </h1>

          <div className="mt-[0.75rem] flex items-center gap-[0.75rem]">
            {(Object.keys(tabLabel) as OrderTab[]).map((tabKey) => {
              const isActive = activeTab === tabKey;

              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTab(tabKey)}
                  className={`min-w-[5.75rem] rounded-[0.5rem] px-[0.875rem] py-[0.5rem] text-[1.125rem] font-semibold leading-[1.75rem] transition-colors ${
                    isActive
                      ? "bg-[var(--orange-normal)] text-[var(--text-white)]"
                      : "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)] hover:bg-[var(--black-light-hover)]"
                  }`}
                >
                  {tabLabel[tabKey]}
                </button>
              );
            })}
          </div>

          <div className="mt-[1rem] overflow-hidden rounded-[0.5rem] border border-[var(--black-light)] bg-[var(--white-normal)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse">
                <thead className="bg-[var(--orange-normal)] text-[var(--text-white)]">
                  <tr>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Nama
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-left text-[1.125rem] font-semibold leading-[1.75rem]">
                      Tanggal
                    </th>
                    <th className="px-[1rem] py-[0.5rem] text-right text-[1.125rem] font-semibold leading-[1.75rem]">
                      Lihat Detail
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orderList.map((order) => (
                    <tr
                      key={`${activeTab}-${order.id}`}
                      className="border-t border-[var(--black-light)]"
                    >
                      <td className="px-[1rem] py-[0.5rem]">
                        <div className="flex items-center gap-[0.75rem]">
                          <Image
                            src={order.image}
                            alt={order.clientName}
                            width={44}
                            height={44}
                            className="h-[2.75rem] w-[2.75rem] rounded-full object-cover"
                          />

                          <div>
                            <p className="text-[1.125rem] font-medium leading-[1.75rem] text-[var(--text-black)]">
                              {order.clientName}
                            </p>
                            <p className="text-[0.875rem] leading-[1.25rem] text-[var(--text-muted)]">
                              {order.projectName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-[1.125rem] leading-[1.75rem] text-[var(--text-secondary)]">
                        {order.date}
                      </td>

                      <td className="px-[1rem] py-[0.5rem] text-right">
                        <Link
                          href={`/dashboard/mandor/pesanan/${order.id}`}
                          className="inline-flex min-w-[5.25rem] justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] text-[var(--text-white)] transition-colors hover:bg-[var(--orange-normal-hover)]"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-[12rem] w-full bg-[var(--white-normal)] md:h-[14rem]" />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
