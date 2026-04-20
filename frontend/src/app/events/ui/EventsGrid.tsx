// app/events/ui/EventsGrid.tsx
"use client";

import Link from "next/link";
import './EventGrid.css'
import { API_URL } from "@/config";

type Event = {
  id: number;
  title: string;
  location: string;
  event_date: string;
  image_url?: string;
};

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  if (!events || events.length === 0) {
    return (
      <div className="no-events">
        <p>Пока нет предстоящих событий</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map((event) => {
        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const imageSrc = event.image_url
          ? event.image_url.startsWith("http")
            ? event.image_url
            : API_URL + `${event.image_url}`
          : "/placeholder-event.jpg"; // можно добавить плейсхолдер

        return (
          <Link href={`/events/${event.id}`} key={event.id} className="event-card">
            <div className="event-card__image">
              <img
                src={imageSrc}
                alt={event.title}
                className="event-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="event-card__content">
              <div className="event-card__date">
                {formattedDate}
              </div>
              <h3 className="event-card__title">{event.title}</h3>
              <p className="event-card__location">
                📍 {event.location}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}