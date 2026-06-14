# ELS Transportes — Site Institucional

Landing page institucional de uma página da **ELS Transportes**, transportadora rodoviária
na Grande São Paulo. HTML/CSS/JS estático, sem framework, servido pela feature de
**Static Assets** do Cloudflare Workers.

- **Stack:** HTML + CSS + JS puro (zero dependências de runtime)
- **Deploy:** Cloudflare Workers (Static Assets) via GitHub (Workers Builds)
- **SEO:** meta tags, Open Graph/Twitter, JSON-LD (`LocalBusiness`), páginas de serviço e locais, `sitemap.xml`, `robots.txt`, `llms.txt`

## Estrutura

```text
public/            # tudo que é servido publicamente
  index.html       # home
  sobre.html
  contato.html
  politica-de-privacidade.html
  termos-de-uso.html
  servicos/        # hub + 3 páginas de serviço
  atendimento/     # hub + 14 localidades
  styles.css
  main.js
  404.html
  robots.txt
  sitemap.xml
  llms.txt
  favicon.svg
  img/             # logo.svg, og-image.png
scripts/
  generate-seo-pages.mjs
wrangler.jsonc     # config do Worker (aponta assets -> ./public)
package.json       # scripts dev/deploy + wrangler
```

## Rodar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev        # abre em http://localhost:8787
```

> Alternativa sem instalar nada: abra `public/index.html` direto no navegador
> (o WhatsApp/links funcionam; só a rota `/404` precisa do `wrangler dev`).

## Deploy

### Opção A — GitHub + Cloudflare Workers Builds (CI automático) — recomendado

1. Suba este repositório para o GitHub.
2. No painel da Cloudflare: **Workers & Pages → Create → Workers → Connect to Git**.
3. Selecione o repositório.
4. Configuração de build:
   - **Build command:** *(deixe vazio — site já é estático)*
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
5. Salve. A cada `git push` na branch principal, a Cloudflare builda e publica.
6. Primeira publicação fica em `https://els-transportes.<sua-conta>.workers.dev`.

### Opção B — Deploy manual pela CLI

```bash
npm install
npx wrangler login      # autentica no navegador
npm run deploy          # wrangler deploy
```

## Domínio próprio (depois)

Para usar `elstransportes.com.br`, o domínio precisa estar na Cloudflare (nameservers
apontados). Depois, no Worker → **Settings → Domains & Routes → Add Custom Domain** →
`elstransportes.com.br`. Os metadados de SEO já usam essa URL como canônica.

## Editar conteúdo

- Textos da home: `public/index.html`.
- Páginas de serviço e locais: edite `scripts/generate-seo-pages.mjs` e rode `npm run generate:seo`.
- Cores e tipografia: variáveis no topo de `public/styles.css` (`:root`).
- Telefone/WhatsApp: constantes no script gerador e busca por `5511964620149` em `index.html`.
- E-mail: `contato@elstransportes.com.br` (ajuste para o e-mail real).

## Pendências de conteúdo (placeholders)

- E-mail oficial (hoje `contato@elstransportes.com.br`).
- CNPJ / endereço comercial completo, se quiser exibir no NAP.
- Redes sociais (`sameAs` no JSON-LD — adicionar só quando houver URLs reais).
- Google Business Profile (criar e alinhar NAP com o site).
- Logo PNG do cliente (opcional; site usa `logo.svg` vetorial).
