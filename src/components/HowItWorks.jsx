import React from 'react';
import { ShoppingBag, PackageOpen, BadgePercent, Repeat, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: ShoppingBag,
      title: "Cadastre-se & Pegue o Cupom",
      description: "Preencha o formulário abaixo e receba imediatamente seu cupom de 20% OFF para sua primeira compra ecológica."
    },
    {
      num: "02",
      icon: PackageOpen,
      title: "Separe Peças que não Usa Mais",
      description: "Pode ser de qualquer marca ou modelo. Nós disponibilizamos etiqueta reversa gratuita ou ponto de coleta para sua doação."
    },
    {
      num: "03",
      icon: BadgePercent,
      title: "Receba Descontos Reais",
      description: "Cada peça entregue gera créditos extras e descontos cumulativos para renovar seus básicos sem pesar no bolso."
    },
    {
      num: "04",
      icon: Repeat,
      title: "Fechando o Ciclo Têxtil",
      description: "Suas roupas antigas passam por higienização, desfibragem mecânica e são reincorporadas em novos tecidos sustentáveis."
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-sand-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-100 text-nature-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Passo a Passo</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nature-950 tracking-tight mb-4">
            Como Funciona o Ciclo ReVeste
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Um ecossistema simples, prático e vantajoso para você e para o meio ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="relative p-6 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col justify-between group hover:border-nature-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-3xl font-extrabold text-sand-300 group-hover:text-nature-600 transition-colors">
                      {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-nature-50 text-nature-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-nature-700">
                  <span>Etapa sustentável</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
