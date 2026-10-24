import { Component } from '@angular/core';

@Component({
  selector: 'app-visit-process',
  templateUrl: './visit-process.html',
  styleUrl: './visit-process.scss',
})
export class VisitProcess {
  protected readonly steps = [
    {
      title: 'Conheça as orientações',
      text: 'Leia a política da APL: documentação, gratuidade ou taxa e necessidade de desmembrar grupos acima de 50 alunos.',
    },
    {
      title: 'Escolha uma data pretendida',
      text: 'Sugira uma data de segunda a sexta, das 08h às 12h, exceto feriados. Recomenda-se antecedência de 7 dias úteis. Não há consulta de vagas.',
    },
    {
      title: 'Prepare o ofício da escola',
      text: 'Inclua os dados exigidos, revise o documento, use papel timbrado e providencie a assinatura da direção ou coordenação.',
    },
    {
      title: 'Envie a solicitação',
      text: 'Envie o ofício em anexo exclusivamente para academiadeletraspb@gmail.com. O envio acontece fora deste protótipo.',
    },
    {
      title: 'Aguarde a análise da APL',
      text: 'A equipe da Academia avalia o pedido. O envio do documento não confirma a data pretendida.',
    },
    {
      title: 'Receba a confirmação',
      text: 'Considere a visita agendada somente se houver resposta de confirmação da equipe. Não há garantia de aprovação.',
    },
    {
      title: 'Realize a visita',
      text: 'Com a confirmação recebida por e-mail, siga a data e o horário combinados e chegue com pelo menos 10 minutos de antecedência.',
    },
  ];
}
