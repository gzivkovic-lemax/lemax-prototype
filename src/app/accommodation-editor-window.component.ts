import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BusinessEntitySelectComponent } from './business-entity-select.component';
import { PROTOTYPE_CONFIG } from './prototype-config';
import {
  CURRENT_USER_BUSINESS_ENTITY,
  PrototypeAccommodation,
  PrototypeContract,
  PrototypeDataRepository
} from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

type AccommodationEditorTab =
  | 'general'
  | 'contracts'
  | 'reservations'
  | 'supplierConfirmations'
  | 'description'
  | 'seo'
  | 'files'
  | 'paymentSettings'
  | 'bookingFormData'
  | 'channelManager';

type ContractsSubTab = 'contracts' | 'supplierOffers' | 'companyOffers' | 'availability';

@Component({
  selector: 'app-accommodation-editor-window',
  imports: [CommonModule, ReactiveFormsModule, BusinessEntitySelectComponent],
  template: `
    <form class="acc-editor" [formGroup]="form" (ngSubmit)="save()">
      <nav class="acc-editor__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="acc-editor__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="acc-editor__body">
        <ng-container *ngIf="activeTab() === 'general'">
          <article class="lmx-card acc-editor__card">
            <div class="acc-editor__card-header">
              <h3 class="acc-editor__card-title">General</h3>
              <div class="acc-editor__card-links">
                <button type="button" class="acc-editor__link">
                  <span class="material-icons">add</span>
                  Add attribute
                </button>
                <button type="button" class="acc-editor__link">
                  <span class="material-icons">edit</span>
                  Edit attributes
                </button>
              </div>
            </div>

            <div class="acc-editor__form">
              <div class="acc-editor__row">
                <label class="acc-editor__label">Select type:</label>
                <select class="lmx-select" disabled>
                  <option>{{ typeLabel() }}</option>
                </select>
              </div>

              <div class="acc-editor__row" *ngIf="enableBusinessEntities">
                <label class="acc-editor__label">Business entities</label>
                <app-business-entity-select
                  [selected]="selectedBusinessEntities()"
                  (selectedChange)="selectedBusinessEntities.set($event)"
                />
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-destination">Select destination:</label>
                <select id="acc-destination" class="lmx-select" formControlName="destination">
                  <option value="">Please select</option>
                  <option *ngFor="let destination of destinationOptions()" [value]="destination">{{ destination }}</option>
                </select>
                <button type="button" class="lmx-icon-btn" aria-label="Add destination"><span class="material-icons">add</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-supplier">Select supplier:</label>
                <select id="acc-supplier" class="lmx-select" formControlName="supplier">
                  <option value="">Please select</option>
                  <option *ngFor="let supplier of supplierOptions()" [value]="supplier">{{ supplier }}</option>
                </select>
                <div class="acc-editor__row-actions">
                  <button type="button" class="lmx-icon-btn" aria-label="Add supplier"><span class="material-icons">add</span></button>
                  <button type="button" class="lmx-icon-btn" aria-label="Edit supplier"><span class="material-icons">edit</span></button>
                </div>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-department">Select department:</label>
                <select id="acc-department" class="lmx-select" formControlName="department">
                  <option value="">Please select</option>
                  <option *ngFor="let department of departmentOptions()" [value]="department">{{ department }}</option>
                </select>
                <button type="button" class="lmx-icon-btn" aria-label="Add department"><span class="material-icons">add</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label">Cash advance</label>
                <label class="lmx-checkbox">
                  <input type="checkbox" formControlName="cashAdvance" />
                </label>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-name">Name</label>
                <input id="acc-name" class="lmx-input" type="text" formControlName="name" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-booking-currency">Booking currency</label>
                <input id="acc-booking-currency" class="lmx-input" type="text" formControlName="bookingCurrency" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-contact-phone-reception">Contact phone reception</label>
                <input id="acc-contact-phone-reception" class="lmx-input" type="text" formControlName="contactPhoneReception" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-contact-email">Contact email</label>
                <input id="acc-contact-email" class="lmx-input" type="email" formControlName="contactEmail" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-webpage">Web page</label>
                <input id="acc-webpage" class="lmx-input" type="text" formControlName="webPage" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-contact-phone">Contact phone</label>
                <input id="acc-contact-phone" class="lmx-input" type="text" formControlName="contactPhone" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-contact-fax">Contact fax</label>
                <input id="acc-contact-fax" class="lmx-input" type="text" formControlName="contactFax" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-address">Address</label>
                <input id="acc-address" class="lmx-input" type="text" formControlName="address" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-stars">Number of stars</label>
                <input id="acc-stars" class="lmx-input acc-editor__input--tiny" type="text" formControlName="numberOfStars" />
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-search-priority">Search priority</label>
                <input id="acc-search-priority" class="lmx-input acc-editor__input--tiny" type="text" formControlName="searchPriority" />
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-infant-age">Infant age</label>
                <input id="acc-infant-age" class="lmx-input acc-editor__input--tiny" type="text" formControlName="infantAge" />
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-checkin">Check-in :</label>
                <input id="acc-checkin" class="lmx-input" type="text" formControlName="checkIn" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="acc-checkout">Check-out :</label>
                <input id="acc-checkout" class="lmx-input" type="text" formControlName="checkOut" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label">House rate allowed (services)</label>
                <label class="lmx-checkbox">
                  <input type="checkbox" formControlName="houseRateAllowed" />
                </label>
              </div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() === 'contracts'">
          <nav class="acc-editor__subtabs">
            <button
              type="button"
              *ngFor="let subTab of contractsSubTabs"
              class="acc-editor__subtab"
              [class.active]="activeContractsSubTab() === subTab.id"
              (click)="activeContractsSubTab.set(subTab.id)"
            >
              {{ subTab.label }}
            </button>
          </nav>

          <ng-container *ngIf="activeContractsSubTab() === 'contracts'">
            <div class="acc-editor__contracts-toolbar">
              <button type="button" class="lmx-btn lmx-btn--action" (click)="openContractEditor(null)">
                <span class="material-icons">add</span>
                New
              </button>
              <button type="button" class="lmx-btn lmx-btn--action-outline">
                Group actions
                <span class="material-icons caret">expand_more</span>
              </button>
            </div>

            <section class="lmx-card lmx-filter-card lmx-filter-card--compact">
              <label class="lmx-field">
                <span>Validity period between</span>
                <div class="acc-editor__date-pair">
                  <input type="date" class="lmx-input" [value]="todayIso" />
                  <input type="date" class="lmx-input" />
                </div>
              </label>
              <label class="lmx-field">
                <span>Status</span>
                <select class="lmx-select"><option>Please select</option></select>
              </label>
              <div class="lmx-field acc-editor__contracts-entities-field" *ngIf="enableBusinessEntities">
                <span>Business entity</span>
                <app-business-entity-select
                  [selected]="selectedContractBusinessEntities()"
                  (selectedChange)="selectedContractBusinessEntities.set($event)"
                />
              </div>
              <div class="lmx-filter-card__submit">
                <button type="button" class="lmx-btn lmx-btn--blue" (click)="applyContractsFilter()">Filter</button>
              </div>
            </section>

            <div class="ops-group-bar">Drag a column header and drop it here to group by that column</div>

            <section class="lmx-card lmx-grid-card">
              <div class="lmx-grid-scroll">
                <table class="lmx-data-grid">
                  <colgroup>
                    <col style="width: 36px" />
                    <col style="width: 80px" />
                    <col style="width: 260px" />
                    <col style="width: 140px" />
                    <col style="width: 150px" />
                    <col style="width: 150px" />
                    <col style="width: 90px" />
                    <col style="width: 90px" />
                    <col style="width: 100px" />
                    <col style="width: 130px" *ngIf="enableBusinessEntities" />
                    <col style="width: 130px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th><input type="checkbox" aria-label="Select all" /></th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Contract type</th>
                      <th>Validity start date</th>
                      <th>Validity end date</th>
                      <th>Min PS</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th *ngIf="enableBusinessEntities">Business entity</th>
                      <th class="lmx-grid-actions-head">
                        <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                          <span class="material-icons">filter_alt</span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of filteredContractRows()" (dblclick)="openContractEditor(row)">
                      <td><input type="checkbox" [attr.aria-label]="'Select ' + row.code" (click)="$event.stopPropagation()" /></td>
                      <td>{{ row.code }}</td>
                      <td>{{ row.name }}</td>
                      <td>{{ row.type }}</td>
                      <td>{{ row.validityStart }}</td>
                      <td>{{ row.validityEnd }}</td>
                      <td>{{ row.minPs }}</td>
                      <td>{{ row.priority }}</td>
                      <td><span class="acc-editor__status-active">{{ row.status }}</span></td>
                      <td *ngIf="enableBusinessEntities">{{ row.businessEntity }}</td>
                      <td>
                        <div class="lmx-row-actions">
                          <button
                            type="button"
                            class="lmx-icon-btn"
                            aria-label="Edit"
                            (click)="$event.stopPropagation(); openContractEditor(row)"
                          >
                            <span class="material-icons">edit</span>
                          </button>
                          <button type="button" class="lmx-icon-btn" aria-label="Delete" (click)="$event.stopPropagation()"><span class="material-icons">delete</span></button>
                          <button type="button" class="lmx-icon-btn" aria-label="Copy" (click)="$event.stopPropagation()"><span class="material-icons">content_copy</span></button>
                          <button type="button" class="lmx-icon-btn" aria-label="Void" (click)="$event.stopPropagation()"><span class="material-icons">close</span></button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="!filteredContractRows().length">
                      <td [attr.colspan]="enableBusinessEntities ? 10 : 9" class="acc-editor__contracts-empty">
                        No contracts match the current filter.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <footer class="acc-editor__pager">
                <a class="acc-editor__pager-tool">
                  <span class="material-icons">view_column</span>
                  Edit columns
                </a>
                <a class="acc-editor__pager-tool">
                  <span class="material-icons">save_alt</span>
                  Data export
                  <span class="material-icons">arrow_drop_down</span>
                </a>
                <span class="acc-editor__pager-spacer"></span>
                <span class="acc-editor__pager-group">
                  Go to page:
                  <input class="lmx-input acc-editor__pager-input" type="text" value="1" />
                  of 1
                  <a class="acc-editor__pager-tool">Go</a>
                </span>
                <span class="acc-editor__pager-group">
                  Page size:
                  <input class="lmx-input acc-editor__pager-input" type="text" value="1" />
                  <a class="acc-editor__pager-tool">Change</a>
                </span>
                <span class="acc-editor__pager-range">1-1 of 1</span>
                <button type="button" class="lmx-icon-btn" aria-label="Previous page" disabled>
                  <span class="material-icons">chevron_left</span>
                </button>
                <button type="button" class="lmx-icon-btn" aria-label="Next page" disabled>
                  <span class="material-icons">chevron_right</span>
                </button>
              </footer>
            </section>
          </ng-container>

          <ng-container *ngIf="activeContractsSubTab() !== 'contracts'">
            <article class="lmx-card acc-editor__card">
              <h3 class="acc-editor__card-title">{{ contractsSubTabLabel(activeContractsSubTab()) }}</h3>
              <p class="acc-editor__placeholder">This section is scaffolded for the prototype.</p>
            </article>
          </ng-container>
        </ng-container>

        <ng-container *ngIf="activeTab() !== 'general' && activeTab() !== 'contracts'">
          <article class="lmx-card acc-editor__card">
            <h3 class="acc-editor__card-title">{{ tabLabel(activeTab()) }}</h3>
            <p class="acc-editor__placeholder">This section is scaffolded for the prototype.</p>
          </article>
        </ng-container>
      </div>

      <footer class="acc-editor__footer">
        <span class="acc-editor__spacer"></span>
        <button type="submit" class="lmx-btn lmx-btn--action">OK</button>
      </footer>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .acc-editor {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .acc-editor__tabs {
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

      .acc-editor__tab {
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

      .acc-editor__tab:hover {
        color: var(--lemax-text);
      }

      .acc-editor__tab.active {
        color: var(--lemax-blue);
      }

      .acc-editor__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .acc-editor__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 16px 24px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .acc-editor__card {
        padding: 16px 20px 20px;
      }

      .acc-editor__card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .acc-editor__card-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .acc-editor__card-links {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .acc-editor__link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: transparent;
        border: 0;
        padding: 0;
        color: var(--lemax-blue);
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }

      .acc-editor__link .material-icons {
        font-size: 16px;
      }

      .acc-editor__link:hover {
        color: var(--lemax-blue-dark);
        text-decoration: underline;
      }

      .acc-editor__form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 640px;
      }

      .acc-editor__row {
        display: grid;
        grid-template-columns: 180px 230px auto;
        align-items: center;
        column-gap: 10px;
        min-height: 30px;
      }

      .acc-editor__row-actions {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .acc-editor__label {
        font-size: 12px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .acc-editor__row .lmx-input,
      .acc-editor__row .lmx-select,
      .acc-editor__row app-business-entity-select {
        width: 100%;
        min-width: 0;
      }

      .acc-editor__input--tiny {
        width: 80px !important;
      }

      .acc-editor__placeholder {
        margin: 0;
        color: var(--lemax-muted);
      }

      .acc-editor__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .acc-editor__spacer {
        flex: 1;
      }

      .acc-editor__subtabs {
        display: flex;
        gap: 24px;
        padding: 2px 4px 12px;
        border-bottom: 1px solid var(--lemax-border-soft);
        margin-bottom: 4px;
      }

      .acc-editor__subtab {
        background: transparent;
        border: 0;
        border-bottom: 2px solid transparent;
        padding: 0 0 8px;
        font: inherit;
        font-size: 13px;
        color: var(--lemax-muted);
        cursor: pointer;
      }

      .acc-editor__subtab:hover {
        color: var(--lemax-text);
      }

      .acc-editor__subtab.active {
        color: var(--lemax-blue);
        border-bottom-color: var(--lemax-blue);
      }

      .acc-editor__contracts-toolbar {
        display: flex;
        gap: 8px;
      }

      .acc-editor__contracts-toolbar .caret {
        font-size: 16px;
      }

      .acc-editor__date-pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .acc-editor__date-pair .lmx-input {
        width: 100%;
        min-width: 0;
      }

      .acc-editor__status-active {
        color: var(--status-option-fg);
        font-weight: 500;
      }

      .acc-editor__pager {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 8px 14px;
        border-top: 1px solid var(--lemax-border-soft);
        background: #fff;
        color: var(--lemax-text);
        font-size: 12px;
        flex-wrap: wrap;
      }

      .acc-editor__pager-tool {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--lemax-blue);
        cursor: pointer;
        white-space: nowrap;
      }

      .acc-editor__pager-tool:hover {
        text-decoration: underline;
      }

      .acc-editor__pager-tool .material-icons {
        font-size: 18px;
      }

      .acc-editor__pager-spacer {
        flex: 1;
      }

      .acc-editor__pager-group {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      }

      .acc-editor__pager-input {
        width: 44px;
        height: 26px;
        padding: 0 6px;
        text-align: center;
      }

      .acc-editor__pager-range {
        color: var(--lemax-muted);
        white-space: nowrap;
      }

      .acc-editor__contracts-entities-field {
        position: relative;
      }

      .acc-editor__contracts-empty {
        padding: 24px;
        text-align: center;
        color: var(--lemax-muted);
      }
    `
  ]
})
export class AccommodationEditorWindowComponent implements OnChanges {
  @Input({ required: true }) accommodationCode = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly enableBusinessEntities = PROTOTYPE_CONFIG.enableBusinessEntities;
  protected readonly activeTab = signal<AccommodationEditorTab>('general');
  protected readonly activeContractsSubTab = signal<ContractsSubTab>('contracts');
  protected readonly currentAccommodation = signal<PrototypeAccommodation | null>(null);
  protected readonly selectedBusinessEntities = signal<string[]>([]);

