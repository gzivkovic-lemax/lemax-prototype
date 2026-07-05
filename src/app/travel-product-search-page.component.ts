import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessEntitySelectComponent } from './business-entity-select.component';
import { PROTOTYPE_CONFIG } from './prototype-config';
import { CURRENT_USER_BUSINESS_ENTITY, PrototypeAccommodation, PrototypeDataRepository } from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

type ProductSearchTab =
  | 'villas'
  | 'hotel'
  | 'tour'
  | 'excursion'
  | 'activities'
  | 'transfer'
  | 'flight'
  | 'guide'
  | 'direct-flight-booking';

const TABS: { id: ProductSearchTab; label: string }[] = [
  { id: 'villas', label: 'Villas' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'tour', label: 'Tour' },
  { id: 'excursion', label: 'Excursion' },
  { id: 'activities', label: 'Activities' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'flight', label: 'Flight' },
  { id: 'guide', label: 'Guide' },
  { id: 'direct-flight-booking', label: 'Direct flight booking' }
];

@Component({
  selector: 'app-travel-product-search-page',
  imports: [CommonModule, FormsModule, BusinessEntitySelectComponent],
  template: `
    <div class="tps">
      <nav class="tps__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="tps__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
        <div class="tps__tabs-spacer"></div>
        <div class="tps__cart">
          <span class="material-icons">shopping_cart</span>
          0 item 0.00 GBP
        </div>
        <button type="button" class="tps__map-link">
          <span class="material-icons">map</span>
          Map view
        </button>
      </nav>

      <div class="tps__body">
        <aside class="tps__sidebar">
          <h3 class="tps__sidebar-title">Search parameters</h3>

          <label class="tps__field">
            <span>Type</span>
            <select class="lmx-select">
              <option>Doesn't matter</option>
              <option *ngFor="let tab of tabs">{{ tab.label }}</option>
            </select>
          </label>

          <label class="tps__field">
            <span>Select subtype</span>
            <select class="lmx-select"><option>Please select</option></select>
          </label>

          <label class="tps__field">
            <span>Customer</span>
            <div class="tps__field-row">
              <input class="lmx-input" type="text" placeholder="Start typing a name" [(ngModel)]="customer" name="customer" />
              <button type="button" class="lmx-icon-btn" aria-label="Add customer"><span class="material-icons">add</span></button>
              <button type="button" class="lmx-icon-btn" aria-label="Edit customer"><span class="material-icons">edit</span></button>
            </div>
          </label>

          <label class="tps__field">
            <span>Name</span>
            <input class="lmx-input" type="text" [(ngModel)]="nameInput" name="name" (keydown.enter)="search()" />
          </label>

          <label class="tps__field">
            <span>Destination</span>
            <input
              class="lmx-input"
              type="text"
              placeholder="Start typing a name"
              [(ngModel)]="destinationInput"
              name="destination"
              (keydown.enter)="search()"
            />
          </label>

          <label class="tps__field">
            <span>Beginning of holiday</span>
            <input class="lmx-input" type="date" [(ngModel)]="beginningOfHoliday" name="beginningOfHoliday" />
          </label>

          <label class="tps__field">
            <span>End of holiday</span>
            <input class="lmx-input" type="date" [(ngModel)]="endOfHoliday" name="endOfHoliday" />
          </label>

          <div class="tps__field-pair">
            <label class="tps__field">
              <span>Adults</span>
              <input class="lmx-input" type="number" min="1" [(ngModel)]="adults" name="adults" />
            </label>
            <label class="tps__field">
              <span>Children</span>
              <select class="lmx-select" [(ngModel)]="children" name="children">
                <option [ngValue]="0">0</option>
                <option [ngValue]="1">1</option>
                <option [ngValue]="2">2</option>
                <option [ngValue]="3">3</option>
                <option [ngValue]="4">4</option>
              </select>
            </label>
          </div>

          <label class="tps__field">
            <span>Alternative to the hotel</span>
            <input class="lmx-input" type="text" [(ngModel)]="alternativeHotel" name="alternativeHotel" />
          </label>

          <label class="tps__field">
            <span>Alternative FIT tour</span>
            <input class="lmx-input" type="text" [(ngModel)]="alternativeTour" name="alternativeTour" />
          </label>

          <label class="tps__field">
            <span>Category</span>
            <select class="lmx-select"><option>Please select</option></select>
          </label>

          <div class="tps__field" *ngIf="enableBusinessEntities">
            <span>Business entities</span>
            <app-business-entity-select
              [selected]="selectedBusinessEntities()"
              (selectedChange)="selectedBusinessEntities.set($event)"
            />
          </div>

          <div class="tps__radios">
            <label class="tps__radio">
              <input type="radio" name="fallsUnder" [checked]="fallsUnderAll()" (change)="fallsUnderAll.set(true)" />
              Falls under all selected
            </label>
            <label class="tps__radio">
              <input type="radio" name="fallsUnder" [checked]="!fallsUnderAll()" (change)="fallsUnderAll.set(false)" />
              Falls under at least one
            </label>
          </div>

          <div class="tps__actions">
            <button type="button" class="lmx-btn lmx-btn--ghost">-1 day</button>
            <button type="button" class="lmx-btn lmx-btn--blue" (click)="search()">Search</button>
            <button type="button" class="lmx-btn lmx-btn--ghost">+1 day</button>
          </div>
        </aside>

        <section class="tps__results">
          <div class="lmx-grid-scroll" *ngIf="activeTab() === 'hotel'; else noResultsTab">
            <table class="lmx-data-grid tps__grid">
              <colgroup>
                <col style="width: 260px" />
                <col style="width: 140px" />
                <col style="width: 130px" />
                <col style="width: 140px" />
                <col style="width: 160px" />
                <col style="width: 90px" />
                <col style="width: 100px" />
                <col style="width: 320px" />
                <col style="width: 150px" />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Internal name</th>
                  <th>Destination</th>
                  <th>Service name</th>
                  <th>Supplier</th>
                  <th>Capacity</th>
                  <th>Units</th>
                  <th>Description</th>
                  <th>Price - total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of results()">
                  <td>
                    <div class="tps__name-cell">
                      <div class="tps__thumb"><span class="material-icons">image</span></div>
                      <div>
                        <button type="button" class="lmx-grid-link tps__name-link">{{ row.name }}</button>
                        <div class="tps__stars">
                          <span class="material-icons" *ngFor="let star of stars(row)">star</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ row.internalName }}</td>
                  <td>{{ row.destination }}</td>
                  <td>{{ row.serviceName }}</td>
                  <td>{{ row.supplier }}</td>
                  <td>{{ row.capacity }}</td>
                  <td>{{ row.units }}</td>
                  <td>{{ row.description }}</td>
                  <td>
                    <div class="tps__price-cell">
                      <span class="tps__price">{{ row.priceTotal | number: '1.2-2' }} {{ row.currency }}</span>
                      <div class="tps__price-actions">
                        <button type="button" class="lmx-btn lmx-btn--action tps__book-btn">Book</button>
                        <button type="button" class="lmx-icon-btn" aria-label="Add to cart"><span class="material-icons">shopping_cart</span></button>
                        <button
                          type="button"
                          class="lmx-icon-btn"
                          aria-label="Edit"
                          (click)="openEditor(row)"
                        >
                          <span class="material-icons">edit</span>
                        </button>
                        <button type="button" class="lmx-icon-btn" aria-label="View"><span class="material-icons">visibility</span></button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="results().length === 0">
                  <td colspan="9" class="tps__empty">No products match this search.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noResultsTab>
            <div class="tps__empty tps__empty--tab">
              Product search for this category isn't wired up in this prototype yet — try the Hotel tab.
            </div>
          </ng-template>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .tps {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 56px);
        background: var(--lemax-bg);
      }

      .tps__tabs {
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

      .tps__tab {
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

      .tps__tab:hover {
        color: var(--lemax-text);
      }

      .tps__tab.active {
        color: var(--lemax-blue);
      }

      .tps__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .tps__tabs-spacer {
        flex: 1;
      }

      .tps__cart {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--lemax-blue);
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }

      .tps__cart .material-icons {
        font-size: 16px;
      }

      .tps__map-link {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: 16px;
        border: 0;
        background: transparent;
        color: var(--lemax-blue);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
      }

      .tps__map-link .material-icons {
        font-size: 16px;
      }

      .tps__body {
        flex: 1;
        display: flex;
        align-items: stretch;
      }

      .tps__sidebar {
        width: 260px;
        flex-shrink: 0;
        padding: 16px;
        border-right: 1px solid var(--lemax-border-soft);
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .tps__sidebar-title {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .tps__field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: var(--lemax-muted);
      }

      .tps__field .lmx-input,
      .tps__field .lmx-select {
        width: 100%;
      }

      .tps__field-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tps__field-pair {
        display: flex;
        gap: 10px;
      }

      .tps__field-pair .tps__field {
        flex: 1;
      }

      .tps__radios {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;
        color: var(--lemax-text);
      }

      .tps__radio {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .tps__actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }

      .tps__actions .lmx-btn--blue {
        flex: 1;
      }

      .tps__results {
        flex: 1;
        min-width: 0;
        padding: 12px;
      }

      .tps__grid {
        min-width: 1400px;
      }

      .tps__name-cell {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .tps__thumb {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        border-radius: 4px;
        background: var(--lemax-header-row);
        display: grid;
        place-items: center;
        color: var(--lemax-muted);
      }

      .tps__thumb .material-icons {
        font-size: 18px;
      }

      .tps__name-link {
        font-weight: 600;
      }

      .tps__stars {
        display: flex;
        color: #f5a623;
      }

      .tps__stars .material-icons {
        font-size: 12px;
      }

      .tps__price-cell {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      .tps__price {
        font-weight: 600;
        color: var(--lemax-text);
        white-space: nowrap;
      }

      .tps__price-actions {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .tps__book-btn {
        height: 24px;
        padding: 0 10px;
        font-size: 11px;
      }

      .tps__empty {
        padding: 24px;
        text-align: center;
        color: var(--lemax-muted);
      }

      .tps__empty--tab {
        margin: 24px;
      }
    `
  ]
})
export class TravelProductSearchPageComponent {
  private readonly repository = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly tabs = TABS;
  protected readonly activeTab = signal<ProductSearchTab>('hotel');

