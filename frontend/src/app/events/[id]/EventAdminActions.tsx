"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/features/events/api/eventApi";

export default function EventAdminActions({ eventId }: { eventId: number }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) setIsAdmin(true);
  }, []);

  const handleDelete = async () => {
    if (!confirm("Удалить это событие?")) return;
    try {
      await deleteEvent(eventId);
      router.push("/events");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="evp-admin-actions">
      <button onClick={handleDelete} className="evp-delete-btn">
        🗑️ Удалить событие
      </button>
    </div>
  );
}