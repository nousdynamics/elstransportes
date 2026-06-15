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
const WPP = `https://wa.me/5511964620149?text=${encodeURIComponent("Olá! Gostaria de um orçamento de transporte.")}`;
const EMAIL = "els@elstransportes.com.br";

const services = [
  {
    slug: "cargas-gerais",
    title: "Cargas Gerais e Fretes",
    keyword: "cargas gerais e fretes na Grande São Paulo",
    h1: "Cargas gerais e fretes na Grande São Paulo",
    lead: "Transporte rodoviário de mercadorias em geral, com coletas programadas e atendimento direto para operações do dia a dia.",
    intro: [
      "A ELS Transportes realiza transporte de cargas gerais e fretes rodoviários em toda a Grande São Paulo. Atendemos empresas e operações que precisam mover mercadorias com regularidade, flexibilidade de volume e comunicação clara do início ao fim.",
      "Este serviço é indicado para distribuição urbana e metropolitana, reposição de estoque, entregas B2B e fluxos recorrentes que exigem pontualidade sem burocracia.",
    ],
    bullets: ["Coletas e entregas programadas", "Volumes diversos", "Atendimento direto pelo WhatsApp", "Rotas na capital e região metropolitana"],
    faq: [
      { q: "Que tipo de mercadoria entra em carga geral?", a: "Atendemos mercadorias em geral dentro da operação rodoviária urbana e metropolitana. Para cargas especiais ou restritas, informe dimensões, peso e tipo de produto no orçamento." },
      { q: "Vocês atendem empresas com entregas recorrentes?", a: "Sim. Podemos estruturar coletas e entregas programadas conforme a demanda da sua operação na Grande São Paulo." },
      { q: "Como solicito orçamento de frete?", a: `Informe origem, destino, volume e prazo pelo WhatsApp ${PHONE_DISPLAY}. Respondemos com proposta objetiva.` },
    ],
  },
  {
    slug: "cargas-dedicadas",
    title: "Cargas Dedicadas",
    keyword: "carga dedicada na Grande São Paulo",
    h1: "Carga dedicada com veículo exclusivo na Grande São Paulo",
    lead: "Veículo exclusivo para sua mercadoria, rota direta e prioridade total — ideal para prazos críticos e cargas sensíveis.",
    intro: [
      "Na carga dedicada, o veículo é reservado exclusivamente para a sua operação. Não há consolidação com outros clientes: a rota é montada para atender origem, destino e prazo combinados.",
      "É a modalidade indicada para entregas urgentes, insumos críticos, peças de reposição, materiais de alto valor agregado ou qualquer envio que não pode aguardar paradas intermediárias.",
    ],
    bullets: ["Veículo exclusivo", "Rota direta", "Menor prazo possível na região", "Prioridade operacional"],
    faq: [
      { q: "Quando escolher carga dedicada em vez de fracionada?", a: "Quando o prazo é crítico, a carga não pode compartilhar espaço ou exige controle total do trajeto. A dedicada elimina paradas de consolidação." },
      { q: "A carga dedicada atende entregas urgentes?", a: "Sim. É a modalidade usada para urgências dentro da Grande São Paulo, com veículo reservado e rota otimizada." },
      { q: "Como calcular o frete dedicado?", a: "Depende de origem, destino, tipo de veículo, janela de coleta e prazo. Envie esses dados pelo WhatsApp para orçamento rápido." },
    ],
  },
  {
    slug: "cargas-fracionadas",
    title: "Cargas Fracionadas",
    keyword: "carga fracionada na Grande São Paulo",
    h1: "Carga fracionada na Grande São Paulo",
    lead: "Consolidação de volumes menores com custo otimizado, mantendo cuidado operacional e cobertura metropolitana.",
    intro: [
      "A carga fracionada permite que sua mercadoria compartilhe o veículo com outros envios compatíveis, reduzindo o custo do frete sem abrir mão de um padrão de cuidado e comunicação.",
      "Funciona bem para lotes menores, e-commerce B2B, distribuição complementar e operações que não justificam um veículo exclusivo, mas precisam de transporte confiável na região.",
    ],
    bullets: ["Custo otimizado", "Consolidação inteligente", "Ideal para lotes menores", "Cobertura metropolitana"],
    faq: [
      { q: "Carga fracionada demora mais que a dedicada?", a: "Em geral sim, porque envolve consolidação e roteirização compartilhada. Ainda assim, planejamos janelas realistas e informamos prazo antes da coleta." },
      { q: "Qual volume mínimo para fracionada?", a: "Não há um único mínimo fixo: avaliamos dimensões, peso, origem e destino. Envie os dados da carga para indicarmos a melhor modalidade." },
      { q: "Posso combinar fracionada com entregas recorrentes?", a: "Sim, quando o perfil de volume se mantém compatível com consolidação. Avaliamos caso a caso na Grande São Paulo." },
    ],
  },
];

