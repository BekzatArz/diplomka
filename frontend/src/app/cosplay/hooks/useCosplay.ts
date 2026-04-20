"use client"

import { useEffect, useState } from "react"
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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
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
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleApprove = async (id: number) => {
    if (!token) return
    await approveCosplay(id, token)

    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: "approved" } : i
      )
    )
  }

  return {
    items,
    isAdmin,
    handleDelete,
    handleApprove,
  }
}