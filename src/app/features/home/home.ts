import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeResources } from './resources/home-resources';
import { HomeHero } from './hero/home-hero';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, HomeResources, HomeHero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  protected readonly benefits = [
    {
      icon: '01',
      title: 'Literatura mais próxima',
      text: 'Dê contexto às leituras da turma e abra espaço para descobrir a produção literária paraibana.',
      kind: 'reading',
    },
    {
      icon: '02',
      title: 'Memória que faz sentido',
      text: 'Conecte histórias, lugares e cultura às conversas que já acontecem em sala de aula.',
      kind: 'memory',
    },
    {
      icon: '03',
      title: 'Curiosidade para levar adiante',
      text: 'Uma visita pode ser o começo de novas perguntas, leituras e produções dos estudantes.',
      kind: 'discovery',
    },
  ];
  protected readonly steps = [
    {
      title: 'Conheça as orientações',
      text: 'Conheça a política de visitação: de segunda a sexta, das 08h às 12h, exceto feriados. Recomenda-se solicitar com 7 dias úteis de antecedência.',
    },
    {
      title: 'Organize o ofício',
      text: 'Reúna os dados de alunos e acompanhantes e prepare o ofício timbrado para revisão e assinatura da direção ou coordenação.',
    },
    {
      title: 'Use o canal oficial',
      text: 'Envie o ofício em anexo exclusivamente para academiadeletraspb@gmail.com. O formulário deste protótipo não faz esse envio.',
    },
    {
      title: 'Aguarde a confirmação',
      text: 'A visita só estará confirmada após a resposta da equipe da Academia. Uma solicitação não garante a reserva.',
    },
  ];
}
