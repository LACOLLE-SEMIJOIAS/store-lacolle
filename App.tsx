
import React, { useState, useMemo } from 'react';
import { SAMPLE_PRODUCTS } from './constants';
import { Product } from './types';
import ProductCard from './components/ProductCard';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Base URL do GitHub para garantir que as imagens apareçam na Vercel
  const GITHUB_BASE = "https://raw.githubusercontent.com/LACOLLE-SEMIJOIAS/store-lacolle/main";
  
  const LOGO_IMG = `${GITHUB_BASE}/logo/Logo-Transparente-TopoPagina.png`;
  const ICON_CHAT = `${GITHUB_BASE}/icons/04-chat.gif`;
  const ICON_EMAIL = `${GITHUB_BASE}/icons/03-email.gif`;

  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/HBd3fLTNxItBOQbPRZKpky";
  const EMAIL_LINK = "mailto:atendimento@lacolle.com.br";

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
      
      {/* 1. BARRA DE TOPO - AJUSTADA CONFORME IMAGEM (MOBILE STACKED, DESKTOP INLINE) */}
      <div className="bg-white border-b border-zinc-100 py-4 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-2">
          
          {/* Contatos: Lado a lado no mobile e desktop */}
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-10 w-full md:w-auto">
            <a 
              href={WHATSAPP_GROUP_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0"
            >
              <img src={ICON_CHAT} className="w-5 h-5 md:w-6 md:h-6 object-contain" alt="Zap" />
              <span className="text-[10px] md:text-[11px] text-zinc-600 font-medium tracking-tight whitespace-nowrap">+55 11 97342-0966</span>
            </a>
            
            <a 
              href={EMAIL_LINK} 
              className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0"
            >
              <img src={ICON_EMAIL} className="w-5 h-5 md:w-6 md:h-6 object-contain" alt="Mail" />
              <span className="text-[10px] md:text-[11px] text-zinc-600 font-medium whitespace-nowrap">atendimento@lacolle.com.br</span>
            </a>
          </div>
          
          {/* Botão Admin: Centralizado abaixo no mobile, direita no desktop */}
          <button 
            onClick={() => isEditMode ? setIsEditMode(false) : setShowAuthModal(true)} 
            className="bg-[#f5a27a] text-white px-8 md:px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm hover:opacity-90 transition-all rounded-sm shrink-0"
          >
            {isEditMode ? 'SAIR ADMIN' : 'ÁREA ADMIN'}
          </button>
        </div>
      </div>

      {/* 2. CABEÇALHO PRINCIPAL */}
      <header className="bg-[#f5a27a] py-8 md:py-12 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
          <div className="w-full flex justify-center">
            <img src={LOGO_IMG} alt="La Colle" className="h-16 md:h-24 object-contain" />
          </div>

          <div className="w-full max-w-[500px] relative">
            <input 
              type="text" 
              placeholder="O que você procura hoje?" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white/20 border-none rounded-full px-6 py-3.5 text-sm text-zinc-900 placeholder-zinc-800 shadow-sm backdrop-blur-md focus:ring-2 focus:ring-white/50 font-medium transition-all" 
            />
            <div className="absolute inset-y-0 right-5 flex items-center">
               <svg className="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MENU NAVEGAÇÃO */}
      <nav className="bg-white border-b border-zinc-100 py-1 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar px-4">
          <div className="flex items-center gap-8 md:gap-16 justify-start md:justify-center min-w-max md:min-w-0 mx-auto">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`whitespace-nowrap py-4 md:py-5 text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold border-b-2 transition-all duration-300 ${
                  selectedCategory === cat ? 'border-zinc-800 text-black' : 'border-transparent text-zinc-300 hover:text-zinc-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. TÍTULO DA SEÇÃO */}
      <div className="pt-16 md:pt-24 pb-12 md:pb-16 text-center px-4">
        <h2 className="text-[11px] md:text-[13px] text-zinc-400 font-light uppercase tracking-[0.4em] md:tracking-[0.6em] mb-4 md:mb-6">CATÁLOGO ATACADO</h2>
        <div className="inline-block bg-[#f8f8f8] border border-zinc-100 px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-sm">
          <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            {filteredProducts.length} itens encontrados
          </span>
        </div>
      </div>

      {/* 5. GRID DE PRODUTOS */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-16 pb-40">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-20">
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
          <div className="py-20 text-center">
            <p className="text-zinc-400 text-sm italic">Nenhum produto encontrado para sua busca.</p>
          </div>
        )}
      </main>

      {/* 6. RODAPÉ */}
      <footer className="bg-[#ebebe3] py-16 md:py-24 px-6 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <img src={LOGO_IMG} alt="La Colle" className="h-12 md:h-16 object-contain mb-8 md:mb-10" />
          <div className="space-y-3 md:space-y-4">
            <p className="text-[9px] md:text-[10px] text-zinc-600 tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">LA COLLE & CO. SEMIJOIAS</p>
            <p className="text-[8px] md:text-[9px] text-zinc-400 tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">Beleza e Sofisticação em cada detalhe</p>
          </div>
        </div>
      </footer>

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <a 
        href={WHATSAPP_GROUP_LINK} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-green-500 text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

export default App;
