
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS, WHOLESALE_CONFIG } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { supabase } from './lib/supabase';
import { getSmartSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'error'>('offline');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Caminho absoluto corrigido para imagens do GitHub
  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;
  const FOOTER_LOGO_URL = `${GITHUB_BASE}/Logo-TransparenteRodape-Pagina.png`;

  const initApp = async () => {
    try {
      setLoading(true);
      const savedCart = localStorage.getItem('lacolle_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      if (!supabase) {
        console.warn("Supabase não encontrado. Usando dados locais.");
        setProducts(SAMPLE_PRODUCTS);
        setDbStatus('offline');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sku', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedData = data.map(item => ({
          id: item.id.toString(),
          sku: item.sku,
          name: item.name,
          price: item.price,
          stock: item.stock,
          category: item.category,
          imageUrl: item.image_url
        }));
        setProducts(mappedData);
        setDbStatus('connected');
      } else {
        setProducts(SAMPLE_PRODUCTS);
        setDbStatus('connected');
      }
    } catch (err: any) {
      console.error("Erro Conexão:", err);
      setDbStatus('error');
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('lacolle_cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    if (supabase && dbStatus === 'connected') {
      try {
        await supabase.from('products').upsert({
          sku: updatedProduct.sku,
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          category: updatedProduct.category,
          image_url: updatedProduct.imageUrl
        }, { onConflict: 'sku' });
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-10 rounded-lg shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-10">Painel Administrativo</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'lili04') { setIsEditMode(true); setShowAuthModal(false); }
              else setAuthError(true);
            }} className="space-y-6">
              <input autoFocus type="password" placeholder="SENHA" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-zinc-100 text-center py-4 text-sm outline-none rounded-sm border focus:border-peach" />
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase">Acesso Negado</p>}
              <button type="submit" className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em]">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* TOP STATUS BAR */}
      <div className="bg-[#f8f9fa] py-2 px-6 md:px-10 border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : dbStatus === 'error' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {dbStatus === 'connected' ? 'Catálogo Online' : dbStatus === 'error' ? 'Erro de Conexão' : 'Usando Banco Local'}
            </span>
            {dbStatus !== 'connected' && (
              <button onClick={initApp} className="text-[9px] underline uppercase font-bold text-peach ml-2">Atualizar</button>
            )}
          </div>
          <button onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-colors ${isEditMode ? 'bg-zinc-200 text-zinc-600' : 'bg-peach text-white shadow-sm hover:bg-[#e08d66]'}`}>
            {isEditMode ? 'Sair Admin' : 'Admin'}
          </button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="bg-peach py-12 px-6 shadow-md">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-10">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
            <div className="w-full max-w-md order-2 md:order-1">
              <input 
                type="text" 
                placeholder="BUSCAR POR NOME OU SKU..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-white/20 border border-white/40 rounded-full px-8 py-3.5 text-xs tracking-widest text-white placeholder-white/80 focus:outline-none focus:bg-white/30 transition-all shadow-inner" 
              />
            </div>
            <div className="order-1 md:order-2">
              <img src={LOGO_URL} alt="La Colle" className="h-16 md:h-24 object-contain" />
            </div>
            <div className="hidden md:block w-full max-w-md order-3"></div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 py-2 px-6 sticky top-[45px] z-30 shadow-sm overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-8 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-2 py-4 text-[10px] uppercase tracking-[0.2em] font-bold border-b-2 transition-all ${selectedCategory === cat ? 'border-peach text-peach' : 'border-transparent text-gray-400 hover:text-zinc-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
        <div className="flex justify-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 bg-zinc-50 px-8 py-3 rounded-full border border-zinc-100 shadow-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Peça Disponível' : 'Peças Disponíveis'}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40">
             <div className="w-10 h-10 border-4 border-peach border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold animate-pulse">Sincronizando Catálogo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onUpdate={handleUpdateProduct}
                onAddToCart={() => {
                  setCartItems(prev => {
                    const existing = prev.find(item => item.id === product.id);
                    if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                    return [...prev, { ...product, quantity: 1 }];
                  });
                  setIsCartOpen(true);
                }}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        )}
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onUpdateQty={(id, qty) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))}
        config={WHOLESALE_CONFIG}
      />

      <footer className="bg-footer-beige py-16 px-6 border-t border-zinc-100 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-8">
          <img src={FOOTER_LOGO_URL} alt="La Colle Footer" className="h-20 opacity-80" />
          <div className="flex flex-col items-center gap-4">
             <p className="text-[9px] text-zinc-500 tracking-[0.5em] uppercase font-bold">La Colle & CO. Semijoias</p>
             <p className="text-[8px] text-zinc-400 tracking-[0.2em] uppercase">Vendas exclusivas no atacado</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
