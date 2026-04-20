import Head from "next/head";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import CosplayGrid from "@/app/cosplay/ui/CosplayGrid";

export const dynamic = "force-dynamic";

export default async function CosplayPage() {


  return (
    <>
      <Head>
        <title>Косплей</title>
        <meta name="description" content="Галерея косплей работ" />
      </Head>

      <div className="app">
        <HeaderWrapper />
        
        <div className="container">
          <CosplayGrid />
        </div>
      </div>
    </>
  );
}