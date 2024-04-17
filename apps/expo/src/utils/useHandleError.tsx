import { TRPCClientError } from "@trpc/client";
import { useRouter, usePathname } from "expo-router";
import { clearAuthTOken } from "~/utils/auth";

export const useHandleError = (e: unknown) => {
  const router = useRouter();

  const path = usePathname();

  if (!e) return;

  if (
    e instanceof TRPCClientError &&
    e.message === "UNAUTHORIZED" &&
    path !== "/login/"
  ) {
    clearAuthTOken();
    router.navigate("/login/");
  }
};
