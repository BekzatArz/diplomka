import { API_URL } from "@/config"

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