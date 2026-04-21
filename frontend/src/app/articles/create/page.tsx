"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import HeaderWrapper from "@/widgets/header/HeaderWrapper"
import { createArticle } from "@/features/articles/api/articleApi"
import "./CreateArticle.css"

// Четкие типы для блоков
type TextBlock = { type: "text"; text: string };
type ImageBlock = { type: "image"; file: File | null; fileKey: string; previewUrl?: string };
type Block = TextBlock | ImageBlock;

export default function CreateArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addText = () => {
    setBlocks((prev) => [...prev, { type: "text", text: "" }])
  }

  const addImage = () => {
    setBlocks((prev) => [
      ...prev,
      { type: "image", file: null, fileKey: `file_${Date.now()}` },
    ])
  }

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  const updateText = (index: number, value: string) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index && b.type === "text" ? { ...b, text: value } : b))
    )
  }

  const updateImage = (index: number, file: File | null) => {
    if (!file) return
    
    // Создаем URL для предпросмотра
    const previewUrl = URL.createObjectURL(file)

    setBlocks((prev) =>
      prev.map((b, i) => 
        i === index && b.type === "image" 
          ? { ...b, file, previewUrl } 
          : b
      )
    )
  }

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Введите заголовок")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)

      const prepared = blocks.map((b) => {
        if (b.type === "image" && b.file) {
          formData.append(b.fileKey, b.file)
          return { type: "image", fileKey: b.fileKey }
        }
        return { type: "text", text: (b as TextBlock).text }
      })

      formData.append("contents", JSON.stringify(prepared))

      await createArticle(formData)
      router.push("/articles")
    } catch (error) {
      console.error(error)
      alert("Ошибка при создании")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <HeaderWrapper />
      <div className="container create-article" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
        <h1 className="create-article-title">Создать статью</h1>

        <input
          className="create-article-input"
          placeholder="Заголовок статьи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="blocks">
          {blocks.map((block, i) => (
            <div key={i} className="block-item" style={{ marginBottom: '15px', position: 'relative' }}>
              <button className="remove-block" onClick={() => removeBlock(i)}>✕</button>
              
              {block.type === "text" && (
                <textarea
                  className="block-textarea"
                  placeholder="Начните писать..."
                  value={block.text}
                  onChange={(e) => updateText(i, e.target.value)}
                />
              )}

              {block.type === "image" && (
                <div className="image-upload-block">
                  {block.previewUrl && (
                    <img src={block.previewUrl} alt="Preview" className="image-preview" style={{ maxWidth: '200px', display: 'block' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateImage(i, e.target.files?.[0] || null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn-add" onClick={addText}>+ Текст</button>
          <button className="btn-add" onClick={addImage}>+ Картинка</button>
        </div>

        <button 
          className="submit-btn" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Публикация..." : "Опубликовать статью"}
        </button>
      </div>
    </div>
  )
}