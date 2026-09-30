import React from 'react';
import { RefreshCw, Heart, Shield, Lock } from 'lucide-react';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="bg-nature-950 text-slate-300 py-16 border-t border-nature-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-nature-800/80">
          
          {/* Brand info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-nature-800 flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Re<span className="text-emerald-400 font-serif italic">Veste</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Uma nova proposta para a moda no Brasil. Roupas básicas e confortáveis tecidas com responsabilidade, respeito aos produtores e sistema circular de troca.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Cadeia 100% livre de exploração humana e poluição têxtil.</span>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#proposta" className="hover:text-white transition-colors">Proposta de Valor</a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">Vantagens & Benefícios</a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">Sistema de Troca</a>
              </li>
              <li>
                <a href="#impacto" className="hover:text-white transition-colors">Métricas de Sustentabilidade</a>
              </li>
              <li>
                <a href="#formulario-cta" className="hover:text-white transition-colors">Garantir Cupom de 20%</a>
              </li>
            </ul>
          </div>

          {/* Área Administrativa e Gestão */}
          <div className="md:col-span-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Gestão da Plataforma
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Acesso exclusivo para administradores da ReVeste acompanharem métricas em tempo real, visualizarem contatos capturados e exportarem relatórios.
            </p>

            <button
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 text-emerald-300 text-xs font-semibold border border-nature-700/60 hover:border-emerald-400/40 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Painel do Administrador (/admin)</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ReVeste - Moda Ecológica e Transparente. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com carinho para o planeta</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
