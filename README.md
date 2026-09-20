# Portfólio — Projeto TCC

Portfólio interativo com aparência de desktop, janelas arrastáveis, temas, currículo, contatos, trabalhos, projetos, conquistas e notificações. Inclui Paint, terminal e outros easter eggs, a gata Futebol, quiz, álbum de figurinhas e três jogos: Pong, Alien Shooter e Cassino Zee.

Desenvolvido por André de Lima Michalsky — TCC, 2026. Projeto em desenvolvimento.

## Tecnologias e requisitos

- Node.js **22.18 ou superior** e npm; use `npm ci` para respeitar o lockfile.
- React 19, JavaScript, CSS, Vite 7 e ESLint.
- React Router (`HashRouter`), EmailJS, lucide-react, p5 e react-pageflip.
- Testes de lógica com Node e testes de navegador com Playwright.

## Instalação e desenvolvimento

```sh
git clone https://github.com/andremk12/tccLola-portif-lio.git
cd tccLola-portif-lio
npm ci
npm run dev
```

Abra a URL exibida pelo Vite, no caminho `/tccLola-portif-lio/`. O script de desenvolvimento é `dev`; não há script `start`.

Os scripts do Vite usam `--configLoader native`: a configuração é JavaScript ESM e pode ser carregada diretamente pelo Node. Isso também evita o empacotamento intermediário da configuração, que falhava neste ambiente Windows com diretórios ancestrais restritos. Veja a [documentação do Vite](https://vite.dev/config/#config-loading).

`npm ci` executa `scripts/fix-pageflip.cjs`. Esse ajuste restrito à versão `page-flip@2.0.7` faz `destroy()` cancelar o loop de animação do livro. Ele é idempotente e interrompe a instalação se a versão ou o trecho esperado mudar. Não use `--ignore-scripts` sem aplicar e revisar esse ajuste. O teste do álbum verifica que nenhum loop permanece após fechar.

## Estrutura

```text
src/
  assets/       imagens importadas pelo Vite
  components/   janelas, jogos, álbum, formulários e efeitos
  data/         conteúdo e configurações estáticas
  hooks/        estado do desktop, timers e foco de janelas
  pages/Home/   composição do desktop
  services/     envio de feedback pelo EmailJS
  utils/        transformações de contatos, figurinhas e canvas
public/         sequências de animação e assets com caminhos estáveis
scripts/        compatibilidade do page-flip e manifesto do cassino
tests/          regressões de lógica, assets e navegador
```

Existe uma página de desktop. As janelas são controladas por estado; não há uma URL por janela. `HashRouter` foi mantido para compatibilidade com a hospedagem estática. Atualizar a página reinicia o estado da sessão, como antes. Apenas a ordem dos contatos é salva em `localStorage`; valores inválidos são descartados e URLs vêm do catálogo local.

## Feedback e EmailJS

A configuração pública existente permanece como padrão em `src/services/feedback.js`. Para outro serviço, copie `.env.example` para `.env.local` e preencha os três identificadores. O template precisa receber `nome`, `email`, `tipo`, `mensagem` e `data`.

Variáveis `VITE_*` fazem parte do frontend. Não coloque secrets, chaves privadas ou senhas nelas. O EmailJS permite a exposição da [chave pública](https://www.emailjs.com/docs/faq/is-it-okay-to-expose-my-public-key/); restrições de origem e proteção contra abuso devem ser configuradas na conta. O formulário valida os campos, bloqueia envios simultâneos e mantém o texto em caso de erro. Os testes interceptam a API e **não enviam e-mails reais**.

## Validação

```sh
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

Os testes de navegador usam o build em `dist` e iniciam o preview na porta 4173. Localmente usam Google Chrome instalado. Para usar Chromium do Playwright:

```sh
npx playwright install chromium
```

Defina `PLAYWRIGHT_CHANNEL=chromium` no seu shell antes de `npm run test:e2e`. Na CI, Chromium é instalado automaticamente. Screenshots e traces de falhas ficam em `test-results/`, ignorado pelo Git. A fonte remota é interceptada nos testes para não depender do Google Fonts.

`.github/workflows/ci.yml` executa instalação, lint sem warnings, testes, build, smoke de navegador e auditoria de produção em pull requests para `main` e pushes na branch de refatoração. Esse workflow não publica o site.

Se alterar as imagens do cassino, atualize o manifesto com `npm run assets:casino`. `npm test` verifica que a deduplicação continua representando cada frame original sem alterar os bytes da imagem.

## Build e GitHub Pages

```sh
npm run build
npm run preview
```

O build é gerado em `dist/`. O `base` do Vite e o caminho dos assets públicos continuam `/tccLola-portif-lio/`; não substitua por `/` para esse deploy.

Após revisar e aprovar as alterações, a publicação continua sendo feita pelo comando existente:

```sh
npm run deploy
```

`predeploy` gera o build e `gh-pages -d dist` publica na branch `gh-pages`. O GitHub Pages deve servir essa branch. Endereço: [portfólio publicado](https://andremk12.github.io/tccLola-portif-lio/). A refatoração não executa deploy nem merge automaticamente.

Veja o [relatório técnico completo](docs/REFACTOR_REVIEW.md) para problemas corrigidos, inventário de arquivos, validação e limitações conhecidas.
