import { Routes } from '@angular/router';
import { AccommodationPageComponent } from './accommodation-page.component';
import { CustomersPageComponent } from './customers-page.component';
import { LemaxShellComponent } from './lemax-shell.component';
import { OffersPageComponent } from './offers-page.component';
import { OperationsReportPageComponent } from './operations-report-page.component';
import { PassengersPageComponent } from './passengers-page.component';
import { PlaceholderPageComponent } from './placeholder-page.component';
import { ReservationsPageComponent } from './reservations-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LemaxShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reservations' },
      { path: 'reservations', component: ReservationsPageComponent },
      { path: 'operations', component: OperationsReportPageComponent },
      { path: 'documents', component: OffersPageComponent },
      {
        path: 'finances',
        component: PlaceholderPageComponent,
        data: {
          title: 'Finances',
          description: 'Payments, transactions, ledgers and finance reporting fit in this section.'
        }
      },
      { path: 'products', component: AccommodationPageComponent },
      { path: 'partners', pathMatch: 'full', redirectTo: 'partners/customers' },
      {
        path: 'partners/customers',
        component: CustomersPageComponent,
        data: { partnerType: 'customer' }
      },
      {
        path: 'partners/suppliers',
        component: CustomersPageComponent,
        data: { partnerType: 'supplier' }
      },
      {
        path: 'partners/travel-agents',
        component: CustomersPageComponent,
        data: { partnerType: 'travel-agent' }
      },
      { path: 'partners/passengers', component: PassengersPageComponent },
      {
        path: 'reports',
        component: PlaceholderPageComponent,
        data: {
          title: 'Reports',
          description: 'Financial and operational reporting modules can be scaffolded into this section.'
        }
      },
      {
        path: 'options',
        component: PlaceholderPageComponent,
        data: {
          title: 'Options',
          description: 'Branch offices, departments, users and system-wide settings live here.'
        }
      },
      { path: 'customers', redirectTo: 'partners' },
      { path: 'offers', redirectTo: 'documents' },
      { path: 'accommodation', redirectTo: 'products' },
      { path: 'settings', redirectTo: 'options' }
    ]
  }
];
