"use client";

import { useRouter } from "next/navigation";
import { deleteArticle } from "@/features/articles/api/articleApi";
import { useEffect, useState } from "react";
import './ArticleAdminActions.css'

export default function ArticleAdminActions({ id }: { id: number }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirm("Вы действительно хотите удалить эту статью? Это действие нельзя отменить.")) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteArticle(id);
      router.push("/articles");
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить статью. Попробуйте ещё раз.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/articles/edit/${id}`);
  };

  return (
    <div className="article__admin">
      <button
        className="article__btn article__btn--edit"
        onClick={handleUpdate}
      >
        ✏️ Update
      </button>

      <button
        className="article__btn article__btn--delete"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "🗑️ Delete"}
      </button>
    </div>
  );
}