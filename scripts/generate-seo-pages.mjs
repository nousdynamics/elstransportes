#!/usr/bin/env node
/**
 * Gera páginas estáticas de serviço e atendimento local (SEO).
 * Uso: node scripts/generate-seo-pages.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public");

const SITE = "https://elstransportes.com.br";
const PHONE = "+5511964620149";
const PHONE_DISPLAY = "(11) 96462-0149";
const WPP = `https://wa.me/5511964620149?text=${encodeURIComponent("Olá! Gostaria de um orçamento para transporte de pisos e porcelanatos.")}`;
const EMAIL = "els@elstransportes.com.br";
const OG_ALT = "ELS Transportes — entrega de pisos e porcelanatos em SP, interior e Brasil";
const FOOTER_TAGLINE = "Cuidado em cada entrega de revestimento.";

const services = [
  {
    slug: "construtoras",
    title: "Entrega para Construtoras",
    keyword: "entrega de pisos e porcelanatos para construtoras",
    h1: "Entrega de pisos e porcelanatos para construtoras",
    lead: "Transporte de revestimentos para obras e canteiros, com entregas programadas, cuidado no manuseio e comunicação direta com a equipe da construtora.",
    intro: [
      "A ELS Transportes leva pisos e porcelanatos até obras e canteiros em São Paulo, interior paulista, Campinas e Belo Horizonte. Entendemos a rotina da construção: cronograma apertado, acesso restrito e material frágil que não pode chegar quebrado.",
      "Atendemos construtoras com coletas em fábricas e distribuidores dos principais polos cerâmicos — como Santa Gertrudes, Mogi Guaçu e Criciúma — com entrega alinhada à janela da obra. Pallets e caixas são transportados com cuidado e acompanhamento do início ao fim.",
    ],
    bullets: ["Entregas programadas para obras", "Cuidado com pallets e caixas", "Volumes maiores e lotes completos", "Atendimento direto pelo WhatsApp"],
    faq: [
      { q: "Vocês entregam direto no canteiro de obras?", a: "Sim, quando o acesso do veículo permite. Informe endereço, restrições de horário e tipo de acesso no orçamento para planejarmos a melhor operação." },
      { q: "Atendem construtoras com entregas recorrentes?", a: "Sim. Estruturamos rotas e janelas conforme o cronograma da obra e o volume de revestimentos necessário em cada etapa." },
      { q: "Como solicito orçamento para uma obra?", a: `Envie origem, destino, quantidade de caixas ou pallets e prazo pelo WhatsApp ${PHONE_DISPLAY}. Respondemos com proposta objetiva.` },
    ],
  },
  {
    slug: "lojas-boutiques",
    title: "Entrega para Lojas e Boutiques",
    keyword: "frete de pisos e porcelanatos para lojas",
    h1: "Entrega de pisos e porcelanatos para lojas e boutiques",
    lead: "Reposição de estoque, entregas em showrooms e atendimento a revendas de revestimentos — com agendamento e cuidado no transporte.",
    intro: [
      "Lojas e boutiques de pisos e porcelanatos precisam de frete confiável para não parar a venda. A ELS Transportes faz coleta em fábricas dos polos cerâmicos, distribuidores e depósitos, entregando no ponto combinado com respeito ao horário de funcionamento e ao espaço de recebimento.",
      "Atendemos revendas, showrooms e lojas de acabamento com volumes variados — desde lotes para reposição até entregas maiores para clientes da loja, sempre com comunicação clara sobre coleta e chegada.",
    ],
    bullets: ["Agendamento com a loja", "Reposição de estoque", "Entregas em showroom e depósito", "Cuidado com material frágil"],
    faq: [
      { q: "Vocês coletam em distribuidores e entregam na loja?", a: "Sim. Informe o ponto de coleta, o destino e o volume para montarmos a rota e o orçamento." },
      { q: "É possível agendar horário de entrega?", a: "Sim. Combinamos janela de entrega com antecedência para não atrapalhar o atendimento na loja." },
      { q: "Atendem lojas fora da Grande São Paulo?", a: "Sim. Atendemos também Litoral, Vale do Paraíba, Campinas, Belo Horizonte e cargas fechadas para todo o Brasil." },
    ],
  },
  {
    slug: "cliente-final",
    title: "Entrega para Cliente Final",
    keyword: "frete de pisos e porcelanatos para cliente final",
    h1: "Entrega de pisos e porcelanatos para cliente final",
    lead: "Transporte de revestimentos para reformas e obras residenciais, com atendimento direto, agendamento e cuidado na descarga.",
    intro: [
      "Comprou pisos ou porcelanatos e precisa levar até casa ou até a obra da reforma? A ELS Transportes atende o cliente final com atendimento simples pelo WhatsApp, sem burocracia.",
      "Coletamos no distribuidor, na loja ou no depósito e entregamos no endereço combinado — residência, condomínio ou pequena obra. Você acompanha o processo e recebe no prazo acordado.",
    ],
    bullets: ["Atendimento direto e sem burocracia", "Coleta na loja ou distribuidor", "Entrega em residência ou obra", "Agendamento de janela"],
    faq: [
      { q: "Vocês entregam em condomínio e apartamento?", a: "Sim, quando o acesso do veículo e as regras do condomínio permitem. Informe restrições de horário e tipo de acesso no pedido de orçamento." },
      { q: "Preciso estar presente na entrega?", a: "Recomendamos que alguém autorizado receba a carga e confira as caixas. Combinamos horário com antecedência." },
      { q: "Como peço orçamento sendo pessoa física?", a: `Chame no WhatsApp ${PHONE_DISPLAY} com origem, destino, quantidade de caixas e data desejada. Respondemos rápido.` },
    ],
  },
];

const cities = [
  { slug: "sao-paulo-capital", name: "São Paulo — Capital", keyword: "entrega de pisos em São Paulo capital", context: "entregas na capital paulista, obras urbanas, lojas e clientes finais em todas as zonas" },
  { slug: "grande-sao-paulo", name: "Grande São Paulo", keyword: "frete de porcelanato Grande São Paulo", context: "RMSP, ABC, Guarulhos, Osasco, Barueri e demais municípios da região metropolitana" },
  { slug: "litoral-paulista", name: "Litoral Paulista", keyword: "transportadora de pisos no litoral de SP", context: "Baixada Santista e cidades do litoral norte e sul paulista" },
  { slug: "vale-do-paraiba", name: "Vale do Paraíba", keyword: "frete de porcelanato Vale do Paraíba", context: "corredor do Vale do Paraíba até Aparecida do Norte e cidades do entorno" },
  { slug: "campinas-regiao", name: "Campinas e região", keyword: "entrega de pisos em Campinas", context: "Região Metropolitana de Campinas, interior próximo e ligação com o polo cerâmico de Santa Gertrudes (Rio Claro, Limeira, Piracicaba)" },
  { slug: "belo-horizonte-grande-bh", name: "Belo Horizonte e Grande BH", keyword: "frete de porcelanato em Belo Horizonte", context: "capital mineira e região metropolitana de Belo Horizonte" },
  { slug: "todo-brasil", name: "Todo o Brasil", keyword: "carga fechada de pisos para todo o Brasil", context: "cargas fechadas interestaduais de pisos e porcelanatos para qualquer estado" },
];

const polos = [
  {
    slug: "polo-santa-gertrudes",
    name: "Polo de Santa Gertrudes",
    keyword: "frete de porcelanato saindo de Santa Gertrudes",
    lead: "Coleta e transporte de revestimentos no maior polo cerâmico do Brasil e das Américas — responsável por cerca de 65% a 70% da produção nacional de pisos e porcelanatos.",
    intro: [
      "O polo de Santa Gertrudes, no interior paulista, é a principal região produtora de revestimentos cerâmicos do país. A ELS Transportes realiza coleta em fábricas, centros de distribuição e depósitos da região, com destino a obras, lojas e clientes finais em São Paulo, interior, Campinas e outras regiões.",
      "A área engloba cidades como Santa Gertrudes, Cordeirópolis, Rio Claro, Limeira, Araras e Piracicaba — corredor industrial com alta concentração de fabricantes de pisos e porcelanatos.",
    ],
    bullets: ["Coleta em fábricas e distribuidores", "Região de Santa Gertrudes, Rio Claro e Limeira", "Entregas para obras, lojas e cliente final", "Cargas fechadas para todo o Brasil"],
    faq: [
      { q: "Vocês coletam em fábricas de Santa Gertrudes e região?", a: "Sim. Realizamos coleta no polo cerâmico de Santa Gertrudes e cidades do entorno, conforme endereço de origem e tipo de carga." },
      { q: "Para onde vocês entregam cargas saindo desse polo?", a: "Entregamos na Grande São Paulo, interior paulista, Litoral, Vale do Paraíba, Campinas, Belo Horizonte e realizamos cargas fechadas interestaduais." },
      { q: "Como pedir orçamento com origem em Santa Gertrudes?", a: `Informe o ponto de coleta, destino, quantidade de caixas ou pallets e prazo pelo WhatsApp ${PHONE_DISPLAY}.` },
    ],
  },
  {
    slug: "polo-criciuma",
    name: "Polo de Criciúma",
    keyword: "frete de porcelanato saindo de Criciúma",
    lead: "Coleta e transporte de porcelanatos no polo mais tradicional do país — referência em revestimentos premium, tecnologia e exportação.",
    intro: [
      "Criciúma (SC) é um dos polos cerâmicos mais reconhecidos do Brasil, com forte tradição em porcelanatos de alto valor agregado. A ELS Transportes atende coletas na região para entregas em Santa Catarina, outros estados e rotas interestaduais em carga fechada.",
      "O polo é conhecido pela produção de revestimentos premium e pela vocação exportadora — e exige o mesmo cuidado no manuseio que qualquer carga de pisos e porcelanatos.",
    ],
    bullets: ["Coleta no polo de Criciúma (SC)", "Porcelanatos premium e alto valor", "Rotas interestaduais em carga fechada", "Cuidado com material frágil"],
    faq: [
      { q: "Vocês fazem frete saindo de Criciúma?", a: "Sim. Atendemos coletas no polo cerâmico de Criciúma para destinos em Santa Catarina e demais estados, conforme rota e volume." },
      { q: "É possível carga fechada de Criciúma para São Paulo?", a: "Sim. Realizamos cargas fechadas interestaduais. Informe origem, destino e volume para orçamento de rota e prazo." },
      { q: "Como solicito orçamento com origem em Criciúma?", a: `Envie endereço de coleta, destino e características da carga pelo WhatsApp ${PHONE_DISPLAY}.` },
    ],
  },
  {
    slug: "polo-mogi-guacu",
    name: "Polo de Mogi Guaçu",
    keyword: "frete de porcelanato saindo de Mogi Guaçu",
    lead: "Coleta e transporte de revestimentos em um dos polos cerâmicos históricos do interior paulista, com fabricantes relevantes do setor.",
    intro: [
      "Mogi Guaçu é um polo cerâmico paulista de longa tradição, com presença de fabricantes importantes do setor de revestimentos. A ELS Transportes realiza coleta na região para entregas em Campinas, Grande São Paulo, interior e outras destinações.",
      "A proximidade com corredores logísticos do interior paulista facilita a distribuição de pisos e porcelanatos para construtoras, lojas e cliente final.",
    ],
    bullets: ["Coleta em Mogi Guaçu e região", "Ligação com Campinas e interior paulista", "Entregas para obras e lojas", "Atendimento direto pelo WhatsApp"],
    faq: [
      { q: "Vocês coletam em Mogi Guaçu?", a: "Sim. Atendemos coletas no polo cerâmico de Mogi Guaçu para destinos na região de Campinas, Grande São Paulo e interior paulista." },
      { q: "Mogi Guaçu é atendida junto com Campinas?", a: "Sim. A região se integra à nossa cobertura de Campinas e interior, com rotas planejadas conforme origem e destino." },
      { q: "Como pedir orçamento com origem em Mogi Guaçu?", a: `Informe coleta, destino e volume pelo WhatsApp ${PHONE_DISPLAY}. Respondemos com proposta objetiva.` },
    ],
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function head({ title, description, path, jsonLdExtra = "" }) {
  const url = `${SITE}${path}`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script>window.dataLayer=window.dataLayer||[];window.dataLayer.push({page_variant:'institucional'});</script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W7VSRRKK');</script>
<!-- End Google Tag Manager -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="author" content="ELS Transportes" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#E1251B" />
<meta name="geo.region" content="BR-SP" />
<meta name="geo.placename" content="São Paulo" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="ELS Transportes" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/img/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${OG_ALT}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE}/img/og-image.png" />
<meta name="twitter:image:alt" content="${OG_ALT}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css" />
${jsonLdExtra}
</head>`;
}

function shellTop(active) {
  const nav = [
    ["home", "/", "Início"],
    ["sobre", "/sobre.html", "Sobre"],
    ["servicos", "/servicos/", "Serviços"],
    ["atendimento", "/atendimento/", "Atuação"],
    ["contato", "/contato.html", "Contato"],
  ];
  const links = nav
    .map(([key, href, label]) => {
      const cls = active === key ? ' aria-current="page"' : "";
      return `<a href="${href}"${cls}>${label}</a>`;
    })
    .join("\n      ");
  return `${headPlaceholder()}
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W7VSRRKK"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<a class="skip-link" href="#main">Pular para o conteúdo</a>
<header class="header" id="top">
  <div class="wrap header__row">
    <a href="/" class="brand" aria-label="ELS Transportes — início">
      <span class="brand__plate"><img src="/img/logo.png" width="134" height="75" alt="ELS Transportes" /></span>
    </a>
    <nav class="nav" aria-label="Navegação principal">
      ${links}
    </nav>
    <a class="btn btn--red header__cta" href="${WPP}" target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
    <button class="burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobileNav">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="mobile-nav" id="mobileNav" aria-label="Navegação mobile" hidden>
    ${links}
    <a class="btn btn--red" href="${WPP}" target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
  </nav>
</header>
<main id="main">`;
}

function headPlaceholder() {
  return "HEAD";
}

function shellBottom() {
  return `</main>
<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <span class="brand__plate"><img src="/img/logo.png" width="134" height="75" alt="ELS Transportes" loading="lazy" /></span>
      <p>Entrega de pisos e porcelanatos em SP, interior e Brasil. Segurança, pontualidade e cuidado em cada entrega de revestimento.</p>
      <div class="footer__nap">
        <strong>ELS Transportes</strong><br />
        São Paulo · SP · Brasil<br />
        Tel./WhatsApp: <a href="https://wa.me/5511964620149">${PHONE_DISPLAY}</a><br />
        E-mail: <a href="mailto:${EMAIL}">${EMAIL}</a><br />
        Seg a Sex · 08h às 18h
      </div>
      <nav class="footer__legal" aria-label="Legal">
        <a href="/politica-de-privacidade.html">Política de Privacidade</a>
        <a href="/termos-de-uso.html">Termos de Uso</a>
      </nav>
    </div>
    <nav class="footer__nav" aria-label="Rodapé">
      <h4>Navegação</h4>
      <a href="/sobre.html">Sobre</a>
      <a href="/servicos/">Serviços</a>
      <a href="/atendimento/">Atuação</a>
      <a href="/contato.html">Contato</a>
    </nav>
    <div class="footer__contact">
      <h4>Contato</h4>
      <a href="${WPP}" target="_blank" rel="noopener noreferrer">WhatsApp ${PHONE_DISPLAY}</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <span>São Paulo · SP · Brasil</span>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <span>&copy; <span id="year">2026</span> ELS Transportes. Todos os direitos reservados.</span>
    <span class="footer__made">${FOOTER_TAGLINE}</span>
  </div>
</footer>
<a class="fab" href="${WPP}" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.633-.957zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
</a>
<script src="/main.js" defer></script>
</body>
</html>`;
}

function breadcrumbJson(items) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  })}</script>`;
}

function faqJson(faq) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  })}</script>`;
}

function serviceJson(s, path) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: "Entrega de pisos e porcelanatos",
    description: s.lead,
    url: `${SITE}${path}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#business`,
      name: "ELS Transportes",
      telephone: PHONE,
      url: SITE,
      areaServed: { "@type": "Country", name: "Brasil" },
    },
    areaServed: { "@type": "Country", name: "Brasil" },
  })}</script>`;
}

function localServiceJson(c, path) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Entrega de pisos e porcelanatos em ${c.name}`,
    serviceType: "Entrega de pisos e porcelanatos",
    description: `Frete de pisos e porcelanatos em ${c.name}: entregas para construtoras, lojas e cliente final.`,
    url: `${SITE}${path}`,
    areaServed: { "@type": "City", name: c.name },
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#business`,
      name: "ELS Transportes",
      telephone: PHONE,
      url: SITE,
    },
  })}</script>`;
}

function renderPage({ active, headMeta, hero, body, jsonLd = "" }) {
  const top = shellTop(active).replace("HEAD", head({ ...headMeta, jsonLdExtra: jsonLd }));
  return `${top}
<section class="page-hero">
  <div class="wrap page-hero__inner">${hero}</div>
</section>
<section class="section section--light">
  <div class="wrap">${body}</div>
</section>
<section class="section contato">
  <div class="wrap contato__inner">
    <p class="kicker kicker--light">// Orçamento</p>
    <h2 class="contato__title">Peça seu frete agora</h2>
    <p class="contato__lead">Atendimento direto pelo WhatsApp. Informe origem, destino e quantidade de caixas ou pallets.</p>
    <div class="contato__actions">
      <a class="btn btn--red btn--lg" href="${WPP}" target="_blank" rel="noopener noreferrer">WhatsApp ${PHONE_DISPLAY}</a>
      <a class="btn btn--ghost btn--lg" href="/contato.html">Outras formas de contato</a>
    </div>
  </div>
</section>
${shellBottom()}`;
}

function faqHtml(faq) {
  return `<div class="faq__list" style="margin-top:2rem">
${faq
  .map(
    (f) => `<details class="faq__item">
  <summary>${esc(f.q)}</summary>
  <p>${esc(f.a)}</p>
</details>`
  )
  .join("\n")}
</div>`;
}

async function writePage(relPath, html) {
  const file = join(root, relPath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  console.log("wrote", relPath);
}

// Service pages
for (const s of services) {
  const path = `/servicos/${s.slug}.html`;
  const hero = `
<nav class="breadcrumb" aria-label="Trilha de navegação">
  <a href="/">Início</a><span aria-hidden="true">/</span>
  <a href="/servicos/">Serviços</a><span aria-hidden="true">/</span>
  <span>${esc(s.title)}</span>
</nav>
<p class="kicker kicker--light">// Serviço</p>
<h1 class="h1">${esc(s.h1)}</h1>
<p class="page-hero__lead">${esc(s.lead)}</p>
<div class="answer-capsule"><strong>Resumo:</strong> A ELS Transportes oferece ${esc(s.keyword)} com atendimento direto, operação enxuta e foco em cuidado, pontualidade e segurança no transporte de revestimentos.</div>`;

  const body = `<div class="prose">
${s.intro.map((p) => `<p>${esc(p)}</p>`).join("\n")}
<h2>Quando usar ${esc(s.title.toLowerCase())}</h2>
<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
<p>Atendemos São Paulo, Grande São Paulo, Litoral, Vale do Paraíba, Campinas, Belo Horizonte e cargas fechadas para todo o Brasil. Informe origem, destino e características da carga para receber orçamento.</p>
<h2>Perguntas frequentes</h2>
</div>
${faqHtml(s.faq)}
<p style="margin-top:2rem"><a class="btn btn--red" href="${WPP}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a></p>`;

  const jsonLd = breadcrumbJson([
    { name: "Início", path: "/" },
    { name: "Serviços", path: "/servicos/" },
    { name: s.title, path },
  ]) + serviceJson(s, path) + faqJson(s.faq);

  await writePage(
    `servicos/${s.slug}.html`,
    renderPage({
      active: "servicos",
      headMeta: {
        title: `${s.title} — ELS Transportes | Pisos e Porcelanatos`,
        description: `${s.lead} Orçamento rápido pelo WhatsApp ${PHONE_DISPLAY}.`,
        path,
      },
      hero,
      body,
      jsonLd,
    })
  );
}

// Services hub
const servicesHubCards = services
  .map(
    (s) => `<a class="link-card" href="/servicos/${s.slug}.html">
  <strong>${esc(s.title)}</strong>
  <span>${esc(s.lead)}</span>
</a>`
  )
  .join("\n");

await writePage(
  "servicos/index.html",
  renderPage({
    active: "servicos",
    headMeta: {
      title: "Serviços — Entrega de Pisos e Porcelanatos | ELS Transportes",
      description: "Entrega de pisos e porcelanatos para construtoras, lojas e cliente final. Cargas fechadas para todo o Brasil. Orçamento pelo WhatsApp.",
      path: "/servicos/",
    },
    hero: `
<p class="kicker kicker--light">// Serviços</p>
<h1 class="h1">Entrega de pisos e porcelanatos</h1>
<p class="page-hero__lead">Atendemos construtoras, lojas e cliente final — com cuidado no manuseio de revestimentos e atendimento direto pelo WhatsApp.</p>`,
    body: `<div class="link-grid">${servicesHubCards}</div>`,
    jsonLd: breadcrumbJson([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/servicos/" },
    ]),
  })
);

// Local pages
for (const c of cities) {
  const path = `/atendimento/${c.slug}.html`;
  const faq = [
    {
      q: `A ELS Transportes atende ${c.name}?`,
      a: `Sim. Realizamos entrega de pisos e porcelanatos em ${c.name}, conforme origem, destino e tipo de operação.`,
    },
    {
      q: "Quem vocês atendem nesta região?",
      a: "Construtoras, lojas e boutiques de revestimentos e cliente final. Para rotas interestaduais, oferecemos cargas fechadas para todo o Brasil.",
    },
    {
      q: "Como pedir orçamento para esta área?",
      a: `Envie origem, destino, quantidade de caixas ou pallets e prazo pelo WhatsApp ${PHONE_DISPLAY}. Respondemos com proposta objetiva.`,
    },
  ];

  const hero = `
<nav class="breadcrumb" aria-label="Trilha de navegação">
  <a href="/">Início</a><span aria-hidden="true">/</span>
  <a href="/atendimento/">Atuação</a><span aria-hidden="true">/</span>
  <span>${esc(c.name)}</span>
</nav>
<p class="kicker kicker--light">// Atuação</p>
<h1 class="h1">Entrega de pisos e porcelanatos em ${esc(c.name)}</h1>
<p class="page-hero__lead">Frete de revestimentos com foco em ${esc(c.keyword)} — cuidado no transporte e atendimento direto.</p>
<div class="answer-capsule"><strong>Resumo:</strong> A ELS Transportes atende ${esc(c.name)} com entrega de pisos e porcelanatos para construtoras, lojas e cliente final, cobrindo ${esc(c.context)}.</div>`;

  const body = `<div class="prose">
<p>A ELS Transportes realiza coletas e entregas de <strong>pisos e porcelanatos</strong> em <strong>${esc(c.name)}</strong>. Trabalhamos com construtoras, lojas de revestimentos e cliente final que precisam de frete confiável, comunicação clara e prazos cumpridos.</p>
<p>Nesta região, atendemos demandas ligadas a ${esc(c.context)}. Avaliamos cada rota para garantir o cuidado necessário com caixas, pallets e material frágil.</p>
<h2>Serviços disponíveis em ${esc(c.name)}</h2>
<ul>
<li><a href="/servicos/construtoras.html">Entrega para construtoras</a></li>
<li><a href="/servicos/lojas-boutiques.html">Entrega para lojas e boutiques</a></li>
<li><a href="/servicos/cliente-final.html">Entrega para cliente final</a></li>
</ul>
<h2>Perguntas frequentes</h2>
</div>
${faqHtml(faq)}`;

  await writePage(
    `atendimento/${c.slug}.html`,
    renderPage({
      active: "atendimento",
      headMeta: {
        title: `Entrega de Pisos e Porcelanatos em ${c.name} — ELS Transportes`,
        description: `Frete de pisos e porcelanatos em ${c.name}. Construtoras, lojas e cliente final. Orçamento pelo WhatsApp ${PHONE_DISPLAY}.`,
        path,
      },
      hero,
      body,
      jsonLd:
        breadcrumbJson([
          { name: "Início", path: "/" },
          { name: "Atuação", path: "/atendimento/" },
          { name: c.name, path },
        ]) + localServiceJson(c, path) + faqJson(faq),
    })
  );
}

// Polo cerâmico pages (coleta / origem)
for (const p of polos) {
  const path = `/atendimento/${p.slug}.html`;

  const hero = `
<nav class="breadcrumb" aria-label="Trilha de navegação">
  <a href="/">Início</a><span aria-hidden="true">/</span>
  <a href="/atendimento/">Atuação</a><span aria-hidden="true">/</span>
  <span>${esc(p.name)}</span>
</nav>
<p class="kicker kicker--light">// Polo cerâmico</p>
<h1 class="h1">Frete de pisos e porcelanatos saindo de ${esc(p.name)}</h1>
<p class="page-hero__lead">${esc(p.lead)}</p>
<div class="answer-capsule"><strong>Resumo:</strong> A ELS Transportes realiza coleta no ${esc(p.keyword.split(" saindo de ")[1] || p.name)} e transporte de revestimentos com cuidado, atendimento direto e cobertura regional e nacional.</div>`;

  const body = `<div class="prose">
${p.intro.map((para) => `<p>${esc(para)}</p>`).join("\n")}
<h2>Operação no ${esc(p.name)}</h2>
<ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
<p>Informe o ponto de coleta, destino, quantidade de caixas ou pallets e prazo para receber orçamento. Atendemos construtoras, lojas e cliente final em todo o trajeto.</p>
<h2>Perguntas frequentes</h2>
</div>
${faqHtml(p.faq)}
<p style="margin-top:2rem"><a class="btn btn--red" href="${WPP}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a></p>`;

  await writePage(
    `atendimento/${p.slug}.html`,
    renderPage({
      active: "atendimento",
      headMeta: {
        title: `Frete de Pisos e Porcelanatos — ${p.name} | ELS Transportes`,
        description: `${p.lead} Orçamento pelo WhatsApp ${PHONE_DISPLAY}.`,
        path,
      },
      hero,
      body,
      jsonLd:
        breadcrumbJson([
          { name: "Início", path: "/" },
          { name: "Atuação", path: "/atendimento/" },
          { name: p.name, path },
        ]) +
        serviceJson({ title: `Coleta em ${p.name}`, lead: p.lead }, path) +
        faqJson(p.faq),
    })
  );
}

// Atendimento hub
const cityCards = cities
  .map(
    (c) => `<a class="link-card" href="/atendimento/${c.slug}.html">
  <strong>${esc(c.name)}</strong>
  <span>${esc(c.keyword)}</span>
</a>`
  )
  .join("\n");

const poloCards = polos
  .map(
    (p) => `<a class="link-card" href="/atendimento/${p.slug}.html">
  <strong>${esc(p.name)}</strong>
  <span>${esc(p.keyword)}</span>
</a>`
  )
  .join("\n");

await writePage(
  "atendimento/index.html",
  renderPage({
    active: "atendimento",
    headMeta: {
      title: "Área de Atuação — Pisos e Porcelanatos | ELS Transportes",
      description: "Entrega de pisos e porcelanatos em SP, interior e Brasil. Coleta nos polos de Santa Gertrudes, Criciúma e Mogi Guaçu.",
      path: "/atendimento/",
    },
    hero: `
<p class="kicker kicker--light">// Atuação</p>
<h1 class="h1">De SP ao Brasil: onde entregamos</h1>
<p class="page-hero__lead">Cobertura regional para construtoras, lojas e cliente final — coleta nos principais polos cerâmicos e cargas fechadas interestaduais.</p>`,
    body: `<div class="prose"><h2>Regiões de entrega</h2></div>
<div class="link-grid">${cityCards}</div>
<div class="prose" style="margin-top:3rem"><h2>Polos cerâmicos de coleta</h2>
<p>Coletamos pisos e porcelanatos nas principais regiões produtoras do Brasil — onde está a fabricação nacional de revestimentos.</p></div>
<div class="link-grid">${poloCards}</div>`,
    jsonLd: breadcrumbJson([
      { name: "Início", path: "/" },
      { name: "Atuação", path: "/atendimento/" },
    ]),
  })
);

console.log("Done.");

// Institutional pages
const institutional = [
  {
    file: "sobre.html",
    active: "sobre",
    title: "Sobre a ELS Transportes — Entrega de Pisos e Porcelanatos",
    description: "Conheça a ELS Transportes: especializada em entrega de pisos e porcelanatos para construtoras, lojas e cliente final em SP, interior e Brasil.",
    path: "/sobre.html",
    h1: "Sobre a ELS Transportes",
    lead: "Transportadora especializada em pisos e porcelanatos, com atendimento direto e foco em cuidado, pontualidade e segurança.",
    body: `<div class="prose">
<p>A <strong>ELS Transportes</strong> nasceu para resolver a logística de <strong>pisos e porcelanatos</strong> com o cuidado que revestimentos exigem. Somos uma operação enxuta, com atendimento direto e foco em entregar no prazo — sem burocracia.</p>
<p>Atendemos <a href="/servicos/construtoras.html">construtoras</a>, <a href="/servicos/lojas-boutiques.html">lojas e boutiques</a> e <a href="/servicos/cliente-final.html">cliente final</a>, com cobertura em São Paulo, Grande São Paulo, Litoral, Vale do Paraíba, Campinas, Belo Horizonte e <a href="/atendimento/todo-brasil.html">cargas fechadas para todo o Brasil</a>.</p>
<h2>Polos cerâmicos de coleta</h2>
<p>Coletamos revestimentos nos principais polos produtores do país: <a href="/atendimento/polo-santa-gertrudes.html">Santa Gertrudes (SP)</a> — maior polo cerâmico das Américas —, <a href="/atendimento/polo-criciuma.html">Criciúma (SC)</a> — referência em porcelanato premium — e <a href="/atendimento/polo-mogi-guacu.html">Mogi Guaçu (SP)</a>.</p>
<h2>Nossos pilares</h2>
<ul>
<li><strong>Cuidado</strong> — material frágil manuseado com atenção do início ao fim.</li>
<li><strong>Pontualidade</strong> — prazo combinado é prazo cumprido.</li>
<li><strong>Atendimento direto</strong> — você fala com quem resolve, pelo WhatsApp.</li>
</ul>
<h2>Área de atuação</h2>
<p>Operamos em macro-regiões de São Paulo, interior, Campinas, Minas Gerais e rotas interestaduais. Veja a lista completa em <a href="/atendimento/">Área de atuação</a>.</p>
</div>`,
  },
  {
    file: "contato.html",
    active: "contato",
    title: "Contato — ELS Transportes | Orçamento de Frete",
    description: "Fale com a ELS Transportes pelo WhatsApp (11) 96462-0149 ou e-mail. Atendimento Seg a Sex, 08h às 18h. Pisos e porcelanatos em SP, interior e Brasil.",
    path: "/contato.html",
    h1: "Contato",
    lead: "Orçamento de frete de pisos e porcelanatos com atendimento direto. Informe origem, destino e quantidade de caixas ou pallets.",
    body: `<div class="prose">
<h2>WhatsApp</h2>
<p>Canal principal para orçamentos e dúvidas operacionais: <a href="${WPP}" target="_blank" rel="noopener noreferrer">${PHONE_DISPLAY}</a>.</p>
<h2>E-mail</h2>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
<h2>Horário de atendimento</h2>
<p>Segunda a sexta-feira, das 08h às 18h.</p>
<h2>Área atendida</h2>
<p>São Paulo Capital, Grande São Paulo, Litoral Paulista, Vale do Paraíba (até Aparecida do Norte), Campinas e região, Belo Horizonte e Grande BH, além de cargas fechadas para todo o Brasil. Coletamos nos polos cerâmicos de Santa Gertrudes, Criciúma e Mogi Guaçu. Consulte <a href="/atendimento/">regiões e polos atendidos</a>.</p>
<h2>Privacidade</h2>
<p>Dados enviados por WhatsApp ou e-mail são usados apenas para responder sua solicitação. Leia a <a href="/politica-de-privacidade.html">Política de Privacidade</a>.</p>
</div>`,
  },
  {
    file: "politica-de-privacidade.html",
    active: null,
    title: "Política de Privacidade — ELS Transportes",
    description: "Como a ELS Transportes trata dados pessoais enviados por WhatsApp, e-mail e navegação no site, em conformidade com a LGPD.",
    path: "/politica-de-privacidade.html",
    h1: "Política de Privacidade",
    lead: "Transparência sobre coleta e uso de dados pessoais.",
    body: `<div class="prose">
<p><strong>Última atualização:</strong> 16 de junho de 2026.</p>
<p>A ELS Transportes respeita a privacidade dos visitantes e clientes. Esta política descreve quais dados podemos receber e como os utilizamos.</p>
<h2>1. Quem somos</h2>
<p>Controladora: <strong>ELS Transportes</strong>, transportadora especializada em entrega de pisos e porcelanatos, atuante em São Paulo, interior paulista, Campinas, Belo Horizonte e cargas fechadas para todo o Brasil. Contato: <a href="mailto:${EMAIL}">${EMAIL}</a> · WhatsApp ${PHONE_DISPLAY}.</p>
<h2>2. Dados que podemos receber</h2>
<ul>
<li>Dados enviados voluntariamente por WhatsApp ou e-mail (nome, telefone, e-mail, informações sobre carga e rotas).</li>
<li>Dados técnicos de navegação (IP, dispositivo, páginas visitadas) por meio de logs do provedor de hospedagem, quando aplicável.</li>
</ul>
<h2>3. Finalidade</h2>
<p>Utilizamos os dados para responder solicitações de orçamento, prestar o serviço de transporte contratado, comunicação operacional e melhoria do site.</p>
<h2>4. Base legal (LGPD)</h2>
<p>Execução de contrato ou procedimentos preliminares, legítimo interesse na comunicação comercial solicitada pelo titular e consentimento quando necessário.</p>
<h2>5. Compartilhamento</h2>
<p>Não vendemos dados pessoais. Compartilhamento ocorre apenas com prestadores essenciais (hospedagem, comunicação) ou por obrigação legal.</p>
<h2>6. Retenção</h2>
<p>Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas e obrigações legais.</p>
<h2>7. Seus direitos</h2>
<p>Você pode solicitar acesso, correção, exclusão, portabilidade ou informações sobre tratamento pelo e-mail <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
<h2>8. Segurança</h2>
<p>Adotamos medidas técnicas e organizacionais compatíveis com a operação para proteger os dados recebidos.</p>
</div>`,
  },
  {
    file: "termos-de-uso.html",
    active: null,
    title: "Termos de Uso — ELS Transportes",
    description: "Termos de uso do site elstransportes.com.br da ELS Transportes.",
    path: "/termos-de-uso.html",
    h1: "Termos de Uso",
    lead: "Condições de uso deste site institucional.",
    body: `<div class="prose">
<p><strong>Última atualização:</strong> 16 de junho de 2026.</p>
<p>Ao acessar <strong>elstransportes.com.br</strong>, você concorda com estes termos.</p>
<h2>1. Objeto</h2>
<p>Este site apresenta informações institucionais sobre a ELS Transportes e canais de contato para solicitação de orçamentos de transporte de pisos e porcelanatos.</p>
<h2>2. Orçamentos e contratação</h2>
<p>Informações do site não constituem proposta comercial vinculante. Condições finais de frete são acordadas diretamente no contato com a equipe.</p>
<h2>3. Propriedade intelectual</h2>
<p>Textos, marca e identidade visual pertencem à ELS Transportes ou são licenciados para seu uso. Reprodução não autorizada é proibida.</p>
<h2>4. Limitação de responsabilidade</h2>
<p>O site é fornecido "como está". Empregamos esforços para manter informações atualizadas, sem garantia de ausência de erros temporários.</p>
<h2>5. Links externos</h2>
<p>Links para WhatsApp ou serviços de terceiros seguem as políticas desses provedores.</p>
<h2>6. Alterações</h2>
<p>Estes termos podem ser atualizados a qualquer momento. A data de revisão será indicada no topo da página.</p>
<h2>7. Contato</h2>
<p>Dúvidas: <a href="mailto:${EMAIL}">${EMAIL}</a> ou WhatsApp ${PHONE_DISPLAY}.</p>
</div>`,
  },
];

for (const page of institutional) {
  await writePage(
    page.file,
    renderPage({
      active: page.active,
      headMeta: { title: page.title, description: page.description, path: page.path },
      hero: `
<p class="kicker kicker--light">// Institucional</p>
<h1 class="h1">${esc(page.h1)}</h1>
<p class="page-hero__lead">${esc(page.lead)}</p>`,
      body: page.body,
      jsonLd: breadcrumbJson([
        { name: "Início", path: "/" },
        { name: page.h1, path: page.path },
      ]),
    })
  );
}

// Sitemap
const urls = [
  "/",
  "/sobre.html",
  "/contato.html",
  "/politica-de-privacidade.html",
  "/termos-de-uso.html",
  "/servicos/",
  ...services.map((s) => `/servicos/${s.slug}.html`),
  "/atendimento/",
  ...cities.map((c) => `/atendimento/${c.slug}.html`),
  ...polos.map((p) => `/atendimento/${p.slug}.html`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${SITE}${path === "/" ? "/" : path}</loc>
    <lastmod>2026-06-16</lastmod>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : path.includes("servicos") || path.includes("atendimento") ? "0.8" : "0.6"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");
console.log("wrote sitemap.xml");
