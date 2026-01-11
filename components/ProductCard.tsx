
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  isEditMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, isEditMode }) => {
  const extensions = ['.jpg', '.png', '.webp', '.jpeg'];
  const [extIndex, setExtIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset de erro e índice ao mudar de produto
    setExtIndex(0);
    setImgError(false);
  }, [product.sku]);

  useEffect(() => {
    // Carrega a imagem da pasta local /produtos
    setCurrentUrl(`${product.imageUrl}${extensions[extIndex]}`);
  }, [product.imageUrl, extIndex]);

  const handleImageError = () => {
    if (extIndex < extensions.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setImgError(true);
    }
  };

  const copySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className={`group flex flex-col bg-white transition-all duration-500`}>
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-500">
        <img 
          src={imgError ? `https://via.placeholder.com/600x800/fdf2f0/f5a27a?text=${product.sku}` : currentUrl} 
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* SKU Badge - Clicável para copiar */}
        <button 
          onClick={copySku}
          title="Clique para copiar o código"
          className="absolute top-4 left-4 flex flex-col items-start gap-1"
        >
          <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] px-3 py-1.5 tracking-[0.1em] font-bold shadow-sm rounded-sm uppercase hover:bg-black hover:text-white transition-colors">
            {copied ? 'COPIADO!' : product.sku}
          </span>
          {!isEditMode && product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter rounded-sm animate-pulse">
              Últimas Peças
            </span>
          )}
        </button>
        
        {/* Esgotado Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
             <span className="bg-black text-white text-[10px] font-bold px-6 py-2.5 uppercase tracking-[0.4em] shadow-xl">Esgotado</span>
          </div>
        )}
      </div>
      
      {/* Detalhes do Produto */}
      <div className="pt-5 flex flex-col text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
           <h3 className="text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
            {product.category}
          </h3>
          {!isEditMode && product.stock > 0 && (
             <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">
               Disponível
             </span>
          )}
        </div>

        <h2 className="text-[12px] font-bold text-zinc-900 uppercase tracking-tight leading-relaxed mb-4 min-h-[40px]">
          {product.name}
        </h2>
        
        <div className="pt-4 border-t border-zinc-50">
          {isEditMode ? (
            <div className="space-y-4 bg-zinc-50 p-4 rounded-sm border border-zinc-100">
               <div className="flex flex-col">
                  <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Preço Atacado</span>
                  <input 
                    type="number" 
                    value={product.price} 
                    onChange={(e) => onUpdate({...product, price: parseFloat(e.target.value) || 0})}
                    className="bg-white border border-zinc-200 rounded px-3 py-2 text-xs font-bold focus:border-peach outline-none shadow-sm" 
                  />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Estoque Físico</span>
                  <input 
                    type="number" 
                    value={product.stock} 
                    onChange={(e) => onUpdate({...product, stock: parseInt(e.target.value) || 0})}
                    className="bg-zinc-900 text-white rounded px-3 py-2 text-xs font-bold outline-none shadow-inner" 
                  />
               </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Atacado</span>
              <span className="text-base md:text-lg font-black text-zinc-900 tracking-tighter">{formattedPrice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
