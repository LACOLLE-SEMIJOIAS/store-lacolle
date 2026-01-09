
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  isEditMode: boolean;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, isEditMode, onAddToCart }) => {
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

  return (
    <div className={`bg-white group flex flex-col h-full border transition-all p-2 shadow-sm ${
      isEditMode ? 'border-gray-100 hover:border-peach/50' : 'border-gray-50'
    }`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 text-black text-[12px] px-3 py-1 tracking-widest uppercase font-black shadow-md">
            {product.sku}
          </span>
        </div>
        
        {!isEditMode && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
             <span className="bg-black text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">Esgotado</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-tight min-h-[2rem]">
          {product.name}
        </h3>
        
        <div className="space-y-3 pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <label className="text-[8px] text-gray-400 uppercase font-bold">Atacado</label>
            {isEditMode ? (
              <input 
                type="number" 
                value={product.price}
                onChange={handlePriceChange}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none"
              />
            ) : (
              <span className="text-sm font-black text-zinc-900">{formattedPrice}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[8px] text-gray-400 uppercase font-bold">Estoque</label>
            {isEditMode ? (
              <input 
                type="number" 
                value={product.stock}
                onChange={handleStockChange}
                className="w-full bg-zinc-900 text-white rounded px-2 py-1 text-xs font-bold focus:outline-none"
              />
            ) : (
              <span className={`text-[10px] font-bold uppercase ${product.stock > 0 ? 'text-green-600' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Indisponível'}
              </span>
            )}
          </div>

          {!isEditMode && product.stock > 0 && (
            <button 
              onClick={onAddToCart}
              className="w-full bg-peach text-white py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-400 transition-colors shadow-sm"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
