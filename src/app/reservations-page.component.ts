import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerRepository } from './customer-repository.service';
import { FilterOptionsRepository } from './filter-options-repository.service';
import { ProductRepository } from './product-repository.service';
import { ReservationRepository } from './reservation-repository.service';
import { ReservationStatusRepository } from './reservation-status-repository.service';
import { ReservationFilters, SortState } from './models';
import { StatusBadgeComponent } from './status-badge.component';
import { WindowManagerService } from './window-manager.service';

@Component({
  selector: 'app-reservations-page',
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DecimalPipe, DatePipe],
  template: `
    <section class="reservations-page">
      <header class="page-header">
        <h1 class="lmx-page-title">All reservations</h1>
        <div class="page-header__actions">
          <button type="button" class="lmx-btn lmx-btn--action">
            Group actions <span class="caret material-icons">expand_more</span>
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">Import</button>
        </div>
      </header>

      <section class="filter-card lmx-card">
        <div class="filter-card__main">
          <label class="lmx-field">
            <span>Status</span>
            <select
              class="lmx-select"
              [ngModel]="statusSelectValue()"
              (ngModelChange)="onStatusSelectChange($event)"
            >
              <option value="all">Inquiry, Option, Confirmed, Fini...</option>
              <option *ngFor="let status of statuses()" [value]="status.id">{{ status.label }}</option>
            </select>
          </label>

          <label class="lmx-field">
            <span>Branch office</span>
            <select
              class="lmx-select"
              [ngModel]="filters().branchOffice"
              (ngModelChange)="updateFilters({ branchOffice: $event })"
            >
              <option value="">Please select</option>
              <option *ngFor="let office of filterOptions().branchOffices" [ngValue]="office">{{ office }}</option>
            </select>
          </label>

          <label class="lmx-field">
            <span>Department</span>
            <select class="lmx-select" disabled>
              <option>Please select</option>
            </select>
          </label>

          <label class="lmx-field">
            <span>Reservation created between</span>
            <div class="lmx-field__date-pair">
              <input type="date" class="lmx-input" />
              <input type="date" class="lmx-input" />
            </div>
          </label>

          <label class="lmx-field">
            <span>Reservation period between</span>
            <div class="lmx-field__date-pair">
              <input type="date" class="lmx-input" />
              <input type="date" class="lmx-input" />
            </div>
          </label>

          <div class="filter-card__submit">
            <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
            <button type="button" class="filter-card__advanced" (click)="toggleAdvancedFilters()">
              Advanced
              <span class="material-icons">{{ showAdvancedFilters() ? 'expand_less' : 'expand_more' }}</span>
            </button>
          </div>
        </div>

        <div class="filter-card__secondary">
          <div class="lmx-field lmx-field--checkbox">
            <span>Not fully paid</span>
            <label class="lmx-checkbox">
              <input
                type="checkbox"
                [ngModel]="filters().onlyOutstanding"
                (ngModelChange)="updateFilters({ onlyOutstanding: $event })"
              />
            </label>
          </div>

          <label class="lmx-field" *ngIf="showAdvancedFilters()">
            <span>Find reservation, customer or passenger</span>
            <input
              type="text"
              class="lmx-input"
              [ngModel]="filters().search"
              (ngModelChange)="updateFilters({ search: $event })"
              placeholder="Minimum of 3 characters"
            />
          </label>

          <label class="lmx-field" *ngIf="showAdvancedFilters()">
            <span>Created by</span>
            <select
              class="lmx-select"
              [ngModel]="filters().createdBy"
              (ngModelChange)="updateFilters({ createdBy: $event })"
            >
              <option value="">All users</option>
              <option *ngFor="let employee of filterOptions().createdBy" [ngValue]="employee">{{ employee }}</option>
            </select>
          </label>
        </div>
      </section>

      <section class="grid-card lmx-card">
        <div class="grid-scroll">
          <table class="grid">
            <colgroup>
              <col style="width: 48px" />
              <col style="width: 82px" />
              <col style="width: 320px" />
              <col style="width: 90px" />
              <col style="width: 165px" />
              <col style="width: 88px" />
              <col style="width: 150px" />
              <col style="width: 95px" />
              <col style="width: 95px" />
              <col style="width: 95px" />
              <col style="width: 105px" />
              <col style="width: 110px" />
              <col style="width: 104px" />
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all" /></th>
                <th><button type="button" (click)="setSort('reservationNumber')">Res. no.</button></th>
                <th><button type="button" (click)="setSort('product')">Product</button></th>
                <th><button type="button" (click)="setSort('customer')">Customer</button></th>
                <th><button type="button" (click)="setSort('period')">Period</button></th>
                <th><button type="button" (click)="setSort('optionDate')">Option</button></th>
                <th><button type="button" (click)="setSort('passengerName')">Passenger</button></th>
                <th class="align-right"><button type="button" (click)="setSort('price')">Price</button></th>
                <th class="align-right"><button type="button" (click)="setSort('paid')">Paid</button></th>
                <th class="align-right"><button type="button" (click)="setSort('remaining')">Remaining</button></th>
                <th class="grid__truncate-head" title="Cancellation policy">Cancellation...</th>
                <th class="grid__truncate-head" title="Cancellation deadline">
                  <button type="button" (click)="setSort('cancellationDeadline')">Cancellation...</button>
                </th>
                <th class="align-right">
                  <button type="button" class="lmx-icon-btn" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let row of filteredRows()" (dblclick)="openReservation(row.id)">
                <td><input type="checkbox" [attr.aria-label]="'Select ' + row.reservationNumber" /></td>
                <td>
                  <button
                    type="button"
                    class="grid__res-button"
                    (click)="openReservation(row.id)"
                    [attr.aria-label]="'Open reservation ' + row.reservationNumber"
                  >
                    <app-status-badge
                      class="grid__res-id"
                      [label]="row.reservationNumber.toString()"
                      [tone]="row.statusTone"
                      [icon]="badgeIcon(row.statusTone)"
                    />
                  </button>
                </td>
                <td>
                  <button type="button" class="grid__link" (click)="openProduct(row.productId)">
                    {{ row.productName }}
                  </button>
                  <span class="grid__subtext">{{ row.unitName }}</span>
                </td>
                <td>
                  <button type="button" class="grid__link" (click)="openCustomer(row.customerId)">
                    {{ row.customerName }}
                  </button>
                </td>
                <td>{{ row.periodLabel }}</td>
                <td>{{ row.optionDate ? (row.optionDate | date: 'dd/MM/yyyy') : '' }}</td>
                <td>{{ row.passengerName || '' }}</td>
                <td class="align-right">{{ row.price | number: '1.2-2' }} {{ row.currency }}</td>
                <td class="align-right">{{ row.paid | number: '1.2-2' }} {{ row.currency }}</td>
                <td class="align-right">{{ row.remaining | number: '1.2-2' }} {{ row.currency }}</td>
                <td></td>
                <td>{{ row.cancellationDeadline | date: 'dd/MM/yyyy' }}</td>
                <td class="align-right">
                  <div class="grid__actions">
                    <button type="button" class="lmx-icon-btn" (click)="openReservation(row.id)" aria-label="Edit">
                      <span class="material-icons">edit</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="Delete">
                      <span class="material-icons">delete</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" (click)="copyReservation(row.id)" aria-label="Copy">
                      <span class="material-icons">content_copy</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="More">
                      <span class="material-icons">more_vert</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="!filteredRows().length">
                <td colspan="13" class="grid__empty">No reservations match the current filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
  styleUrl: './reservations-page.component.css'
})
export class ReservationsPageComponent {
  private readonly reservationRepository = inject(ReservationRepository);
  private readonly customerRepository = inject(CustomerRepository);
  private readonly productRepository = inject(ProductRepository);
  private readonly statusRepository = inject(ReservationStatusRepository);
  private readonly filterOptionsRepository = inject(FilterOptionsRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly showAdvancedFilters = signal(false);
  protected readonly filters = signal<ReservationFilters>({
    search: '',
    statusIds: [],
    branchOffice: '',
    onlyOutstanding: false,
    createdBy: ''
  });
  protected readonly sortState = signal<SortState>({
    column: 'reservationNumber',
    direction: 'desc'
  });

  protected readonly statuses = this.statusRepository.statuses;
  protected readonly filterOptions = this.filterOptionsRepository.filterOptions;

  private readonly rows = computed(() => {
    const customers = new Map(this.customerRepository.customers().map((customer) => [customer.id, customer]));
    const products = new Map(this.productRepository.products().map((product) => [product.id, product]));
    const statuses = new Map(this.statusRepository.statuses().map((status) => [status.id, status]));

    return this.reservationRepository.reservations().map((reservation) => {
      const customer = customers.get(reservation.customerId);
      const product = products.get(reservation.productId);
      const status = statuses.get(reservation.statusId);

      return {
        ...reservation,
        customerName: customer?.name ?? 'Unknown customer',
        productName: product?.name ?? 'Unknown product',
        unitName: product?.unitName ?? '',
        statusLabel: status?.label ?? 'Unknown',
        statusTone: status?.tone ?? 'finished',
        periodLabel: this.formatPeriod(reservation.periodStart, reservation.periodEnd),
        remaining: Math.max(0, reservation.price - reservation.paid)
      };
    });
  });

  protected readonly filteredRows = computed(() => {
    const { search, statusIds, branchOffice, onlyOutstanding, createdBy } = this.filters();
    const normalizedSearch = search.trim().toLowerCase();
    const activeStatusIds = statusIds.length ? statusIds : this.statuses().map((status) => status.id);
    const currentSort = this.sortState();

    return [...this.rows()]
      .filter((row) => activeStatusIds.includes(row.statusId))
      .filter((row) => !branchOffice || row.branchOffice === branchOffice)
      .filter((row) => !createdBy || row.createdBy === createdBy)
      .filter((row) => !onlyOutstanding || row.remaining > 0)
      .filter((row) => {
        if (!normalizedSearch) {
          return true;
        }

        return [
          row.reservationNumber.toString(),
          row.customerName,
          row.productName,
          row.passengerName,
          row.branchOffice
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((left, right) => this.compareRows(left, right, currentSort));
  });

  protected badgeIcon(tone: string): string | null {
    if (tone === 'option') return 'schedule';
    return null;
  }

  protected statusSelectValue(): string {
    const ids = this.filters().statusIds;
    return ids.length === 1 ? ids[0] : 'all';
  }

  protected onStatusSelectChange(value: string): void {
    this.updateFilters({ statusIds: value === 'all' ? [] : [value] });
  }

  protected toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((current) => !current);
  }

  protected updateFilters(patch: Partial<ReservationFilters>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  protected setSort(column: SortState['column']): void {
    this.sortState.update((current) => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  protected copyReservation(reservationId: string): void {
    const copy = this.reservationRepository.duplicate(reservationId);
    if (copy) {
      this.windowManager.open('reservation', copy.id, `Reservation details (${copy.reservationNumber})`, 'edit');
    }
  }

  protected openReservation(reservationId: string): void {
    const reservation = this.reservationRepository.getById(reservationId);

    if (!reservation) {
      return;
    }

    this.windowManager.open('reservation', reservationId, `Reservation details (${reservation.reservationNumber})`, 'edit');
  }

  protected openProduct(productId: string): void {
    const product = this.productRepository.getById(productId);

    if (!product) {
      return;
    }

    this.windowManager.open('product', productId, product.name, 'read');
  }

  protected openCustomer(customerId: string): void {
    const customer = this.customerRepository.getById(customerId);

    if (!customer) {
      return;
    }

    this.windowManager.open('customer', customerId, customer.name, 'read');
  }

  private formatPeriod(start: string, end: string): string {
    const startStr = this.formatDate(start);
    const endStr = this.formatDate(end);
    if (startStr === endStr) {
      return startStr;
    }
    return `${startStr} - ${endStr}`;
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  private compareRows(left: ReturnType<typeof this.rows>[number], right: ReturnType<typeof this.rows>[number], sortState: SortState): number {
    const direction = sortState.direction === 'asc' ? 1 : -1;

    const leftValue = this.getSortValue(left, sortState.column);
    const rightValue = this.getSortValue(right, sortState.column);

    if (leftValue < rightValue) {
      return -1 * direction;
    }

    if (leftValue > rightValue) {
      return 1 * direction;
    }

    return 0;
  }

  private getSortValue(row: ReturnType<typeof this.rows>[number], column: SortState['column']): string | number {
    switch (column) {
      case 'reservationNumber':
        return row.reservationNumber;
      case 'product':
        return row.productName;
      case 'customer':
        return row.customerName;
      case 'period':
        return row.periodStart;
      case 'optionDate':
        return row.optionDate || '';
      case 'passengerName':
        return row.passengerName || '';
      case 'price':
        return row.price;
      case 'paid':
        return row.paid;
      case 'remaining':
        return row.remaining;
      case 'cancellationDeadline':
        return row.cancellationDeadline;
    }
  }
}
