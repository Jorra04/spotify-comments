"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <h1>Hello, welcome to spotify comments</h1>
      <button onClick={() => router.push("/home")}>Login with Spotify</button>
    </>
  );
}
