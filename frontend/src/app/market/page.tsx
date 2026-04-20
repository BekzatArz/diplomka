import Head from "next/head";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import MarketGrid from "./ui/MarketGrid";

export const dynamic = "force-dynamic";

export default async function MarketPage() {


  return (
    <>
      <Head>
        <title>Маркет</title>
        <meta name="description" content="Магазин косплей товаров" />
      </Head>

      <div className="app">
        <HeaderWrapper />

        <div className="container">
          <MarketGrid />
        </div>
      </div>
    </>
  );
}