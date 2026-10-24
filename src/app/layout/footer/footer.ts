import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container footer-grid">
        <div class="footer-about">
          <a class="footer-brand" routerLink="/">APL <em>Educa</em></a>
          <p>Uma ponte entre a escola, a literatura<br />e a memória cultural paraibana.</p>
          <span class="institution">Academia Paraibana de Letras</span>
        </div>
        <nav aria-label="Preparação da visita">
          <h2>Planeje o encontro</h2>
          <a routerLink="/como-visitar">Como visitar</a
          ><a routerLink="/preparar-oficio">Preparar ofício</a
          ><a routerLink="/materiais-educativos">Materiais educativos</a>
        </nav>
        <nav aria-label="Espaços demonstrativos">
          <h2>Conheça o protótipo</h2>
          <a routerLink="/solicitar-visita">Solicitação demonstrativa</a
          ><a routerLink="/acompanhar-solicitacao">Acompanhar solicitação</a>
          <a routerLink="/admin">Administração demonstrativa</a>
          <p>Dados locais, sem envio à APL.</p>
        </nav>
      </div>
      <div class="container footer-bottom">
        <span>APL Educa · Visitas escolares</span>
        <p>
          Protótipo em desenvolvimento. Esta plataforma não é um canal oficial de agendamento ou
          protocolo da APL.
        </p>
      </div>
    </footer>
  `,
  styles: `
    footer {
      background: var(--apl-cream);
      border-top: 1px solid var(--apl-border);
      padding-block: 3rem 1.5rem;
    }
    .footer-grid {
      display: grid;
      gap: 2rem;
    }
    .footer-brand {
      font-family: var(--apl-font-heading);
      font-size: 2rem;
      text-decoration: none;
    }
    p {
      color: var(--apl-muted);
      font-size: 0.78rem;
      margin: 0.8rem 0;
    }
    .institution {
      display: block;
      font-size: 0.65rem;
      margin-top: 1.5rem;
    }
    nav {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 0.6rem;
    }
    nav h2 {
      font-family: var(--apl-font-body);
      font-size: 0.72rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    nav a {
      text-decoration: none;
      font-size: 0.75rem;
    }
    nav a:hover {
      text-decoration: underline;
    }
    nav p {
      margin: 0;
      font-size: 0.68rem;
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      border-top: 1px solid var(--apl-border);
      margin-top: 2.5rem;
      padding-top: 1.2rem;
      font-size: 0.65rem;
    }
    .footer-bottom p {
      margin: 0;
      max-width: 33rem;
      font-size: 0.65rem;
    }
    @media (min-width: 48rem) {
      .footer-grid {
        grid-template-columns: 1.5fr 1fr 1fr;
      }
    }
  `,
})
export class Footer {}
