import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import ImpactMetrics from '../components/ImpactMetrics';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';

export default function LandingPage({ onNavigateAdmin }) {
  useEffect(() => {
    // Registrar visualização da página para o Painel Admin
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const locale = navigator.language || 'pt-BR';
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          timezone,
          locale
        })
      }).catch(() => {});
    } catch {
      // Ignora erro
    }
  }, []);

  const handleCtaClick = (source) => {
    // Registra clique no botão da Hero
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const locale = navigator.language || 'pt-BR';
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'submit_click',
          source,
          timezone,
          locale
        })
      }).catch(() => {});
    } catch {
      // Ignora erro
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col font-sans">
      <Navbar onNavigateAdmin={onNavigateAdmin} />
      
      <main className="flex-grow">
        <Hero onCtaClick={handleCtaClick} />
        <ValueProps />
        <HowItWorks />
        <ImpactMetrics />
        <LeadForm />
      </main>

      <Footer onNavigateAdmin={onNavigateAdmin} />
    </div>
  );
}
