export async function createCosplay(data: any) {
  const res = await fetch("http://localhost:5000/cosplay/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}