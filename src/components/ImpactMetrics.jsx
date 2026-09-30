import React from 'react';
import { Droplets, Sprout, Wind, ShieldCheck } from 'lucide-react';

export default function ImpactMetrics() {
  const metrics = [
    {
      icon: Droplets,
      value: "-75%",
      label: "Consumo de Água",
      detail: "Processos sem irrigação química e com reúso de água pluvial."
    },
    {
      icon: Sprout,
      value: "+5.400",
      label: "Peças Circulares Resgatadas",
      detail: "Roupas que deixaram de ir para aterros sanitários e lixões."
    },
    {
      icon: Wind,
      value: "4.8 ton",
      label: "Redução de CO2",
      detail: "Cadeia local brasileira encurtando rotas de frete poluidoras."
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Rastreabilidade Aberta",
      detail: "Todo o histórico de produção e custos acessível ao cliente."
    }
  ];

  return (
    <section id="impacto" className="py-20 bg-nature-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Impacto Ecológico Mensurável
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
            Cada escolha sua transforma o planeta
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            A indústria da moda tradicional é uma das mais poluidoras do mundo. A ReVeste nasceu para provar que é possível vestir com conforto, beleza e consciência limpa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-nature-950/60 border border-nature-700/60 backdrop-blur-sm flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-nature-800 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-display text-4xl font-black text-white mb-1">
                  {m.value}
                </div>
                <div className="font-bold text-emerald-300 text-sm mb-2">
                  {m.label}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {m.detail}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
