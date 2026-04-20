"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminGuard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/not-found");
    } else {
      setChecked(true);
    }
  }, [router]);

  return checked;
}