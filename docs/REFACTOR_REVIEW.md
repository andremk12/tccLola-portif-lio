# Revisão técnica e refatoração

Repositório: `andremk12/tccLola-portif-lio`. Base analisada: `5fb15374bd8ff020f731634f53c1eddf3e993a28` (`main`). Trabalho realizado em `refactor/codebase-cleanup`, com continuação das mudanças já implementadas. Nenhum merge ou deploy faz parte desta entrega.

## Arquitetura encontrada

A aplicação tem uma única página (`Home`), composta dentro de `HashRouter`. A navegação entre currículo, contatos, trabalhos, projetos, personalização e segredo acontece por estado e janelas sobre o desktop. Não existiam rotas individuais nem testes automatizados.

`Home` concentrava 563 linhas de apresentação, relógio, bateria e Wi-Fi simulados, boot, menu, conquistas, personalização, notificações e easter eggs. `PopUp` selecionava conteúdos e controlava posicionamento. Trabalhos reunia catálogos, galerias e lançamento dos jogos. Álbum, Futebol, terminal e quiz também misturavam dados e lógica de interação.

Pong usa Canvas 2D; Alien Shooter e Cassino usam p5; o álbum usa react-pageflip/page-flip. EmailJS envia feedback diretamente do navegador. Google Fonts e fotografias do Picsum são recursos externos. Os estilos são CSS global e arquivos associados aos componentes, sem isolamento automático de seletores.

O Vite usa `base: '/tccLola-portif-lio/'`. A publicação existente usa `predeploy` seguido de `gh-pages -d dist`. Esse caminho, o HashRouter e a estratégia de deploy foram preservados.

## Problemas encontrados e correções

| Classificação | Problema verificado | Alteração |
| --- | --- | --- |
| Bug / segurança | `contactsOrder` inválido quebrava o carregamento; objetos salvos podiam substituir URLs | Validação, migração por nome, deduplicação e catálogo local como única fonte de URLs; tolerância à indisponibilidade do storage |
| Bug | Personalização reaberta perdia a indicação das escolhas atuais | Seleção controlada pelas props do desktop, eliminando estado derivado |
| Bug | Formulário perdia dados ao falhar e não expressava corretamente erro/loading | Estados explícitos, validação, bloqueio de envio simultâneo e retenção do texto para repetir |
| Bug | Terminal aceitava propriedades herdadas como comandos; `clear` voltava a escrever no histórico | `Object.hasOwn`, normalização da entrada e retorno após `clear`/`exit` |
| Bug | Entrada do terminal ignorada nos primeiros 100 ms | Remoção do bloqueio artificial de digitação |
| Bug | Conquista de bateria inacessível porque a carga voltava antes de chegar a 1 | Ciclo da bateria alcança 1 e só depois reinicia; notificações usam estado atual |
| Bug | Identificador da conquista da galeria divergia da lista do terminal | Catálogo consistente; conquista do easter egg incluída na listagem |
| Bug | Coordenadas do Paint ficavam incorretas quando o canvas era reduzido por CSS | Conversão entre coordenadas do ponteiro e resolução interna, com captura de ponteiro |
| Bug | Reiniciar Pong podia acumular loops; fechamento deixava frames pendentes | Um identificador de RAF em todos os caminhos, cancelamento antes de reiniciar e ao desmontar |
| Bug / performance | Wrapper do álbum não destruía adequadamente a instância; `page-flip@2.0.7` mantinha RAF mesmo em `destroy()` | Destruição explícita e patch pequeno, versionado e validado no postinstall; teste conta frames após fechar |
| Bug | Atualizações de moedas dentro de atualizadores de estado, compras repetidas e timers de pacotes concorrentes | Transações puras, estado único da coleção, saldo validado, compra de figurinha já obtida bloqueada e timers nomeados |
| Bug | Botão de contato da loja apenas fechava o álbum | Fecha o álbum e abre a janela de contatos |
| Bug | Remoção de inimigos/tiros durante iteração crescente pulava colisões | Iteração reversa e interrupção depois do acerto no sketch extraído |
| Bug / manutenção | Timers, listeners e closures de efeitos sem ciclo de vida confiável | Cleanup de intervalos, timeouts, listeners, instâncias p5 e animações; `useEffectEvent` onde callbacks de efeitos precisam do estado atual |
| Arquitetura | Conteúdo estático e várias responsabilidades dentro de componentes extensos | Dados em `src/data`, estado do desktop em hook, serviço de feedback e utilitários pequenos |
| Performance | Relógio atualizava a árvore inteira a cada segundo; jogos/p5 e álbum entravam no bundle inicial | Relógio isolado e imports lazy com fallback nos jogos e álbum |
| Performance | Cassino carregava/redimensionava 284 imagens com muitas duplicatas | Manifesto de hashes conserva as 284 posições, apontando para 124 imagens únicas, carregadas uma vez por instância |
| Performance | Futebol atualizava posição em estado React a cada frame e recriava efeitos | Modelo mutável para animação, um RAF, estado apenas para mudanças de pose/elementos; escrita direta de posição restrita à animação |
| Responsividade | Janelas, grids, canvas e controles excediam telas menores | Limites por viewport, clamp do arraste/resize, grids adaptáveis, canvas proporcional, ajustes de álbum/taskbar e rolagem |
| Acessibilidade | Ícones acionáveis como div, labels/alt ausentes e foco sem tratamento | Botões nativos, nomes acessíveis, labels, foco visível, Escape/Tab nas janelas, restauração do foco, redução de movimento e ordem dos contatos por teclado |
| Manutenção | Imports/estados mortos, CSS duplicado, seletores globais conflitantes e erros de sintaxe | Remoções confirmadas, seletores de tema/currículo limitados ao componente e correções de animação/cor/seletores |
| Segurança | Dependências com advisories no lockfile | Atualizações compatíveis dentro das faixas existentes; auditoria analisada sem atualização major forçada |
| Manutenção | README usava `npm start`, omitia ferramentas e não explicava o deploy | Instruções reais de instalação, execução, integração, validação, assets e publicação |

