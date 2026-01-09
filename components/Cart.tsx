
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
                <img src={item.imageUrl} className="w-20 h-24 object-cover rounded-sm" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium uppercase">{item.name}</h4>
                  <p className="text-[10px] text-gray-400">SKU: {item.sku}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex border border-gray-200 rounded-sm scale-90 origin-left">
                      <button onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} className="px-2">-</button>
                      <span className="w-8 text-center text-xs leading-6">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="px-2">+</button>
                    </div>
                    <span className="text-sm font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                    </span>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-[10px] text-red-500 hover:underline mt-1 uppercase">Remover</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Mínimo Atacado:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(config.minOrderValue)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className={isEligible ? 'text-green-600' : 'text-red-600'}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </div>

          {!isEligible && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-sm text-[11px] text-amber-800">
              Faltam <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remainingForMin)}</strong> para atingir o valor mínimo de atacado.
            </div>
          )}

          <button 
            disabled={!isEligible || items.length === 0}
            className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:bg-gray-300"
          >
            Finalizar Pedido via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
