# APL Educa — Registro de Decisões

**Projeto:** APL Educa — Academia Paraibana de Letras  
**Versão:** 0.3
**Última atualização:** 23/10/2026  
**Documento de referência:** `APL_EDUCA_ESPECIFICACAO_MVP.md`

## 1. Objetivo

Este documento registra as decisões funcionais, técnicas e de experiência do usuário tomadas durante o desenvolvimento do APL Educa.

Seu objetivo é preservar o histórico das decisões, evitar interpretações incorretas dos requisitos e orientar o Codex durante a implementação das funcionalidades.

Este documento complementa a especificação funcional, mas não a substitui.

## 2. Status das decisões

Cada decisão deverá possuir um dos seguintes status:

- **Aprovada:** decisão confirmada e autorizada para implementação.
- **Proposta:** solução sugerida, ainda não aprovada.
- **Pendente:** necessita de esclarecimento ou validação.
- **Substituída:** decisão antiga que foi modificada por uma decisão posterior.
- **Cancelada:** decisão descartada, que não deve ser implementada.

O Codex não está autorizado a transformar decisões propostas ou pendentes em aprovadas.

---

## DEC-001 — Utilização do Angular

**Categoria:** Arquitetura  
**Status:** Aprovada  
**Sprint:** 01  
**Data:** 22/10/2026

### Contexto

O APL Educa será desenvolvido como uma aplicação web, com navegação entre páginas e funcionalidades interativas.

### Decisão

Utilizar Angular 22, TypeScript e SCSS, priorizando componentes standalone e Angular Router.

### Justificativa

A arquitetura permite organizar funcionalidades em componentes reutilizáveis e desenvolver o projeto progressivamente.

### Consequências

- Utilizar componentes standalone.
- Organizar funcionalidades em módulos lógicos ou pastas.
- Priorizar lazy loading quando apropriado.
- Evitar a introdução de outros frameworks de interface sem aprovação.

---

## DEC-002 — Biblioteca de componentes

**Categoria:** Design System / Front-end  
**Status:** Aprovada  
**Sprint:** 01  
**Data:** 22/10/2026

### Contexto

O projeto necessita de componentes visuais consistentes para formulários, navegação, botões e outros elementos de interface.

### Decisão

Utilizar a biblioteca Optimus UI, respeitando a versão instalada e suas APIs documentadas.

### Consequências

- Priorizar componentes existentes na biblioteca.
- Não adicionar PrimeNG ou Angular Material automaticamente.
- Utilizar SCSS para personalizações.
- Verificar a documentação antes de importar componentes.

---

## DEC-003 — Geração do ofício escolar

**Categoria:** Requisito funcional  
**Status:** Pendente  
**Sprint:** 03

### Contexto

O processo de visitação escolar envolve a preparação de um ofício institucional.

O APL Educa deverá ajudar o responsável pela escola a preparar esse documento.

### Questão em aberto

Qual formato será utilizado para gerar o ofício?

### Alternativas

**Alternativa A — PDF**

Documento pronto para impressão, assinatura e envio.

**Alternativa B — DOCX**

Documento editável em processadores de texto.

**Alternativa C — Ambos**

Permitir a geração de PDF e DOCX.

### Decisão

Ainda não definida.

### Orientação para o Codex

Não implementar a exportação definitiva enquanto esta decisão estiver pendente.

É permitido construir protótipos visuais sem exportação real, desde que identificados como demonstração.

---

## DEC-004 — Envio de solicitações de visita

**Categoria:** Regra de negócio / Integração  
**Status:** Pendente de validação institucional  
**Sprint:** 04

### Contexto

O APL Educa pretende facilitar o processo de solicitação de visitas escolares à Academia Paraibana de Letras.

A utilização de um formulário digital como canal oficial depende de autorização institucional.

### Decisão

Durante a fase de prototipação, o formulário não deve ser apresentado como canal oficial de solicitação.

### Restrições

- Não afirmar que uma visita foi oficialmente agendada.
- Não enviar solicitações reais sem autorização.
- Não implementar integração com e-mail institucional sem aprovação.
- Não criar confirmações fictícias que possam ser confundidas com confirmações oficiais.

### Orientação para o Codex

Utilizar dados simulados durante o desenvolvimento e identificar claramente o ambiente como protótipo.

---

## DEC-005 — Persistência de dados no MVP

**Categoria:** Arquitetura  
**Status:** Aprovada  
**Escopo aprovado:** Dados fictícios e armazenamento local  
**Sprint:** 04 e 05  
**Data da aprovação:** 23/10/2026

### Contexto

As funcionalidades de solicitação e acompanhamento necessitarão de armazenamento de informações.

### Decisão aprovada

Utilizar dados de mockup e `localStorage` no navegador durante a prototipação das solicitações demonstrativas, sem backend, autenticação, banco de dados remoto ou envio à APL.

### Registro de aprovação e histórico

