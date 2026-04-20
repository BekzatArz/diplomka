import { Cosplay } from "@/features/cosplay/model/types"
import './AdminCosplayCard.css'
import { API_URL } from "../../../config"

export default function AdminCosplayCard({
  item,
  onDelete,
  onApprove,
  onClick,
}: {
  item: Cosplay
  onDelete: (id: number) => void
  onApprove: (id: number) => void
  onClick?: () => void
}) {
  return (
    <article
      className="cosplay-card admin"
      onClick={onClick}
      style={{
        "--glow-color": item.favorite_color || "#d400ff",
        cursor: "pointer",
      } as React.CSSProperties}
    >
      {item.image_url && (
        <div className="img-wrapper">
          <img style={{
                        "--glow-color": item.favorite_color || "#d400ff",
                      } as React.CSSProperties} src={API_URL + `${item.image_url}`} />
        </div>
      )}

      <h3 style={{ color: item.favorite_color }}>{item.title}</h3>

      <div className="des">
        <span style={{ color: item.favorite_color }}>Описание:</span>{" "}
        <span>
          {item.description.length > 126
            ? item.description.slice(0, 126) + "..."
            : item.description}
        </span>
      </div>

      <div className="admin-bottom">

  <div className="admin-meta">
    <span
      className="author"
      style={{ color: item.favorite_color }}
    >
      {item.author_name}
    </span>

    <h4 className={`status ${item.status}`}>
      {item.status === "approved"
        ? "Разрешен"
        : "В обработке"}
    </h4>
  </div>

  <div className="admin-actions">
    <button onClick={(e) => {
      e.stopPropagation()
      onApprove(item.id)
    }}>
      Разрешить
    </button>

    <button onClick={(e) => {
      e.stopPropagation()
      onDelete(item.id)
    }}>
      Удалить
    </button>
  </div>

</div>
    </article>
  )
}