import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'APL Educa | Visitas escolares',
        loadComponent: () => import('./features/home/home').then((m) => m.HomePage),
      },
      {
        path: 'como-visitar',
        title: 'Como visitar | APL Educa',
        loadComponent: () =>
          import('./features/como-visitar/como-visitar').then((m) => m.ComoVisitarPage),
      },
      {
        path: 'preparar-oficio',
        title: 'Preparar ofício | APL Educa',
        loadComponent: () =>
          import('./features/preparar-oficio/preparar-oficio').then((m) => m.PrepararOficioPage),
      },
      {
        path: 'solicitar-visita',
        title: 'Solicitação demonstrativa | APL Educa',
        loadComponent: () =>
          import('./features/solicitar-visita/solicitar-visita').then((m) => m.SolicitarVisitaPage),
      },
      {
        path: 'acompanhar-solicitacao',
        title: 'Acompanhamento demonstrativo | APL Educa',
        loadComponent: () =>
          import('./features/acompanhar-solicitacao/acompanhar-solicitacao').then(
            (m) => m.AcompanharSolicitacaoPage,
          ),
      },
      {
        path: 'admin',
        title: 'Administração demonstrativa | APL Educa',
        loadComponent: () =>
          import('./features/admin-demo/admin-demo').then((m) => m.AdminDemoPage),
      },
      {
        path: 'materiais-educativos',
        title: 'Materiais educativos | APL Educa',
        loadComponent: () =>
          import('./features/materiais-educativos/materiais-educativos').then(
            (m) => m.MateriaisEducativosPage,
          ),
      },
      {
        path: '**',
        title: 'Página não encontrada | APL Educa',
        loadComponent: () =>
          import('./shared/components/not-found-page/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
