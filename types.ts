
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

// Fix: Adding CartItem interface to satisfy import requirements in Cart.tsx
export interface CartItem extends Product {
  quantity: number;
}

export interface WholesaleConfig {
  minOrderValue: number;
  minQuantityPerItem: number;
}