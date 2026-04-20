import { API_URL } from "@/../config"

export async function createCosplay(data: any) {
  const res = await fetch(`${API_URL}/cosplay/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}

export async function getPublicCosplays() {
  const res = await fetch(`${API_URL}/cosplay/public`)
  return res.json()
}

export async function getAdminCosplays(token: string) {
  const res = await fetch(`${API_URL}/cosplay/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

export async function deleteCosplay(id: number, token: string) {
  await fetch(`${API_URL}/cosplay/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function approveCosplay(id: number, token: string) {
  await fetch(`${API_URL}/cosplay/${id}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}