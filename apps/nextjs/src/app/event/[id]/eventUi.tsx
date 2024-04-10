"use client";

import { api } from "~/trpc/react";

export const EventUi = ({ id }: { id: string }) => {
  const { data } = api.events.get.useQuery(id);

  return (
    <div>
      Event {id}
      {JSON.stringify(data)}
    </div>
  );
};
