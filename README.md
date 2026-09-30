# ReVeste - Moda Ecológica, Confortável e Transparente 🌱

Plataforma e Landing Page de alta conversão para a marca **ReVeste**, pioneira em moda circular, roupas sustentáveis e sistema de troca de roupas usadas por descontos reais.

---

## 🚀 Como Executar o Projeto

O projeto possui um backend completo em Node.js com Express e SQLite integrado ao frontend React (Vite + Tailwind CSS).

### 1. Iniciar o Servidor Completo (Landing Page + Admin + API)
```bash
npm start
```
Após executar, acesse:
- **Landing Page Pública:** [http://localhost:3000](http://localhost:3000)
- **Painel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 2. Modo Desenvolvimento com Live Reload (Opcional)
```bash
npm run dev
```

---

## 🌟 Funcionalidades Implementadas

### 🌿 1. Landing Page (Página Inicial)
- **Hero Section:**
  - Título Principal: *ReVeste: Moda ecológica e transparente.*
  - Subtítulo: *Roupas básicas e confortáveis feitas com tecidos ecológicos. Doe suas roupas usadas e ganhe descontos em peças novas.*
  - Mídia visual com imagens de produtos sustentáveis e selos ecológicos.
  - Botão de Ação: *"Quero o Meu Desconto"*.
- **Proposta de Valor & Benefícios:**
  - Matéria-prima reciclada e algodão agroecológico sem agrotóxicos.
  - Produção ética com transparência total de custos e remuneração justa.
  - Sistema de Troca Circular (entregue roupas velhas e ganhe cupons).
  - Durabilidade e conforto atemporal para o dia a dia.
- **Como Funciona:** Passo a passo do ciclo circular da ReVeste.
- **Métricas de Impacto:** Redução de água, resgate de peças e diminuição de CO2.
- **Formulário Call to Action (CTA):**
  - Campos: Nome Completo, E-mail, WhatsApp (com máscara automática `(XX) XXXXX-XXXX`) e Interesse.
  - Rastreamento instantâneo de cliques no botão de envio.
  - Detecção automática do país de acesso (inclusive em testes locais no Brasil 🇧🇷).
  - Feedback interativo com chuva de confetes e cupom de 20% OFF (`REVESTE20`).

---

### 📊 2. Painel do Administrador (`/admin`)
- **Cards de Métricas em Tempo Real:**
  - Total de Leads Cadastrados.
  - Total de Cliques no Botão de Envio (para calcular interesse).
  - Taxa de Conversão (% de quem clicou e efetivamente enviou).
  - Total de visualizações da página.
- **Detecção de Países:**
  - Card geográfico exibindo a bandeira emoji e a quantidade de contatos por país (ex: 🇧🇷 Brasil, 🇵🇹 Portugal, etc.).
- **Tabela Completa de Contatos:**
  - Nome, E-mail, WhatsApp (com link direto para conversa no WhatsApp Web), País com bandeira, Interesse, Data e Hora de cadastro.
  - Barra de busca em tempo real (filtra instantaneamente por nome, e-mail ou país).
  - Botão de exclusão de contato.
  - **Exportação CSV:** Download de planilha formatada pronta para Excel e Google Planilhas.

---

## 🗄️ Banco de Dados

Os dados são armazenados localmente e de forma persistente no arquivo:
```
data/reveste.sqlite
```
Nenhuma dependência externa pesada de banco de dados é necessária, funcionando perfeitamente em qualquer máquina.
