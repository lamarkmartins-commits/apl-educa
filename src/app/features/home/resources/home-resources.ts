import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
@Component({
  selector: 'app-home-resources',
  imports: [RouterLink, ButtonDirective],
  templateUrl: './home-resources.html',
  styleUrl: './home-resources.scss',
})
export class HomeResources {}
