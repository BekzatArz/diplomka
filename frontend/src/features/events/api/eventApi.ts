import { API_URL } from "@/config"
const API = `${API_URL}/events`;

export type EventContentBlock = {
  type: "text" | "image";
  text?: string;
  image_url?: string;
  isNew?: boolean; // Для логики обновления
  index?: number;  // Для связи с файлами в FormData
};

export type Event = {
  id: number;
  title: string;
  location: string;
  event_date: string;
  image_url?: string;
};

export type EventFull = {
  id: number;
  title: string;
  location: string;
  event_date: string;
  contents: EventContentBlock[];
};

/* =========================
   GET ALL
========================= */
export async function getEvents(): Promise<Event[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Ошибка при загрузке списка событий");
  return res.json();
}

/* =========================
   GET ONE
========================= */
export async function getEvent(id: number): Promise<EventFull> {
  // Вместо if (!id), проверяем на undefined или NaN
  if (id === undefined || isNaN(id)) {
    throw new Error("Неверный ID события (NaN/Undefined)");
  }

  const res = await fetch(`${API}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Не удалось загрузить событие. Статус: ${res.status}`);
  }

  return res.json();
}
/* =========================
   CREATE (admin)
========================= */
export async function createEvent(formData: FormData) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API}/`, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Ошибка сервера" }));
    throw new Error(error.error || "Ошибка при создании события");
  }

  return res.json();
}

/* =========================
   UPDATE (admin)
========================= */
export async function updateEvent(id: number, formData: FormData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Ошибка сервера" }));
    throw new Error(error.error || "Ошибка при обновлении события");
  }

  return res.json();
}

/* =========================
   DELETE (admin)
========================= */
export async function deleteEvent(id: number) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Нет токена авторизации");
  }

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ошибка удаления: ${res.status} ${errorText}`);
  }

  // Проверяем, есть ли тело ответа, прежде чем парсить JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  
  return { success: true };
}