const cities = [
  { slug: "sao-paulo-capital", name: "São Paulo — Capital", keyword: "transportadora em São Paulo capital", context: "circulação entre zonas da capital, centros logísticos e vias de ligação metropolitana" },
  { slug: "zona-leste", name: "Zona Leste", keyword: "frete zona leste São Paulo", context: "distritos industriais, comércio atacadista e ligações com ABC e Guarulhos" },
  { slug: "zona-norte", name: "Zona Norte", keyword: "transportadora zona norte São Paulo", context: "fluxos para marginais, centros de distribuição e corredores de saída da capital" },
  { slug: "zona-sul", name: "Zona Sul", keyword: "frete zona sul São Paulo", context: "entregas urbanas e conexão rápida com ABC e rodovias de acesso sul" },
  { slug: "zona-oeste", name: "Zona Oeste", keyword: "transportadora zona oeste São Paulo", context: "operações próximas a Osasco, Barueri e eixos corporativos da região oeste" },
  { slug: "grande-abc", name: "Grande ABC", keyword: "transportadora Grande ABC", context: "polo industrial do ABC, entregas intermunicipais e abastecimento fabril" },
  { slug: "guarulhos", name: "Guarulhos", keyword: "transportadora em Guarulhos", context: "proximidade aeroportuária, centros logísticos e corredor leste metropolitano" },
  { slug: "osasco", name: "Osasco", keyword: "frete em Osasco", context: "distribuição corporativa, eixos comerciais e ligação oeste-capital" },
  { slug: "barueri", name: "Barueri", keyword: "transportadora em Barueri", context: "centros empresariais, galpões logísticos e entregas na região oeste" },
  { slug: "maua", name: "Mauá", keyword: "frete em Mauá", context: "indústria, varejo e integração com corredor ABC-metropolitano" },
  { slug: "diadema", name: "Diadema", keyword: "transportadora em Diadema", context: "operações industriais e entregas rápidas entre ABC e capital" },
  { slug: "sao-bernardo-do-campo", name: "São Bernardo do Campo", keyword: "frete São Bernardo do Campo", context: "polo automotivo, metal-mecânico e distribuição regional" },
  { slug: "santo-andre", name: "Santo André", keyword: "transportadora Santo André", context: "centro comercial e industrial do ABC com alta demanda de fretes urbanos" },
  { slug: "regiao-metropolitana", name: "Região Metropolitana", keyword: "transportadora região metropolitana São Paulo", context: "integração entre capital, ABC, GRU, Osasco, Barueri e demais municípios da RMSP" },
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
<meta property="og:image:alt" content="ELS Transportes — transporte de cargas na Grande São Paulo" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE}/img/og-image.png" />
<meta name="twitter:image:alt" content="ELS Transportes — transporte de cargas na Grande São Paulo" />
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
      <p>Transporte rodoviário de cargas na Grande São Paulo. Segurança, pontualidade e eficiência em cada entrega.</p>
      <div class="footer__nap">
        <strong>ELS Transportes</strong><br />
        Grande São Paulo · SP · Brasil<br />
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
      <span>Grande São Paulo · SP</span>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <span>&copy; <span id="year">2026</span> ELS Transportes. Todos os direitos reservados.</span>
    <span class="footer__made">Eficiência no transporte.</span>
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
    serviceType: "Transporte rodoviário de cargas",
    description: s.lead,
    url: `${SITE}${path}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#business`,
      name: "ELS Transportes",
      telephone: PHONE,
      url: SITE,
      areaServed: { "@type": "AdministrativeArea", name: "Grande São Paulo" },
    },
    areaServed: { "@type": "AdministrativeArea", name: "Grande São Paulo" },
  })}</script>`;
}

function localServiceJson(c, path) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Transporte de cargas em ${c.name}`,
    serviceType: "Transporte rodoviário de cargas",
    description: `Frete e transporte de cargas em ${c.name}: cargas gerais, dedicadas e fracionadas na Grande São Paulo.`,
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
    <p class="contato__lead">Atendimento direto pelo WhatsApp. Informe origem, destino e volume da carga.</p>
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
<div class="answer-capsule"><strong>Resumo:</strong> A ELS Transportes oferece ${esc(s.keyword)} com atendimento direto, operação enxuta e foco em segurança, pontualidade e eficiência.</div>`;

  const body = `<div class="prose">