## Alterações por área

- **Desktop:** `Home` fica responsável pela composição visual; `useDesktop` controla o estado e eventos. `DesktopClock` isola seu intervalo. `useTimeouts` substitui timers anteriores da mesma ação e cancela pendências na desmontagem. Conquistas são deduplicadas no momento da interação, sem efeitos derivados.
- **Janelas e teclado:** `PopUp` usa pointer capture, ignora controles no início do arraste e limita a posição à tela. `useDialog` coordena as janelas abertas para Tab/Escape e devolve o foco. Personalização recebe tema, cursor e wallpaper atuais. Os atalhos secretos não interceptam digitação de campos ou eventos dos canvas de jogos.
- **Feedback e contatos:** serviço EmailJS separado; mesmo serviço/template público padrão e mesmos campos enviados, incluindo data. IDs podem ser sobrescritos por variáveis públicas. Contatos preservam o catálogo original, inclusive placeholders; a ordem persistida não pode injetar um endereço.
- **Jogos e efeitos:** p5 permanece intencionalmente no projeto, com `remove()` no cleanup. Resolução lógica preservada e apresentação escalada. Entrada de teclado restrita ao canvas e controles de ponteiro/toque adicionados. Matrix se ajusta ao resize. Futebol mantém as ações, bola, carinho e sono, com loop independente de renderizações do desktop.
- **Álbum:** conteúdo e raridades mantidos, compras com saldo/deduplicação, coleta indivisível, timers canceláveis e instância page-flip destruída. A correção de RAF é aplicada automaticamente na instalação e falha de forma explícita caso o código upstream mude.
- **Conteúdo e CSS:** textos, imagens, sprites, jogos, temas e caminhos de publicação conservados. As principais mudanças visuais são correções de encaixe em telas pequenas, foco e estados de erro. Não foi aplicada uma conversão automática de imagens nem uma renomeação em massa dos componentes existentes.
- **Configuração:** carregamento nativo da configuração ESM do Vite, requisito de Node documentado, scripts mínimos de teste, CI de validação, ignores de arquivos locais e remoção de dois assets do template.

