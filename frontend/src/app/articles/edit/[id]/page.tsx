// app/articles/edit/[id]/page.tsx
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import { getArticle } from "@/features/articles/api/articleApi";
import ArticleEditForm from "./ArticleEditForm";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId) || numId <= 0) {
    return <div>Неверный ID статьи</div>;
  }

  let article;
  try {
    article = await getArticle(numId);
  } catch (error) {
    return <div>Статья не найдена или произошла ошибка</div>;
  }

  return (
    <div className="app">
      <HeaderWrapper />

      <div className="container">
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
        <article className="article__container">
          <h1 className="article__title" style={{textAlign: 'center'}}>Редактирование статьи</h1>
          <p className="article__subtitle" style={{textAlign: "center"}}>ID: {numId}</p>

          <ArticleEditForm article={article} />
        </article>
      </div>
    </div>
  );
}