"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // если 404 — не показываем хедер
  if (pathname === "/404") return null;

  return <Header />;
}
