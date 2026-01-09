
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WholesaleConfig {
  minOrderValue: number;
  minQuantityPerItem: number;
}
