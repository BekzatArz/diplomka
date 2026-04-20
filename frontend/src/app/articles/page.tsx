import Head from "next/head";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import ArticlesGrid from "./ui/ArticlesGrid";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {


  return (
    <>
      <Head>
        <title>Косплей Статьи</title>
        <meta name="description" content="Статьи про Косплеи" />
      </Head>

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
          <ArticlesGrid />
        </div>
      </div>
    </>
  );
}