
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS } from './constants';
import { Product } from './types';
import ProductCard from './components/ProductCard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'error'>('offline');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Caminhos locais para pastas dentro de store-lacolle
  const LOGO_IMG = "/logo/Logo-Transparente-TopoPagina.png";
  const ICON_CHAT = "/icons/04-chat.gif";
  const ICON_EMAIL = "/icons/03-email.gif";

  useEffect(() => {
    const sync = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase.from('products').select('sku, price, stock');
        if (data && data.length > 0) {
          setProducts(prev => prev.map(p => {
            const match = data.find(db => db.sku === p.sku);
            return match ? { ...p, price: match.price, stock: match.stock } : p;
          }));
          setDbStatus('connected');
        }
      } catch (e) { setDbStatus('error'); }
    };
    sync();
  }, []);

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))], []);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const search = searchTerm.toLowerCase();
      return (p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) &&
             (selectedCategory === 'Todos' || p.category === selectedCategory);
    });
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-['Montserrat']">
      
      {/* 1. BARRA DE TOPO (STATUS + CONTATO + ADMIN) */}
      <div className="bg-[#f2f5f5] border-b border-zinc-200 py-4 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Status */}
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
            <span>{dbStatus === 'connected' ? 'Online' : 'Offline'}</span>
            <span className="mx-2 text-zinc-300">|</span>
          </div>

          {/* Contatos (Central) */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-3">
              <img src={ICON_CHAT} className="w-6 h-6" alt="WhatsApp" />
              <span className="text-[11px] text-zinc-600 font-medium">+55 11 97342-0966</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={ICON_EMAIL} className="w-6 h-6" alt="Email" />
              <span className="text-[11px] text-zinc-600 font-medium">atendimento@lacolle.com.br</span>
            </div>
          </div>
          
          {/* Botão Admin */}
          <button 
            onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} 
            className="bg-[#f5a27a] text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm hover:opacity-90 transition-all rounded-sm"
          >
            {isEditMode ? 'SAIR ADMIN' : 'ÁREA ADMIN'}
          </button>
        </div>
      </div>

      {/* 2. CABEÇALHO PÊSSEGO (BUSCA + LOGO) */}
      <header className="bg-[#f5a27a] py-10 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Busca */}
          <div className="w-full max-w-[400px] relative">
            <input 
              type="text" 
              placeholder="Buscar" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-[#f8bca1] border-none rounded-full px-6 py-3.5 text-xs text-zinc-800 placeholder-zinc-700 shadow-inner focus:ring-0 font-medium" 
            />
            <div className="absolute inset-y-0 right-5 flex items-center">
               <svg className="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* Logo */}
          <div className="md:mr-20">
            <img src={LOGO_IMG} alt="La Colle" className="h-16 md:h-20 object-contain" />
          </div>
          
          <div className="hidden md:block w-[400px]"></div> {/* Spacer para equilibrar */}
        </div>
      </header>

      {/* 3. MENU NAVEGAÇÃO */}
      <nav className="bg-white border-b border-zinc-100 py-1 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar px-4">
          <div className="flex items-center gap-10 md:gap-16 justify-start md:justify-center">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`whitespace-nowrap py-5 text-[11px] uppercase tracking-[0.3em] font-bold border-b-2 transition-all duration-300 ${
                  selectedCategory === cat ? 'border-zinc-800 text-black' : 'border-transparent text-zinc-300 hover:text-zinc-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. TÍTULO E CONTADOR (STYLING DA IMAGEM 2) */}
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-[13px] text-zinc-400 font-light uppercase tracking-[0.6em] mb-6">CATÁLOGO ATACADO</h2>
        <div className="inline-block bg-[#f8f8f8] border border-zinc-100 px-8 py-3 rounded-full shadow-sm">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Mostrando {filteredProducts.length} de {products.length} itens
          </span>
        </div>
      </div>

      {/* 5. GRID DE PRODUTOS */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-16 pb-40">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 md:gap-x-12 gap-y-20">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.sku} 
              product={product} 
              onUpdate={(updated) => setProducts(prev => prev.map(p => p.sku === updated.sku ? updated : p))} 
              isEditMode={isEditMode} 
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-zinc-300 uppercase tracking-widest text-sm font-bold">Nenhum item disponível nesta categoria</p>
          </div>
        )}
      </main>

      {/* 6. RODAPÉ (STYLING DA IMAGEM 4) */}
      <footer className="bg-[#ebebe3] py-24 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <img src={LOGO_IMG} alt="La Colle" className="h-16 object-contain mb-10" />
          
          <div className="space-y-4">
            <p className="text-[10px] text-zinc-600 tracking-[0.5em] uppercase font-bold">LA COLLE & CO. SEMIJOIAS</p>
            <p className="text-[9px] text-zinc-400 tracking-[0.3em] uppercase font-medium">Feito com carinho para revendedoras</p>
          </div>
        </div>
      </footer>

      {/* MODAL ADMIN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-10 rounded-sm shadow-2xl w-full max-w-[400px] text-center">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 text-zinc-400">Acesso Administrativo</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'lili04') { setIsEditMode(true); setShowAuthModal(false); setPasswordInput(''); }
              else setAuthError(true);
            }} className="space-y-6">
              <input 
                autoFocus type="password" placeholder="SENHA" value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full bg-zinc-50 text-center py-4 text-xs outline-none border border-zinc-100 focus:border-[#f5a27a]" 
              />
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Senha Incorreta</p>}
              <button type="submit" className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em]">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <a 
        href="https://wa.me/5511973420966" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
};

export default App;
