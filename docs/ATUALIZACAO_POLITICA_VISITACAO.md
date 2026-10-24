# Adequação à política de visitação — seção 18

## Autorização e fonte

O responsável pelo projeto autorizou expressamente aplicar a seção 18 como regra de negócio prevalente. Fonte: https://aplpb.com.br/visitacao/. A aprovação foi registrada na DEC-007, sem promover as decisões pendentes DEC-003 e DEC-004.

O documento funcional foi reconciliado nas seções 2, 7, 8, 9 e 15. A versão inicial e a natureza provisória da numeração RF/RN permanecem registradas; o relatório da Sprint 06 foi identificado como histórico.

## Implementação

- Home, Como visitar, FAQ, preparação/checklist e guias educativos atualizados com as condições escolares publicadas.
- Rede pública: gratuidade de entrada e mediação cultural para estudantes e professores. Rede privada: R$ 5,00 por aluno, com professores e coordenadores acompanhantes isentos; instruções de pagamento no e-mail de confirmação enviado pela APL. A taxa geral para professores não foi aplicada ao acompanhamento de grupos escolares.
- Visitação de segunda a sexta, das 08h às 12h, exceto feriados. Chegada pelo menos 10 minutos antes da visita confirmada. Sete dias úteis são recomendação, sem bloqueio por antecedência.
- Envio oficial exclusivamente ao e-mail institucional com ofício timbrado, emitido e assinado pela direção ou coordenação, como anexo. O protótipo não envia e-mails.
- Novos campos no modelo do ofício e na solicitação demonstrativa: quantidade de acompanhantes e telefone/WhatsApp do responsável. Série/ano, data e horário sugeridos passaram a ser obrigatórios.
- O ofício gerado e copiado inclui o total de alunos e acompanhantes, série/ano, data e horário e contato. Dados adicionais de composição da minuta não são apresentados como exigências adicionais da instituição.
- Validadores compartilhados em `core/models/visit-policy.ts` verificam dias da semana e horário, sem impor duração, intervalos de agenda, proporção de acompanhantes ou formato telefônico não definidos na política. A quantidade de acompanhantes deve ser informada como inteiro não negativo; não há mínimo institucional inventado.

## Capacidade e datas

O formulário ainda pode registrar o total de um grupo acima de 50 para planejamento demonstrativo. A interface e a minuta destacam que esse grupo **deverá ser desmembrado para solicitar datas ou turnos diferentes**. O registro não representa uma única reserva para todo o grupo. Não foram criados divisão automática, agenda, vagas ou recusa institucional automática.

As sugestões de data e horário são validadas no intervalo publicado, sem reservar vagas. Não existe calendário homologado de feriados no projeto; por isso, o fechamento nos feriados é informado e a data precisa ser conferida com a APL. Não foram inventadas exceções, feriados, duração da visita ou política de remarcação.

## Compatibilidade dos dados

O envelope de armazenamento local continua na versão 1. Os novos campos são opcionais **na leitura de registros legados**, mas obrigatórios nas novas entradas. O serviço valida as novas gravações sem revalidar nem completar retroativamente os dados históricos.

Administração e acompanhamento exibem acompanhantes e telefone quando disponíveis e avisam sobre ausência dos novos dados. Registros antigos, incluindo seus horários textuais, IDs, status e observações, permanecem legíveis e podem continuar no fluxo demonstrativo. Nenhuma migração destrutiva ou limpeza automática foi realizada.

## Validação e limites

- Suíte automatizada: **61 testes aprovados em 12 arquivos**.
- Build de produção: aprovado, incluindo bundles do servidor e sete rotas pré-renderizadas.
- Navegador: oito rotas verificadas em 320, 390, 768 e 1440 px, teclado e fluxo de criação/consulta/atualização local, sem exceções de execução ou requisições HTTP externas observadas.
- Corrigida a quebra de e-mails longos no passo a passo, FAQ e leitura dos guias para telas estreitas. Nenhuma dependência foi atualizada.

Os testes cobrem a política, obrigatoriedade dos dados, horários fora da visitação, fins de semana, quantidades, minuta, desmembramento e preservação de registros legados. Reexecutar:

```sh
npm test -- --watch=false
npm run build
```

Com o servidor local ativo, executar também `node scripts/validate-browser.mjs` para a regressão de navegação, responsividade e persistência em perfil temporário isolado.

Continuam fora do escopo: envio real, cobrança, upload, backend, autenticação, confirmação automática e exportação definitiva PDF/DOCX. A política publicada orienta o produto, mas não constitui autorização da APL para tornar o protótipo um canal oficial.
