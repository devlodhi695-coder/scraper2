export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  discount: number;
  imageUrl: string;
  productUrl: string;
}

export interface ScrapeSettings {
  query: string;
  pages: number;
}