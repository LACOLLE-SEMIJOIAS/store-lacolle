
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

// Added missing CartItem interface as required by the Cart component
export interface CartItem extends Product {
  quantity: number;
}

export interface WholesaleConfig {
  minOrderValue: number;
  minQuantityPerItem: number;
}
