# ELS Transportes — Site Institucional

Landing page institucional de uma página da **ELS Transportes**, transportadora rodoviária
na Grande São Paulo. HTML/CSS/JS estático, sem framework, servido pela feature de
**Static Assets** do Cloudflare Workers.

- **Stack:** HTML + CSS + JS puro (zero dependências de runtime)
- **Deploy:** Cloudflare Workers (Static Assets) via GitHub (Workers Builds)
- **SEO:** meta tags, Open Graph/Twitter, JSON-LD (`MovingCompany`), `sitemap.xml`, `robots.txt`

## Estrutura

```text
public/            # tudo que é servido publicamente
  index.html       # a página
  styles.css
  main.js
  404.html
  robots.txt
  sitemap.xml
  favicon.svg
  img/             # logo + og-image
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

- Textos, serviços e cidades: `public/index.html`.
- Cores e tipografia: variáveis no topo de `public/styles.css` (`:root`).
- Telefone/WhatsApp: procure por `5511964620149` em `index.html`.
- E-mail placeholder: `contato@elstransportes.com.br` (ajuste para o e-mail real).

## Pendências de conteúdo (placeholders)

- E-mail oficial (hoje `contato@elstransportes.com.br`).
- CNPJ / endereço, se quiser exibir.
- Redes sociais (`sameAs` no JSON-LD).
- Logo em alta resolução / SVG (a atual tem 134×75).
