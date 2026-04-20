"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "./ArticlesGrid.css"

import { getArticles } from "@/features/articles/api/articleApi"
import { API_URL } from "@/config"

type Article = {
  id: number
  title: string
  image_url?: string
  created_at?: string
}

export default function ArticlesGrid() {
  const [items, setItems] = useState<Article[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsAdmin(true)

    getArticles().then(setItems)
  }, [])

  return (
    <div className="articles-page">

      {isAdmin && (
        <div className="articles-header">
          <button
            className="add-article-btn"
            onClick={() => router.push("/articles/create")}
          >
            + Добавить статью
          </button>
        </div>
      )}

      <section className="articles-grid">
        {items.map((item) => (
          <article
            key={item.id}
            className="article-card"
            onClick={() => {
              if (!item.id) return
              router.push(`/articles/${item.id}`)
            }}
          >

            {item.image_url && (
              <div className="article-img">
                <img
                  src={API_URL + `${item.image_url}`}
                  alt={item.title}
                />
              </div>
            )}

            <h3 className="article-title">{item.title}</h3>

            {item.created_at && (
              <div className="article-date">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            )}

          </article>
        ))}
      </section>

    </div>
  )
}