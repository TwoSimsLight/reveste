import React from 'react';
import { ArrowDown, Sparkles, Shield, RefreshCw, CheckCircle2, HeartHandshake, Tag } from 'lucide-react';

export default function Hero({ onCtaClick }) {
  const scrollToForm = () => {
    onCtaClick?.('hero_button');
    const el = document.getElementById('formulario-cta');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComoFunciona = () => {
    const el = document.getElementById('como-funciona');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background organic glow shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-nature-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-[350px] h-[350px] bg-sand-300/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-nature-600 animate-pulse" />
              <span>Moda Sustentável, Transparente e Circular</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-nature-950 tracking-tight leading-[1.12] mb-6">
              Re<span className="font-serif italic text-nature-700">Veste</span>: Moda ecológica e transparente.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
              Roupas básicas e confortáveis feitas com tecidos ecológicos. <span className="font-semibold text-nature-900">Doe suas roupas usadas e ganhe descontos em peças novas.</span>
            </p>

            {/* Quick Benefits Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-10">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-sand-200 backdrop-blur-sm shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700">100% Algodão Orgânico</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-sand-200 backdrop-blur-sm shadow-xs">
                <RefreshCw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Ciclo Logística Reversa</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-sand-200 backdrop-blur-sm shadow-xs">
                <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Troque & Ganhe Cupons</span>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold text-white bg-nature-900 hover:bg-nature-800 active:scale-98 shadow-xl shadow-nature-900/25 hover:shadow-nature-900/35 transition-all group"
              >
                <span>Quero o Meu Desconto</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase">
                  20% OFF
                </span>
              </button>

              <button
                onClick={scrollToComoFunciona}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold text-nature-900 bg-sand-200/70 hover:bg-sand-200 hover:border-sand-300 border border-sand-300/80 transition-all"
              >
                <span>Entenda Como Funciona</span>
                <ArrowDown className="w-4 h-4 text-nature-700" />
              </button>
            </div>

            {/* Social Trust Guarantee */}
            <div className="mt-8 flex items-center gap-3 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Sem spam. Seus dados estão seguros e o cupom é liberado na hora.</span>
            </div>

          </div>

          {/* Right Column: Visual Media (Product Showcases & Circular Badges) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-stone-100 aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80"
                  alt="Roupas básicas sustentáveis em algodão orgânico e tecidos naturais"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-nature-950/80 via-nature-950/20 to-transparent" />

                {/* Floating badge inside picture */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-nature-700">
                      Coleção Essencial 2026
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Camisetas e Básicos Circulares
                    </div>
                    <div className="text-xs text-slate-500">
                      0 agrotóxicos • Rastreabilidade 100%
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      Ecológico
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Top Floating Card: Circular Discount */}
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 p-4 rounded-2xl bg-sand-50/95 backdrop-blur-md border border-sand-300/80 shadow-2xl shadow-sand-900/10 flex items-center gap-3 animate-bounce-subtle">
                <div className="w-12 h-12 rounded-xl bg-nature-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-nature-900 uppercase tracking-wider">
                    Sistema de Troca
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    Doe 1 peça usada
                  </div>
                  <div className="text-xs font-bold text-terracotta-500">
                    Ganhe desconto real!
                  </div>
                </div>
              </div>

              {/* Decorative eco circle pill */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 px-4 py-2.5 rounded-2xl bg-nature-900 text-white shadow-xl flex items-center gap-2 border border-nature-700">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Produção Ética e Transparente</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
