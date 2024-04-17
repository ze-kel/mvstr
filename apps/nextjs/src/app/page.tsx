import { redirect } from "next/navigation";

import { validateRequest } from "@acme/auth";

import { Sidebar } from "~/app/_components/sidebar";
import { TestComponent } from "~/app/_components/test";
import { LogOut } from "~/app/login/auth";

const Home = async () => {
  const r = await validateRequest();

  if (!r.user) {
    redirect("/login");
  }

  return (
    <div className={"flex flex-row gap-4"}>
      <Sidebar />
      <div>
        <TestComponent />
        {r.user.firstName} {r.user.lastName}
        <LogOut />
      </div>
    </div>
  );
};

export default Home;
