import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerRepository } from './customer-repository.service';
import { FilterOptionsRepository } from './filter-options-repository.service';
import { ProductRepository } from './product-repository.service';
import { Reservation } from './models';
import { ReservationRepository } from './reservation-repository.service';
import { ReservationStatusRepository } from './reservation-status-repository.service';
import { WindowManagerService } from './window-manager.service';

type Tab =
  | 'general'
  | 'activity'
  | 'custom'
  | 'itinerary'
  | 'communication'
  | 'passengers'
  | 'reservationReport'
  | 'automaticActions'
  | 'travelSegments'
  | 'operationsReport';

@Component({
  selector: 'app-reservation-editor-window',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  template: `
    <form class="editor" [formGroup]="form" (ngSubmit)="save()">
      <nav class="editor__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="editor__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="editor__body">
        <ng-container *ngIf="activeTab() === 'general'">
          <div class="editor__top-cards">
            <article class="lmx-card editor__card editor__card--main">
              <h3 class="editor__card-title">
                Reservation details ({{ currentReservation()?.reservationNumber }})
              </h3>
              <div class="editor__form-grid">
                <label class="lmx-field">
                  <span>Description</span>
                  <input class="lmx-input" type="text" formControlName="passengerName" />
                </label>
                <label class="lmx-field">
                  <span>Currency</span>
                  <select class="lmx-select" disabled>
                    <option>{{ currency() }}</option>
                  </select>
                </label>
                <label class="lmx-field">
                  <span>Customer</span>
                  <select class="lmx-select" formControlName="customerId">
                    <option *ngFor="let customer of customers()" [ngValue]="customer.id">{{ customer.name }}</option>
                  </select>
                </label>
                <label class="lmx-field">
                  <span>Created by</span>
                  <select class="lmx-select" formControlName="createdBy">
                    <option *ngFor="let employee of filterOptions().createdBy" [ngValue]="employee">
                      {{ employee }}
                    </option>
                  </select>
                </label>
                <label class="lmx-field">
                  <span>Branch office</span>
                  <select class="lmx-select" formControlName="branchOffice">
                    <option *ngFor="let office of filterOptions().branchOffices" [ngValue]="office">{{ office }}</option>
                  </select>
                </label>
                <label class="lmx-field">
                  <span>Department</span>
                  <select class="lmx-select" disabled>
                    <option>Default</option>
                  </select>
                </label>
              </div>
            </article>

            <article class="lmx-card editor__card">
              <h3 class="editor__card-title">Note</h3>
              <ul class="editor__doc-list">
                <li><a>Internal</a></li>
                <li><a>Voucher</a></li>
                <li><a>Contract</a></li>
                <li><a>Rooming list</a></li>
                <li><a>Flight/bus list</a></li>
              </ul>
            </article>

            <article class="lmx-card editor__card">
              <h3 class="editor__card-title">Documents</h3>
              <div class="editor__docs">
                <span class="editor__docs-label">Offer</span>
                <a class="editor__docs-link">Create</a>
                <a class="editor__docs-link">List</a>
                <span class="material-icons editor__doc-icon">mail</span>
                <span class="material-icons editor__doc-icon">picture_as_pdf</span>
                <span></span>

                <span class="editor__docs-label">Pro forma invoice</span>
                <a class="editor__docs-link">Create</a>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <span class="editor__docs-label">Supplier inquiry</span>
                <a class="editor__docs-link">Create</a>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <span class="editor__docs-label">Supplier confirmations</span>
                <a class="editor__docs-link">Create</a>
                <a class="editor__docs-link">List</a>
                <span class="material-icons editor__doc-icon">mail</span>
                <span class="material-icons editor__doc-icon">picture_as_pdf</span>
                <span></span>

                <span class="editor__docs-label">Invoice</span>
                <a class="editor__docs-link">Create</a>
                <a class="editor__docs-link">List</a>
                <span class="material-icons editor__doc-icon">mail</span>
                <span class="material-icons editor__doc-icon">picture_as_pdf</span>
                <span class="material-icons editor__doc-icon">add</span>

                <span class="editor__docs-label">Supplier Invoice</span>
                <a class="editor__docs-link">New</a>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <span class="editor__docs-label">Vouchers</span>
                <a class="editor__docs-link">Create</a>
                <a class="editor__docs-link">List</a>
                <span class="material-icons editor__doc-icon">mail</span>
                <span class="material-icons editor__doc-icon">picture_as_pdf</span>
                <span></span>
              </div>
            </article>

            <article class="lmx-card editor__card editor__status-card">
              <h3 class="editor__card-title">Status</h3>
              <div class="editor__status-row">
                <span class="editor__status-label">Current status:</span>
                <span
                  class="editor__status-pill"
                  [ngClass]="currentStatusTone()"
                >{{ currentStatusLabel() }}</span>
              </div>
              <div class="editor__status-links">
                <a class="editor__status-link"><span class="material-icons">check_circle</span>Finish</a>
                <a class="editor__status-link"><span class="material-icons">cancel</span>Cancel</a>
              </div>

              <h3 class="editor__card-title editor__card-title--spaced">Transactions</h3>
              <div class="editor__transactions">
                <a class="editor__status-link editor__status-link--blue">
                  <span class="material-icons editor__money-icon">attach_money</span>Transactions
                </a>
                <a class="editor__status-link editor__status-link--blue">
                  <span class="material-icons">add</span>New payment
                </a>
              </div>
              <div class="editor__paid-row">
                <div>Paid <strong>{{ form.controls.paid.value | number: '1.2-2' }}</strong></div>
                <div>Remain. <strong>{{ remainingAmount() | number: '1.2-2' }}</strong></div>
              </div>
            </article>
          </div>

          <div class="editor__items-bar">
            <button type="button" class="lmx-btn lmx-btn--action">
              <span class="material-icons">add_box</span> New Item
            </button>
            <button type="button" class="lmx-btn lmx-btn--action-outline">
              <span class="material-icons">add</span> Add ad-hoc item
            </button>
            <button type="button" class="lmx-btn lmx-btn--action-outline">
              <span class="material-icons">add</span> Add items from template
            </button>
            <button type="button" class="lmx-btn lmx-btn--action-outline">
              <span class="material-icons">add</span> Add flight ticket
            </button>
            <button type="button" class="lmx-btn lmx-btn--action-outline">
              <span class="material-icons">add</span> Add Flight ad-hoc item
            </button>
            <button type="button" class="lmx-btn lmx-btn--ghost">
              <span class="material-icons">open_with</span> Copy
            </button>
            <button type="button" class="lmx-btn lmx-btn--ghost">
              Options <span class="material-icons">expand_more</span>
            </button>
          </div>

          <article class="lmx-card editor__items">
            <header class="editor__items-header">
              <span class="editor__items-eyebrow">Drag a column header and drop it here to group by that column</span>
            </header>

            <div class="editor__items-grid">
              <div class="editor__items-row editor__items-row--head">
                <div><input type="checkbox" aria-label="Select all" /></div>
                <div>Product</div>
                <div>Destination</div>
                <div>Passenger</div>
                <div>Supplier</div>
                <div class="align-right">PAX</div>
                <div>Period</div>
                <div class="align-right">Default price</div>
                <div class="align-right">Price</div>
                <div class="align-right">Net</div>
                <div class="align-right">Margin</div>
                <div>Status</div>
                <div class="align-right"></div>
              </div>
              <div class="editor__items-row" *ngFor="let pax of itemPassengers(); let i = index">
                <div><input type="checkbox" [attr.aria-label]="'Select ' + pax" /></div>
                <div>
                  <a>{{ productLabel() }}</a>
                </div>
                <div>{{ destinationLabel() }}</div>
                <div>{{ pax }}</div>
                <div><a>{{ supplierLabel() }}</a></div>
                <div class="align-right">1</div>
                <div>{{ periodLabel() }}</div>
                <div class="align-right">
                  {{ unitPrice() | currency: currency() : 'symbol-narrow' : '1.2-2' }}
                </div>
                <div class="align-right">
                  {{ unitPrice() | currency: currency() : 'symbol-narrow' : '1.2-2' }}
                </div>
                <div class="align-right">
                  {{ unitNet() | currency: currency() : 'symbol-narrow' : '1.2-2' }}
                </div>
                <div class="align-right">
                  {{ unitMargin() | currency: currency() : 'symbol-narrow' : '1.2-2' }}
                </div>
                <div>
                  <span class="editor__pill">
                    Initial state <span class="material-icons">expand_more</span>
                  </span>
                </div>
                <div class="align-right">
                  <div class="grid__actions">
                    <button type="button" class="lmx-icon-btn" aria-label="Edit">
                      <span class="material-icons">edit</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="Delete">
                      <span class="material-icons">delete</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="Move">
                      <span class="material-icons">open_with</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="More">
                      <span class="material-icons">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() === 'custom'">
          <article class="lmx-card editor__card">
            <h3 class="editor__card-title">Custom fields</h3>
            <div class="editor__form-grid" formGroupName="customFields">
              <label class="lmx-field">
                <span>Preferred market</span>
                <select class="lmx-select" formControlName="preferredMarket">
                  <option *ngFor="let market of filterOptions().markets" [ngValue]="market">{{ market }}</option>
                </select>
              </label>
              <label class="lmx-field">
                <span>Tariff level</span>
                <input class="lmx-input" type="text" formControlName="tariffLevel" />
              </label>
              <label class="lmx-field">
                <span>Commission</span>
                <input class="lmx-input" type="text" formControlName="commission" />
              </label>
            </div>
          </article>

          <article class="lmx-card editor__card">
            <h3 class="editor__card-title">Notes</h3>
            <textarea class="lmx-input" formControlName="notes" rows="6"></textarea>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() === 'activity'">
          <article class="lmx-card editor__card">
            <h3 class="editor__card-title">Activity</h3>
            <p class="editor__placeholder">No activity recorded for this reservation yet.</p>
          </article>
        </ng-container>

        <ng-container *ngIf="isPlaceholderTab()">
          <article class="lmx-card editor__card">
            <h3 class="editor__card-title">{{ tabLabel(activeTab()) }}</h3>
            <p class="editor__placeholder">This section is scaffolded for the prototype.</p>
          </article>
        </ng-container>
      </div>

      <footer class="editor__footer">
        <span class="editor__saved" *ngIf="savedMessage()">{{ savedMessage() }}</span>
        <span class="editor__spacer"></span>
        <button type="button" class="lmx-btn lmx-btn--action-outline" (click)="reset()">Create template</button>
        <button type="submit" class="lmx-btn lmx-btn--action" [disabled]="form.invalid">OK</button>
      </footer>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .editor {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .editor__tabs {
        display: flex;
        align-items: stretch;
        gap: 0;
        background: #fff;
        border-bottom: 1px solid var(--lemax-border-soft);
        padding: 0 16px;
        flex-shrink: 0;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .editor__tab {
        position: relative;
        background: transparent;
        border: 0;
        padding: 14px 14px 12px;
        font: inherit;
        font-weight: 600;
        color: var(--lemax-muted);
        cursor: pointer;
        font-size: 12px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .editor__tab:hover {
        color: var(--lemax-text);
      }

      .editor__tab.active {
        color: var(--lemax-blue);
      }

      .editor__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .editor__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 12px 16px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .editor__top-cards {
        display: grid;
        grid-template-columns: 1.4fr 0.9fr 1.2fr 0.9fr;
        gap: 10px;
        align-items: start;
      }

      .editor__card {
        padding: 12px 16px;
      }

      .editor__card-title {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .editor__card-title--spaced {
        margin-top: 12px;
      }

      .editor__form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 12px;
      }

      .editor__doc-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 6px;
        font-size: 12px;
      }

      .editor__doc-list li {
        display: flex;
        align-items: center;
      }

      .editor__doc-list li > a {
        color: var(--lemax-blue);
      }

      .editor__docs {
        display: grid;
        grid-template-columns: 1fr auto auto 18px 18px 18px;
        column-gap: 10px;
        row-gap: 6px;
        font-size: 12px;
        align-items: center;
      }

      .editor__docs-label {
        color: var(--lemax-text);
      }

      .editor__docs-link {
        color: var(--lemax-blue);
        cursor: pointer;
        white-space: nowrap;
      }

      .editor__docs-link:hover {
        text-decoration: underline;
      }

      .editor__doc-icon.material-icons {
        color: var(--lemax-muted);
        font-size: 16px;
      }

      .editor__status-card {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .editor__status-card .editor__card-title {
        margin-bottom: 6px;
      }

      .editor__status-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        font-size: 12px;
      }

      .editor__status-label {
        color: var(--lemax-text);
      }

      .editor__status-pill {
        display: inline-flex;
        align-items: center;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }

      .editor__status-pill.confirmed {
        background: var(--status-confirmed-bg);
        color: var(--status-confirmed-fg);
      }
      .editor__status-pill.option {
        background: var(--status-option-bg);
        color: var(--status-option-fg);
      }
      .editor__status-pill.inquiry {
        background: var(--status-inquiry-bg);
        color: var(--status-inquiry-fg);
      }
      .editor__status-pill.finished {
        background: var(--status-finished-bg);
        color: var(--status-finished-fg);
      }
      .editor__status-pill.cancelled,
      .editor__status-pill.unrealized {
        background: var(--status-cancelled-bg);
        color: var(--status-cancelled-fg);
      }

      .editor__status-links {
        display: flex;
        gap: 14px;
        align-items: center;
      }

      .editor__status-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        cursor: pointer;
        color: var(--lemax-action);
      }

      .editor__status-link:hover {
        text-decoration: underline;
      }

      .editor__status-link .material-icons {
        font-size: 16px;
      }

      .editor__status-link--blue {
        color: var(--lemax-blue);
      }

      .editor__transactions {
        display: flex;
        gap: 14px;
        align-items: center;
        margin-bottom: 8px;
      }

      .editor__money-icon.material-icons {
        font-size: 18px;
        color: var(--lemax-blue);
      }

      .editor__paid-row {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: var(--lemax-text);
      }

      .editor__paid-row strong {
        margin-left: 4px;
        font-weight: 600;
      }

      .editor__totals {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .editor__totals span {
        display: block;
        color: var(--lemax-muted);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .editor__totals strong {
        display: block;
        margin-top: 2px;
        color: var(--lemax-text);
        font-size: 16px;
      }

      .editor__items-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .editor__items-bar .material-icons {
        font-size: 16px;
      }

      .editor__items {
        padding: 0;
        overflow: hidden;
      }

      .editor__items-header {
        padding: 10px 14px;
        background: var(--lemax-blue-soft);
        color: var(--lemax-blue-dark);
        border-bottom: 1px solid var(--lemax-blue-tint);
      }

      .editor__items-eyebrow {
        font-size: 12px;
      }

      .editor__items-grid {
        font-size: 12px;
      }

      .editor__items-row {
        display: grid;
        grid-template-columns: 28px minmax(180px, 1.8fr) 100px 80px minmax(120px, 1fr) 50px 130px 110px 110px 110px 100px 130px 130px;
        gap: 10px;
        padding: 10px 14px;
        border-top: 1px solid var(--lemax-border-soft);
        align-items: center;
      }

      .editor__items-row--head {
        background: var(--lemax-header-row);
        color: var(--lemax-muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 11px;
        border-top: 0;
      }

      .editor__items-row .align-right {
        text-align: right;
      }

      .editor__pill {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px 4px 2px 8px;
        background: #f2f3f5;
        color: var(--lemax-blue);
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }

      .editor__pill .material-icons {
        font-size: 16px;
      }

      .editor__items input[type='checkbox'] {
        width: 14px;
        height: 14px;
        accent-color: var(--lemax-blue);
      }

      .grid__actions {
        display: inline-flex;
        align-items: center;
        gap: 0;
        justify-content: flex-end;
      }

      .editor__placeholder {
        margin: 0;
        color: var(--lemax-muted);
      }

      .editor__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .editor__spacer {
        flex: 1;
      }

      .editor__saved {
        color: var(--lemax-muted);
        font-size: 12px;
      }

      .editor__items-grid {
        overflow-x: auto;
      }

      .editor__items-row {
        min-width: 1280px;
      }

      @media (max-width: 1380px) {
        .editor__top-cards {
          grid-template-columns: 1.4fr 1fr 1.2fr;
        }
        .editor__top-cards .editor__status-card {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 980px) {
        .editor__top-cards {
          grid-template-columns: 1fr 1fr;
        }
        .editor__top-cards .editor__status-card {
          grid-column: auto;
        }
      }

      @media (max-width: 760px) {
        .editor__top-cards {
          grid-template-columns: 1fr;
        }
        .editor__form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ReservationEditorWindowComponent implements OnChanges {
  @Input({ required: true }) reservationId = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly reservationRepository = inject(ReservationRepository);
  private readonly statusRepository = inject(ReservationStatusRepository);
  private readonly customerRepository = inject(CustomerRepository);
  private readonly productRepository = inject(ProductRepository);
  private readonly filterOptionsRepository = inject(FilterOptionsRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly statuses = this.statusRepository.statuses;
  protected readonly customers = this.customerRepository.customers;
  protected readonly products = this.productRepository.products;
  protected readonly filterOptions = this.filterOptionsRepository.filterOptions;
  protected readonly currentReservation = signal<Reservation | null>(null);
  protected readonly savedMessage = signal('');
  protected readonly activeTab = signal<Tab>('general');
  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'activity', label: 'Activity' },
    { id: 'custom', label: 'Custom fields' },
    { id: 'itinerary', label: 'Itinerary description' },
    { id: 'communication', label: 'Communication' },
    { id: 'passengers', label: 'Passengers' },
    { id: 'reservationReport', label: 'Reservation report' },
    { id: 'automaticActions', label: 'Automatic actions' },
    { id: 'travelSegments', label: 'Travel segments' },
    { id: 'operationsReport', label: 'Operations report' }
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    statusId: ['', Validators.required],
    customerId: ['', Validators.required],
    productId: ['', Validators.required],
    passengerName: [''],
    periodStart: ['', Validators.required],
    periodEnd: ['', Validators.required],
    optionDate: [''],
    cancellationDeadline: ['', Validators.required],
    price: [0, Validators.min(0)],
    paid: [0, Validators.min(0)],
    branchOffice: ['', Validators.required],
    createdBy: ['', Validators.required],
    notes: [''],
    customFields: this.formBuilder.nonNullable.group({
      preferredMarket: [''],
      tariffLevel: [''],
      commission: ['']
    })
  });

  protected readonly remainingAmount = computed(() =>
    Math.max(0, Number(this.form.controls.price.value) - Number(this.form.controls.paid.value))
  );

  protected readonly currency = computed(() => this.currentReservation()?.currency ?? 'EUR');

  protected readonly currentStatusTone = computed(() => {
    const id = this.form.controls.statusId.value || this.currentReservation()?.statusId;
    return this.statuses().find((status) => status.id === id)?.tone ?? 'inquiry';
  });

  protected readonly currentStatusLabel = computed(() => {
    const id = this.form.controls.statusId.value || this.currentReservation()?.statusId;
    return this.statuses().find((status) => status.id === id)?.label ?? '';
  });

  protected readonly itemPassengers = computed(() => {
    const reservation = this.currentReservation();
    if (!reservation) return [] as string[];
    const passengerCount = Math.max(1, Math.min(5, Math.round(reservation.price / 5000) || 1));
    return Array.from({ length: passengerCount }, (_, index) => `s${index + 1}`);
  });

  protected readonly productLabel = computed(() => {
    const reservation = this.currentReservation();
    if (!reservation) return '';
    const product = this.products().find((p) => p.id === reservation.productId);
    return product ? product.name : '';
  });

  protected readonly destinationLabel = computed(() => {
    const reservation = this.currentReservation();
    if (!reservation) return '';
    const product = this.products().find((p) => p.id === reservation.productId);
    return product?.region ?? '';
  });

  protected readonly supplierLabel = computed(() => {
    const reservation = this.currentReservation();
    if (!reservation) return '';
    const product = this.products().find((p) => p.id === reservation.productId);
    return product?.supplier ?? '';
  });

  protected readonly periodLabel = computed(() => {
    const reservation = this.currentReservation();
    if (!reservation) return '';
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const start = formatter.format(new Date(reservation.periodStart));
    const end = formatter.format(new Date(reservation.periodEnd));
    return start === end ? start : `${start} - ${end}`;
  });

  protected readonly unitPrice = computed(() => {
    const reservation = this.currentReservation();
    const passengers = this.itemPassengers().length || 1;
    return reservation ? reservation.price / passengers : 0;
  });

  protected readonly unitNet = computed(() => Math.round(this.unitPrice() * 0.81 * 100) / 100);

  protected readonly unitMargin = computed(() => this.unitPrice() - this.unitNet());

  protected isPlaceholderTab(): boolean {
    const placeholders: Tab[] = [
      'itinerary',
      'communication',
      'passengers',
      'reservationReport',
      'automaticActions',
      'travelSegments',
      'operationsReport'
    ];
    return placeholders.includes(this.activeTab());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservationId']) {
      this.loadReservation();
    }
  }

  protected tabLabel(id: Tab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected reset(): void {
    this.loadReservation();
  }

  protected save(): void {
    const existingReservation = this.currentReservation();

    if (!existingReservation) {
      return;
    }

    const formValue = this.form.getRawValue();
    const updatedReservation: Reservation = {
      ...existingReservation,
      ...formValue,
      price: Number(formValue.price),
      paid: Number(formValue.paid)
    };

    this.reservationRepository.save(updatedReservation);
    this.windowManager.close(this.windowId);
  }

  private loadReservation(): void {
    const reservation = this.reservationRepository.getById(this.reservationId);

    if (!reservation) {
      return;
    }

    this.currentReservation.set(reservation);
    this.savedMessage.set('');
    this.form.reset({
      statusId: reservation.statusId,
      customerId: reservation.customerId,
      productId: reservation.productId,
      passengerName: reservation.passengerName,
      periodStart: reservation.periodStart,
      periodEnd: reservation.periodEnd,
      optionDate: reservation.optionDate,
      cancellationDeadline: reservation.cancellationDeadline,
      price: reservation.price,
      paid: reservation.paid,
      branchOffice: reservation.branchOffice,
      createdBy: reservation.createdBy,
      notes: reservation.notes,
      customFields: reservation.customFields
    });
  }
}
