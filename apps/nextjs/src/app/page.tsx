import { redirect } from "next/navigation";

import { validateRequest } from "@acme/auth";

import { LogOut } from "~/app/login/auth";
import { api } from "~/trpc/server";

const Home = async () => {
  const r = await validateRequest();

  if (!r.user) {
    redirect("/login");
  }

  const ev = await api.events.all();

  return (
    <div className="flex flex-col gap-4">
      <div>Вы вошли {r.user ? r.user.id : ""}</div>

      <LogOut />
      <div>{ev.length}</div>
      <div>
        {ev.map((v) => {
          return <div>{JSON.stringify(v)}</div>;
        })}
      </div>
    </div>
  );
};

export default Home;
