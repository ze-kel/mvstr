import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { EventUi } from "~/app/event/[id]/invitation";
import { api } from "~/trpc/server";

const EventPage = async ({ params }: { params: { id: string } }) => {
  const res = await api.events.getPublic(params.id);

  const res2 = await api.events.getWishesPublic(params.id);

  if (!res) return;

  const qc = new QueryClient();

  qc.setQueryData(
    [["events", "getPublic"], { input: params.id, type: "query" }],
    res,
  );
  qc.setQueryData(
    [["events", "getWishesPublic"], { input: params.id, type: "query" }],
    res2,
  );

  return (
    <div className="flex">
      <HydrationBoundary state={dehydrate(qc)}>
        <EventUi id={params.id} />
      </HydrationBoundary>
    </div>
  );
};

export default EventPage;
