"use client"
import './CosplayGrid.css'
import { useEffect, useState } from "react"
import CosplayCard from "./CosplayCard"
import AdminCosplayCard from "./AdminCosplayCard"
import {
  getPublicCosplays,
  getAdminCosplays,
  deleteCosplay,
  approveCosplay,
} from "../../../features/cosplay/api/cosplayApi"

import { Cosplay } from "../../../features/cosplay/model/types"
import AddCosplay from './AddCosplay'

export default function CosplayGrid() {
  const [items, setItems] = useState<Cosplay[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Cosplay | null>(null)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  useEffect(() => {
    if (token) {
      setIsAdmin(true)

      getAdminCosplays(token).then(setItems)
    } else {
      getPublicCosplays().then(setItems)
    }
  }, [])

  const handleDelete = async (id: number) => {
    if (!token) return
    await deleteCosplay(id, token)
    setItems(items.filter((i) => i.id !== id))
  }

  const handleApprove = async (id: number) => {
    if (!token) return
    await approveCosplay(id, token)

    setItems(
      items.map((i) =>
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
      {items
        .sort((a, b) => (a.status === "pending" ? -1 : 1))
        .map((item) =>
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
        {selected && (
  <div className="cosplay-modal" onClick={() => setSelected(null)}>
    <div
      className="cosplay-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button style={{ color: selected.favorite_color }} onClick={() => setSelected(null)}>✖</button>

      {selected.image_url && (
        <img src={`http://localhost:5000${selected.image_url}`} />
      )}

      <h2 style={{ color: selected.favorite_color }}>
        {selected.title}
      </h2>

      <p>
      <span style={{ color: selected.favorite_color }}>
          Описание:
        </span>{" "}
        {selected.description}
      </p>
      <span><span style={{color: '#888888'}}>Автор:</span> {selected.author_name}</span>
    </div>
  </div>
)}
  </div>
)
}