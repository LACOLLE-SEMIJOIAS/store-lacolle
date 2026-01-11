
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onAddToCart?: () => void;
  isEditMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onAddToCart, isEditMode }) => {
  const [imgError, setImgError] = useState(false);

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
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img 
          src={imgError ? placeholderUrl : product.imageUrl} 
          alt={product.name}
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            !imgError ? 'group-hover:scale-105' : ''
          }`}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] px-3 py-1.5 tracking-[0.2em] font-bold shadow-sm">
            {product.sku}
          </span>
        </div>
        
        {!isEditMode && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
             <span className="bg-black text-white text-[10px] font-bold px-5 py-2.5 uppercase tracking-[0.3em]">Indisponível</span>
          </div>
        )}

        {/* BOTAO DE ADD RAPIDO NO HOVER */}
        {!isEditMode && product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={onAddToCart}
              className="w-full bg-black/80 hover:bg-black text-white text-[11px] font-bold py-4 uppercase tracking-widest backdrop-blur-md"
            >
              Adicionar ao Orçamento
            </button>
          </div>
        )}
      </div>
      
      <div className="py-4 flex flex-col gap-1">
        <h3 className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest truncate">
          {product.category}
        </h3>
        <h2 className="text-[13px] font-bold text-zinc-900 uppercase tracking-tight line-clamp-2 h-10">
          {product.name}
        </h2>
        
        <div className="mt-2 pt-2 border-t border-gray-50">
          {isEditMode ? (
            <div className="space-y-3">
               <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Preço Atacado</label>
                  <input type="number" value={product.price} onChange={handlePriceChange} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs font-bold focus:ring-1 focus:ring-peach outline-none" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Qtd Estoque</label>
                  <input type="number" value={product.stock} onChange={handleStockChange} className="w-full bg-zinc-900 text-white rounded px-2 py-1.5 text-xs font-bold focus:ring-1 focus:ring-peach outline-none" />
               </div>
            </div>
          ) : (
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Atacado</span>
                <span className="text-base font-black text-zinc-900">{formattedPrice}</span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {product.stock} DISPONÍVEIS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
