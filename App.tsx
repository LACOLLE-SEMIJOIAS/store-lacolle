
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS } from './constants';
import { Product } from './types';
import ProductCard from './components/ProductCard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'error'>('offline');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;
  const ICON_WHATSAPP = `${GITHUB_BASE}/04-chat.gif`;
  const ICON_EMAIL = `${GITHUB_BASE}/03-email.gif`;

  // Função para carregar dados do banco e mesclar com a lista base
  const syncProductsWithDB = async () => {
    if (!supabase) {
      setDbStatus('offline');
      setLoading(false);
      return;
    }

    try {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('sku, price, stock, name, category');

      if (error) throw error;

      if (dbProducts) {
        setProducts(prevProducts => {
          return prevProducts.map(baseProd => {
            const dbMatch = dbProducts.find(p => p.sku === baseProd.sku);
            if (dbMatch) {
              return {
                ...baseProd,
                price: dbMatch.price ?? baseProd.price,
                stock: dbMatch.stock ?? baseProd.stock,
                // Mantemos o nome e categoria do DB se existirem para consistência total
                name: dbMatch.name ?? baseProd.name,
                category: dbMatch.category ?? baseProd.category
              };
            }
            return baseProd;
          });
        });
      }
      setDbStatus('connected');
    } catch (err) {
      console.error("Erro na sincronização:", err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncProductsWithDB();

    // CONFIGURAÇÃO REALTIME: Ouve mudanças no banco e atualiza a tela na hora
    if (supabase) {
      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'products' }, 
          (payload) => {
            const updatedItem = payload.new as any;
            setProducts(prev => prev.map(p => 
              p.sku === updatedItem.sku 
                ? { ...p, price: updatedItem.price, stock: updatedItem.stock } 
                : p
            ));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return ['Todos', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const handleUpdateProduct = async (updatedProduct: Product) => {
    // Atualiza localmente primeiro (otimista)
    setProducts(prev => prev.map(p => p.sku === updatedProduct.sku ? updatedProduct : p));
    
    if (supabase) {
      try {
        const { error } = await supabase.from('products').upsert({
          sku: updatedProduct.sku,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          name: updatedProduct.name,
          category: updatedProduct.category
        }, { onConflict: 'sku' });
        
        if (error) throw error;
      } catch (err) { 
        console.error("Erro ao salvar no banco:", err);
        // Em caso de erro, poderíamos reverter o estado aqui, mas o Realtime corrigirá na próxima sync
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full max-w-[440px] text-center border border-zinc-100">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-zinc-400">Painel Administrativo</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'lili04') { setIsEditMode(true); setShowAuthModal(false); setPasswordInput(''); }
              else setAuthError(true);
            }} className="space-y-5">
              <input 
                autoFocus 
                type="password" 
                placeholder="SENHA" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full bg-zinc-50 text-center py-3.5 text-xs outline-none rounded-sm border border-zinc-200 focus:border-peach transition-colors" 
              />
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Acesso Negado</p>}
              <button type="submit" className="w-full bg-black text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-900 transition-colors">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* BARRA DE STATUS E CONTATOS */}
      <div className="bg-[#f4f7f6] py-2 px-4 border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-400' : 'bg-[#f5a27a]'}`}></span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">
                {dbStatus === 'connected' ? 'Sincronizado' : 'Modo Offline'}
              </span>
            </div>
            
            <div className="hidden sm:block h-3 w-[1px] bg-zinc-200"></div>

            <div className="flex items-center gap-4 sm:gap-6">
              <a href="https://wa.me/5511973420966" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 group">
                <img src={ICON_WHATSAPP} alt="WhatsApp" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                <span className="text-[10px] sm:text-[11px] font-normal text-zinc-500 tracking-tighter">+55 11 97342-0966</span>
              </a>
              <a href="mailto:atendimento@lacolle.com.br" className="flex items-center gap-1.5 group">
                <img src={ICON_EMAIL} alt="Email" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                <span className="text-[10px] sm:text-[12px] font-normal text-zinc-500 lowercase tracking-tighter">atendimento@lacolle.com.br</span>
              </a>
            </div>
          </div>
          
          <button 
            onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} 
            className="bg-[#f5a27a] text-white px-4 py-1.5 rounded-sm text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-sm hover:brightness-105 transition-all"
          >
            {isEditMode ? 'ENCERRAR EDIÇÃO' : 'GERENCIAR ESTOQUE'}
          </button>
        </div>
      </div>

      <header className="bg-peach py-8 md:py-10 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:grid md:grid-cols-3 items-center gap-6">
          <div className="order-1 md:order-2 flex justify-center">
            <img src={LOGO_URL} alt="La Colle" className="h-14 md:h-16 lg:h-20 object-contain" />
          </div>
          <div className="order-2 md:order-1 flex justify-center md:justify-start w-full max-w-sm md:max-w-xs mx-auto md:mx-0">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Buscar por SKU ou Nome" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-white/20 border border-white/40 rounded-full px-6 py-2.5 text-xs tracking-widest text-black placeholder-zinc-800 focus:outline-none focus:bg-white/40 transition-all text-left" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="hidden md:block order-3"></div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 py-1 px-6 sticky top-[44px] sm:top-[46px] z-30 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto flex items-center justify-start sm:justify-center">
          <div className="flex items-center gap-6 md:gap-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap py-4 sm:py-5 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 transition-all ${selectedCategory === cat ? 'border-peach text-peach' : 'border-transparent text-zinc-300 hover:text-zinc-500'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col items-center mb-12 md:mb-16 gap-4">
          <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-zinc-300">Catálogo Atacado</h2>
          <div className="bg-zinc-50 border border-zinc-100 px-5 py-1.5 rounded-full">
             <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
               {isEditMode ? 'MODO DE EDIÇÃO ATIVO' : `Mostrando ${filteredProducts.length} itens`}
             </span>
          </div>
          <div className="h-[1px] w-12 bg-peach/30"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-32">
             <div className="w-8 h-8 border-2 border-peach border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sincronizando Dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.sku} 
                product={product} 
                onUpdate={handleUpdateProduct}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-footer-beige pt-20 pb-16 px-6 border-t border-zinc-100 mt-20">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-10">
          <img src={LOGO_URL} alt="La Colle Footer" className="h-14 md:h-18 object-contain" />
          <div className="text-center space-y-3">
             <p className="text-[9px] md:text-[10px] text-zinc-400 tracking-[0.5em] uppercase font-bold">La Colle & CO. Semijoias</p>
             <p className="text-[8px] text-zinc-400 tracking-[0.2em] uppercase">Gestão de Preços e Estoque Cloud</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
