"use client"

import { useState } from "react"
import { loginAdmin } from "@/features/login/loginApi"
import { useRouter } from "next/navigation"
import HeaderWrapper from "@/widgets/header/HeaderWrapper"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(email, password)

      localStorage.setItem("token", data.token)

      router.push("/admin")
    } catch {
      alert("Ошибка входа")
    }
  }

  return (
    <div className="app">
        <HeaderWrapper />
      <h1>Admin Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  )
}