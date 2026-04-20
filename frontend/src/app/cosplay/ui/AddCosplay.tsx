"use client"

import { useState } from "react"
import './AddCosplay.css'

export default function AddCosplay() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [author, setAuthor] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [color, setColor] = useState("#d400ff")

const handleSubmit = async () => {
  if (!title || !description || !author || !file) {
    alert("Заполни все поля")
    return
  }

  const formData = new FormData()

  formData.append("title", title)
  formData.append("description", description)
  formData.append("author_name", author)
  formData.append("favorite_color", color)

  if (file) {
    formData.append("image", file)
  }

  await fetch("http://localhost:5000/cosplay/", {
    method: "POST",
    body: formData,
  })

  setTitle("")
  setDescription("")
  setAuthor("")
  setFile(null)
  setColor("#d400ff")
}

 

  return (
  <div className="add-cosplay">

    <div className="add-cosplay__layout">

      {/* LEFT SIDE */}
      <div className="add-cosplay__left">

        <div className="add-cosplay__row">
          <input
            placeholder="Название"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            placeholder="Автор"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Описание"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="add-cosplay__right">

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0])
          }}
        />
        Выберите сочетающийся цвет
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="add-cosplay__color"
        />

        <button onClick={handleSubmit}>
          Добавить косплей
        </button>

      </div>

    </div>
  </div>
)
}