${s.intro.map((p) => `<p>${esc(p)}</p>`).join("\n")}
<h2>Quando usar ${esc(s.title.toLowerCase())}</h2>
<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
<p>Operamos na capital paulista e na região metropolitana. Se sua rota envolve ${esc(s.keyword.split(" na ")[0])}, envie origem, destino e características da carga para receber orçamento.</p>
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
        title: `${s.title} — ELS Transportes | Grande São Paulo`,
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
      title: "Serviços de Transporte de Cargas — ELS Transportes",
      description: "Cargas gerais, dedicadas e fracionadas na Grande São Paulo. Conheça os serviços da ELS Transportes e peça orçamento pelo WhatsApp.",
      path: "/servicos/",
    },
    hero: `
<p class="kicker kicker--light">// Serviços</p>
<h1 class="h1">Serviços de transporte de cargas</h1>
<p class="page-hero__lead">Três modalidades para atender operações de diferentes portes na Grande São Paulo — com atendimento direto e resposta rápida.</p>`,
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
      a: `Sim. Atendemos ${c.name} e integrações com a capital e demais municípios da Grande São Paulo, conforme origem, destino e tipo de carga.`,
    },
    {
      q: "Quais serviços estão disponíveis nesta região?",
      a: "Cargas gerais e fretes, cargas dedicadas (veículo exclusivo) e cargas fracionadas, de acordo com volume, prazo e perfil da operação.",
    },
    {
      q: "Como pedir orçamento para esta área?",
      a: `Envie origem, destino, peso/dimensões e prazo pelo WhatsApp ${PHONE_DISPLAY}. Respondemos com proposta objetiva.`,
    },
  ];

  const hero = `
<nav class="breadcrumb" aria-label="Trilha de navegação">
  <a href="/">Início</a><span aria-hidden="true">/</span>
  <a href="/atendimento/">Atuação</a><span aria-hidden="true">/</span>
  <span>${esc(c.name)}</span>
</nav>
<p class="kicker kicker--light">// Atuação local</p>
<h1 class="h1">Transportadora em ${esc(c.name)}</h1>
<p class="page-hero__lead">Frete rodoviário de cargas com foco em ${esc(c.keyword)} — segurança, pontualidade e atendimento direto.</p>
<div class="answer-capsule"><strong>Resumo:</strong> A ELS Transportes atende ${esc(c.name)} com cargas gerais, dedicadas e fracionadas, cobrindo ${esc(c.context)}.</div>`;

  const body = `<div class="prose">
<p>A ELS Transportes realiza coletas e entregas em <strong>${esc(c.name)}</strong>, integrando a operação à rede da Grande São Paulo. Trabalhamos com empresas que precisam de frete confiável, comunicação clara e prazos cumpridos.</p>
<p>Nesta região, atendemos demandas ligadas a ${esc(c.context)}. Avaliamos cada rota para indicar a modalidade mais adequada: carga dedicada para urgências, fracionada para lotes menores ou carga geral para fluxos recorrentes.</p>
<h2>Serviços disponíveis em ${esc(c.name)}</h2>
<ul>
<li><a href="/servicos/cargas-gerais.html">Cargas gerais e fretes</a></li>
<li><a href="/servicos/cargas-dedicadas.html">Cargas dedicadas</a></li>
<li><a href="/servicos/cargas-fracionadas.html">Cargas fracionadas</a></li>
</ul>
<h2>Perguntas frequentes</h2>
</div>
${faqHtml(faq)}`;

  await writePage(
    `atendimento/${c.slug}.html`,
    renderPage({
      active: "atendimento",
      headMeta: {
        title: `Transportadora em ${c.name} — ELS Transportes`,
        description: `Frete e transporte de cargas em ${c.name}. Cargas gerais, dedicadas e fracionadas. Orçamento pelo WhatsApp ${PHONE_DISPLAY}.`,
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

// Atendimento hub
const cityCards = cities
  .map(
    (c) => `<a class="link-card" href="/atendimento/${c.slug}.html">
  <strong>${esc(c.name)}</strong>
  <span>${esc(c.keyword)}</span>
</a>`
  )
  .join("\n");

await writePage(
  "atendimento/index.html",
  renderPage({
    active: "atendimento",
    headMeta: {
      title: "Área de Atuação — Transportadora Grande São Paulo | ELS",
      description: "Atendemos capital, ABC, Guarulhos, Osasco, Barueri e região metropolitana. Veja as localidades atendidas pela ELS Transportes.",
      path: "/atendimento/",
    },
    hero: `
<p class="kicker kicker--light">// Atuação</p>
<h1 class="h1">Área de atuação na Grande São Paulo</h1>
<p class="page-hero__lead">Coletas e entregas na capital paulista e na região metropolitana, com páginas dedicadas por localidade.</p>`,
    body: `<div class="link-grid">${cityCards}</div>`,
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
    title: "Sobre a ELS Transportes — Transportadora na Grande São Paulo",
    description: "Conheça a ELS Transportes: transportadora rodoviária enxuta, focada em eficiência, segurança e qualidade no transporte de cargas na Grande São Paulo.",
    path: "/sobre.html",
    h1: "Sobre a ELS Transportes",
    lead: "Transportadora rodoviária nova, com um objetivo claro: eficiência no transporte de cargas na Grande São Paulo.",
    body: `<div class="prose">
<p>A <strong>ELS Transportes</strong> nasceu para entregar o essencial no transporte de cargas: <strong>segurança</strong>, <strong>qualidade</strong> e <strong>pontualidade</strong>. Somos uma operação enxuta, com atendimento direto e foco em resolver a logística do cliente sem burocracia.</p>
<p>Atendemos a Grande São Paulo com três modalidades principais: <a href="/servicos/cargas-gerais.html">cargas gerais e fretes</a>, <a href="/servicos/cargas-dedicadas.html">cargas dedicadas</a> e <a href="/servicos/cargas-fracionadas.html">cargas fracionadas</a>.</p>
<h2>Nossos pilares</h2>
<ul>
<li><strong>Segurança</strong> — carga cuidada do início ao fim.</li>
<li><strong>Qualidade</strong> — padrão de serviço perceptível em cada entrega.</li>
<li><strong>Eficiência</strong> — rotas inteligentes e prazos cumpridos.</li>
</ul>
<h2>Área de atuação</h2>
<p>Operamos na capital paulista e na região metropolitana. Veja a lista completa de localidades em <a href="/atendimento/">Área de atuação</a>.</p>
</div>`,
  },
  {
    file: "contato.html",
    active: "contato",
    title: "Contato — ELS Transportes | Orçamento de Frete",
    description: "Fale com a ELS Transportes pelo WhatsApp (11) 96462-0149 ou e-mail. Atendimento Seg a Sex, 08h às 18h. Grande São Paulo.",
    path: "/contato.html",
    h1: "Contato",
    lead: "Orçamento de frete com atendimento direto. Informe origem, destino e volume da carga.",
    body: `<div class="prose">
<h2>WhatsApp</h2>
<p>Canal principal para orçamentos e dúvidas operacionais: <a href="${WPP}" target="_blank" rel="noopener noreferrer">${PHONE_DISPLAY}</a>.</p>
<h2>E-mail</h2>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
<h2>Horário de atendimento</h2>
<p>Segunda a sexta-feira, das 08h às 18h.</p>
<h2>Área atendida</h2>
<p>Grande São Paulo — capital e região metropolitana. Consulte <a href="/atendimento/">localidades atendidas</a>.</p>
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
<p><strong>Última atualização:</strong> 14 de junho de 2026.</p>
<p>A ELS Transportes respeita a privacidade dos visitantes e clientes. Esta política descreve quais dados podemos receber e como os utilizamos.</p>
<h2>1. Quem somos</h2>
<p>Controladora: <strong>ELS Transportes</strong>, transportadora rodoviária atuante na Grande São Paulo. Contato: <a href="mailto:${EMAIL}">${EMAIL}</a> · WhatsApp ${PHONE_DISPLAY}.</p>
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
<p><strong>Última atualização:</strong> 14 de junho de 2026.</p>
<p>Ao acessar <strong>elstransportes.com.br</strong>, você concorda com estes termos.</p>
<h2>1. Objeto</h2>
<p>Este site apresenta informações institucionais sobre a ELS Transportes e canais de contato para solicitação de orçamentos de transporte de cargas.</p>
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
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${SITE}${path === "/" ? "/" : path}</loc>
    <lastmod>2026-06-14</lastmod>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : path.includes("servicos") || path.includes("atendimento") ? "0.8" : "0.6"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");
console.log("wrote sitemap.xml");
