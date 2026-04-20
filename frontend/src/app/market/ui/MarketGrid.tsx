"use client"

import "./MarketGrid.css"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import AdminProductCard from "./AdminProductCard"
import AddProduct from "./AddProduct"
import { Product } from "@/features/market/model/types"

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/features/market/api/productApi"

export default function MarketGrid() {
  const [items, setItems] = useState<Product[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  useEffect(() => {
    if (token) setIsAdmin(true)
    getProducts().then(setItems)
  }, [])

  // CREATE / UPDATE
  const handleSubmit = async (data: FormData) => {
    if (editing) {
      await updateProduct(editing.id, data)
    } else {
      await createProduct(data)
    }

    setItems(await getProducts())

    setOpen(false)
    setEditing(null)
  }

  // DELETE
  const handleDelete = async (id: number) => {
    await deleteProduct(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="market-page">

      {/* BUTTON */}
      {isAdmin && (
        <button
          className="add-product-toggle"
          onClick={() => {
            setEditing(null)
            setOpen(!open)
          }}
        >
          {open ? "✖ Закрыть" : "+ Добавить товар"}
        </button>
      )}

      {/* FORM */}
      {open && (
        <AddProduct
          onSubmit={handleSubmit}
          defaultValue={editing}
        />
      )}

      {/* GRID */}
      <section className="market-grid">
        {items.map((item) =>
          isAdmin ? (
            <AdminProductCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={(p) => {
                setEditing(p)
                setOpen(true)
              }}
              onClick={() => setSelected(item)}
            />
          ) : (
            <ProductCard
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
            />
          )
        )}
      </section>

      {/* ===== MODAL ===== */}
      {selected && (
        <div className="product-modal" onClick={() => setSelected(null)}>
          <div
            className="product-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)}>✖</button>

            {selected.image_url && (
              <img
                src={`http://localhost:5000${selected.image_url}`}
                alt={selected.title}
              />
            )}

            <h2>{selected.title}</h2>

            <p>
              <span style={{ color: "#888" }}>Описание:</span>{" "}
              {selected.description}
            </p>

            <div>
              <span style={{ color: "#888" }}>Цена:</span>{" "}
              {selected.price} сом
            </div>

            {selected.seller_phone && (
              <div>📞 {selected.seller_phone}</div>
            )}

            {selected.seller_instagram && (
              <a
                href={
                  selected.seller_instagram.startsWith("http")
                    ? selected.seller_instagram
                    : `https://instagram.com/${selected.seller_instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                📷 Instagram
              </a>
            )}

          </div>
        </div>
      )}

    </div>
  )
}