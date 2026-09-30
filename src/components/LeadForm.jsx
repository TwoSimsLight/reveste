import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle, Copy, Check, ArrowRight, ShieldAlert, Phone, Mail, User, Heart, Lock } from 'lucide-react';

export default function LeadForm({ onLeadSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    interest: 'Trocar roupas usadas por desconto de 20%'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Formatação automática do WhatsApp no padrão brasileiro (XX) XXXXX-XXXX
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    setFormData(prev => ({ ...prev, whatsapp: value }));
  };

  // Registra o evento de clique no botão de envio
  const handleButtonClick = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const locale = navigator.language || 'pt-BR';
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'submit_click',
          timezone,
          locale
        })
      }).catch(() => {});
    } catch {
      // Ignora erro de tracking para não bloquear UX
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor, informe o seu nome completo.');
      return;
    }

    if (!formData.email.trim() && !formData.whatsapp.trim()) {
      setErrorMsg('Por favor, preencha pelo menos o seu E-mail ou o WhatsApp.');
      return;
    }

    setLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const locale = navigator.language || 'pt-BR';

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          interest: formData.interest,
          timezone,
          locale
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setResultData(data);
        onLeadSuccess?.(data.lead);

        // Disparar confetes festivos
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2d6a4f', '#52b788', '#d1b17a', '#c85a17']
          });
        } catch {
          // Confetti fallback
        }
      } else {
        setErrorMsg(data.error || 'Não foi possível salvar os dados. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na submissão:', err);
      setErrorMsg('Erro de conexão com o servidor. Verifique sua rede e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyCouponCode = () => {
    const code = resultData?.coupon || 'REVESTE20';
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  return (
    <section id="formulario-cta" className="py-24 bg-sand-50 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nature-100/60 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-300/80 shadow-2xl relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nature-700 via-emerald-500 to-terracotta-500" />

          {!submitted ? (
            <div>
              {/* Form Headline */}
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acesso Antecipado + Cupom Exclusivo</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-nature-950 tracking-tight mb-3">
                  Garanta Seu Cupom de 20% OFF
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Junte-se à revolução da moda circular. Preencha seus dados para receber o cupom de boas-vindas e a etiqueta para envio das suas roupas usadas.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Campo: Nome Completo */}
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nome Completo <span className="text-emerald-700">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Ex: Ana Silva Santos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand-300 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/40 text-slate-800 placeholder-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Grid: E-mail e WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Campo: E-mail */}
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Seu Melhor E-mail <span className="text-emerald-700">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="lead-email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand-300 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/40 text-slate-800 placeholder-slate-400 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Campo: WhatsApp */}
                  <div>
                    <label htmlFor="lead-whatsapp" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      WhatsApp ou Telefone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        id="lead-whatsapp"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        value={formData.whatsapp}
                        onChange={handlePhoneChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand-300 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/40 text-slate-800 placeholder-slate-400 text-sm transition-all"
                      />
                    </div>
                  </div>

                </div>

                {/* Opção de Interesse */}
                <div>
                  <label htmlFor="lead-interest" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Qual seu principal interesse na ReVeste?
                  </label>
                  <select
                    id="lead-interest"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-sand-300 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/40 text-slate-800 text-sm transition-all"
                  >
                    <option value="Trocar roupas usadas por desconto de 20%">Trocar roupas velhas/usadas por desconto de 20%</option>
                    <option value="Comprar roupas básicas em algodão orgânico">Comprar roupas básicas e confortáveis em tecido orgânico</option>
                    <option value="Conhecer o projeto de moda circular e ética">Conhecer a cadeia transparente e ética da ReVeste</option>
                    <option value="Acesso antecipado ao lançamento oficial">Apenas garantir meu acesso antecipado com cupom</option>
                  </select>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={handleButtonClick}
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-nature-900 hover:bg-nature-800 text-white font-bold text-base sm:text-lg shadow-xl shadow-nature-900/25 hover:shadow-nature-900/35 active:scale-99 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processando e gerando seu cupom...</span>
                      </>
                    ) : (
                      <>
                        <span>Quero o Meu Desconto</span>
                        <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Seus dados são confidenciais e protegidos. Nunca compartilhamos suas informações.</span>
                </div>

              </form>
            </div>
          ) : (
            /* Success View with Coupon Presentation */
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                Cadastro Confirmado com Sucesso!
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-nature-950 mt-2 mb-3">
                Obrigado, {formData.name.split(' ')[0]}!
              </h3>

              <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base mb-6">
                Seus dados foram salvos com sucesso na plataforma ReVeste. Aqui está o seu cupom exclusivo de 20% de desconto:
              </p>

              {/* Coupon Box */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-sand-100/90 border-2 border-dashed border-nature-600/60 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-nature-700 block">
                    Código do Cupom:
                  </span>
                  <span className="font-mono text-2xl font-black text-nature-900 tracking-wider">
                    {resultData?.coupon || 'REVESTE20'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyCouponCode}
                  className="px-4 py-2.5 rounded-xl bg-nature-900 hover:bg-nature-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedCoupon ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              {/* Geolocation Notice */}
              <div className="text-xs text-slate-500 max-w-sm mx-auto mb-8 bg-sand-50 p-3 rounded-xl border border-sand-200">
                <span>📍 Identificamos seu acesso a partir do </span>
                <strong className="text-nature-900">
                  {resultData?.lead?.country || 'Brasil'} {resultData?.lead?.country_code === 'BR' ? '🇧🇷' : '🌐'}
                </strong>
                <span>. Entraremos em contato com novidades da sua região!</span>
              </div>

              {/* Action reset */}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', whatsapp: '', interest: 'Trocar roupas usadas por desconto de 20%' });
                }}
                className="text-xs font-semibold text-nature-700 hover:text-nature-900 underline underline-offset-4"
              >
                Cadastrar outro e-mail ou pessoa
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
