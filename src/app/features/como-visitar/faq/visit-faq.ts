import { Component } from '@angular/core';
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
} from '@openng/optimus-ui/accordion';

@Component({
  selector: 'app-visit-faq',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './visit-faq.html',
  styleUrl: './visit-faq.scss',
})
export class VisitFaq {
  protected readonly questions = [
    {
      id: 'antecedencia',
      question: 'Quanto tempo antes devo solicitar?',
      answer:
        'A APL recomenda no mínimo 7 dias úteis de antecedência. É uma recomendação de planejamento, não um bloqueio automático neste protótipo. A data depende da confirmação de disponibilidade pela equipe.',
    },
    {
      id: 'capacidade',
      question: 'Existe limite de estudantes?',
      answer:
        'O número ideal é de até 50 alunos por turno. Turmas que excedam esse quantitativo deverão desmembrar o grupo e solicitar datas ou turnos diferentes. Nenhuma divisão ou reserva é realizada automaticamente pelo APL Educa.',
    },
    {
      id: 'publica',
      question: 'Escola pública paga?',
      answer:
        'Não. A política assegura gratuidade total de entrada e mediação cultural para estudantes e professores das redes públicas municipal, estadual e federal.',
    },
    {
      id: 'particular',
      question: 'Escola particular paga?',
      answer:
        'A taxa é de R$ 5,00 por aluno da rede privada. Professores e coordenadores acompanhantes da turma são isentos. As instruções para pagamento serão enviadas pela APL no e-mail de confirmação. A taxa geral de professor não se aplica a esse acompanhamento escolar. O protótipo não cobra nem recebe pagamentos.',
    },
    {
      id: 'confirmacao',
      question: 'A solicitação garante a visita?',
      answer:
        'Não. Enviar uma solicitação não confirma a visita nem reserva a data pretendida. O agendamento só deve ser considerado confirmado após manifestação da equipe da APL.',
    },
    {
      id: 'oficio',
      question: 'Preciso apresentar um ofício?',
      answer:
        'Sim. Para ambas as redes, o e-mail deve ter um ofício timbrado, emitido e assinado pela direção ou coordenação. Informe instituição, totais de alunos e acompanhantes, série/ano, data e horário sugeridos e telefone/WhatsApp do professor ou coordenador responsável. Gerar a minuta não agenda a visita.',
    },
    {
      id: 'alteracao',
      question: 'Posso alterar a data posteriormente?',
      answer:
        'A documentação do projeto não define uma política de alteração de datas. Consulte a equipe da APL antes de modificar o planejamento. Não há garantia de remarcação ou disponibilidade de outra data.',
    },
    {
      id: 'envio',
      question: 'O APL Educa envia minha solicitação?',
      answer:
        'Não. A solicitação oficial deve ser enviada exclusivamente para academiadeletraspb@gmail.com com o ofício em anexo. Esse envio ocorre fora do protótipo. O registro local não substitui o e-mail nem confirma uma visita.',
    },
    {
      id: 'horarios',
      question: 'Quais são os dias e horários de visitação?',
      answer:
        'As visitas acontecem de segunda a sexta-feira, das 08h às 12h. A APL permanece fechada nos feriados. A sugestão de data e horário depende da confirmação por e-mail.',
    },
    {
      id: 'chegada',
      question: 'Com quanto tempo de antecedência devemos chegar?',
      answer:
        'No dia da visita confirmada, o grupo deve chegar com pelo menos 10 minutos de antecedência em relação ao horário marcado.',
    },
  ];
}
