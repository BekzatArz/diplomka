// app/events/page.tsx

import Head from "next/head";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import EventsGrid from "./ui/EventsGrid";
import { getEvents } from "@/features/events/api/eventApi";
import EventAdminCreateButton from "./ui/EventAdminCreateButton";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: any[] = [];

  try {
    events = await getEvents();
  } catch (error) {
    console.error("Ошибка загрузки событий:", error);
  }

  return (
    <>
      <Head>
        <title>Косплей Ивенты</title>
        <meta name="description" content="Ближайшие косплей ивенты и события" />
      </Head>

      <div className="app">
        <HeaderWrapper />
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
        <div className="container">

          <div className="events-page-header">
            <h1 className="events-title">Косплей Ивенты</h1>
            <p className="events-subtitle">Ближайшие события и фестивали</p>
          </div>

          {/* Кнопка "Создать событие" — видна только админу */}
          <EventAdminCreateButton />

          <EventsGrid events={events} />
        </div>
      </div>
    </>
  );
}