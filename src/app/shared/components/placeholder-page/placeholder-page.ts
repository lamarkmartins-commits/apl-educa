import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-placeholder-page',
  imports: [RouterLink, ButtonDirective],
  template: `
    <section class="container section" aria-labelledby="page-title">
      <p class="eyebrow">APL Educa · Em preparação</p>
      <h1 id="page-title">{{ page.title }}</h1>
      <p class="description">{{ page.description }}</p>
      <div class="notice">
        <h2>Este espaço ainda não está disponível</h2>
        <p>
          A funcionalidade será construída em uma próxima etapa. Este protótipo não envia
          solicitações à APL nem confirma visitas.
        </p>
      </div>
      <div class="actions"><a pButton routerLink="/">Voltar ao início</a></div>
    </section>
  `,
  styles: `
    h1 {
      max-width: 18ch;
    }
    .description {
      max-width: 45rem;
    }
    .notice {
      max-width: 48rem;
      margin-block: 2rem;
    }
    h2 {
      font-size: 1.5rem;
    }
  `,
})
export class PlaceholderPage {
  protected readonly page = inject(ActivatedRoute).snapshot.data as {
    title: string;
    description: string;
  };
}
