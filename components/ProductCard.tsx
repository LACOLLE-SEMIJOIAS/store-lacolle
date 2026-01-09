
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [qty, setQty] = React.useState(1);

  return (
    <div className="bg-white group flex flex-col h-full border border-transparent hover:border-peach/30 transition-all">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 flex flex-col gap-1">
          <span className="bg-white/90 text-black text-[9px] px-2 py-0.5 tracking-widest uppercase font-bold shadow-sm">
            {product.sku}
          </span>
          {product.stock <= 10 && (
            <span className="bg-black text-white text-[9px] px-2 py-0.5 tracking-widest uppercase font-bold">
              Últimas {product.stock}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-[11px] font-semibold text-zinc-900 line-clamp-2 uppercase tracking-wide leading-tight min-h-[2rem]">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Valor atacado</span>
            <span className="text-lg font-bold text-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center border border-zinc-200 rounded-sm">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
              >-</button>
              <span className="w-8 text-center text-xs font-bold">{qty}</span>
              <button 
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
              >+</button>
            </div>
            
            <button 
              disabled={product.stock <= 0}
              onClick={() => onAddToCart(product, qty)}
              className="flex-1 bg-zinc-900 text-white text-[10px] font-bold py-2 px-4 uppercase tracking-widest hover:bg-black transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              {product.stock > 0 ? 'Adicionar' : 'Esgotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