  protected readonly tabs: { id: AccommodationEditorTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'supplierConfirmations', label: 'Supplier confirmations' },
    { id: 'description', label: 'Description' },
    { id: 'seo', label: 'SEO' },
    { id: 'files', label: 'Files' },
    { id: 'paymentSettings', label: 'Payment settings' },
    { id: 'bookingFormData', label: 'Booking form data' },
    { id: 'channelManager', label: 'Channel manager' }
  ];

  protected readonly contractsSubTabs: { id: ContractsSubTab; label: string }[] = [
    { id: 'contracts', label: 'Contracts' },
    { id: 'supplierOffers', label: 'Supplier special offers' },
    { id: 'companyOffers', label: 'Company special offers' },
    { id: 'availability', label: 'Availability' }
  ];

  protected readonly contractsForAccommodation = computed(() => {
    const code = this.currentAccommodation()?.code;
    return code ? this.prototypeData.getContractsForAccommodation(code) : [];
  });
  protected readonly selectedContractBusinessEntities = signal<string[]>([CURRENT_USER_BUSINESS_ENTITY]);
  protected readonly appliedContractBusinessEntities = signal<string[]>([CURRENT_USER_BUSINESS_ENTITY]);
  protected readonly todayIso = new Date().toISOString().slice(0, 10);

  protected readonly filteredContractRows = computed(() => {
    const selected = this.appliedContractBusinessEntities();
    const rows = this.contractsForAccommodation();
    if (selected.length === 0) {
      return rows;
    }
    return rows.filter((row) => selected.includes(row.businessEntity));
  });

  protected applyContractsFilter(): void {
    this.appliedContractBusinessEntities.set(this.selectedContractBusinessEntities());
  }

  protected readonly typeLabel = computed(() => this.currentAccommodation()?.type || 'Hotel');

  protected readonly destinationOptions = computed(() =>
    this.uniqueValues((row) => row.destination)
  );
  protected readonly supplierOptions = computed(() => this.uniqueValues((row) => row.supplier));
  protected readonly departmentOptions = computed(() => this.uniqueValues((row) => row.department));

  protected readonly form = this.formBuilder.nonNullable.group({
    destination: '',
    supplier: '',
    department: '',
    cashAdvance: false,
    name: '',
    bookingCurrency: '',
    contactPhoneReception: '',
    contactEmail: '',
    webPage: '',
    contactPhone: '',
    contactFax: '',
    address: '',
    numberOfStars: '',
    searchPriority: '',
    infantAge: '',
    checkIn: '',
    checkOut: '',
    houseRateAllowed: false
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accommodationCode']) {
      this.loadAccommodation();
    }
  }

  protected tabLabel(id: AccommodationEditorTab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected contractsSubTabLabel(id: ContractsSubTab): string {
    return this.contractsSubTabs.find((subTab) => subTab.id === id)?.label ?? '';
  }

  protected openContractEditor(contract: PrototypeContract | null): void {
    const entityId = `${this.accommodationCode}:${contract ? contract.code : 'new'}`;
    const title = contract
      ? `${contract.name} (${contract.validityStart} - ${contract.validityEnd}, ${contract.type}, Min ps=${contract.minPs})`
      : 'New contract';
    this.windowManager.open('prototype-contract', entityId, title, 'edit');
  }

  protected save(): void {
    const existing = this.currentAccommodation();
    const value = this.form.getRawValue();

    if (!existing) {
      const created: PrototypeAccommodation = {
        code: this.prototypeData.generateAccommodationCode(),
        country: '',
        region: '',
        internalName: '',
        businessEntities: this.selectedBusinessEntities(),
        ...value
      };

      this.prototypeData.createAccommodation(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypeAccommodation = {
      ...existing,
      ...value,
      businessEntities: this.selectedBusinessEntities()
    };

    this.prototypeData.saveAccommodation(updated);
    this.windowManager.close(this.windowId);
  }

  private uniqueValues(pick: (row: PrototypeAccommodation) => string): string[] {
    return Array.from(new Set(this.prototypeData.accommodations().map(pick).filter(Boolean))).sort();
  }

  private loadAccommodation(): void {
    if (this.accommodationCode === 'new') {
      this.currentAccommodation.set(null);
      this.selectedBusinessEntities.set([]);
      this.selectedContractBusinessEntities.set([CURRENT_USER_BUSINESS_ENTITY]);
      this.appliedContractBusinessEntities.set([CURRENT_USER_BUSINESS_ENTITY]);
      this.form.reset();
      return;
    }

    const accommodation = this.prototypeData.getAccommodationByCode(this.accommodationCode);
    if (!accommodation) {
      return;
    }

    this.currentAccommodation.set(accommodation);
    this.selectedBusinessEntities.set(accommodation.businessEntities ?? []);
    this.selectedContractBusinessEntities.set([CURRENT_USER_BUSINESS_ENTITY]);
    this.appliedContractBusinessEntities.set([CURRENT_USER_BUSINESS_ENTITY]);
    this.form.reset({
      destination: accommodation.destination ?? '',
      supplier: accommodation.supplier ?? '',
      department: accommodation.department ?? '',
      cashAdvance: accommodation.cashAdvance ?? false,
      name: accommodation.name ?? '',
      bookingCurrency: accommodation.bookingCurrency ?? '',
      contactPhoneReception: accommodation.contactPhoneReception ?? '',
      contactEmail: accommodation.contactEmail ?? '',
      webPage: accommodation.webPage ?? '',
      contactPhone: accommodation.contactPhone ?? '',
      contactFax: accommodation.contactFax ?? '',
      address: accommodation.address ?? '',
      numberOfStars: accommodation.numberOfStars ?? '',
      searchPriority: accommodation.searchPriority ?? '',
      infantAge: accommodation.infantAge ?? '',
      checkIn: accommodation.checkIn ?? '',
      checkOut: accommodation.checkOut ?? '',
      houseRateAllowed: accommodation.houseRateAllowed ?? false
    });
  }
}
