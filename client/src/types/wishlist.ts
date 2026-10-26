export interface WishlistItem {
  _id: string;
  product: {
    _id?: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string;
  } | null;
  isLiked: boolean;
  updated?: string;
  created?: string;
}
