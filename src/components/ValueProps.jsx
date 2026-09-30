import React from 'react';
import { Recycle, Scale, RefreshCw, Feather, Check, Sparkles, Shirt } from 'lucide-react';

export default function ValueProps() {
  const benefits = [
    {
      icon: Recycle,
      tag: "Matéria-Prima Pura",
      title: "Matéria-Prima Reciclada & Orgânica",
      description: "Nossas peças são tecidas com uma combinação exclusiva de algodão orgânico certificado (sem defensivos agrícolas) e fibras têxteis recicladas de alta resistência.",
      highlights: [
        "Zero microplásticos derivados de petróleo",
        "Tinturaria vegetal com baixo consumo de água",
        "Toque suave e ultra macio na pele"
      ],
      color: "nature"
    },
    {
      icon: Scale,
      tag: "100% Rastreável",
      title: "Produção Ética e Transparência Total",
      description: "Acreditamos que você tem o direito de saber quem fez suas roupas. Abrimos publicamente nossa planilha de custos, fornecedores e remuneração justa das costureiras.",
      highlights: [
        "Mão de obra 100% justa e regularizada",
        "Oficinas certificadas no Brasil",
        "Relatório de custos aberto por peça"
      ],
      color: "sand"
    },
    {
      icon: RefreshCw,
      tag: "Ciclo Fechado",
      title: "Sistema de Troca por Descontos",
      description: "Sua roupa velha não é lixo. Entregue peças usadas de qualquer marca no momento da compra ou entrega e acumule créditos e descontos imediatos no seu pedido.",
      highlights: [
        "Aceitamos peças de qualquer marca",
        "Logística reversa simplificada em domicílio",
        "Descontos de até 20% aplicados na hora"
      ],
      color: "emerald"
    },
    {
      icon: Feather,
      tag: "Design Atemporal",
      title: "Básicos Confortáveis e Duráveis",
      description: "Roupas feitas para durar anos, não semanas. Modelagens inteligentes, costuras reforçadas e cores neutras essenciais que combinam com tudo no seu dia a dia.",
      highlights: [
        "Não deforma nem encolhe na lavagem",
        "Modelagem ergonômica super confortável",
        "Menos consumo, mais estilo e praticidade"
      ],
      color: "stone"
    }
  ];

  return (
    <section id="proposta" className="py-24 bg-white/70 border-y border-sand-200 relative overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200/80 text-nature-900 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-nature-700" />
            <span>Proposta de Valor ReVeste</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nature-950 tracking-tight mb-6">
            Uma Moda Sustentável, Transparente e Circular
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Roupas básicas e confortáveis feitas com tecidos ecológicos de verdade. Entregue as suas peças velhas, ganhe descontos e faça parte do ciclo que regenera o planeta.
          </p>
        </div>

        {/* Benefits Grid */}
        <div id="beneficios" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="card-hover relative p-8 rounded-3xl bg-sand-50/70 border border-sand-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-nature-900 text-emerald-400 flex items-center justify-center shadow-lg shadow-nature-900/15">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-nature-100 text-nature-800 text-xs font-bold uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-sand-200/70">
                  <div className="text-xs font-bold text-nature-900 uppercase tracking-wider mb-3">
                    Destaques da proposta:
                  </div>
                  <ul className="space-y-2">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Banner: Transparency Pledge */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-nature-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 rounded-l-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-800 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Shirt className="w-3.5 h-3.5" />
                <span>Nosso Compromisso de Transparência</span>
              </div>
              <h4 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Você sabe quanto custou cada botão da sua roupa?
              </h4>
              <p className="text-slate-300 text-sm sm:text-base">
                Na ReVeste, publicamos a quebra de custo exata de cada camiseta: tecido, costura, impostos, transporte e nossa margem justa. Sem surpresas, sem exploração.
              </p>
            </div>
            
            <a
              href="#formulario-cta"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-nature-950 font-bold text-sm shadow-lg shadow-emerald-400/20 active:scale-95 transition-all whitespace-nowrap"
            >
              Participar da Mudança
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
