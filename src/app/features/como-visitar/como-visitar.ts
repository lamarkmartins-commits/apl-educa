import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { VisitProcess } from './process/visit-process';
import { VisitPreparation } from './preparation/visit-preparation';
import { VisitFaq } from './faq/visit-faq';

@Component({
  selector: 'app-como-visitar-page',
  imports: [RouterLink, ButtonDirective, VisitProcess, VisitPreparation, VisitFaq],
  templateUrl: './como-visitar.html',
  styleUrl: './como-visitar.scss',
})
export class ComoVisitarPage {}
