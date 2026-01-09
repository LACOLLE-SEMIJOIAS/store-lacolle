
import React from 'react';
import { CartItem, WholesaleConfig } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  config: WholesaleConfig;
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQty, config, isOpen, onClose }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingForMin = Math.max(0, config.minOrderValue - total);
  const isEligible = total >= config.minOrderValue;

  const handleCheckout = () => {
    const phone = "5511973420966";
    const header = "Olá La Colle & CO! Gostaria de solicitar um orçamento no atacado:\n\n";
    const itemsList = items.map(item => 
      `• ${item.sku} - ${item.name}\n  Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join("\n\n");
    const footer = `\n\n*Total do Orçamento: R$ ${total.toFixed(2)}*`;
    
    const message = encodeURIComponent(header + itemsList + footer);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-widest serif">Seu Orçamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Nenhum item adicionado ao orçamento.
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                <img src={item.imageUrl} className="w-20 h-24 object-cover rounded-sm bg-gray-50" />
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold uppercase leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-gray-400">SKU: {item.sku}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex border border-gray-200 rounded-sm scale-90 origin-left">
                      <button onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} className="px-2 hover:bg-gray-50">-</button>
                      <span className="w-8 text-center text-xs leading-6 font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="px-2 hover:bg-gray-50">+</button>
                    </div>
                    <span className="text-xs font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                    </span>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-[9px] text-red-500 hover:underline mt-1 uppercase font-bold tracking-tighter">Remover Item</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t space-y-4 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-gray-500">
            <span>Mínimo Atacado:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(config.minOrderValue)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold uppercase tracking-widest">
            <span>Total:</span>
            <span className={isEligible ? 'text-green-600' : 'text-red-600'}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </div>

          {!isEligible && (
            <div className="bg-white border border-peach/30 p-4 rounded-sm">
               <div className="flex justify-between mb-1 text-[9px] font-bold uppercase tracking-widest text-peach">
                <span>Progresso para Atacado</span>
                <span>{Math.round((total / config.minOrderValue) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-peach h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (total / config.minOrderValue) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-gray-500 leading-tight">
                Faltam <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remainingForMin)}</strong> para liberar o pedido.
              </p>
            </div>
          )}

          <button 
            disabled={!isEligible || items.length === 0}
            onClick={handleCheckout}
            className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:bg-gray-300 shadow-xl active:scale-[0.98]"
          >
            Finalizar via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
