const API = "http://localhost:5000/products"

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

// 🔥 GET ALL
export async function getProducts() {
  const res = await fetch(API)
  return res.json()
}

// 🔥 CREATE (admin) — FORM DATA
export async function createProduct(data: FormData) {
  const token = getToken()

  const res = await fetch(`${API}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❗ НЕ ставим Content-Type при FormData
    },
    body: data,
  })

  return res.json()
}

// 🔥 DELETE (admin)
export async function deleteProduct(id: number) {
  const token = getToken()

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

// 🔥 UPDATE (admin) — тоже FormData (если хочешь фото менять)
export async function updateProduct(id: number, data: FormData) {
  const token = getToken()

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })

  return res.json()
}