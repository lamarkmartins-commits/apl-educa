import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, ButtonDirective],
  template: `
    <section class="container section">
      <p class="eyebrow">Página não encontrada · 404</p>
      <h1>Vamos voltar ao caminho?</h1>
      <p>O endereço acessado não corresponde a uma página do APL Educa.</p>
      <a pButton routerLink="/">Voltar ao início</a>
    </section>
  `,
})
export class NotFoundPage {}
