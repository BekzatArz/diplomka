export async function getPublicCosplays() {
  const res = await fetch("http://localhost:5000/cosplay/public")
  return res.json()
}

export async function getAdminCosplays(token: string) {
  const res = await fetch("http://localhost:5000/cosplay/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

export async function deleteCosplay(id: number, token: string) {
  await fetch(`http://localhost:5000/cosplay/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function approveCosplay(id: number, token: string) {
  await fetch(`http://localhost:5000/cosplay/${id}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}