## Arquivos removidos ou movidos

| Arquivo | Motivo |
| --- | --- |
| `public/vite.svg` | Logo do template sem referência na aplicação |
| `src/assets/react.svg` | Logo do template sem referência na aplicação |
| `src/pages/Home page/Home.jsx` | Movido/refatorado para `src/pages/Home/Home.jsx`; página preservada |
| `src/pages/Home page/Home.css` | Movido para `src/pages/Home/Home.css`, retirando espaço no nome da pasta |

As sequências originais do cassino e os arquivos de arte não usados diretamente no build, como `Cat Sprite Sheet.png` e `adesivuspronto.png`, foram mantidos: podem ser fontes autorais. Não foi presumido que ausência de import torna uma fonte artística descartável.

## Arquivos criados

| Arquivo | Finalidade |
| --- | --- |
| `src/components/DesktopClock.jsx` | Relógio com intervalo próprio |
| `src/components/games/alienGame/alienSketch.js` | Lógica de p5 separada do ciclo de vida React |
| `src/hooks/useDesktop.js` | Estado e interações do desktop |
| `src/hooks/useTimeouts.js` | Timers canceláveis por ação |
| `src/hooks/useDialog.js` | Foco e teclado para janelas empilhadas |
| `src/data/achievements.js` | Catálogo de conquistas |
| `src/data/contacts.js` | Catálogo confiável dos contatos |
| `src/data/customization.js` | Opções de temas, cursor e wallpaper |
| `src/data/projects.js` | Conteúdo dos projetos |
| `src/data/works.js` | Trabalhos, fotografias, artes e HQs |
| `src/data/quiz.js` | Perguntas/resultados do quiz |
| `src/data/stickers.js` | Catálogo das figurinhas |
| `src/data/casinoFrames.js` | Manifesto deduplicado das sequências |
| `src/services/feedback.js` | Configuração pública e chamada EmailJS |
| `src/utils/contacts.js` | Restauração e persistência validada da ordem |
| `src/utils/canvas.js` | Conversão de coordenadas do canvas |
| `src/utils/stickers.js` | Regras puras de coleta e compra |
| `scripts/fix-pageflip.cjs` | Patch restrito de cancelamento de RAF |
| `scripts/generate-casino-frames.cjs` | Geração reproduzível do manifesto por hash |
| `tests/logic.test.js` | Regressões de storage, moedas e coordenadas |
| `tests/assets.test.js` | Equivalência de cada frame com o original |
| `tests/app.spec.js` | Smoke e regressões no navegador |
| `playwright.config.js` | Preview de produção e navegador de testes |
| `.github/workflows/ci.yml` | Validação automática, sem deploy |
| `.env.example` | Modelo apenas para identificadores públicos |
| `docs/REFACTOR_REVIEW.md` | Este relatório |

`Home.jsx` e `Home.css` no novo diretório são movimentos dos arquivos existentes, não novas funcionalidades. O inventário completo de arquivos modificados está ao final deste relatório.

## Dependências

Nenhuma dependência de produção foi removida ou substituída. React/React DOM 19, p5, react-pageflip, EmailJS e lucide-react continuam usados. `react-router-dom` permanece responsável pelo HashRouter. Não foram feitas atualizações major diretas.

| Dependência | Lockfile anterior → atual | Motivo |
| --- | --- | --- |
| `vite` | 7.3.1 → 7.3.6 | Correções compatíveis do ferramental e segurança |
| `@vitejs/plugin-react` | 5.1.4 → 5.2.0 | Compatibilidade/correções da mesma major |
| `react-router-dom` / `react-router` | 7.13.1 → 7.18.4 | Correções dentro da faixa existente; HashRouter validado |
| `@playwright/test` | adicionado, 1.63.0 | Única dependência direta nova, apenas de desenvolvimento, para reproduzir bugs de navegador/lifecycle |

