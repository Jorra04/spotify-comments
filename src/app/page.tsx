"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();

  return (
    <>
      <h1>Hello, welcome to spotify comments</h1>
      <button onClick={() => router.push("/api/auth")}>
        Login with Spotify
      </button>
    </>
  );
}
