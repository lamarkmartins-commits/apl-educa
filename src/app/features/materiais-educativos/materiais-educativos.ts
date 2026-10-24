import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { materiais } from './materiais';

@Component({
  selector: 'app-materiais-educativos-page',
  imports: [RouterLink, ButtonDirective],
  templateUrl: './materiais-educativos.html',
  styleUrl: './materiais-educativos.scss',
})
export class MateriaisEducativosPage {
  protected readonly materiais = materiais;
}
