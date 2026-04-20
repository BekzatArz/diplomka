// app/articles/edit/[id]/ArticleEditForm.tsx
"use client";
import { API_URL } from "@/config"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateArticle } from "@/features/articles/api/articleApi";
import './ArticleEditForm.css';

type ArticleContentBlock = {
  type: "text" | "image";
  text?: string;
  image_url?: string;     // оригинальный путь с бэка (например: /static/uploads/xxx.jpg)
  file?: File;            // новое загруженное изображение
  isNew?: boolean;        // флаг, что это новое изображение
};

type ArticleFull = {
  id: number;
  title: string;
  contents: ArticleContentBlock[];
};

interface ArticleEditFormProps {
  article: ArticleFull;
}

const API_BASE = API_URL

export default function ArticleEditForm({ article }: ArticleEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [contents, setContents] = useState<ArticleContentBlock[]>(article.contents);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Функция для получения правильного src для <img>
  const getImageSrc = (block: ArticleContentBlock): string | undefined => {
    if (!block.image_url) return undefined;

    // Если это новое загруженное изображение (blob URL)
    if (block.image_url.startsWith("blob:")) {
      return block.image_url;
    }

    // Если это старое изображение с бэка
    return `${API_BASE}${block.image_url}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);

    const contentsForServer: any[] = [];

    contents.forEach((block, index) => {
      if (block.type === "text") {
        contentsForServer.push({
          type: "text",
          text: block.text || ""
        });
      } else if (block.type === "image") {
        if (block.file) {
          // Новое изображение
          formData.append(`image_${index}`, block.file);
          contentsForServer.push({
            type: "image",
            isNew: true,
            index
          });
        } else if (block.image_url) {
          // Старое изображение — оставляем как есть
          contentsForServer.push({
            type: "image",
            image_url: block.image_url
          });
        }
      }
    });

    formData.append("contents", JSON.stringify(contentsForServer));

    try {
      await updateArticle(article.id, formData);
      setMessage("Статья успешно обновлена!");

      setTimeout(() => {
        router.push(`/articles/${article.id}`);
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при сохранении статьи");
    } finally {
      setIsSaving(false);
    }
  };

  const addTextBlock = () => {
    setContents([...contents, { type: "text", text: "" }]);
  };

  const addImageBlock = () => {
    setContents([...contents, { type: "image" }]);
  };

  const updateText = (index: number, newText: string) => {
    const updated = [...contents];
    updated[index] = { type: "text", text: newText };
    setContents(updated);
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const updated = [...contents];

    updated[index] = {
      type: "image",
      file,
      image_url: previewUrl,   // blob URL
      isNew: true
    };
    setContents(updated);
  };

  const removeBlock = (index: number) => {
    const block = contents[index];
    if (block.type === "image" && block.image_url?.startsWith("blob:")) {
      URL.revokeObjectURL(block.image_url);
    }
    setContents(contents.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSave} className="article-edit-form">
      <div className="form-group">
        <label>Заголовок статьи</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="article-input"
        />
      </div>

      <div className="content-blocks">
        <h3>Содержимое статьи</h3>

        {contents.map((block, index) => (
          <div key={index} className="content-block">
            {block.type === "text" ? (
              <div>
                <label>Текст {index + 1}</label>
                <textarea
                  value={block.text || ""}
                  onChange={(e) => updateText(index, e.target.value)}
                  rows={6}
                  className="article-textarea"
                  placeholder="Введите текст..."
                />
              </div>
            ) : (
              <div>
                <label>Изображение {index + 1}</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
                  className="file-input"
                />

                {block.image_url && (
                  <div className="image-preview-container">
                    <img
                      src={getImageSrc(block)}
                      alt="preview"
                      className="image-preview"
                    />
                  </div>
                )}

                {!block.image_url && (
                  <p className="no-image">Выберите изображение</p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => removeBlock(index)}
              className="remove-btn"
            >
              Удалить блок
            </button>
          </div>
        ))}
      </div>

      <div className="add-buttons">
        <button type="button" onClick={addTextBlock} className="add-btn">
          + Добавить текст
        </button>
        <button type="button" onClick={addImageBlock} className="add-btn">
          + Добавить изображение
        </button>
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => router.back()} className="cancel-btn">
          Отмена
        </button>
        <button type="submit" disabled={isSaving} className="save-btn">
          {isSaving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>

      {message && (
        <p className={`message ${message.includes("успешно") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </form>
  );
}