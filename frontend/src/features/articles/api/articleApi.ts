import { API_URL } from "@/config"

const API = `${API_URL}/articles`

export type Article = {
  id: number
  title: string
  image_url?: string
  created_at?: string
}

export type ArticleContent = {
  type: "text" | "image"
  text?: string
  image_url?: string
}

export type ArticleFull = {
  id: number
  title: string
  contents: ArticleContent[]
}

/* =========================
   GET ALL
========================= */
export async function getArticles(): Promise<Article[]> {
  const res = await fetch(API)
  return res.json()
}

/* =========================
   GET ONE
========================= */
export async function getArticle(id: number): Promise<ArticleFull> {
  if (!id) throw new Error("Invalid id")

  const res = await fetch(`${API}/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch article")
  }

  return res.json()
}

/* =========================
   CREATE (admin)
========================= */
export async function createArticle(data: FormData) {
  const res = await fetch(`${API}/`, {
    method: "POST",
    body: data,
    headers: {
      Authorization: localStorage.getItem("token") || ""
    }
  })

  return res.json()
}

/* =========================
   UPDATE (admin)
========================= */
export async function updateArticle(id: number, data: FormData) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    body: data,
    headers: {
      Authorization: localStorage.getItem("token") || ""
    }
  })

  return res.json()
}

/* =========================
   DELETE (admin)
========================= */
export async function deleteArticle(id: number) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authorization token");
  }

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete article: ${res.status} ${errorText}`);
  }

  return res.json();
}