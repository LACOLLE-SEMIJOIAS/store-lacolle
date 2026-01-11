
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

  // Agora as pastas logo e icons estão na raiz do projeto (store-lacolle)
  const LOGO_TOP = "/logo/Logo-Transparente-TopoPagina.png?v=3.0";
  const GIF_CHAT = "/icons/04-chat.gif?v=3.0";

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
      
      {/* BOTÃO WHATSAPP - CENTRAL DE ATENDIMENTO */}
      <a 
        href="https://wa.me/5511973420966" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="absolute right-full mr-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Fale Conosco
        </span>
      </a>

      {/* LOGIN ADMIN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white p-10 rounded-sm shadow-2xl w-full max-w-[400px] text-center">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 text-zinc-400">Restrito a Proprietária</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'lili04') { setIsEditMode(true); setShowAuthModal(false); setPasswordInput(''); }
              else setAuthError(true);
            }} className="space-y-6">
              <input 
                autoFocus type="password" placeholder="DIGITE A SENHA" value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full bg-zinc-50 text-center py-4 text-xs outline-none border border-zinc-100 focus:border-peach" 
              />
              {authError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Acesso Negado</p>}
              <button type="submit" className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors">Entrar no Sistema</button>
            </form>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR INFORMATIVA */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-3 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span>CATÁLOGO ONLINE OFICIAL</span>
            </div>
            <span className="hidden md:inline text-zinc-200">/</span>
            <div className="hidden md:flex items-center gap-2">
               <img src={GIF_CHAT} className="w-4 h-4 grayscale opacity-50" alt="" />
               <span className="font-medium tracking-normal text-zinc-400">+55 11 97342-0966</span>
            </div>
          </div>
          
          <button 
            onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} 
            className="text-zinc-300 hover:text-black text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
          >
            {isEditMode ? 'ENCERRAR SESSÃO' : 'PORTAL ADMIN'}
          </button>
        </div>
      </div>

      {/* CABEÇALHO LUXO */}
      <header className="bg-peach pt-20 pb-16 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-12">
          <img src={LOGO_TOP} alt="La Colle & CO" className="h-28 md:h-36 object-contain drop-shadow-sm" />
          
          <div className="w-full max-w-[700px] relative">
            <input 
              type="text" 
              placeholder="Pesquisar por nome do produto ou SKU..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white border-none rounded-full px-12 py-6 text-sm text-zinc-800 placeholder-zinc-300 shadow-2xl focus:ring-0 transition-all font-medium" 
            />
            <div className="absolute inset-y-0 right-10 flex items-center">
               <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </header>

      {/* NAVEGAÇÃO CATEGORIAS */}
      <nav className="bg-white border-b border-zinc-100 py-1 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar px-4">
          <div className="flex items-center gap-10 md:gap-20 justify-start md:justify-center">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`whitespace-nowrap py-6 text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-bold border-b-2 transition-all duration-300 ${
                  selectedCategory === cat ? 'border-zinc-900 text-black' : 'border-transparent text-zinc-300 hover:text-zinc-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* TÍTULO DA VITRINE */}
      <div className="pt-20 pb-12 text-center">
        <h2 className="text-[14px] text-zinc-900 font-bold uppercase tracking-[0.8em] mb-4">Lookbook 2024</h2>
        <div className="h-[1px] w-20 bg-peach mx-auto mb-6"></div>
        <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-medium max-w-md mx-auto leading-loose px-4">
          Nossa coleção completa de semijoias premium exclusivas para parceiros de atacado.
        </p>
      </div>

      {/* GRID DE PRODUTOS */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 md:px-10 pb-40">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 md:gap-x-16 gap-y-24">
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
          <div className="py-40 text-center space-y-4">
            <p className="text-zinc-300 uppercase tracking-widest text-sm font-bold">Nenhum produto encontrado</p>
            <button onClick={() => setSearchTerm('')} className="text-peach text-xs font-bold underline uppercase tracking-widest">Limpar busca</button>
          </div>
        )}
      </main>

      {/* FOOTER PREMIUM */}
      <footer className="bg-zinc-50 py-32 px-6 border-t border-zinc-100">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <img src={LOGO_TOP} alt="La Colle & CO" className="h-16 object-contain mb-14 opacity-20 grayscale" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900">Sobre nós</h4>
              <p className="text-[10px] text-zinc-400 leading-loose tracking-widest">Sofisticação e qualidade em cada detalhe de nossas peças banhadas a ouro 18k.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900">Atendimento</h4>
              <a href="https://wa.me/5511973420966" className="block text-[10px] text-zinc-400 hover:text-peach transition-colors tracking-widest">+55 11 97342-0966</a>
              <p className="text-[10px] text-zinc-400 tracking-widest">Segunda a Sexta • 09h às 18h</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900">Localização</h4>
              <p className="text-[10px] text-zinc-400 leading-loose tracking-widest">Showroom Exclusivo<br/>São Paulo, Brasil</p>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-zinc-100 w-full max-w-4xl">
             <p className="text-[9px] text-zinc-300 tracking-[0.5em] uppercase font-bold">© 2024 La Colle & CO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
