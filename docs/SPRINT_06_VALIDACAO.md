# Sprint 06 — Qualidade e preparação para validação

> Registro histórico da Sprint 06. Após esta entrega, o responsável incorporou a política oficial na seção 18 e aprovou sua precedência (DEC-007). As pendências de conhecimento da política e dos dados obrigatórios do ofício foram superadas por essa atualização; não a autorização de operação oficial. Consulte `ATUALIZACAO_POLITICA_VISITACAO.md` para o estado posterior.

## Escopo autorizado

O responsável pelo projeto autorizou concluir `/materiais-educativos` e, em seguida, executar a Sprint 06. O catálogo atende aos RF-23 e RF-24 **provisórios** da matriz reconstruída; esta entrega não transforma a matriz em contrato homologado.

Foram preservadas as decisões existentes e as funcionalidades das sprints anteriores. Não foram adicionados backend, autenticação, envio de e-mails, upload, pagamentos, agenda ou confirmação institucional.

## Catálogo entregue

- Página standalone com carregamento sob demanda pelo Angular Router.
- Três guias internos de preparação: caminho da visita, informações da escola e revisão do ofício.
- Leitura na própria página com `details`/`summary`, operável por teclado, e links internos para as etapas existentes.
- Identificação explícita de conteúdo demonstrativo baseado na especificação, não produzido ou homologado pela APL.
- Aviso de que ainda não há acervo institucional validado, PDFs oficiais ou downloads. Nenhum título histórico, publicação ou link externo foi inventado.
- Atualização do acesso na Home para não anunciar o catálogo como uma página em construção.

O catálogo funcional não substitui a futura seleção editorial de materiais educativos reais pela instituição.

## Revisões de qualidade

- Foco no conteúdo principal após mudança de página, sem interferir na primeira abertura, em âncoras ou consultas na mesma página. A execução ocorre após a renderização no navegador, preservando SSR.
- Campo de identificação local marcado como obrigatório também no HTML.
- Remoção de feedback antigo do painel ao atualizar registros, evitando misturar sucesso anterior com falha atual de leitura.
- Revisão de textos desatualizados sobre o formulário e de uma repetição no aviso do ofício, mantendo todas as ressalvas institucionais.
- Configuração do Vitest limitada a dois workers. A suíte ampliada havia apresentado timeout na inicialização da página Como visitar com paralelismo padrão. O limite de tempo dos testes não foi ampliado e nenhuma dependência foi atualizada.

## Evidências técnicas

| Verificação                                                              | Resultado                                                                                               |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `npm test -- --watch=false`                                              | 54 testes aprovados em 11 arquivos                                                                      |
| `npm run build`                                                          | Concluído; bundles de navegador e servidor, sete rotas pré-renderizadas                                 |
| Estrutura acessível nas sete páginas e na página de endereço inexistente | Um `main`, um `h1`, IDs únicos, referências ARIA existentes, controles nomeados e link de salto         |
| Catálogo                                                                 | Leitura abre/fecha, destinos internos existentes, ausência de downloads e links externos inventados     |
| Fluxos de ofício e solicitação                                           | Validações, revisão, edição, impressão/cópia e falhas de armazenamento cobertas pelos testes existentes |
| Chrome headless em servidor de desenvolvimento                           | Oito rotas sem transbordamento horizontal da página em 320, 390, 768 e 1440 px                          |
| Teclado no Chrome                                                        | Leitura do guia com Enter e foco no conteúdo após navegação                                             |
| Jornada integrada no Chrome                                              | Criar exemplo, consultar, alterar status e observação, recarregar e consultar os dados persistidos      |
| Execução e rede durante a jornada automatizada                           | Nenhuma exceção de execução ou requisição HTTP externa observada                                        |

O primeiro build foi impedido por `spawn EPERM` na restrição de processos do ambiente. A repetição autorizada fora dessa restrição concluiu sem erro de compilação.

## Arquivos desta entrega

- `src/app/features/materiais-educativos/`: dados, componente, template, SCSS e testes do catálogo.
- `src/app/app.routes.ts` e `src/app/app.spec.ts`: rota real e navegação para o catálogo.
- `src/app/quality.spec.ts`: verificações estruturais de acessibilidade e foco.
- `src/app/layout/public-layout/public-layout.ts`: foco após navegação.
- `src/app/features/home/resources/home-resources.html`: descrição do acesso ao catálogo.
- `src/app/features/como-visitar/preparation/visit-preparation.html` e `src/app/features/preparar-oficio/preparar-oficio.html`: revisão de textos.
- `src/app/features/acompanhar-solicitacao/acompanhar-solicitacao.html`: obrigatoriedade acessível do código.
- `src/app/features/admin-demo/admin-demo.ts` e respectivo `.spec.ts`: limpeza de feedback e teste de regressão.
- `angular.json` e `vitest.config.mts`: paralelismo dos testes.
- `scripts/validate-browser.mjs`: verificação repetível no navegador com perfil isolado.
- `docs/SPRINT_06_VALIDACAO.md`: este relatório.

Alterações preexistentes em dependências e outras partes do projeto foram preservadas; não houve atualização de pacotes nesta entrega.

### Como repetir

```sh
npm test -- --watch=false
npm run build
```

Com `npm start` ativo, em outro terminal:

```sh
node scripts/validate-browser.mjs
```

O script usa o Chrome instalado no Windows; para outro caminho, configure `CHROME_PATH`. Aceita somente servidor local, usa perfil temporário isolado, preenche apenas dados fictícios e remove esse perfil ao encerrar. Não modifica os registros do navegador habitual do usuário. A tabela administrativa pode ter rolagem interna no celular; isso não equivale a transbordamento da página.

## Pendências antes de publicação oficial

1. Validar diretamente com a APL o procedimento e contato de envio, antecedência, capacidade, valores e gratuidade. A revisão técnica não homologa essas políticas.
2. Obter autorização institucional de uso público e esclarecer a DEC-004. Salvar no navegador continua sem enviar ou protocolar pedidos na APL.
3. Resolver a DEC-003 antes de exportação definitiva em PDF/DOCX. Impressão e cópia da minuta não são essa decisão.
4. Selecionar, verificar autoria/direitos de uso e aprovar os materiais educativos institucionais e seus destinos antes de disponibilizá-los como acervo oficial.
5. Homologar campos do ofício e vocabulário de estados; os estados atuais continuam demonstrativos.
6. Recuperar as redações originais dos RF/RN antes de congelar a rastreabilidade contratual.
7. Realizar avaliação humana com professores e equipe da APL, revisão visual, contraste em todos os estados e testes com leitor de tela/tecnologias assistivas. As verificações estruturais e de teclado não certificam conformidade integral com WCAG.
8. Qualquer uso de dados pessoais reais, acesso protegido ou persistência remota exige decisões próprias de privacidade, segurança e arquitetura. O painel atual é público e demonstrativo.

## Situação da entrega

A preparação técnica permite avaliação do protótipo. A validação institucional e a aprovação para operação oficial **não foram realizadas**. As decisões pendentes não tiveram seu status alterado. Sugere-se registrar no histórico de decisões a futura seleção editorial dos materiais e o resultado da homologação humana quando ocorrerem.
