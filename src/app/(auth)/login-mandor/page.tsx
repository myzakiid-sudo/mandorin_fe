import { Suspense } from "react";
import SharedLogin from "@/components/features/auth/shared-login";

export default function LoginMandorPage() {
  return (
    <Suspense fallback={null}>
      <SharedLogin role="mandor" />
    </Suspense>
  );
}
