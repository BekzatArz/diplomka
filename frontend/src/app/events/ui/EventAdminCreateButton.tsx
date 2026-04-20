// app/events/EventAdminCreateButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './EventAdminCreateButton.css'

export default function EventAdminCreateButton() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="admin-create-button-container">
      <button
        onClick={() => router.push("/events/create")}
        className="admin-create-btn"
      >
        + Создать новое событие
      </button>
    </div>
  );
}