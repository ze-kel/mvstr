"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const EventContext = createContext<{ id: string | null }>({ id: null });

export const EventProvider = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  return (
    <EventContext.Provider value={{ id }}>{children}</EventContext.Provider>
  );
};

export const useEventId = () => {
  const { id } = useContext(EventContext);

  if (!id) throw new Error("no id in context");

  return id;
};
