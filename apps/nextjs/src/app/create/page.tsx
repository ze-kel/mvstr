"use client";

import { useRouter } from "next/navigation";

import type { RouterInputs } from "@acme/api";

import { CreateForm } from "~/app/create/createUi";
import { api } from "~/trpc/react";

const CreatePage = () => {
  const mutation = api.events.create.useMutation();

  const router = useRouter();

  const handleSave = async (v: RouterInputs["events"]["create"]) => {
    const res = await mutation.mutateAsync(v);

    router.push(`/event/${res.id}`);
  };

  return (
    <div>
      <CreateForm initialState={{ name: "" }} handleSave={handleSave} />
    </div>
  );
};

export default CreatePage;
