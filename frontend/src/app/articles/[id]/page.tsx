// app/articles/[id]/page.tsx

import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import { getArticle } from "@/features/articles/api/articleApi";
import ArticleAdminActions from "./ArticleAdminActions";
import ArticleContent from "./ArticleContent";   // ← новый импорт
import './ArticleContent.css';

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId) || numId <= 0) {
    return <div>Invalid article</div>;
  }

  const article = await getArticle(numId);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="app">
      <HeaderWrapper />

      <div className="container">
        {/* Слайдер — не трогаем */}
        <div className="ui-slider">
          <div className="ui-track">
            <div className="ui-slide slide1" />
            <div className="ui-slide slide2" />
            <div className="ui-slide slide3" />
            <div className="ui-slide slide4" />
            <div className="ui-slide slide1" />
            <div className="ui-slide slide2" />
            <div className="ui-slide slide3" />
            <div className="ui-slide slide4" />
          </div>
        </div>

        {/* Основной контент статьи */}
        <article className="article__container">
          <ArticleAdminActions id={numId} />

          <h1 className="article__title">{article.title}</h1>

          {/* Вынесли в отдельный компонент */}
          <ArticleContent contents={article.contents} />
        </article>
      </div>
    </div>
  );
}