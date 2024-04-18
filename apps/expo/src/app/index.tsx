import { Redirect, useRootNavigationState } from "expo-router";

import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { getAuthToken } from "~/utils/auth";
import { useHandleError } from "~/utils/useHandleError";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const u = api.user.getMe.useQuery();

  useHandleError(u.error);

  if (rootNavigationState.key) {
    if (!token) {
      return <Redirect href={"/login/"} />;
    }
  }

  if (u.data) return <Redirect href={"/home/"} />;

  return <Spinner />;
}
