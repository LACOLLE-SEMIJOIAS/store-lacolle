
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS } from './constants';
import { Product } from './types';
import ProductCard from './components/ProductCard';
import { supabase, connectionMeta } from './lib/supabase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'error' | 'wrong_key' | 'clerk_error'>('offline');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;

  const syncWithDatabase = async () => {
    if (!connectionMeta.hasUrl || !connectionMeta.hasKey) {
      setDbStatus('offline');
      setLoading(false);
      return;
    }
    if (connectionMeta.isClerk) {
      setDbStatus('clerk_error');
      setLoading(false);
      return;
    }
    if (!supabase) {
      setDbStatus('error');
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('products').select('sku, price, stock');
      if (error) {
        if (error.message.includes('JWT') || error.code === '401') setDbStatus('wrong_key');
        else setDbStatus('error');
      } else {
        if (data && data.length > 0) {
          setProducts(prev => prev.map(p => {
            const match = data.find(db => db.sku === p.sku);
            return match ? { ...p, price: match.price, stock: match.stock } : p;
          }));
        }
        setDbStatus('connected');
      }
    } catch (err) {
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncWithDatabase();
    if (supabase && dbStatus === 'connected') {
      const channel = supabase
        .channel('realtime-v2')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          const newItem = payload.new as any;
          if (newItem?.sku) {
            setProducts(prev => prev.map(p => 
              p.sku === newItem.sku ? { ...p, price: newItem.price, stock: newItem.stock } : p
            ));
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [dbStatus]);

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.sku === updatedProduct.sku ? updatedProduct : p));
    if (supabase) {
      try {
        await supabase.from('products').upsert({
          sku: updatedProduct.sku,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          name: updatedProduct.name,
          category: updatedProduct.category
        }, { onConflict: 'sku' });
      } catch (err) { console.error(err); }
    }
  };

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const search = searchTerm.toLowerCase();
      return (p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) &&
             (selectedCategory === 'Todos' || p.category === selectedCategory);
    });
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* MODAL ADMIN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full max-w-[440px] text-center border border-zinc-100">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-zinc-400">Acesso Restrito</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'lili04') { setIsEditMode(true); setShowAuthModal(false); setPasswordInput(''); }
              else setAuthError(true);
            }} className="space-y-5">
              <input 
                autoFocus type="password" placeholder="SENHA" value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full bg-zinc-50 text-center py-4 text-xs outline-none rounded-sm border border-zinc-200 focus:border-peach" 
              />
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Senha Incorreta</p>}
              <button type="submit" className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em]">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* 1. BARRA SUPERIOR (TOTALMENTE FIEL À FOTO) */}
      <div className="bg-[#f8f9fa] border-b border-zinc-200 py-3 px-2 md:px-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Linha de Contatos: Flex Wrap para mobile para garantir que caiba */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 md:gap-x-4 text-[8px] md:text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
              <span>{dbStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
            <span className="text-zinc-300">|</span>
            <div className="flex items-center gap-1">
               <img src="/04-chat.gif" className="w-4 h-4 md:w-5 md:h-5" alt="" />
               <span className="lowercase font-medium tracking-normal text-zinc-500">+55 11 97342-0966</span>
            </div>
            <span className="hidden md:block text-zinc-300">|</span>
            <div className="flex items-center gap-1">
               <img src="/03-email.gif" className="w-4 h-4 md:w-5 md:h-5" alt="" />
               <span className="lowercase font-medium tracking-normal text-zinc-500">atendimento@lacolle.com.br</span>
            </div>
          </div>
          
          {/* Botão Admin: Centralizado abaixo no mobile, à direita no desktop */}
          <div className="flex justify-center md:absolute md:top-3 md:right-10 mt-3 md:mt-0">
            <button 
              onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} 
              className="bg-[#f5a27a] text-white px-8 py-2 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm"
            >
              {isEditMode ? 'SAIR ADMIN' : 'ÁREA ADMIN'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. HEADER PÊSSEGO */}
      <header className="bg-peach py-8 md:py-6 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto">
          {/* MOBILE: Logo acima, Busca abaixo (Foto 1) */}
          <div className="flex md:hidden flex-col items-center gap-6">
            <img src={LOGO_URL} alt="La Colle" className="h-12 object-contain" />
            <div className="w-full max-w-[320px] relative">
              <input 
                type="text" placeholder="Buscar" value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-white/30 border border-white/20 rounded-full px-6 py-2.5 text-[13px] text-zinc-800 placeholder-zinc-700 focus:outline-none focus:bg-white/40 font-medium" 
              />
              <div className="absolute inset-y-0 right-5 flex items-center">
                 <svg className="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          {/* DESKTOP: Logo centro, Busca direita (Imagem 2) */}
          <div className="hidden md:grid grid-cols-3 items-center">
            <div></div> {/* Vazio esquerda */}
            <div className="flex justify-center">
              <img src={LOGO_URL} alt="La Colle" className="h-20 object-contain" />
            </div>
            <div className="flex justify-end">
              <div className="relative w-full max-w-[280px]">
                <input 
                  type="text" placeholder="Buscar" value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full bg-white/30 border border-white/30 rounded-full px-6 py-2.5 text-sm text-zinc-900 placeholder-zinc-800 focus:outline-none focus:bg-white/50 transition-all" 
                />
                <div className="absolute inset-y-0 right-6 flex items-center">
                   <svg className="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MENU DE CATEGORIAS */}
      <nav className="bg-white border-b border-gray-100 py-1 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar px-4">
          <div className="flex items-center gap-8 md:gap-16 justify-start md:justify-center">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`whitespace-nowrap py-4 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold border-b-2 transition-all ${
                  selectedCategory === cat ? 'border-zinc-800 text-black' : 'border-transparent text-zinc-300 hover:text-zinc-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* TEXTO DE CONTEÚDO */}
      <div className="py-12 text-center bg-zinc-50/20">
        <h2 className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.5em] mb-4">Catálogo Atacado</h2>
        <div className="inline-block bg-white border border-zinc-100 rounded-full px-8 py-2.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest shadow-sm">
          Mostrando {filteredProducts.length} de {products.length} itens
        </div>
      </div>

      {/* LISTA DE PRODUTOS */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 md:px-10 pb-24 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 md:gap-x-10 gap-y-16">
          {filteredProducts.map(product => (
            <ProductCard key={product.sku} product={product} onUpdate={handleUpdateProduct} isEditMode={isEditMode} />
          ))}
        </div>
      </main>

      {/* RODAPÉ (INALTERADO) */}
      <footer className="bg-footer-beige py-20 px-6 border-t border-zinc-100">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <img src={LOGO_URL} alt="La Colle" className="h-14 object-contain mb-8 opacity-60" />
          <div className="space-y-3">
            <p className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase font-bold">La Colle & CO. Semijoias</p>
            <p className="text-[8px] text-zinc-400 tracking-[0.2em] uppercase font-medium">Feito com carinho para revendedoras</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
