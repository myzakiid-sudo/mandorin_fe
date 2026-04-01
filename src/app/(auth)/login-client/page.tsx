import { Suspense } from "react";
import SharedLogin from "@/components/features/auth/shared-login";

export default function LoginClientPage() {
  return (
    <Suspense fallback={null}>
      <SharedLogin role="client" />
    </Suspense>
  );
}
