/** Conteúdo local do protótipo, derivado da especificação. Não é acervo oficial da APL. */
export interface MaterialPreparacao {
  id: string;
  titulo: string;
  descricao: string;
  pontos: readonly string[];
  rota: string;
  acao: string;
}

export const materiais: readonly MaterialPreparacao[] = [
  {
    id: 'caminho-da-visita',
    titulo: 'Entenda o caminho da visita',
    descricao: 'Da primeira leitura das orientações à resposta da equipe da Academia.',
    pontos: [
      'Consulte as orientações antes de definir o planejamento da turma.',
      'Uma data pretendida é uma preferência: não representa disponibilidade ou reserva.',
      'As visitas acontecem de segunda a sexta, das 08h às 12h, exceto feriados. Recomenda-se solicitar com 7 dias úteis de antecedência e chegar 10 minutos antes da visita confirmada.',
      'A confirmação depende da resposta por e-mail da APL. Rede pública tem gratuidade; particular paga R$ 5,00 por aluno, com professores e coordenadores acompanhantes isentos. As instruções de pagamento vêm no e-mail de confirmação, sem cobrança pelo protótipo.',
    ],
    rota: '/como-visitar',
    acao: 'Consultar orientações de visitação',
  },
  {
    id: 'informacoes-da-escola',
    titulo: 'Organize as informações da escola',
    descricao: 'Um guia de conferência para preparar a solicitação com mais clareza.',
    pontos: [
      'Reúna o nome completo da instituição e o telefone/WhatsApp direto do professor ou coordenador responsável.',
      'Organize os totais de estudantes e acompanhantes, a série/ano das turmas e as sugestões de data e horário. Acima de 50 alunos, o grupo deve ser desmembrado para datas ou turnos diferentes.',
      'Defina o objetivo pedagógico da visita e consulte o checklist de preparação. Esses dados não são enviados à APL pelo protótipo.',
    ],
    rota: '/como-visitar',
    acao: 'Conferir a preparação da visita',
  },
  {
    id: 'revisao-do-oficio',
    titulo: 'Prepare e revise o ofício',
    descricao: 'Saiba o que conferir antes de assinar e encaminhar o documento da instituição.',
    pontos: [
      'Use o modelo de preparação para organizar os dados da escola, do responsável e o objetivo da visita.',
      'Revise os dados exigidos na política, coloque o ofício em papel timbrado e providencie a emissão e assinatura pela direção ou coordenação.',
      'Envie o ofício em anexo exclusivamente para academiadeletraspb@gmail.com. Gerar ou imprimir a minuta não envia o documento nem agenda a visita.',
    ],
    rota: '/preparar-oficio',
    acao: 'Preparar meu ofício',
  },
];