- Em 22/10/2026, a utilização de dados simulados e armazenamento local foi registrada como proposta.
- Em 23/10/2026, o responsável pelo projeto aprovou expressamente a proposta apresentada para a Sprint 04: dados fictícios e `localStorage`, sem backend, autenticação ou envio à APL, e autorizou o registro da decisão.
- Justificativa: permitir testar o fluxo de solicitação, sua revisão e a persistência demonstrativa prevista na especificação, preservando a separação do procedimento institucional.

### Limites

- Usar apenas dados fictícios nos testes e identificar a interface como demonstração.
- Salvar localmente não envia, agenda ou protocola pedidos na APL.
- O código gerado é um identificador local demonstrativo.
- Tratar falhas de armazenamento sem afirmar salvamento bem-sucedido e sem apagar dados existentes automaticamente.
- A aprovação não autoriza dados pessoais reais em produção nem altera a pendência institucional da DEC-004.

### Questões de uma eventual evolução, fora do escopo aprovado

- O MVP terá backend?
- Será necessário autenticar escolas?
- Haverá banco de dados?
- Como serão protegidos os dados pessoais?

### Orientação para o Codex

Não implementar backend, autenticação ou armazenamento de dados pessoais reais sem decisão aprovada.

---

## DEC-006 — Identidade visual

**Categoria:** UX/UI  
**Status:** Aprovada como direção visual inicial  
**Sprint:** 01

### Contexto

A interface deverá transmitir caráter institucional, cultural, educativo e acessível.

### Decisão

Adotar inicialmente a seguinte paleta:

| Elemento        | Cor       |
| --------------- | --------- |
| Marrom profundo | `#513527` |
| Terracota       | `#A66A46` |
| Creme           | `#F7F3EB` |
| Branco          | `#FFFFFF` |
| Verde de apoio  | `#56745F` |

### Orientação para o Codex

Utilizar tokens SCSS para centralizar as cores.

Verificar contraste e acessibilidade antes de aplicar as combinações.

Não substituir a identidade visual sem aprovação.

---

## DEC-007 — Precedência da política oficial de visitação

**Categoria:** Regras de negócio / Conteúdo  
**Status:** Aprovada pelo responsável pelo projeto nesta conversa  
**Data do registro:** 23/10/2026  
**Fonte:** seção 18 de `APL_EDUCA_ESPECIFICACAO_MVP.md` e https://aplpb.com.br/visitacao/

### Decisão e histórico

O responsável adicionou a política oficial na seção 18 e autorizou expressamente sua precedência sobre os trechos provisórios anteriores. A qualificação antiga de gratuidade, taxa, capacidade, canal de envio e campos do ofício como políticas não verificadas fica substituída pela política publicada e transcrita nessa seção.

Aplicar as condições escolares específicas: gratuidade da rede pública; R$ 5,00 por aluno da rede privada, com professores e coordenadores acompanhantes isentos; desmembramento de grupos acima de 50 alunos; dados obrigatórios do ofício; visitação de segunda a sexta, das 08h às 12h, exceto feriados; antecedência recomendada de 7 dias úteis; chegada pelo menos 10 minutos antes e confirmação por e-mail da APL.

### Limites preservados

- A DEC-004 continua pendente: publicação da política não autoriza envio digital oficial pelo APL Educa.
- A DEC-003 continua pendente: não implementar exportação definitiva em PDF/DOCX.
- Nenhum checkout, backend, autenticação ou confirmação automática foi aprovado.
- Preservar registros locais anteriores, sem inventar novos dados ausentes.
- Não inferir disponibilidade, calendário de feriados, remarcação ou duração da visita.

---

## 3. Decisões pendentes

| ID      | Decisão                         | Sprint | Situação                |
| ------- | ------------------------------- | ------ | ----------------------- |
| DEC-003 | Formato de exportação do ofício | 03     | Pendente                |
| DEC-004 | Envio oficial de solicitações   | 04     | Validação institucional |

A persistência demonstrativa da DEC-005 está aprovada nos limites acima. Sua evolução para serviços remotos permanece fora do escopo.

## 4. Regras para atualização deste documento

1. Toda decisão relevante deve receber um identificador único.
2. Uma decisão aprovada não pode ser alterada silenciosamente.
3. Mudanças devem registrar a justificativa e a data.
4. Decisões substituídas devem permanecer no histórico.
5. O Codex pode propor decisões, mas não aprová-las em nome do responsável pelo projeto.
6. Decisões não podem contrariar requisitos homologados sem revisão explícita da especificação.

## 5. Instruções para o Codex

Antes de implementar uma funcionalidade:

1. Consulte a especificação funcional.
2. Consulte as decisões relacionadas.
3. Verifique se existem pendências.
4. Implemente apenas o que estiver autorizado.
5. Caso exista conflito entre documentos, interrompa a implementação afetada e solicite esclarecimento.
6. Ao concluir uma sprint, sugira atualizações para este registro, sem alterar o status de aprovação automaticamente.
