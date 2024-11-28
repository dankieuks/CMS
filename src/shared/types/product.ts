export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string | File | null;
  brand: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}