O lockfile também atualiza dependências transitivas compatíveis: Babel 7, Rollup 4.58.0 → 4.63.4 e seus binários de plataforma, PostCSS 8.5.6 → 8.5.28, minimatch, picomatch, brace-expansion, flatted, js-yaml, nanoid, humanfs e dados de compatibilidade dos navegadores. Não foi usado `npm audit fix --force` nem override incompatível de esbuild. O diff do lockfile registra todas as versões e integridades.

## Validação e segunda revisão

O smoke da Futebol também identificou e corrigiu a área vazia dos ícones que não acionava a bola e o sprite parcialmente encoberto pela barra de tarefas. O teste agora verifica menu, ativação, movimento, bola e remoção da personagem.

A revisão final incluiu imports/caminhos, diff completo, dados extraídos, configuração, assets, hooks, timers, listeners, CSS, referências ao diretório anterior, código temporário e mensagens de debug. Os únicos `console.log` adicionados ficam nos scripts de manutenção e informam seus resultados. Nenhuma regra de lint foi desativada; os scripts CommonJS receberam o ambiente Node e as regras recomendadas.

Resultados locais finais, em 20/09/2026, Node 22.18.0, npm 10.9.3 e Chrome no Windows:

| Verificação | Resultado |
| --- | --- |
| `npm ci` | Sucesso; postinstall confirmou a correção do page-flip |
| `npm run lint` | Sucesso, sem erros ou warnings; também executado com `--max-warnings=0` |
| `npm test` | 5 testes aprovados |
| `npm run build` | Sucesso; permanece apenas o aviso do tamanho do chunk p5 |
| `npm run test:e2e` | 18 testes aprovados na execução final |
| `npm audit --omit=dev` | 0 vulnerabilidades reportadas |
| `npm audit` | 1 vulnerabilidade baixa em dependência de desenvolvimento, detalhada abaixo |
| `git diff --check` | Sem erros de whitespace |

O smoke cobre as janelas principais em 1440×900, 1366×768, 768×1024 e 390×844; personalização e arraste; contatos corrompidos; feedback com falha, retry e envio simulado; terminal; álbum e moedas; reinícios/cleanup do Pong e álbum; Paint escalado e quiz; assets de Alien/Cassino em desktop e smartphone; navegação do álbum; URL com hash e refresh sob o base do Pages; menu Iniciar e Futebol. Screenshots de desktop, jogos, álbum e Futebol foram inspecionados visualmente. Não houve envio real de e-mail nem publicação do build.

Neste sandbox Windows, um arquivo nativo temporariamente aberto bloqueou a primeira reinstalação; após liberado, `npm ci` passou. Ao final da suíte, o processo de preview precisou ser encerrado explicitamente para concluir o teardown; as 18 verificações já haviam passado e o comando terminou com código 0. O servidor dos testes é iniciado diretamente pelo binário do Vite. A CI em Linux valida o mesmo conjunto fora desse ambiente.

**Carregamento:** o JavaScript inicial minificado passou de 1.401,05 kB (gzip 383,30 kB) para 310,41 kB (gzip 108,68 kB), redução aproximada de 78% e 72%, respectivamente. Isso é divisão de carregamento, não remoção do custo total: o chunk p5 tem 1.037,80 kB (gzip 261,91 kB) e passa a ser solicitado pelos jogos; o álbum também tem chunk próprio. O manifesto do cassino referencia 124 imagens únicas para as 284 posições originais, equivalentes byte a byte nos testes.

## Segurança e pontos que ainda merecem atenção

