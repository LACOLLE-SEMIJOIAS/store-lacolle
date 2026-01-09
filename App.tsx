
import React, { useState, useMemo } from 'react';
import { SAMPLE_PRODUCTS, WHOLESALE_CONFIG } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = useMemo(() => 
    ['Todos', ...Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))], 
  []);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, qty: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Logotipo principal (Preto para o header)
  const LogoMain = ({ className = "h-14" }: { className?: string }) => (
    <img 
      src="https://content.instruct.ai/v1/image/4a14112e-85a2-4a00-9978-57451648a946" 
      alt="La Colle & CO" 
      className={`object-contain ${className}`}
    />
  );

  // Logotipo Branco (Para o rodapé escuro)
  const LogoFooter = ({ className = "h-14" }: { className?: string }) => (
    <img 
      src="https://content.instruct.ai/v1/image/22467b7e-751d-44cc-8e36-6997193950f2" 
      alt="La Colle & CO" 
      className={`object-contain ${className}`}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar (Black) */}
      <div className="bg-black text-white py-2 text-[10px] md:text-[11px] px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <span className="opacity-70">📞</span> (11) 94474-1742
            </span>
            <span className="flex items-center gap-1">
              <span className="opacity-70">📱</span> 11 97342-0966
            </span>
            <span className="flex items-center gap-1">
              <span className="opacity-70">✉️</span> atendimento@lacolle.com.br
            </span>
          </div>
          
          <div className="flex items-center gap-2 uppercase tracking-widest text-center">
            <span className="opacity-50">‹</span>
            <span>Parcele em Até 6X no Cartão De Crédito</span>
            <span className="opacity-50">›</span>
          </div>

          <div className="flex gap-3 text-lg items-center">
            <span className="cursor-pointer hover:opacity-70 text-sm">📷</span>
            <span className="cursor-pointer hover:opacity-70 font-bold text-sm">f</span>
          </div>
        </div>
      </div>

      {/* Main Header (Peach) */}
      <header className="bg-peach py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* Search */}
          <div className="relative max-w-xs w-full justify-self-center md:justify-self-start">
            <input 
              type="text" 
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 border border-white rounded-full px-6 py-2.5 text-sm placeholder-white/80 text-white focus:outline-none focus:bg-white/30 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          {/* Logo Center */}
          <div className="flex justify-center">
             <LogoMain className="h-16 md:h-20" />
          </div>

          {/* User & Cart */}
          <div className="flex items-center justify-center md:justify-end gap-6 text-[11px] md:text-[13px] font-medium uppercase tracking-tight">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
              <span className="text-xl">👤</span>
              <span>Cadastre-se | Fazer login</span>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative cursor-pointer hover:opacity-70"
            >
              <span className="text-2xl md:text-3xl">🛍️</span>
              {cartItems.length > 0 && (
                <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalog Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Categories Bar */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Filtrar:</span>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 text-[11px] uppercase tracking-widest rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </main>

      {/* Footer Layout com novo Logo Branco */}
      <footer className="w-full mt-auto">
        {/* Newsletter Section (Black) */}
        <div className="bg-black text-white py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-6 items-center md:items-start">
              <LogoFooter className="h-12" /> {/* Usando o logotipo branco aqui */}
              <div className="flex gap-4 text-xl">
                <span className="cursor-pointer hover:opacity-70">📷</span>
                <span className="cursor-pointer hover:opacity-70 font-bold text-sm leading-none flex items-center">f</span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl w-full">
              <div className="flex flex-col gap-1 mb-6 text-center md:text-left">
                <h3 className="uppercase text-sm font-bold tracking-[0.2em]">LA COLLE CLUB</h3>
                <p className="text-[10px] opacity-60 uppercase tracking-widest">Seja da nossa lista VIP!</p>
              </div>
              <form className="flex flex-wrap gap-2 justify-center md:justify-start" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nome completo" className="bg-black border border-white/20 text-[10px] px-4 py-3 min-w-[150px] focus:outline-none focus:border-white/60 transition-colors uppercase tracking-widest" />
                <input type="text" placeholder="Fone/WhatsApp" className="bg-black border border-white/20 text-[10px] px-4 py-3 min-w-[150px] focus:outline-none focus:border-white/60 transition-colors uppercase tracking-widest" />
                <input type="email" placeholder="E-mail" className="bg-black border border-white/20 text-[10px] px-4 py-3 min-w-[150px] flex-1 focus:outline-none focus:border-white/60 transition-colors uppercase tracking-widest" />
                <button className="bg-peach text-black text-[10px] font-bold uppercase px-8 py-3 hover:bg-opacity-90 transition-all tracking-[0.2em]">EU QUERO!</button>
              </form>
            </div>
          </div>
        </div>

        {/* Links & Info Section (Beige) */}
        <div className="bg-footer-beige py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-zinc-800">
            {/* Institucional */}
            <div className="space-y-4">
              <h4 className="font-bold text-[11px] uppercase tracking-[0.1em]">Institucional</h4>
              <ul className="text-[11px] space-y-2 opacity-80 uppercase tracking-tight">
                <li className="hover:underline cursor-pointer">Página Inicial</li>
                <li className="hover:underline cursor-pointer">Sobre a La Colle & CO</li>
                <li className="hover:underline cursor-pointer">Política de Troca e Devolução</li>
                <li className="hover:underline cursor-pointer">Política de Reembolso</li>
                <li className="hover:underline cursor-pointer">Política de Privacidade</li>
                <li className="hover:underline cursor-pointer">Termos de Uso</li>
                <li className="hover:underline cursor-pointer">Fale Conosco</li>
              </ul>
            </div>

            {/* Meus Pedidos */}
            <div className="space-y-4">
              <h4 className="font-bold text-[11px] uppercase tracking-[0.1em]">Meus Pedidos</h4>
              <ul className="text-[11px] space-y-2 opacity-80 uppercase tracking-tight">
                <li className="hover:underline cursor-pointer">Minha Conta</li>
                <li className="hover:underline cursor-pointer">Criar uma Conta</li>
                <li className="hover:underline cursor-pointer">Rastrear Pedido (Correios)</li>
              </ul>
            </div>

            {/* Atendimento Online */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-bold text-[11px] uppercase tracking-[0.1em]">Atendimento Online</h4>
              <ul className="text-[11px] space-y-3 opacity-80 font-medium">
                <li className="flex items-center gap-2"><span>📞</span> (11) 94474-1742</li>
                <li className="flex items-center gap-2"><span>📱</span> 11 97342-0966</li>
                <li className="flex items-center gap-2"><span>✉️</span> atendimento@lacolle.com.br</li>
                <li className="flex items-center gap-2"><span>📍</span> São Paulo - SP</li>
                <li className="flex items-center gap-2"><span>⏰</span> De Seg. à Sex. das 9h às 18h.</li>
              </ul>
            </div>
          </div>

          {/* Payment & Security Badges */}
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-black/5 flex flex-col md:flex-row gap-12 justify-between items-start">
            <div className="space-y-4">
               <h4 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Formas de pagamento</h4>
               <div className="flex flex-wrap gap-3 items-center opacity-60">
                 <img src="https://cdn.jsdelivr.net/gh/annexare/payment-icons/svg/visa.svg" className="h-6" alt="Visa" />
                 <img src="https://cdn.jsdelivr.net/gh/annexare/payment-icons/svg/mastercard.svg" className="h-6" alt="Master" />
                 <img src="https://cdn.jsdelivr.net/gh/annexare/payment-icons/svg/amex.svg" className="h-6" alt="Amex" />
                 <img src="https://cdn.jsdelivr.net/gh/annexare/payment-icons/svg/diners.svg" className="h-6" alt="Diners" />
                 <div className="bg-zinc-800 text-white w-10 h-6 rounded-sm text-[8px] flex items-center justify-center font-bold">PIX</div>
                 <div className="bg-zinc-800 text-white w-12 h-6 rounded-sm text-[8px] flex items-center justify-center font-bold">BOLETO</div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Meios de envio</h4>
               <div className="flex gap-4 items-center opacity-60">
                 <div className="bg-zinc-800 text-white px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">Correios</div>
                 <div className="bg-zinc-800 text-white px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">Loggi</div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Segurança</h4>
               <div className="flex gap-4 items-center opacity-60">
                  <div className="border border-black/10 p-2 rounded-sm flex items-center gap-2 bg-white/50">
                    <span className="text-xl">🔒</span>
                    <div className="flex flex-col text-[8px] leading-tight font-bold">
                      <span className="text-zinc-400">LOJA SEGURA</span>
                      <span className="text-zinc-900">SSL CERTIFICADO</span>
                    </div>
                  </div>
                  <div className="border border-black/10 p-2 rounded-sm flex items-center gap-2 bg-white/50">
                    <img src="https://www.gstatic.com/images/branding/googlelogo/svg/google_logo_color_92x30dp.svg" className="h-3" alt="Google" />
                    <div className="flex flex-col text-[8px] leading-tight font-bold">
                      <span className="text-green-600">SAFE BROWSING</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-10 text-center md:text-left">
            <p className="text-gray-400 text-[9px] uppercase tracking-[0.2em]">© 2024 La Colle & CO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
        config={WHOLESALE_CONFIG}
      />
    </div>
  );
};

export default App;
