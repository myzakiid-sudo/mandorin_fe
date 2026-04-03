"use client";

import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldShowFooter =
    pathname === "/beranda" ||
    pathname === "/mandor" ||
    /^\/mandor\/[^/]+$/.test(pathname);

  return (
    <>
      <PublicNavbar />
      {children}
      {shouldShowFooter ? <PublicFooter /> : null}
    </>
  );
}
