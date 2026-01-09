
import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_PRODUCTS, WHOLESALE_CONFIG } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lacolle_catalog_products');
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(true);

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

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  const LOGO_URL = `${GITHUB_BASE}/Logo-Transparente-TopoPagina.png`;
  const ICON_CHAT = `${GITHUB_BASE}/04-chat.gif`;
  const ICON_EMAIL = `${GITHUB_BASE}/03-email.gif`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* 1. TOP BAR */}
      <div className="bg-[#f8f9fa] text-zinc-800 py-3 px-4 md:px-10 border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex-1 hidden md:block"></div>
          
          <div className="flex items-center justify-center gap-8 text-[10px] tracking-wider font-medium">
            <div className="flex items-center gap-3">
              <img src={ICON_CHAT} alt="" className="w-6 h-6 object-contain" />
              <span className="font-semibold">11 97342-0966</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={ICON_EMAIL} alt="" className="w-6 h-6 object-contain" />
              <span className="font-semibold">atendimento@lacolle.com.br</span>
            </div>
          </div>

          <div className="flex-1 flex justify-end gap-4">
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                isEditMode ? 'bg-peach text-white shadow-lg' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {isEditMode ? 'Modo Edição' : 'Catálogo Travado'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="bg-peach py-8 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          <div className="relative order-2 md:order-1">
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-white rounded-full px-6 py-2 text-xs text-white placeholder-white focus:outline-none"
            />
          </div>

          <div className="flex justify-center order-1 md:order-2">
            <img src={LOGO_URL} alt="La Colle" className="h-16 object-contain" />
          </div>

          <div className="hidden md:flex justify-end order-3">
             <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all text-white"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-peach text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                    {totalCartItems}
                  </span>
                )}
             </button>
          </div>
        </div>
      </header>

      {/* 3. FILTERS */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 sticky top-[53px] z-30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-all ${
                  selectedCategory === cat ? 'border-black text-black' : 'border-transparent text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onUpdate={handleUpdateProduct}
              isEditMode={isEditMode}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </main>

      <Cart 
        items={cartItems} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
        config={WHOLESALE_CONFIG}
      />

      {/* FLOATING CART BUTTON (MOBILE) */}
      {!isCartOpen && totalCartItems > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 md:hidden bg-black text-white p-5 rounded-full shadow-2xl z-50 animate-bounce"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <span className="absolute top-0 right-0 bg-peach text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {totalCartItems}
          </span>
        </button>
      )}

      {/* FOOTER */}
      <footer className="bg-footer-beige py-12 px-6 text-center">
        <img src={LOGO_URL} alt="La Colle" className="h-8 mx-auto opacity-30 grayscale mb-6" />
        <p className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase">© 2024 La Colle & CO. Atacado Semijoias</p>
      </footer>
    </div>
  );
};

export default App;
