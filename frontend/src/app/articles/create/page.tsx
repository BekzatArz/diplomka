"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import HeaderWrapper from "@/widgets/header/HeaderWrapper"
import { createArticle } from "@/features/articles/api/articleApi"
import "./CreateArticle.css"

type Block =
  | { type: "text"; text: string }
  | { type: "image"; file: File | null; fileKey: string }

export default function CreateArticlePage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])

  const addText = () => {
    setBlocks((prev) => [...prev, { type: "text", text: "" }])
  }

  const addImage = () => {
    setBlocks((prev) => [
      ...prev,
      { type: "image", file: null, fileKey: `file_${Date.now()}` },
    ])
  }

  const updateText = (index: number, value: string) => {
    const copy = [...blocks]
    // @ts-ignore
    copy[index].text = value
    setBlocks(copy)
  }

  const updateImage = (index: number, file: File | null) => {
    const copy = [...blocks]
    // @ts-ignore
    copy[index].file = file
    setBlocks(copy)
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    formData.append("title", title)

    const prepared = blocks.map((b) => {
      if (b.type === "image") {
        formData.append(b.fileKey, b.file as File)
        return { type: "image", fileKey: b.fileKey }
      }

      return { type: "text", text: b.text }
    })

    formData.append("contents", JSON.stringify(prepared))

    await createArticle(formData)
    router.push("/articles")
  }

  return (
    <div className="app">
      <HeaderWrapper />

      <div style={{backgroundColor: 'gray'}} className="container create-article">

        <h1 className="create-article-title">Создать статью</h1>

        {/* TITLE */}
        <input
          className="create-article-input"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* BLOCKS */}
        <div className="blocks">
          {blocks.map((block, i) => (
            <div key={i} className="block">
              {block.type === "text" && (
                <textarea
                  className="block-textarea"
                  placeholder="Текст..."
                  value={block.text}
                  onChange={(e) => updateText(i, e.target.value)}
                />
              )}

              {block.type === "image" && (
                <input
                  className="block-file"
                  type="file"
                  onChange={(e) =>
                    updateImage(i, e.target.files?.[0] || null)
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="btn" onClick={addText}>+ Text</button>
          <button className="btn" onClick={addImage}>+ Image</button>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Создать
        </button>

      </div>
    </div>
  )
}