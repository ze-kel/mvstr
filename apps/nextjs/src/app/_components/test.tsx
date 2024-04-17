"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export const TestComponent = () => {
  const [url, setUrl] = useState("");

  const m = api.wish.getUrlInfo.useMutation();

  const metaHandler = async () => {
    const res = m.mutate({
      url,
    });

    console.log(res);
  };

  return (
    <div>
      <input value={url} onChange={(e) => setUrl(e.target.value)}></input>
      <button onClick={metaHandler}>тест</button>
    </div>
  );
};
