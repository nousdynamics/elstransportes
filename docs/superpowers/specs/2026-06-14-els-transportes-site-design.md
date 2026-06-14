# ELS Transportes — Site Institucional (one-pager) — Design

**Data:** 2026-06-14
**Status:** Aprovado (escopo + abordagem A)

## Objetivo

Recriar o site `elstransportes.com.br` (hoje placeholder GoDaddy) como uma **única página
institucional**, otimizada para SEO e performance, publicada em **Cloudflare Workers** com
CI/CD via **GitHub** (Workers Builds). Idioma: pt-BR.

## Empresa (fatos conhecidos)

- Nome: **ELS Transportes** (transportadora rodoviária).
- Proposta: empresa nova, foco em **eficiência no transporte**; pilares **segurança** e **qualidade**.
- WhatsApp: **+55 11 96462-0149** (canal de contato principal).
- Área de atuação: **Grande São Paulo** (capital + região).
- Sem backend nesta versão → formulário de contato vira link click-to-chat WhatsApp + email placeholder.

> Decisões do usuário: serviços = copy profissional escrita por nós; identidade visual = criada
> por nós; deploy inicial = subdomínio `*.workers.dev`.

## Abordagem (A) — Static + Workers Static Assets

- `index.html` artesanal, CSS próprio, JS mínimo (sem framework).
- Cloudflare Worker serve **Static Assets** (binding `assets` em `wrangler.jsonc`).
- Deploy: repositório GitHub conectado ao **Cloudflare Workers Builds** (build/publish automático no push).
- Justificativa: SEO máximo (HTML estático, render instantâneo), melhor performance, build trivial,
  zero runtime overhead. Astro/React seriam overkill para uma página.

## Arquitetura de arquivos

```text
/
├── public/                 # diretório de assets servidos
│   ├── index.html          # a página
│   ├── styles.css          # estilos
│   ├── main.js             # interações mínimas (menu mobile, scroll suave, ano footer)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   └── og-image.* / imagens (hero etc.)
├── wrangler.jsonc          # config Worker + assets
├── package.json            # scripts (deploy/dev via wrangler)
├── .gitignore
└── README.md               # instruções de deploy
```

O Worker usa apenas a feature de **Static Assets** (sem script de fetch customizado, a menos
que necessário para headers). `wrangler.jsonc` aponta `assets.directory` para `./public`.

## Conteúdo / Seções (scroll único)

1. **Header / Nav** — logo ELS Transportes (texto), âncoras: Sobre · Serviços · Atuação · Contato.
   Botão CTA WhatsApp. Menu responsivo (hambúrguer no mobile).
2. **Hero** — headline "eficiência no transporte", subhead curto, 2 CTAs (WhatsApp + "Nossos serviços").
   Fundo com tema estrada/movimento (imagem ou gradiente + arte).
3. **Sobre** — empresa nova com foco em eficiência; pilares segurança + qualidade; missão curta.
4. **Serviços** — 3 cards (copy profissional):
   - Cargas gerais / fretes
   - Cargas dedicadas (veículo exclusivo)
   - Cargas fracionadas (consolidação)
5. **Diferenciais** — segurança, pontualidade, agilidade, atendimento próximo. Qualitativo
   (empresa nova → **sem estatísticas/números falsos**).
6. **Área de atuação** — Grande São Paulo: lista de regiões/cidades atendidas.
7. **Contato / CTA final** — WhatsApp click-to-chat, email placeholder, horário; reforço de CTA.
8. **Footer** — nav, copyright (ano dinâmico), CNPJ placeholder, mini-NAP.

## Identidade visual

- **Logo:** fornecida pelo cliente em `public/img/logo.png` (134×75, baixa-res). "ELS" em
  vermelho + "TRANSPORTES" em azul-marinho/preto sobre branco. Usar no header (~120px de largura).
  Opção futura: recriar wordmark como SVG nítido (escala em qualquer tamanho/retina).
- **Paleta da marca:** **vermelho + preto + branco** (cores oficiais da ELS).
  - Vermelho primário ≈ `#E1251B` (amostrar/ajustar do logo na implementação).
  - Preto/grafite (texto e seções escuras): `#111111` / `#1A1A1A`.
  - Branco / off-white: `#FFFFFF` / `#F6F6F6`.
  - Sem azul/âmbar — manter fiel à marca.
- **Tipografia:** display geométrica forte para headings + sans legível para corpo (Google Fonts, com `preconnect` e `display=swap`).
- **Estilo:** premium, alto contraste (vermelho sobre preto/branco), anti-"AI genérico" (seguir
  skill frontend-design). Sem templates óbvios; hierarquia clara, espaçamento generoso, detalhes de marca.
- **Acessibilidade:** contraste AA (atenção: vermelho como cor de texto só em fundos claros/grandes;
  CTAs com vermelho de fundo + texto branco), foco visível, navegação por teclado, `alt` em imagens, landmarks ARIA.

## SEO (skill seo-optimizer)

- `<title>` e `meta description` otimizados (palavras-chave: transportadora, fretes, cargas, São Paulo).
- `lang="pt-BR"`, `<link rel="canonical">`.
- Open Graph + Twitter Card (`og:image` dedicada).
- **JSON-LD** `MovingCompany`/`LocalBusiness`: nome, telefone (WhatsApp), areaServed (São Paulo, geo),
  url, sameAs (placeholder redes), openingHours.
- HTML semântico (`header/nav/main/section/footer`, headings em ordem), `alt` descritivo.
- `robots.txt` + `sitemap.xml`.
- Performance / Core Web Vitals: imagens otimizadas (`width/height`, lazy abaixo da dobra,
  formato moderno), CSS enxuto inline-crítico se necessário, fontes com swap, sem JS bloqueante.

## Deploy

1. Inicializar repo, criar arquivos.
2. `wrangler.jsonc` com `assets` apontando `./public`; `package.json` com scripts `dev`/`deploy`.
3. Push para GitHub (repo novo).
4. Conectar repo no painel Cloudflare → **Workers Builds**; primeira publicação em
   `els-transportes.<conta>.workers.dev`.
5. (Futuro) apontar `elstransportes.com.br` quando o DNS estiver no Cloudflare.

> Observação: criar o projeto Cloudflare e conectar o GitHub exige ações do usuário no painel
> (auth). Forneceremos os arquivos + README com passo a passo; deploy local opcional via
> `wrangler deploy` se o usuário autenticar a CLI.

## Fora de escopo (YAGNI)

- Backend / formulário com envio server-side (contato = WhatsApp/email).
- CMS, blog, múltiplas páginas, i18n.
- Estatísticas/contadores numéricos não verificáveis.
- Domínio custom nesta etapa (workers.dev primeiro).

## Critérios de sucesso

- Uma página responsiva, rápida (Lighthouse perf/SEO/a11y altos), visual premium.
- SEO completo (meta, OG, JSON-LD, sitemap, robots, semântico).
- Builda e publica em Workers via GitHub sem fricção; README claro.
