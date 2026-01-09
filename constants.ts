
import { Product, WholesaleConfig } from './types';

export const WHOLESALE_CONFIG: WholesaleConfig = {
  minOrderValue: 1500, // R$ 1.500,00
  minQuantityPerItem: 3,
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'BR-001-GOLD',
    name: 'Brinco Argola Cravejada Ouro 18k',
    price: 45.90,
    stock: 120,
    category: 'Brincos',
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    sku: 'CL-054-GOLD',
    name: 'Colar Veneziana Pingente Zircônia',
    price: 89.00,
    stock: 45,
    category: 'Colares',
    imageUrl: 'https://images.unsplash.com/photo-1599643478123-212f27941a9c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    sku: 'AN-022-GOLD',
    name: 'Anel Solitário Minimalista',
    price: 32.50,
    stock: 80,
    category: 'Anéis',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    sku: 'BR-015-SILVER',
    name: 'Brinco Ponto de Luz Ródio Branco',
    price: 18.00,
    stock: 200,
    category: 'Brincos',
    imageUrl: 'https://images.unsplash.com/photo-1535633302703-b0703af78518?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    sku: 'PU-088-GOLD',
    name: 'Pulseira Riviera Banho Ouro',
    price: 115.00,
    stock: 15,
    category: 'Pulseiras',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    sku: 'CL-099-PEARL',
    name: 'Gargantilha Pérolas Shell',
    price: 155.00,
    stock: 30,
    category: 'Colares',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'
  }
];
