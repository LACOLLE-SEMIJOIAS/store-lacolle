
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  isEditMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, isEditMode }) => {
  const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const [extIndex, setExtIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const isSoldOut = product.stock <= 0;

  const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main/produtos";

  useEffect(() => {
    setExtIndex(0);
    setImgError(false);
  }, [product.sku]);

  useEffect(() => {
    const filename = encodeURIComponent(product.imageUrl);
    const ext = extensions[extIndex];
    setCurrentUrl(`${GITHUB_RAW_BASE}/${filename}${ext}`);
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

  return (
    <div className={`group flex flex-col bg-white transition-all duration-500 ${isSoldOut ? 'opacity-80' : ''}`}>
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-500">
        <img 
          src={imgError ? `https://via.placeholder.com/600x800/fdf2f0/f5a27a?text=${product.sku}` : currentUrl} 
          alt={product.name}
          onError={handleImageError}
          className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isSoldOut ? 'grayscale-[0.3] opacity-60' : ''}`}
        />
        
        {/* SKU Badge */}
        <button 
          onClick={copySku}
          className="absolute top-2 left-2 md:top-4 md:left-4 z-10"
        >
          <span className="bg-white/90 backdrop-blur-sm text-black text-[8px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 tracking-[0.1em] font-bold shadow-sm rounded-sm uppercase hover:bg-black hover:text-white transition-colors">
            {copied ? 'COPIADO!' : product.sku}
          </span>
        </button>

        {/* Faixa ESGOTADO Verde */}
        {isSoldOut && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
            <span className="bg-green-600 text-white text-[8px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 tracking-[0.1em] font-black shadow-lg rounded-sm uppercase">
              ESGOTADO
            </span>
          </div>
        )}
      </div>
      
      {/* Detalhes do Produto */}
      <div className="pt-3 md:pt-5 flex flex-col text-center md:text-left">
        <div className="mb-1 md:mb-2">
           <h3 className="text-[7px] md:text-[8px] font-bold text-zinc-300 uppercase tracking-[0.2em] md:tracking-[0.3em]">
            {product.category}
          </h3>
        </div>

        <h2 className="text-[10px] md:text-[12px] font-bold text-zinc-900 uppercase tracking-tight leading-snug md:leading-relaxed mb-2 md:mb-4 min-h-[32px] md:min-h-[40px] line-clamp-2">
          {product.name}
        </h2>
        
        <div className="pt-2 md:pt-4 border-t border-zinc-50">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <span className="text-[8px] md:text-[9px] text-zinc-400 font-medium tracking-[0.05em] uppercase">Banhado a Ouro 18k</span>
            <span className={`text-[9px] md:text-[10px] font-light italic ${isSoldOut ? 'text-zinc-300' : 'text-zinc-500'}`}>
              {isSoldOut ? 'Indisponível no momento' : 'Orçamento via WhatsApp'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