1. **Auditoria:** dependências de produção sem vulnerabilidades reportadas na consulta. A árvore completa mantém um advisory de severidade baixa em `esbuild@0.27.3`, usado pelo Vite. [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) tem correção em 0.28.1, fora da faixa 0.27 exigida pelo Vite instalado. Não foi forçado um salto potencialmente incompatível; acompanhar uma atualização compatível do Vite. A auditoria reflete o banco consultado na execução, não uma garantia futura.
2. **Bundle:** o p5 continua grande e o build ainda avisa sobre seu chunk acima de 500 kB. Ele agora é carregado ao abrir um jogo que o utiliza. O aviso foi mantido visível. Trocar a biblioteca seria uma mudança maior de implementação/experiência.
3. **Assets:** artes originais de vários MB foram preservadas. A deduplicação do cassino reduz carregamentos e bitmaps por instância, mas 124 imagens ainda consomem memória significativa. Compressão, formatos alternativos ou vídeo precisam de comparação visual e aprovação autoral; não são ganhos de tamanho garantidos por esta refatoração.
4. **EmailJS:** os identificadores encontrados são públicos por definição do SDK. Não foram encontrados secrets privados no código revisado. Autorização de domínio, cotas, template e proteção contra abuso dependem da conta EmailJS; o envio real não foi acionado. Testes simulam sucesso/erro sem contatar destinatários.
5. **Conteúdo:** links genéricos/placeholders e ações de projetos ainda em desenvolvimento foram preservados e devem receber destinos reais fornecidos pelo autor. Fotografias do Picsum dependem de serviço externo. Códigos de easter eggs presentes no cliente são parte da experiência, não autenticação.
6. **Page-flip:** o patch de lifecycle é uma obrigação explícita de manutenção. Ao atualizar page-flip, revisar o ajuste e executar o teste do álbum. A checagem de versão/source impede aplicar silenciosamente um patch em código diferente.
7. **Cobertura:** testes de navegador usam Chromium/Chrome, viewports de desktop a smartphone e fonte fallback controlada. Não equivalem a auditoria WCAG completa, teste em aparelho físico, Safari/iOS, envio real de e-mail ou comparação visual pixel a pixel. Temas e conteúdo foram preservados, mas ainda cabe validação autoral dessas combinações em dispositivos reais.
8. **Estado:** coleção de figurinhas, moedas, tema e conquistas continuam por sessão, como antes. Implementar persistência ampla mudaria comportamento e exige decisão de produto.

## Inventário dos arquivos existentes modificados

Além dos arquivos criados, removidos e movidos listados acima, os seguintes arquivos existentes foram alterados. O diff da branch é a referência exata para cada linha.

```text
.gitignore
README.md
eslint.config.js
index.html
package-lock.json
package.json
src/components/aviso/aviso.css
src/components/aviso/aviso.jsx
src/components/canvas/canvas.css
src/components/canvas/canvas.jsx
src/components/customize/customize.css
src/components/customize/customize.jsx
src/components/form/form.css
src/components/form/form.jsx
src/components/futebol/futebol.css
src/components/futebol/futebol.jsx
src/components/games/alienGame/alienGame.css
src/components/games/alienGame/alienGame.jsx
src/components/games/cassino/cassino.css
src/components/games/cassino/cassino.jsx
src/components/games/pong/pong.css
src/components/games/pong/pong.jsx
src/components/matrixRain/matrix.jsx
src/components/popUp/popUp.css
src/components/popUp/popUp.jsx
src/components/stickerbook/sticker.css
src/components/stickerbook/sticker.jsx
src/components/terminal/terminal.css
src/components/terminal/terminal.jsx
src/components/toast/toast.css
src/components/toast/toast.jsx
src/components/windows/contact/contact.css
src/components/windows/contact/contact.jsx
src/components/windows/curriculum/curriculum.css
src/components/windows/curriculum/curriculum.jsx
src/components/windows/projects/projects.css
src/components/windows/projects/projects.jsx
src/components/windows/segredo/segredo.css
src/components/windows/segredo/segredo.jsx
src/components/works/work.css
src/components/works/works.jsx
src/index.css
src/main.jsx
```
