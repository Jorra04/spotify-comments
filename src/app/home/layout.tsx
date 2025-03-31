"use client";
import { useQueryHandler } from "@/effects";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useQueryHandler();
  return <>{children}</>;
}
