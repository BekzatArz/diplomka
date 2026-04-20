import { API_URL } from "@/config"
import { Cosplay } from "@/features/cosplay/model/types"
import './CosplayCard.css'

export default function CosplayCard({ item, onClick, }: { item: Cosplay 
  onClick?: () => void}) {
  return (
    <article
      onClick={onClick}
      className="cosplay-card"
      style={{
        "--glow-color": item.favorite_color || "#d400ff",
      } as React.CSSProperties}
    >
      {item.image_url && (
        <div className="img-wrapper">
          <img style={{
                        "--glow-color": item.favorite_color || "#d400ff",
                      } as React.CSSProperties} src={API_URL + `${item.image_url}`} />
        </div>
      )}

      <h3 style={{color: item.favorite_color}}>{item.title}</h3>
      <div className="des">
        <h4 style={{ color: item.favorite_color }}>Описание:</h4>{" "}
        <span>
          {item.description.length > 126
            ? item.description.slice(0, 126) + "..."
            : item.description}
        </span>
      </div>

      <span>
        <span style={{ color: "#ffffff" }}>Автор:</span>{" "}
        <span style={{ color: item.favorite_color }}>
          {item.author_name}
        </span>
      </span>
    </article>
  )
}