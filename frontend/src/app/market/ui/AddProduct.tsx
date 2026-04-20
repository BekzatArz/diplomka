import { useEffect, useState } from "react"
import "./AddProduct.css"

type Props = {
  onSubmit: (data: FormData) => void
  defaultValue?: any
}

export default function AddProduct({ onSubmit, defaultValue }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    seller_phone: "",
    seller_instagram: "",
  })

  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (defaultValue) {
      setForm({
        title: defaultValue.title || "",
        description: defaultValue.description || "",
        price: defaultValue.price || "",
        seller_phone: defaultValue.seller_phone || "",
        seller_instagram: defaultValue.seller_instagram || "",
      })
    } else {
      setForm({
        title: "",
        description: "",
        price: "",
        seller_phone: "",
        seller_instagram: "",
      })
    }

    setImage(null)
  }, [defaultValue])

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const data = new FormData()

    Object.entries(form).forEach(([k, v]) => {
      data.append(k, String(v))
    })

    if (image) data.append("image", image)

    onSubmit(data)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Название товара"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Описание товара..."
      />

      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Цена (сом)"
      />

      <input
        name="seller_phone"
        value={form.seller_phone}
        onChange={handleChange}
        placeholder="Телефон продавца"
      />

      <input
        name="seller_instagram"
        value={form.seller_instagram}
        onChange={handleChange}
        placeholder="@instagram или ссылка"
      />

      <input
        type="file"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
      />

      <button type="submit">
        {defaultValue ? "Обновить" : "Добавить"}
      </button>
    </form>
  )
}