  protected customer = '';
  protected nameInput = '';
  protected destinationInput = '';
  protected beginningOfHoliday = '';
  protected endOfHoliday = '';
  protected adults = 2;
  protected children = 0;
  protected alternativeHotel = '';
  protected alternativeTour = '';

  protected readonly fallsUnderAll = signal(true);
  protected readonly enableBusinessEntities = PROTOTYPE_CONFIG.enableBusinessEntities;
  protected readonly selectedBusinessEntities = signal<string[]>([CURRENT_USER_BUSINESS_ENTITY]);
  protected readonly appliedFilters = signal({
    name: '',
    destination: '',
    businessEntities: [CURRENT_USER_BUSINESS_ENTITY] as string[]
  });

  protected readonly results = computed(() => {
    const { name, destination, businessEntities } = this.appliedFilters();
    return this.repository.accommodations().filter((row) => {
      const matchesName = !name || row.name.toLowerCase().includes(name);
      const matchesDestination = !destination || row.destination.toLowerCase().includes(destination);
      const matchesBusinessEntity =
        !this.enableBusinessEntities ||
        businessEntities.length === 0 ||
        (row.businessEntities ?? []).some((entity) => businessEntities.includes(entity));
      return matchesName && matchesDestination && matchesBusinessEntity;
    });
  });

  protected search(): void {
    this.appliedFilters.set({
      name: this.nameInput.trim().toLowerCase(),
      destination: this.destinationInput.trim().toLowerCase(),
      businessEntities: this.selectedBusinessEntities()
    });
  }

  protected stars(row: PrototypeAccommodation): number[] {
    const count = Number.parseInt(row.numberOfStars ?? '0', 10);
    return Array.from({ length: Number.isFinite(count) ? count : 0 });
  }

  protected openEditor(row: PrototypeAccommodation): void {
    const title = row.destination ? `${row.name} (${row.destination})` : row.name;
    this.windowManager.open('prototype-accommodation', row.code, title, 'edit');
  }
}
