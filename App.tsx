
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;
  const FOOTER_LOGO_URL = `${GITHUB_BASE}/Logo-TransparenteRodape-Pagina.png`;

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem('lacolle_cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));

        if (!supabase) {
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
        console.error("Erro Inicialização:", err);
        setDbStatus('error');
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
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

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const result = await getSmartSuggestions(aiQuery, products);
      setAiResponse(result || 'Não consegui encontrar sugestões específicas agora.');
    } catch (err) {
      setAiResponse('Desculpe, o assistente está offline agora.');
    } finally {
      setIsAiLoading(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : dbStatus === 'error' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              {dbStatus === 'connected' ? 'Conectado' : dbStatus === 'error' ? 'Ajuste Necessário' : 'Offline'}
            </span>
          </div>
          <button onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${isEditMode ? 'bg-zinc-200' : 'bg-peach text-white shadow-sm'}`}>
            {isEditMode ? 'Sair Admin' : 'Admin'}
          </button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="bg-peach py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-10">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
            {/* BUSCA À ESQUERDA */}
            <div className="w-full max-w-md order-2 md:order-1">
              <input 
                type="text" 
                placeholder="BUSCAR POR NOME OU SKU..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-white/20 border border-white/40 rounded-full px-8 py-3.5 text-xs tracking-widest text-white placeholder-white/80 focus:outline-none focus:bg-white/30 transition-all shadow-inner" 
              />
            </div>
            {/* LOGO CENTRALIZADO */}
            <div className="order-1 md:order-2">
              <img src={LOGO_URL} alt="La Colle" className="h-14 md:h-20 object-contain drop-shadow-sm" />
            </div>
            {/* ESPAÇADOR PARA MANTER SIMETRIA NO DESKTOP */}
            <div className="hidden md:block w-full max-w-md order-3"></div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 py-2 px-6 sticky top-[45px] z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2 py-4 text-[10px] uppercase tracking-[0.2em] font-bold border-b-2 transition-all ${selectedCategory === cat ? 'border-peach text-peach' : 'border-transparent text-gray-400 hover:text-zinc-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
        {/* TOTAL DE ITENS */}
        <div className="flex justify-center mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-400 bg-zinc-50 px-6 py-2 rounded-full border border-zinc-100">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Item Disponível' : 'Itens Disponíveis'}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40">
             <div className="w-8 h-8 border-2 border-peach border-t-transparent rounded-full animate-spin"></div>
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

      {/* FLOATING ACTIONS */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {!isEditMode && (
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-peach text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </button>
        )}
        {!isEditMode && cartItems.length > 0 && (
          <button onClick={() => setIsCartOpen(true)} className="bg-black text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-3 border-2 border-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="text-xs font-bold bg-peach px-2 py-0.5 rounded-full">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
          </button>
        )}
      </div>

      {isChatOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-full max-w-xs bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-900 p-4 flex justify-between items-center">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-widest">IA La Colle</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto bg-zinc-50 text-[11px] leading-relaxed">
            {aiResponse ? <p className="whitespace-pre-wrap">{aiResponse}</p> : <p className="text-zinc-400 italic">Me pergunte sobre tendências ou peças específicas!</p>}
            {isAiLoading && <div className="mt-2 flex gap-1"><span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce delay-75"></span><span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce delay-150"></span></div>}
          </div>
          <form onSubmit={handleAskAi} className="p-3 border-t flex gap-2">
            <input type="text" placeholder="Ex: Peças para festa..." value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} className="flex-1 text-[11px] outline-none" />
            <button type="submit" disabled={isAiLoading} className="text-peach font-bold text-[10px]">ENVIAR</button>
          </form>
        </div>
      )}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onUpdateQty={(id, qty) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))}
        config={WHOLESALE_CONFIG}
      />

      {/* FOOTER SECTION */}
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
