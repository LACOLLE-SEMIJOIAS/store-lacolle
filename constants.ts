
import { Product, WholesaleConfig } from './types';

export const WHOLESALE_CONFIG: WholesaleConfig = {
  minOrderValue: 1500,
  minQuantityPerItem: 3,
};

/** 
 * Caminho das pastas conforme estrutura do repositório store-lacolle.
 * No Vercel, pastas na raiz são acessíveis via /nome-da-pasta/
 */
export const LOCAL_PRODUTOS_PATH = "produtos";

const createImageUrlBase = (name: string) => {
  // Retornamos apenas o nome base; a extensão e o caminho completo são tratados no componente
  return name.trim();
};

export const SAMPLE_PRODUCTS: Product[] = [
  { id: 'lc-001', sku: 'LC0001', name: 'Brinco Espiral Vazado', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Espiral Vazado') },
  { id: 'lc-002', sku: 'LC0002', name: 'Brinco Quadrado Listrado', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Quadrado Listrado') },
  { id: 'lc-003', sku: 'LC0003', name: 'Colar Cartier com Borboleta Preta', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Cartier com Borboleta Preta') },
  { id: 'lc-004', sku: 'LC0004', name: 'Colar Canutilhos com Esferas', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Canutilhos com Esferas') },
  { id: 'lc-005', sku: 'LC0005', name: 'Colar Canutilhos com Esferas 1mm', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Canutilhos com Esferas 1mm') },
  { id: 'lc-006', sku: 'LC0006', name: 'Brinco Ponto de Luz em Zircônia Cristal', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Ponto de Luz em Zircônia Cristal') },
  { id: 'lc-007', sku: 'LC0007', name: 'Brinco Meia Bola Com Pérola e Borda 6mm', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Meia Bola Com Pérola e Borda 6mm') },
  { id: 'lc-008', sku: 'LC0008', name: 'Brinco Com Base Redonda e Pérola', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Com Base Redonda e Pérola') },
  { id: 'lc-009', sku: 'LC0009', name: 'Brinco Quadrado Cravejado com Zircônias Cristal 9x9mm', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Quadrado Cravejado com Zircônias Cristal 9x9mm') },
  { id: 'lc-010', sku: 'LC0010', name: 'Brinco Quadrado Frisado Geométrico', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Quadrado Frisado Geométrico') },
  { id: 'lc-011', sku: 'LC0011', name: 'Brinco Redondo com Efeito Raiado 28mm', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Redondo com Efeito Raiado 28mm') },
  { id: 'lc-012', sku: 'LC0012', name: 'Brinco Flor Orgânica 6 Pontas Texturizada', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Flor Orgânica 6 Pontas Texturizada') },
  { id: 'lc-013', sku: 'LC0013', name: 'Brinco Coração Plissado 1,3cm', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Coração Plissado 1,3cm') },
  { id: 'lc-014', sku: 'LC0014', name: 'Brinco Flor 4 Pétalas', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Flor 4 Pétalas') },
  { id: 'lc-015', sku: 'LC0015', name: 'Brinco Meia Argola Abaulada', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Meia Argola Abaulada') },
  { id: 'lc-016', sku: 'LC0016', name: 'Brinco Coração De Pérola', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Coração De Pérola') },
  { id: 'lc-017', sku: 'LC0017', name: 'Brinco Argolinha Reticulada Click', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argolinha Reticulada Click') },
  { id: 'lc-018', sku: 'LC0018', name: 'Brinco Argolinha Click de Esferas', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argolinha Click de Esferas') },
  { id: 'lc-019', sku: 'LC0019', name: 'Brinco Borboleta Branca Eleganza', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Borboleta Branca Eleganza') },
  { id: 'lc-020', sku: 'LC0020', name: 'Choker Corrente Torcida Diamantada', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Choker Corrente Torcida Diamantada') },
  { id: 'lc-021', sku: 'LC0021', name: 'Colar Chocker de Pérolas', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Chocker de Pérolas') },
  { id: 'lc-022', sku: 'LC0022', name: 'Pulseira Elo Português com Coração, Cadeado, Trevo e Chave', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Elo Português com Coração, Cadeado, Trevo e Chave') },
  { id: 'lc-023', sku: 'LC0023', name: 'Brinco de Argolinha Pequeno Coração Cravejado de Pedras', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Argolinha Pequeno Coração Cravejado de Pedras') },
  { id: 'lc-024', sku: 'LC0024', name: 'Brinco Quadrado Cravejado com Zircônias', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Quadrado Cravejado com Zircônias') },
  { id: 'lc-025', sku: 'LC0025', name: 'Pulseira Cartier La Colle', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Cartier La Colle') },
  { id: 'lc-026', sku: 'LC0026', name: 'Brinco Borboleta Verde Eleganza', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Borboleta Verde Eleganza') },
  { id: 'lc-027', sku: 'LC0027', name: 'Brinco Argola Vazada Cravejada Cristal', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argola Vazada Cravejada Cristal') },
  { id: 'lc-028', sku: 'LC0028', name: 'Brinco Argola Texturizada com Coração em Cristal', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argola Texturizada com Coração em Cristal') },
  { id: 'lc-029', sku: 'LC0029', name: 'Colar Chocker Riviera Navete Cristal', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Chocker Riviera Navete Cristal') },
  { id: 'lc-030', sku: 'LC0030', name: 'Brinco Prateado Gota', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Prateado Gota') },
  { id: 'lc-031', sku: 'LC0031', name: 'Brinco Dourado de Trevo com Zircônia Verde', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Dourado de Trevo com Zircônia Verde') },
  { id: 'lc-032', sku: 'LC0032', name: 'Brinco Dourado Gota', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Dourado Gota') },
  { id: 'lc-033', sku: 'LC0033', name: 'Brinco Girassol Cravejado com Cristais', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Girassol Cravejado com Cristais') },
  { id: 'lc-034', sku: 'LC0034', name: 'Colar Rabo de Rato com Flor 4 Pétalas', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Rabo de Rato com Flor 4 Pétalas') },
  { id: 'lc-035', sku: 'LC0035', name: 'Brinco com 4 Pontos de Luz em Zircônia', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco com 4 Pontos de Luz em Zircônia') },
  { id: 'lc-036', sku: 'LC0036', name: 'Brinco Ponto de Luz em Zircônia', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Ponto de Luz em Zircônia') },
  { id: 'lc-037', sku: 'LC0037', name: 'Brinco Ponto de Luz Pequeno em Zircônia', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Ponto de Luz Pequeno em Zircônia') },
  { id: 'lc-038', sku: 'LC0038', name: 'Brinco de Argolinha com Pedra de Zircônia em Formato de Estrela', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Argolinha com Pedra de Zircônia em Formato de Estrela') },
  { id: 'lc-039', sku: 'LC0039', name: 'Pulseira Dourada Trevos Com Zircônias Preta', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Dourada Trevos Com Zircônias Preta') },
  { id: 'lc-040', sku: 'LC0040', name: 'Brinco de Gota em Zircônia', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Gota em Zircônia') },
  { id: 'lc-041', sku: 'LC0041', name: 'Colar Cordão Baiano', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Cordão Baiano') },
  { id: 'lc-042', sku: 'LC0042', name: 'Colar Medalha Olho Grego', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Medalha Olho Grego') },
  { id: 'lc-043', sku: 'LC0043', name: 'Brinco de Pedra Zircônia em formato de Coração', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Pedra Zircônia em formato de Coração') },
  { id: 'lc-044', sku: 'LC0044', name: 'Brinco Clássico de Pérola', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Clássico de Pérola') },
  { id: 'lc-045', sku: 'LC0045', name: 'Pulseira de Pérolas e Bolinhas', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira de Pérolas e Bolinhas') },
  { id: 'lc-046', sku: 'LC0046', name: 'Pulseira Trançada', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Trançada') },
  { id: 'lc-047', sku: 'LC0047', name: 'Corrente Delicada Trançada', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Corrente Delicada Trançada') },
  { id: 'lc-048', sku: 'LC0048', name: 'Brinco Ear Cuff Cristal Gota', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Ear Cuff Cristal Gota') },
  { id: 'lc-049', sku: 'LC0049', name: 'Brinco de Argolinha Pequeno Coração', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Argolinha Pequeno Coração') },
  { id: 'lc-050', sku: 'LC0050', name: 'Brinco de Coração Rosa', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Coração Rosa') },
  { id: 'lc-051', sku: 'LC0051', name: 'Escapulário São Jorge', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Escapulário São Jorge') },
  { id: 'lc-052', sku: 'LC0052', name: 'Escapulário Quadrado', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Escapulário Quadrado') },
  { id: 'lc-053', sku: 'LC0053', name: 'Pulseira Elo 3 por 1', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Elo 3 por 1') },
  { id: 'lc-054', sku: 'LC0054', name: 'Pulseira de Seta', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira de Seta') },
  { id: 'lc-055', sku: 'LC0055', name: 'Brinco Argolinha Pedra de Coração Rosa', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argolinha Pedra de Coração Rosa') },
  { id: 'lc-056', sku: 'LC0056', name: 'Brinco Argolinha Pedra de Coração Verde', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco Argolinha Pedra de Coração Verde') },
  { id: 'lc-057', sku: 'LC0057', name: 'Brinco de Pedra Retangular Rosa', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Pedra Retangular Rosa') },
  { id: 'lc-058', sku: 'LC0058', name: 'Brinco de Pedra Retangular Verde', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Pedra Retangular Verde') },
  { id: 'lc-059', sku: 'LC0059', name: 'Brinco de Coração Verde', price: 0, stock: 1, category: 'Brincos', imageUrl: createImageUrlBase('Brinco de Coração Verde') },
  { id: 'lc-060', sku: 'LC0060', name: 'Pulseira Dupla de Elo Português e Pérolas com Pingente', price: 0, stock: 1, category: 'Pulseiras', imageUrl: createImageUrlBase('Pulseira Dupla de Elo Português e Pérolas com Pingente') },
  { id: 'lc-061', sku: 'LC0061', name: 'Colar Triplo 3 Pontos de Luz em Zircônia', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Triplo 3 Pontos de Luz em Zircônia') },
  { id: 'lc-062', sku: 'LC0062', name: 'Colar Duplo de Coração em Cristal', price: 0, stock: 1, category: 'Colares', imageUrl: createImageUrlBase('Colar Duplo de Coração em Cristal') }
];
