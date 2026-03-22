import PublicFooter from "@/components/features/public/footer";
import PublicNavbar from "@/components/features/public/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  );
}
