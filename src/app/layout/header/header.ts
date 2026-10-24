import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ButtonDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly menuOpen = signal(false);
  protected readonly links = [
    { path: '/', label: 'Início' },
    { path: '/como-visitar', label: 'Como visitar' },
    { path: '/materiais-educativos', label: 'Materiais educativos' },
    { path: '/preparar-oficio', label: 'Preparar ofício' },
    { path: '/solicitar-visita', label: 'Solicitar visita' },
    { path: '/acompanhar-solicitacao', label: 'Acompanhar' },
  ];
  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
