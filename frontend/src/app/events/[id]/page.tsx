import { getEvent } from "@/features/events/api/eventApi";
import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import { notFound } from "next/navigation";
import EventAdminActions from "./EventAdminActions";
import "./EventDetail.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) return notFound();

  let event;
  try {
    event = await getEvent(eventId);
  } catch (error) {
    return notFound();
  }

  if (!event) return notFound();

  const formattedDate = new Date(event.event_date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const coverImage = event.contents.find((b: any) => b.type === "image")?.image_url;
  const fullCoverUrl = coverImage 
    ? (coverImage.startsWith("http") ? coverImage : `http://localhost:5000${coverImage}`)
    : null;

  return (
    <div className="evp-root">
      <HeaderWrapper />
      
      <main className="evp-main">
        <section className="evp-hero">
          {fullCoverUrl && (
            <div className="evp-hero-bg">
              <img src={fullCoverUrl} alt="" />
              <div className="evp-hero-overlay"></div>
            </div>
          )}
          
          <div className="evp-hero-inner">
            <div className="evp-hero-content">
              <EventAdminActions eventId={eventId} />
              
              <div className="evp-hero-badge">
                {formattedDate} • {event.location}
              </div>
              <h1 className="evp-hero-title">{event.title}</h1>
            </div>
          </div>
        </section>

        <section className="evp-body">
          <div className="evp-content-wrapper">
            {event.contents.map((block: any, index: number) => (
              <div key={index} className={`evp-block evp-block--${block.type}`}>
                {block.type === "text" ? (
                  <p className="evp-text">{block.text}</p>
                ) : (
                  <div className="evp-media-frame">
                    <img
                      src={block.image_url?.startsWith("http") 
                        ? block.image_url 
                        : `http://localhost:5000${block.image_url}`}
                      alt=""
                      className="evp-img"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}