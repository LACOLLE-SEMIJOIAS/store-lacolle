
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  isEditMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, isEditMode }) => {
  // Lista de extensões para tentar carregar
  const extensions = ['.jpg', '.png', '.webp', '.jpeg'];
  const [extIndex, setExtIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Toda vez que o produto mudar ou houver erro, tenta a próxima extensão
  useEffect(() => {
    // A URL base vem do constants.ts (sem extensão)
    const base = product.imageUrl;
    // v=2.1 para evitar cache do navegador durante os testes
    setCurrentUrl(`${base}${extensions[extIndex]}?v=2.1`);
  }, [product.imageUrl, extIndex]);

  const handleImageError = () => {
    if (extIndex < extensions.length - 1) {
      console.log(`Falha ao carregar ${extensions[extIndex]} para ${product.sku}, tentando próxima...`);
      setExtIndex(extIndex + 1);
    } else {
      console.error(`Todas as extensões falharam para o produto ${product.sku}`);
      setImgError(true);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...product, price: parseFloat(e.target.value) || 0 });
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...product, stock: parseInt(e.target.value) || 0 });
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const placeholderUrl = `https://via.placeholder.com/600x800/fdf2f0/f5a27a?text=${encodeURIComponent(product.sku)}`;

  return (
    <div className={`group flex flex-col h-full bg-white transition-all duration-300 ${
      isEditMode ? 'ring-1 ring-peach/20 p-2' : ''
    }`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
        <img 
          src={imgError ? placeholderUrl : currentUrl} 
          alt={product.name}
          onError={handleImageError}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            !imgError ? 'group-hover:scale-105' : ''
          }`}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-black text-[8px] md:text-[9px] px-2.5 py-1 tracking-[0.15em] font-bold shadow-sm rounded-[1px]">
            {product.sku}
          </span>
        </div>
        
        {!isEditMode && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
             <span className="bg-black text-white text-[9px] font-bold px-4 py-2 uppercase tracking-[0.2em]">Esgotado</span>
          </div>
        )}
      </div>
      
      <div className="py-3 flex flex-col gap-1">
        <h3 className="text-[9px] md:text-[10px] font-medium text-zinc-400 uppercase tracking-widest truncate">
          {product.category}
        </h3>
        <h2 className="text-[11px] md:text-[12px] font-bold text-zinc-900 uppercase tracking-tight line-clamp-2 h-9 md:h-10">
          {product.name}
        </h2>
        
        <div className="mt-1 pt-2 border-t border-gray-50">
          {isEditMode ? (
            <div className="space-y-3">
               <div>
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Preço Atacado</label>
                  <input type="number" value={product.price} onChange={handlePriceChange} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-peach outline-none" />
               </div>
               <div>
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Qtd Estoque</label>
                  <input type="number" value={product.stock} onChange={handleStockChange} className="w-full bg-zinc-900 text-white rounded px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-peach outline-none" />
               </div>
            </div>
          ) : (
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Atacado</span>
                <span className="text-sm md:text-base font-black text-zinc-900">{formattedPrice}</span>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm ${
                product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {product.stock} DISP.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
