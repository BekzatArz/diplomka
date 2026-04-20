"use client";
import { useAppSelector } from "@/store/hooks"
import { selectThemeMode } from "./themeSelector";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector(selectThemeMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.toggle("light-theme", themeMode);
    document.body.classList.toggle("dark-theme", !themeMode);
  }, [themeMode]);

  if (!mounted) return null; // рендерим только после монтирования

  return <>{children}</>;
}
  