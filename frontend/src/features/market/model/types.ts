// features/product/model/types.ts
export type Product = {
  id: number
  title: string
  description: string
  price: number
  image_url?: string | null
  seller_phone: string
  seller_instagram: string
}