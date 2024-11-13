export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string | File | null;
  brand: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
