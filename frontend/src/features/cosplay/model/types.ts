export type Cosplay = {
  id: number
  title: string
  description: string
  author_name: string
  image_url: string | null
  favorite_color?: string;
  status?: "pending" | "approved"
}