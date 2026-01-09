
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS, WHOLESALE_CONFIG } from './constants';
import { Product } from './types';
import ProductCard from './components/ProductCard';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lacolle_catalog_products');
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Password protection state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    localStorage.setItem('lacolle_catalog_products', JSON.stringify(products));
  }, [products]);

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

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAdminToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setShowAuthModal(true);
      setAuthError(false);
      setPasswordInput('');
    }
  };

  const handleAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === 'lili04') {
      setIsEditMode(true);
      setShowAuthModal(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;
  const ICON_CHAT = `${GITHUB_BASE}/04-chat.gif`;
  const ICON_EMAIL = `${GITHUB_BASE}/03-email.gif`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-10 rounded-lg shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-10 text-black">Acesso Administrativo</h2>
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  autoFocus
                  type="password"
                  placeholder="........"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-[#3f3f3f] text-white text-center py-3.5 text-sm outline-none transition-all rounded-sm font-bold tracking-widest placeholder-[#5a5a5a] ${
                    authError ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-peach'
                  }`}
                />
              </div>
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2">Senha Incorreta</p>}
              <button 
                type="submit"
                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-peach transition-colors shadow-lg active:scale-[0.98]"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="bg-[#f8f9fa] text-zinc-800 py-3 px-4 md:px-10 border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex-1 hidden md:block"></div>
          
          <div className="flex items-center justify-center gap-8 text-[10px] tracking-wider font-medium">
            <div className="flex items-center gap-2">
              <img 
                src={ICON_CHAT} 
                alt="" 
                className="w-5 h-5 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="font-semibold">11 97342-0966</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={ICON_EMAIL} 
                alt="" 
                className="w-5 h-5 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="font-semibold">atendimento@lacolle.com.br</span>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={handleAdminToggle}
              className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm ${
                isEditMode 
                ? 'bg-black text-white hover:bg-peach' 
                : 'bg-peach text-white hover:bg-black'
              }`}
            >
              {isEditMode ? 'Sair Edição' : 'Painel Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-peach py-10 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          <div className="relative order-2 md:order-1">
            <input 
              type="text" 
              placeholder="PESQUISAR PRODUTO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-3 text-[10px] tracking-widest text-white placeholder-white/70 focus:outline-none focus:bg-white/30 transition-all"
            />
          </div>

          <div className="flex justify-center order-1 md:order-2">
            <img 
              src={LOGO_URL} 
              alt="La Colle" 
              className="h-20 object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/200x80?text=LA+COLLE";
              }}
            />
          </div>

          <div className="hidden md:flex justify-end order-3">
             {/* Carrinho removido conforme solicitado */}
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <nav className="bg-white border-b border-gray-100 py-2 px-6 sticky top-[53px] z-30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-4 text-[10px] uppercase tracking-[0.2em] font-bold border-b-2 transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'border-peach text-peach' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            {selectedCategory === 'Todos' ? 'Coleção Completa' : selectedCategory}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Produto' : 'Produtos'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onUpdate={handleUpdateProduct}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-footer-beige py-16 px-6 text-center">
        <div className="max-w-xs mx-auto opacity-40 mb-8 grayscale">
            <img src={LOGO_URL} alt="La Colle" className="h-10 mx-auto" />
        </div>
        <p className="text-[9px] text-zinc-500 tracking-[0.4em] uppercase">© 2024 La Colle & CO. Joalheria Contemporânea no Atacado</p>
      </footer>
    </div>
  );
};

export default App;
