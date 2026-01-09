
import { Product, WholesaleConfig } from './types';

export const WHOLESALE_CONFIG: WholesaleConfig = {
  minOrderValue: 1500, // R$ 1.500,00
  minQuantityPerItem: 3,
};

// Se os arquivos estiverem dentro de uma pasta no GitHub, adicione o caminho aqui.
// Exemplo: se estiver em public/produtos, use ".../main/public/produtos"
const GITHUB_IMG_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main/produtos";

// Função para gerar a URL. Tente trocar .webp por .png ou .jpg se suas imagens tiverem outra extensão.
const createImageUrl = (name: string) => `${GITHUB_IMG_BASE}/${name.replace(/\s/g, '%20')}.webp`;

export const SAMPLE_PRODUCTS: Product[] = [
  { id: 'lc-001', sku: 'LC0001', name: 'Brinco Espiral Vazado', price: 19.90, stock: 50, category: 'Brincos', imageUrl: createImageUrl('Brinco Espiral Vazado') },
  { id: 'lc-002', sku: 'LC0002', name: 'Brinco Quadrado Listrado', price: 19.90, stock: 45, category: 'Brincos', imageUrl: createImageUrl('Brinco Quadrado Listrado') },
  { id: 'lc-003', sku: 'LC0003', name: 'Colar Cartier com Borboleta Preta', price: 19.90, stock: 20, category: 'Colares', imageUrl: createImageUrl('Colar Cartier com Borboleta Preta') },
  { id: 'lc-004', sku: 'LC0004', name: 'Colar Canutilhos com Esferas', price: 19.90, stock: 30, category: 'Colares', imageUrl: createImageUrl('Colar Canutilhos com Esferas') },
  { id: 'lc-005', sku: 'LC0005', name: 'Colar Canutilhos com Esferas 1mm', price: 19.90, stock: 25, category: 'Colares', imageUrl: createImageUrl('Colar Canutilhos com Esferas 1mm') },
  { id: 'lc-006', sku: 'LC0006', name: 'Brinco Ponto de Luz em Zircônia Cristal', price: 19.90, stock: 60, category: 'Brincos', imageUrl: createImageUrl('Brinco Ponto de Luz em Zircônia Cristal') },
  { id: 'lc-007', sku: 'LC0007', name: 'Brinco Meia Bola Com Pérola e Borda 6mm', price: 19.90, stock: 15, category: 'Brincos', imageUrl: createImageUrl('Brinco Meia Bola Com Pérola e Borda 6mm') },
  { id: 'lc-008', sku: 'LC0008', name: 'Brinco Com Base Redonda e Pérola', price: 19.90, stock: 10, category: 'Brincos', imageUrl: createImageUrl('Brinco Com Base Redonda e Pérola') },
  { id: 'lc-009', sku: 'LC0009', name: 'Brinco Quadrado Cravejado com Zircônias Cristal 9x9mm', price: 20.90, stock: 18, category: 'Brincos', imageUrl: createImageUrl('Brinco Quadrado Cravejado com Zircônias Cristal 9x9mm') },
  { id: 'lc-010', sku: 'LC0010', name: 'Brinco Quadrado Frisado Geométrico', price: 19.90, stock: 22, category: 'Brincos', imageUrl: createImageUrl('Brinco Quadrado Frisado Geométrico') },
  { id: 'lc-011', sku: 'LC0011', name: 'Brinco Redondo com Efeito Raiado 28mm', price: 19.90, stock: 35, category: 'Brincos', imageUrl: createImageUrl('Brinco Redondo com Efeito Raiado 28mm') },
  { id: 'lc-012', sku: 'LC0012', name: 'Brinco Flor Orgânica 6 Pontas Texturizada', price: 19.90, stock: 12, category: 'Brincos', imageUrl: createImageUrl('Brinco Flor Orgânica 6 Pontas Texturizada') },
  { id: 'lc-013', sku: 'LC0013', name: 'Brinco Coração Plissado 1,3cm', price: 19.90, stock: 40, category: 'Brincos', imageUrl: createImageUrl('Brinco Coração Plissado 1,3cm') },
  { id: 'lc-014', sku: 'LC0014', name: 'Brinco Flor 4 Pétalas', price: 19.90, stock: 28, category: 'Brincos', imageUrl: createImageUrl('Brinco Flor 4 Pétalas') },
  { id: 'lc-015', sku: 'LC0015', name: 'Brinco Meia Argola Abaulada', price: 19.90, stock: 50, category: 'Brincos', imageUrl: createImageUrl('Brinco Meia Argola Abaulada') },
  { id: 'lc-016', sku: 'LC0016', name: 'Brinco Coração De Pérola', price: 19.90, stock: 33, category: 'Brincos', imageUrl: createImageUrl('Brinco Coração De Pérola') },
  { id: 'lc-017', sku: 'LC0017', name: 'Brinco Argolinha Reticulada Click', price: 19.90, stock: 21, category: 'Brincos', imageUrl: createImageUrl('Brinco Argolinha Reticulada Click') },
  { id: 'lc-018', sku: 'LC0018', name: 'Brinco Argolinha Click de Esferas', price: 19.90, stock: 19, category: 'Brincos', imageUrl: createImageUrl('Brinco Argolinha Click de Esferas') },
  { id: 'lc-019', sku: 'LC0019', name: 'Brinco Borboleta Branca Eleganza', price: 19.90, stock: 15, category: 'Brincos', imageUrl: createImageUrl('Brinco Borboleta Branca Eleganza') },
  { id: 'lc-020', sku: 'LC0020', name: 'Choker Corrente Torcida Diamantada', price: 19.90, stock: 12, category: 'Colares', imageUrl: createImageUrl('Choker Corrente Torcida Diamantada') }
];
