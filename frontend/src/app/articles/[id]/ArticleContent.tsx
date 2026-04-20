"use client";

type ArticleContentBlock = {
    type: "text" | "image";
    text?: string;
    image_url?: string;
};

interface ArticleContentProps {
    contents?: ArticleContentBlock[];
}
import { API_URL } from "@/config";

export default function ArticleContent({ contents = [] }: ArticleContentProps) {
  return (
    <div className="article__content">
      {contents.map((block, i) => {
        if (block.type === "text" && block.text) {
          return (
            <p key={i} className="article__text">
              {block.text}
            </p>
          );
        }

        if (block.type === "image" && block.image_url) {
          return (
            <img
              key={i}
              className="article__image"
              src={`${API_URL}${block.image_url}`}
              alt="Изображение статьи"
            />
          );
        }

        return null;
      })}
    </div>
  );
}