import { usePathname, useRouter } from "expo-router";
import { TRPCClientError } from "@trpc/client";

import { clearAuthTokenSync } from "~/utils/auth";

export const useHandleError = (e: unknown) => {
  const router = useRouter();

  const path = usePathname();

  if (!e) return;

  if (
    e instanceof TRPCClientError &&
    e.message === "UNAUTHORIZED" &&
    path !== "/login/"
  ) {
    clearAuthTokenSync();
    router.navigate("/login/");
  }
};
