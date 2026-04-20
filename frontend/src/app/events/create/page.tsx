"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from '@/features/events/api/eventApi'
import "./CreateEvent.css";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";

type ContentBlock = {
  type: "text" | "image";
  text?: string;
  file?: File;
  previewUrl?: string;
};

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);

  const addTextBlock = () => {
    setBlocks([...blocks, { type: "text", text: "" }]);
  };

  const addImageBlock = () => {
    setBlocks([...blocks, { type: "image" }]);
  };

  const updateTextBlock = (index: number, text: string) => {
    const newBlocks = [...blocks];
    newBlocks[index].text = text;
    setBlocks(newBlocks);
  };

  const updateImageBlock = (index: number, file: File) => {
    const newBlocks = [...blocks];
    newBlocks[index].file = file;
    newBlocks[index].previewUrl = URL.createObjectURL(file);
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("event_date", eventDate);

      // Формируем структуру контента для JSON.loads в Flask
      const contentsSchema = blocks.map((block, index) => {
        if (block.type === "text") {
          return { type: "text", text: block.text };
        } else {
          if (block.file) {
            formData.append(`image_${index}`, block.file);
          }
          return { type: "image", index }; // index нужен Flask, чтобы найти image_N
        }
      });

      formData.append("contents", JSON.stringify(contentsSchema));

      await createEvent(formData);
      router.push("/events");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
        <HeaderWrapper />
    <div className="create-event-container">
      <h1>Создать новое событие</h1>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label>Название</label>
          <input 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Название фестиваля"
          />
        </div>

        <div className="form-group">
          <label>Локация</label>
          <input 
            required 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Город, место"
          />
        </div>

        <div className="form-group">
          <label>Дата проведения</label>
          <input 
            required 
            type="datetime-local" 
            value={eventDate} 
            onChange={(e) => setEventDate(e.target.value)} 
          />
        </div>

        <div className="content-blocks">
          <h2>Контент страницы</h2>
          {blocks.map((block, index) => (
            <div key={index} className="block-item">
              {block.type === "text" ? (
                <textarea
                  placeholder="Введите текст..."
                  value={block.text}
                  onChange={(e) => updateTextBlock(index, e.target.value)}
                />
              ) : (
                <div className="image-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files && updateImageBlock(index, e.target.files[0])} 
                  />
                  {block.previewUrl && <img src={block.previewUrl} alt="Preview" className="img-preview" />}
                </div>
              )}
              <button type="button" onClick={() => removeBlock(index)} className="remove-btn">Удалить блок</button>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="button" onClick={addTextBlock}>+ Добавить текст</button>
          <button type="button" onClick={addImageBlock}>+ Добавить фото</button>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Сохранение..." : "Опубликовать событие"}
        </button>
      </form>
    </div>
    </div>
  );
}