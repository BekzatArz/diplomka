"use client"

import { useEffect, useState, useMemo } from "react"
import {
  getPublicCosplays,
  getAdminCosplays,
  deleteCosplay,
  approveCosplay,
} from "@/features/cosplay/api/cosplayApi"
import { Cosplay } from "@/features/cosplay/model/types"

export function useCosplay() {
  const [items, setItems] = useState<Cosplay[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Полезно для UI (спиннеры и т.д.)

  // Токен лучше брать внутри useEffect или через стейт, 
  // чтобы избежать проблем с гидратацией в Next.js
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token")
    setToken(savedToken)
    
    const fetchData = async () => {
      try {
        if (savedToken) {
          setIsAdmin(true)
          const data = await getAdminCosplays(savedToken)
          setItems(data)
        } else {
          setIsAdmin(false)
          const data = await getPublicCosplays()
          setItems(data)
        }
      } catch (error) {
        console.error("Ошибка при загрузке косплеев:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Сортировка теперь живет внутри хука. 
  // Компонент получит уже "правильный" список.
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1
      if (a.status !== "pending" && b.status === "pending") return 1
      return 0
    })
  }, [items])

  const handleDelete = async (id: number) => {
    if (!token) return
    try {
      await deleteCosplay(id, token)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      alert("Не удалось удалить")
    }
  }

  const handleApprove = async (id: number) => {
    if (!token) return
    try {
      await approveCosplay(id, token)
      setItems(prev =>
        prev.map(i =>
          i.id === id ? { ...i, status: "approved" as const } : i
        )
      )
    } catch (err) {
      alert("Не удалось одобрить")
    }
  }

  return {
    items: sortedItems, // Возвращаем отсортированные данные
    isAdmin,
    isLoading,
    handleDelete,
    handleApprove,
  }
}