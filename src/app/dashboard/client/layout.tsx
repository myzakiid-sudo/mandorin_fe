"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "client") {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
