import React, { useState, useEffect } from 'react';
import { Leaf, RefreshCw, ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ onNavigateAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-sand-50/90 backdrop-blur-md shadow-sm border-b border-sand-200 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-nature-900 flex items-center justify-center text-white shadow-md shadow-nature-900/20 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-nature-900 leading-none">
                Re<span className="text-nature-600 font-serif italic">Veste</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-nature-700/75 mt-0.5">
                Moda Ecológica & Circular
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => scrollToSection('proposta')} 
              className="hover:text-nature-900 transition-colors"
            >
              Proposta de Valor
            </button>
            <button 
              onClick={() => scrollToSection('beneficios')} 
              className="hover:text-nature-900 transition-colors"
            >
              Benefícios
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')} 
              className="hover:text-nature-900 transition-colors"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('impacto')} 
              className="hover:text-nature-900 transition-colors"
            >
              Impacto
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onNavigateAdmin}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-nature-900 hover:bg-sand-200/60 rounded-lg transition-colors border border-transparent hover:border-sand-300"
              title="Acessar painel de controle"
            >
              Painel Admin 📊
            </button>

            <button
              onClick={() => scrollToSection('formulario-cta')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-nature-900 hover:bg-nature-800 active:scale-95 shadow-md shadow-nature-900/20 hover:shadow-nature-900/30 transition-all"
            >
              <span>Quero Meu Desconto</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-nature-900 hover:bg-sand-200 rounded-lg"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-sand-50/95 backdrop-blur-lg rounded-2xl border border-sand-200 shadow-xl flex flex-col gap-3 animate-fade-in">
            <button 
              onClick={() => scrollToSection('proposta')}
              className="text-left py-2 font-medium text-slate-700 hover:text-nature-900"
            >
              Proposta de Valor
            </button>
            <button 
              onClick={() => scrollToSection('beneficios')}
              className="text-left py-2 font-medium text-slate-700 hover:text-nature-900"
            >
              Benefícios
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')}
              className="text-left py-2 font-medium text-slate-700 hover:text-nature-900"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('impacto')}
              className="text-left py-2 font-medium text-slate-700 hover:text-nature-900"
            >
              Impacto Ecológico
            </button>
            <div className="pt-2 border-t border-sand-200 flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('formulario-cta')}
                className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-nature-900 shadow-md"
              >
                Garantir Meu Cupom
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateAdmin(); }}
                className="w-full text-center py-2 text-xs font-semibold text-slate-600 hover:text-nature-900"
              >
                Acessar Área Administrativa
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
