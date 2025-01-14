export interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  userId: string;
  user: { name: string };
  items: {
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    total: number;
  }[];
}
