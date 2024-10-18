export interface Product {
  id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  brand?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
