import { redirect } from "next/navigation";

import { validateRequest } from "@acme/auth";

import { Sidebar } from "~/app/_components/sidebar";
import { LogOut } from "~/app/login/auth";

const Home = async () => {
  const r = await validateRequest();

  if (!r.user) {
    redirect("/login");
  }

  return (
    <div className={"flex flex-col gap-4"}>
      <Sidebar />
      <div>
        {r.user.firstName} {r.user.lastName}
      </div>

      <LogOut />
    </div>
  );
};

export default Home;
