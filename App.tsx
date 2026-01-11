
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS, WHOLESALE_CONFIG } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
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

  // URLs fixas e seguras para os ativos da marca
  const LOGO_URL = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main/Logo-Transparente-TopoPagina.png";
  const FOOTER_LOGO_URL = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main/Logo-TransparenteRodape-Pagina.png";

  const syncPricesAndStock = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('sku, price, stock');

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(prev => prev.map(localProd => {
          const dbItem = data.find(d => d.sku === localProd.sku);
          if (dbItem) {
            return {
              ...localProd,
              price: dbItem.price || localProd.price,
              stock: dbItem.stock !== undefined ? dbItem.stock : localProd.stock
            };
          }
          return localProd;
        }));
        setDbStatus('connected');
      }
    } catch (err) {
      console.error("Erro ao sincronizar preços:", err);
      setDbStatus('error');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const savedCart = localStorage.getItem('lacolle_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
      
      await syncPricesAndStock();
      setLoading(false);
    };
    init();
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
    if (supabase) {
      try {
        await supabase.from('products').upsert({
          sku: updatedProduct.sku,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          name: updatedProduct.name, // Mantém backup do nome no banco
          category: updatedProduct.category
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

      {/* BARRA DE STATUS DISCRETA */}
      <div className="bg-[#fdf2f0] py-1.5 px-6 border-b border-peach/10 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-400' : 'bg-orange-300'}`}></span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              {dbStatus === 'connected' ? 'Preços Sincronizados' : 'Modo Offline'}
            </span>
          </div>
          <button onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} className="text-[9px] font-bold uppercase tracking-widest text-peach/60 hover:text-peach transition-colors">
            {isEditMode ? 'Sair do Modo Edição' : 'Área Admin'}
          </button>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <header className="bg-peach pt-12 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-12">
          <img src={LOGO_URL} alt="La Colle" className="h-20 md:h-32 object-contain" />
          
          <div className="w-full max-w-2xl relative">
            <input 
              type="text" 
              placeholder="PESQUISAR POR MODELO OU SKU..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white/10 border border-white/30 rounded-full px-10 py-4 text-xs tracking-[0.2em] text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all text-center" 
            />
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 py-1 px-6 sticky top-[33px] z-30 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap py-5 text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 transition-all ${selectedCategory === cat ? 'border-peach text-peach' : 'border-transparent text-zinc-300 hover:text-zinc-500'}`}>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-16">
        <div className="flex justify-center mb-16">
          <div className="text-center">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-zinc-300 mb-2">Catálogo Atacado</h2>
            <div className="h-[1px] w-12 bg-peach/30 mx-auto"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-32">
             <div className="w-8 h-8 border-2 border-peach border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
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

      <footer className="bg-footer-beige pt-24 pb-16 px-6 border-t border-zinc-100 mt-20">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-12">
          <img src={FOOTER_LOGO_URL} alt="La Colle Footer" className="h-20 opacity-50 grayscale" />
          <div className="text-center space-y-3">
             <p className="text-[10px] text-zinc-400 tracking-[0.5em] uppercase font-bold">La Colle & CO. Semijoias</p>
             <p className="text-[8px] text-zinc-400 tracking-[0.2em] uppercase">Feito com carinho para revendedoras</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
