"use client";

import Link from "next/link";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

export const EventList = () => {
  const { data } = api.events.list.useQuery();

  if (!data) return <div></div>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((v) => (
        <Link key={v.id} href={`/event/${v.id}`}>
          <Button className="h-12 w-12 truncate">{v.name}</Button>
        </Link>
      ))}
    </div>
  );
};
