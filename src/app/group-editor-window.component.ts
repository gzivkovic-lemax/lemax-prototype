import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  CURRENT_USER_BUSINESS_ENTITY,
  PrototypeAccommodation,
  PrototypeDataRepository,
  PrototypeSubgroup
} from './prototype-data-repository.service';
import { toDateInputValue } from './date-utils';
import { WindowManagerService } from './window-manager.service';

type GroupEditorTab =
  | 'general'
  | 'subgroups'
  | 'availability'
  | 'reservations'
  | 'supplierInvoice'
  | 'seo'
  | 'description'
  | 'servicesUsage'
  | 'paymentSettings'
  | 'operationsReport'
  | 'offer'
  | 'files'
  | 'cancellationPolicy'
  | 'specialOffers';

@Component({
  selector: 'app-group-editor-window',
  imports: [CommonModule, ReactiveFormsModule],
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
                <label class="acc-editor__label" for="grp-destination">Select destination:</label>
                <select id="grp-destination" class="lmx-select" formControlName="destination">
                  <option value="">Please select</option>
                  <option *ngFor="let destination of destinationOptions()" [value]="destination">{{ destination }}</option>
                </select>
                <button type="button" class="lmx-icon-btn" aria-label="Add destination"><span class="material-icons">add</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-department">Select department:</label>
                <select id="grp-department" class="lmx-select" formControlName="department">
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
                <label class="acc-editor__label" for="grp-name">Name</label>
                <input id="grp-name" class="lmx-input" type="text" formControlName="name" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-booking-currency">Booking currency</label>
                <input id="grp-booking-currency" class="lmx-input" type="text" formControlName="bookingCurrency" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-contact-phone-reception">Contact phone reception</label>
                <input id="grp-contact-phone-reception" class="lmx-input" type="text" formControlName="contactPhoneReception" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-contact-email">Contact email</label>
                <input id="grp-contact-email" class="lmx-input" type="email" formControlName="contactEmail" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-webpage">Web page</label>
                <input id="grp-webpage" class="lmx-input" type="text" formControlName="webPage" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-contact-phone">Contact phone</label>
                <input id="grp-contact-phone" class="lmx-input" type="text" formControlName="contactPhone" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-contact-fax">Contact fax</label>
                <input id="grp-contact-fax" class="lmx-input" type="text" formControlName="contactFax" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-address">Address</label>
                <input id="grp-address" class="lmx-input" type="text" formControlName="address" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-search-priority">Search priority</label>
                <input id="grp-search-priority" class="lmx-input acc-editor__input--tiny" type="text" formControlName="searchPriority" />
              </div>

              <div class="acc-editor__row">
                <label class="acc-editor__label" for="grp-infant-age">Infant age</label>
                <input id="grp-infant-age" class="lmx-input acc-editor__input--tiny" type="text" formControlName="infantAge" />
              </div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() === 'subgroups'">
          <div class="acc-editor__contracts-toolbar">
            <button type="button" class="lmx-btn lmx-btn--action" (click)="openSubgroupEditor(null)">
              <span class="material-icons">add</span>
              New
            </button>
            <button type="button" class="lmx-btn lmx-btn--action-outline">
              <span class="material-icons">add</span>
              Prepare for operations
            </button>
          </div>

          <section class="lmx-card lmx-filter-card lmx-filter-card--compact">
            <label class="lmx-field">
              <span>Subgroup starts between</span>
              <div class="acc-editor__date-pair">
                <input
                  type="date"
                  class="lmx-input"
                  [value]="startsFrom()"
                  (change)="startsFrom.set($any($event.target).value)"
                />
                <input
                  type="date"
                  class="lmx-input"
                  [value]="startsTo()"
                  (change)="startsTo.set($any($event.target).value)"
                />
              </div>
            </label>
            <label class="lmx-field">
              <span>Group subgroups</span>
              <label class="lmx-checkbox">
                <input type="checkbox" />
              </label>
            </label>
            <label class="lmx-field">
              <span>Prepared for operations</span>
              <select
                class="lmx-select"
                [value]="preparedFilter()"
                (change)="preparedFilter.set($any($event.target).value)"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <div class="lmx-filter-card__submit">
              <button type="button" class="lmx-btn lmx-btn--blue" (click)="applySubgroupFilter()">Filter</button>
            </div>
          </section>

          <section class="lmx-card lmx-grid-card">
            <div class="lmx-grid-scroll">
              <table class="lmx-data-grid">
                <colgroup>
                  <col style="width: 36px" />
                  <col style="width: 140px" />
                  <col style="width: 110px" />
                  <col style="width: 400px" />
                  <col style="width: 380px" />
                  <col style="width: 90px" />
                  <col style="width: 260px" />
                  <col style="width: 130px" />
                </colgroup>
                <thead>
                  <tr>
                    <th><input type="checkbox" aria-label="Select all" /></th>
                    <th>Subgroup ID</th>
                    <th>Code</th>
                    <th>
                      Subgroup name
                      <span class="material-icons acc-editor__sort-icon">arrow_downward</span>
                    </th>
                    <th>Period</th>
                    <th>Pax</th>
                    <th>Prepared for operations</th>
                    <th class="lmx-grid-actions-head">
                      <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                        <span class="material-icons">filter_alt</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of filteredSubgroups()" (dblclick)="openSubgroupEditor(row)">
                    <td><input type="checkbox" [attr.aria-label]="'Select ' + row.id" (click)="$event.stopPropagation()" /></td>
                    <td>{{ row.id }}</td>
                    <td>{{ row.code }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.periodStart }} - {{ row.periodEnd }}</td>
                    <td>{{ row.pax }}</td>
                    <td>{{ row.preparedForOperations ? 'Yes' : 'No' }}</td>
                    <td>
                      <div class="lmx-row-actions">
                        <button
                          type="button"
                          class="lmx-icon-btn"
                          aria-label="Edit"
                          (click)="$event.stopPropagation(); openSubgroupEditor(row)"
                        >
                          <span class="material-icons">edit</span>
                        </button>
                        <button type="button" class="lmx-icon-btn" aria-label="Delete" (click)="$event.stopPropagation()"><span class="material-icons">delete</span></button>
                        <button type="button" class="lmx-icon-btn" aria-label="Unlink" (click)="$event.stopPropagation()"><span class="material-icons">link_off</span></button>
                        <button type="button" class="lmx-icon-btn" aria-label="Copy" (click)="$event.stopPropagation()"><span class="material-icons">content_copy</span></button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="!filteredSubgroups().length">
                    <td colspan="8" class="acc-editor__contracts-empty">
                      No subgroups match the current filter.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <footer class="lmx-pager">
              <a class="lmx-pager__tool">
                <span class="material-icons">view_column</span>
                Edit columns
              </a>
              <a class="lmx-pager__tool">
                <span class="material-icons">save_alt</span>
                Data export
                <span class="material-icons">arrow_drop_down</span>
              </a>
              <span class="lmx-pager__spacer"></span>
              <span class="lmx-pager__group">
                Go to page:
                <input class="lmx-input lmx-pager__input" type="text" value="1" />
                of 1
                <a class="lmx-pager__tool">Go</a>
              </span>
              <span class="lmx-pager__group">
                Page size:
                <input class="lmx-input lmx-pager__input" type="text" [value]="filteredSubgroups().length || 1" />
                <a class="lmx-pager__tool">Change</a>
              </span>
              <span class="lmx-pager__range">{{ pagerRange() }}</span>
              <button type="button" class="lmx-icon-btn" aria-label="Previous page" disabled>
                <span class="material-icons">chevron_left</span>
              </button>
              <button type="button" class="lmx-icon-btn" aria-label="Next page" disabled>
                <span class="material-icons">chevron_right</span>
              </button>
            </footer>
          </section>

          <section class="lmx-card lmx-totals">
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Total selling</span>
              <span class="lmx-totals__value">{{ formatAmount(totals().selling) }}</span>
            </div>
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Total net</span>
              <span class="lmx-totals__value">{{ formatAmount(totals().net) }}</span>
            </div>
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Profit</span>
              <span class="lmx-totals__value">{{ formatAmount(totals().profit) }}</span>
            </div>
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Paid</span>
              <span class="lmx-totals__value">{{ formatAmount(totals().paid) }}</span>
            </div>
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Remaining</span>
              <span class="lmx-totals__value">{{ formatAmount(totals().remaining) }}</span>
            </div>
            <div class="lmx-totals__item">
              <span class="lmx-totals__label">Currency</span>
              <select class="lmx-select acc-editor__currency-select">
                <option>EUR</option>
              </select>
            </div>
          </section>
        </ng-container>

        <ng-container *ngIf="activeTab() !== 'general' && activeTab() !== 'subgroups'">
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

      .acc-editor__label {
        font-size: 12px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .acc-editor__row .lmx-input,
      .acc-editor__row .lmx-select {
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

      .acc-editor__contracts-toolbar {
        display: flex;
        gap: 8px;
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

      .acc-editor__sort-icon {
        font-size: 14px;
        vertical-align: middle;
        color: var(--lemax-muted);
      }

      .acc-editor__contracts-empty {
        padding: 24px;
        text-align: center;
        color: var(--lemax-muted);
      }

      .acc-editor__currency-select {
        width: 120px;
      }
    `
  ]
})
export class GroupEditorWindowComponent implements OnChanges {
  @Input({ required: true }) groupCode = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly activeTab = signal<GroupEditorTab>('general');
  protected readonly currentGroup = signal<PrototypeAccommodation | null>(null);

  protected readonly tabs: { id: GroupEditorTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'subgroups', label: 'Subgroups' },
    { id: 'availability', label: 'Availability' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'supplierInvoice', label: 'Supplier invoice' },
    { id: 'seo', label: 'SEO' },
    { id: 'description', label: 'Description' },
    { id: 'servicesUsage', label: 'Services usage' },
    { id: 'paymentSettings', label: 'Payment settings' },
    { id: 'operationsReport', label: 'Operations report' },
    { id: 'offer', label: 'Offer' },
    { id: 'files', label: 'Files' },
    { id: 'cancellationPolicy', label: 'Cancellation policy' },
    { id: 'specialOffers', label: 'Special offers' }
  ];

  protected readonly destinationOptions = computed(() => this.uniqueValues((row) => row.destination));
  protected readonly departmentOptions = computed(() => this.uniqueValues((row) => row.department));

  protected readonly startsFrom = signal('');
  protected readonly startsTo = signal('');
  protected readonly preparedFilter = signal('all');
  private readonly appliedFilter = signal({ from: '', to: '', prepared: 'all' });

  private readonly subgroupsForGroup = computed(() => {
    const code = this.currentGroup()?.code;
    return code ? this.prototypeData.getSubgroupsForGroup(code) : [];
  });

  protected readonly filteredSubgroups = computed(() => {
    const { from, to, prepared } = this.appliedFilter();
    return this.subgroupsForGroup().filter((row) => {
      if (prepared !== 'all' && row.preparedForOperations !== (prepared === 'yes')) {
        return false;
      }
      const start = toDateInputValue(row.periodStart);
      if (from && start < from) return false;
      if (to && start > to) return false;
      return true;
    });
  });

  protected readonly totals = computed(() => {
    const rows = this.filteredSubgroups();
    const selling = rows.reduce((sum, row) => sum + row.totalSelling, 0);
    const net = rows.reduce((sum, row) => sum + row.totalNet, 0);
    const paid = rows.reduce((sum, row) => sum + row.paid, 0);
    return { selling, net, paid, profit: selling - net, remaining: selling - paid };
  });

  protected readonly pagerRange = computed(() => {
    const count = this.filteredSubgroups().length;
    return count ? `1-${count} of ${count}` : '0-0 of 0';
  });

  protected readonly form = this.formBuilder.nonNullable.group({
    destination: '',
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
    searchPriority: '',
    infantAge: ''
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupCode']) {
      this.loadGroup();
    }
  }

  protected tabLabel(id: GroupEditorTab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected applySubgroupFilter(): void {
    this.appliedFilter.set({
      from: this.startsFrom(),
      to: this.startsTo(),
      prepared: this.preparedFilter()
    });
  }

  protected formatAmount(value: number): string {
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
  }

  protected openSubgroupEditor(subgroup: PrototypeSubgroup | null): void {
    const groupName = this.currentGroup()?.name ?? 'New group';
    const entityId = `${this.groupCode}:${subgroup ? subgroup.id : 'new'}`;
    const title = subgroup
      ? `${groupName} - ${subgroup.name} - Subgroup: (${subgroup.periodStart} - ${subgroup.periodEnd})`
      : `${groupName} - New subgroup`;
    this.windowManager.open('prototype-subgroup', entityId, title, 'edit');
  }

  protected save(): void {
    const existing = this.currentGroup();
    const value = this.form.getRawValue();

    if (!existing) {
      const created: PrototypeAccommodation = {
        code: this.prototypeData.generateAccommodationCode(),
        country: '',
        region: '',
        supplier: '',
        internalName: '',
        type: 'Groups',
        businessEntities: [CURRENT_USER_BUSINESS_ENTITY],
        ...value
      };

      this.prototypeData.createAccommodation(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypeAccommodation = {
      ...existing,
      ...value
    };

    this.prototypeData.saveAccommodation(updated);
    this.windowManager.close(this.windowId);
  }

  private uniqueValues(pick: (row: PrototypeAccommodation) => string): string[] {
    return Array.from(new Set(this.prototypeData.groupProducts().map(pick).filter(Boolean))).sort();
  }

  private loadGroup(): void {
    if (this.groupCode === 'new') {
      this.currentGroup.set(null);
      this.form.reset();
      return;
    }

    const group = this.prototypeData.getAccommodationByCode(this.groupCode);
    if (!group) {
      return;
    }

    this.currentGroup.set(group);
    this.form.reset({
      destination: group.destination ?? '',
      department: group.department ?? '',
      cashAdvance: group.cashAdvance ?? false,
      name: group.name ?? '',
      bookingCurrency: group.bookingCurrency ?? '',
      contactPhoneReception: group.contactPhoneReception ?? '',
      contactEmail: group.contactEmail ?? '',
      webPage: group.webPage ?? '',
      contactPhone: group.contactPhone ?? '',
      contactFax: group.contactFax ?? '',
      address: group.address ?? '',
      searchPriority: group.searchPriority ?? '',
      infantAge: group.infantAge ?? ''
    });
  }
}
