import { Component, ElementRef, Injector, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <app-header />
    <main id="conteudo" tabindex="-1"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }
    main {
      flex: 1;
    }
    .skip-link {
      position: absolute;
      top: 1rem;
      left: 1rem;
      transform: translateY(-200%);
      z-index: 10;
      background: white;
      padding: 1rem;
    }
    .skip-link:focus {
      transform: translateY(0);
    }
  `,
})
export class PublicLayout {
  private readonly router = inject(Router);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  constructor() {
    let previousPath = '';
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      const path = event.urlAfterRedirects.split(/[?#]/)[0];
      const pageChanged = previousPath !== '' && previousPath !== path;
      previousPath = path;
      // Não roubar o foco inicial, das âncoras ou dos controles de uma consulta na mesma página.
      if (!pageChanged || event.urlAfterRedirects.includes('#')) return;
      afterNextRender(
        () => {
          if (this.router.url.split(/[?#]/)[0] === path) {
            this.element.nativeElement
              .querySelector<HTMLElement>('main')
              ?.focus({ preventScroll: true });
          }
        },
        { injector: this.injector },
      );
    });
  }
}
