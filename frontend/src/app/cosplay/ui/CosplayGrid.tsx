"use client"
import './CosplayGrid.css'
import { useEffect, useState, useMemo } from "react" // Добавили useMemo
import CosplayCard from "./CosplayCard"
import AdminCosplayCard from "./AdminCosplayCard"
import {
  getPublicCosplays,
  getAdminCosplays,
  deleteCosplay,
  approveCosplay,
} from "@/features/cosplay/api/cosplayApi"

import { Cosplay } from "@/features/cosplay/model/types"
import AddCosplay from './AddCosplay'
import { API_URL } from '@/config'

export default function CosplayGrid() {
  const [items, setItems] = useState<Cosplay[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Cosplay | null>(null)

  // Получаем токен (безопасно для SSR)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (token) {
      setIsAdmin(true)
      getAdminCosplays(token).then(setItems)
    } else {
      getPublicCosplays().then(setItems)
    }
  }, [token]) // Добавили token в зависимости

  // --- ЛОГИКА СОРТИРОВКИ ---
  const sortedItems = useMemo(() => {
  // Проверяем: если items не существует или это не массив, возвращаем пустой список
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return 0;
  });
}, [items]);

  const handleDelete = async (id: number) => {
    if (!token) return
    await deleteCosplay(id, token)
    setItems(prev => prev.filter((i) => i.id !== id))
  }

  const handleApprove = async (id: number) => {
    if (!token) return
    await approveCosplay(id, token)

    setItems(prev =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "approved" } : i
      )
    )
  }

  return (
    <div className="cosplay-page">
      <button
        className="add-cosplay-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? "✖ Закрыть" : "+ Добавьте свой Косплей"}
      </button>

      {open && <AddCosplay />}

      <section className="cosplay-grid">
        {/* Используем отсортированный массив */}
        {sortedItems.map((item) =>
          isAdmin ? (
            <AdminCosplayCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onClick={() => setSelected(item)}
            />
          ) : (
            <CosplayCard onClick={() => setSelected(item)} key={item.id} item={item} />
          )
        )}
      </section>

      {/* Модальное окно */}
      {selected && (
        <div className="cosplay-modal" onClick={() => setSelected(null)}>
          <div
            className="cosplay-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              style={{ color: selected.favorite_color }} 
              onClick={() => setSelected(null)}
            >
              ✖
            </button>

            {selected.image_url && (
              <img src={`${API_URL}${selected.image_url}`} alt={selected.title} />
            )}

            <h2 style={{ color: selected.favorite_color }}>
              {selected.title}
            </h2>

            <p>
              <span style={{ color: selected.favorite_color }}>Описание: </span>
              {selected.description}
            </p>
            <span>
              <span style={{ color: '#888888' }}>Автор:</span> {selected.author_name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}