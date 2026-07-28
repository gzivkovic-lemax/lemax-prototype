import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { addDaysToDate, fromDateInputValue, toDateInputValue } from './date-utils';
import {
  PrototypeDataRepository,
  PrototypePackagePrice,
  PrototypeSubgroup,
  SUBGROUP_CALCULATION,
  SUBGROUP_STATUSES
} from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

type SubgroupEditorTab =
  | 'general'
  | 'partners'
  | 'calculation'
  | 'reservations'
  | 'travelSegments'
  | 'operationsReport'
  | 'availability'
  | 'description'
  | 'payments'
  | 'refunds'
  | 'documents'
  | 'servicesUsage';

@Component({
  selector: 'app-subgroup-editor-window',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="sub-editor" [formGroup]="form" (ngSubmit)="save()">
      <nav class="sub-editor__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="sub-editor__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="sub-editor__body">
        <ng-container *ngIf="activeTab() === 'general'">
          <article class="lmx-card sub-editor__card">
            <div class="sub-editor__card-header">
              <h3 class="sub-editor__card-title">General</h3>
              <div class="sub-editor__card-links">
                <button type="button" class="sub-editor__link">
                  <span class="material-icons">add</span>
                  Add attribute
                </button>
                <button type="button" class="sub-editor__link">
                  <span class="material-icons">edit</span>
                  Edit attributes
                </button>
              </div>
            </div>

            <div class="sub-editor__form">
              <div class="sub-editor__row">
                <label class="sub-editor__label" for="sub-period-start">Period start</label>
                <input id="sub-period-start" class="lmx-input" type="date" formControlName="periodStart" />
              </div>

              <div class="sub-editor__row">
                <label class="sub-editor__label" for="sub-period-end">Period end</label>
                <input id="sub-period-end" class="lmx-input" type="date" formControlName="periodEnd" />
              </div>

              <div class="sub-editor__row">
                <label class="sub-editor__label" for="sub-description">Description</label>
                <input id="sub-description" class="lmx-input" type="text" formControlName="name" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="sub-editor__row">
                <label class="sub-editor__label" for="sub-code">Code</label>
                <input id="sub-code" class="lmx-input" type="text" formControlName="code" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="sub-editor__row">
                <label class="sub-editor__label" for="sub-status">Status</label>
                <select id="sub-status" class="lmx-select" formControlName="status">
                  <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
                </select>
              </div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() === 'calculation'">
          <article class="lmx-card calc__toolbar">
            <div class="calc__toolbar-group">
              <span class="calc__label">View mode</span>
              <select class="lmx-select calc__view-mode">
                <option>Compact</option>
                <option>Expanded</option>
              </select>
              <button type="button" class="calc__help">
                <span class="material-icons">help</span>
                Read more
              </button>
            </div>

            <div class="calc__toolbar-group">
              <span class="calc__label">Currency</span>
              <select class="lmx-select calc__currency-picker">
                <option>{{ calculation.currency }}</option>
              </select>
              <span class="material-icons calc__help-icon">help</span>
              <span class="calc__label">No. of PAX breaks</span>
              <input
                class="lmx-input calc__breaks"
                type="text"
                [value]="breakCount()"
                (change)="setBreakCount($any($event.target).value)"
              />
            </div>

            <div class="calc__toolbar-actions">
              <button type="button" class="lmx-btn lmx-btn--action-outline">
                <span class="material-icons">autorenew</span>
                Recalculate
              </button>
              <button type="button" class="lmx-btn lmx-btn--action-outline">
                <span class="material-icons">content_copy</span>
                Copy from
              </button>
              <button type="button" class="lmx-btn lmx-btn--action-outline" (click)="openSettings()">
                <span class="material-icons">edit</span>
                Settings
              </button>
            </div>
          </article>

          <article class="lmx-card calc__sheet">
            <div class="calc__scroll">
              <div class="calc__row calc__row--pax">
                <span class="calc__row-label">Paying pax:</span>
                <input *ngFor="let pax of visible(calculation.payingPax)" class="lmx-input calc__pax" type="text" [value]="pax" />
              </div>
              <div class="calc__row calc__row--pax">
                <span class="calc__row-label">FOC Pax:</span>
                <input *ngFor="let pax of visible(calculation.focPax)" class="lmx-input calc__pax" type="text" [value]="pax" />
              </div>

              <button type="button" class="calc__section" (click)="toggleSection('itinerary')">
                <span class="material-icons">{{ sectionIcon('itinerary') }}</span>
                Itinerary
              </button>

              <ng-container *ngIf="!isCollapsed('itinerary')">
                <ng-container *ngFor="let day of calculation.days; let dayIndex = index">
                  <div class="calc__day">
                    <button type="button" class="calc__section calc__section--day" (click)="toggleSection('day-' + dayIndex)">
                      <span class="material-icons">{{ sectionIcon('day-' + dayIndex) }}</span>
                      Day {{ dayIndex + 1 }} ({{ dayDate(dayIndex) }})
                    </button>
                    <button type="button" class="calc__item-link">
                      <span class="material-icons">add_box</span>
                      New Item
                    </button>
                    <button type="button" class="calc__item-link">
                      <span class="material-icons">add</span>
                      Add ad-hoc item
                    </button>
                  </div>

                  <ng-container *ngIf="!isCollapsed('day-' + dayIndex)">
                    <ng-container *ngFor="let item of day.items">
                      <div class="calc__row" *ngFor="let line of item.lines; let lineIndex = index">
                        <span class="calc__item-name">
                          <button type="button" class="lmx-grid-link" *ngIf="lineIndex === 0">{{ item.label }}</button>
                        </span>
                        <span class="calc__item-currency">
                          <select class="lmx-select" *ngIf="lineIndex === 0">
                            <option>{{ item.currency }}</option>
                          </select>
                        </span>
                        <span class="calc__net">Net</span>
                        <span class="calc__occupancy">{{ line.occupancy }}</span>
                        <span class="calc__cell" *ngFor="let price of visible(line.prices)">{{ amount(price) }}</span>
                      </div>
                    </ng-container>
                  </ng-container>
                </ng-container>
              </ng-container>

              <ng-container *ngFor="let pkg of calculation.packagePrices">
                <button
                  type="button"
                  class="calc__section"
                  (click)="toggleSection('package-' + pkg.occupancy)"
                >
                  <span class="material-icons">{{ sectionIcon('package-' + pkg.occupancy) }}</span>
                  Package price - {{ pkg.occupancy }} - {{ pkg.currency }}
                </button>

                <ng-container *ngIf="!isCollapsed('package-' + pkg.occupancy)">
                  <div class="calc__row" *ngFor="let row of packageRows(pkg)">
                    <span class="calc__item-name calc__item-name--total">{{ row.label }}</span>
                    <span class="calc__item-currency"></span>
                    <span class="calc__net"></span>
                    <span class="calc__occupancy"></span>
                    <span class="calc__cell" *ngFor="let value of visible(row.values)">{{ amount(value) }}</span>
                  </div>
                </ng-container>
              </ng-container>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() !== 'general' && activeTab() !== 'calculation'">
          <article class="lmx-card sub-editor__card">
            <h3 class="sub-editor__card-title">{{ tabLabel(activeTab()) }}</h3>
            <p class="sub-editor__placeholder">This section is scaffolded for the prototype.</p>
          </article>
        </ng-container>
      </div>

      <footer class="sub-editor__footer">
        <span class="sub-editor__spacer"></span>
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

      .sub-editor {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .sub-editor__tabs {
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

      .sub-editor__tab {
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

      .sub-editor__tab:hover {
        color: var(--lemax-text);
      }

      .sub-editor__tab.active {
        color: var(--lemax-blue);
      }

      .sub-editor__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .sub-editor__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 16px 24px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .sub-editor__card {
        padding: 16px 20px 20px;
      }

      .sub-editor__card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .sub-editor__card-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .sub-editor__card-links {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .sub-editor__link,
      .calc__item-link,
      .calc__help {
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

      .sub-editor__link .material-icons,
      .calc__item-link .material-icons {
        font-size: 16px;
      }

      .sub-editor__link:hover,
      .calc__item-link:hover {
        color: var(--lemax-blue-dark);
        text-decoration: underline;
      }

      .calc__help {
        color: var(--lemax-text);
        font-weight: 400;
      }

      .sub-editor__form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 560px;
      }

      .sub-editor__row {
        display: grid;
        grid-template-columns: 180px 230px auto;
        align-items: center;
        column-gap: 10px;
        min-height: 30px;
      }

      .sub-editor__label {
        font-size: 12px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .sub-editor__row .lmx-input,
      .sub-editor__row .lmx-select {
        width: 100%;
        min-width: 0;
      }

      .sub-editor__placeholder {
        margin: 0;
        color: var(--lemax-muted);
      }

      .sub-editor__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .sub-editor__spacer {
        flex: 1;
      }

      .calc__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        padding: 12px 16px;
      }

      .calc__toolbar-group,
      .calc__toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .calc__label {
        font-size: 12px;
        color: var(--lemax-text);
        white-space: nowrap;
      }

      .calc__currency-picker,
      .calc__breaks {
        width: 78px;
      }

      .calc__view-mode {
        width: 118px;
      }

      .calc__breaks {
        text-align: center;
      }

      .calc__help .material-icons,
      .calc__help-icon {
        font-size: 15px;
        color: var(--lemax-muted);
      }

      .calc__toolbar-actions .material-icons {
        font-size: 15px;
      }

      .calc__sheet {
        padding: 6px 16px 18px;
      }

      .calc__scroll {
        overflow-x: auto;
      }

      /* One fixed template keeps the pax header, item rows and totals in the same columns. */
      .calc__row {
        display: grid;
        grid-template-columns: 460px 60px 34px 38px repeat(7, 72px);
        align-items: center;
        column-gap: 6px;
        padding: 3px 0;
      }

      .calc__row--pax {
        padding: 6px 0;
      }

      .calc__row-label {
        grid-column: 1 / 5;
        font-size: 12px;
        color: var(--lemax-text);
      }

      .calc__pax {
        width: 100%;
        height: 26px;
        padding: 0 4px;
        text-align: center;
        font-size: 12px;
      }

      .calc__section {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        border: 0;
        padding: 10px 0 4px;
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
        cursor: pointer;
      }

      .calc__section .material-icons {
        font-size: 15px;
        color: var(--lemax-muted);
      }

      .calc__section--day {
        font-size: 13px;
        padding: 4px 0;
      }

      .calc__day {
        display: flex;
        align-items: center;
        gap: 22px;
        padding-left: 10px;
      }

      .calc__item-name {
        padding-left: 26px;
        font-size: 12px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .calc__item-name .lmx-grid-link {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .calc__item-name--total {
        padding-left: 38px;
        font-weight: 600;
      }

      .calc__item-currency .lmx-select {
        width: 100%;
        height: 26px;
        padding: 0 2px 0 4px;
        font-size: 11px;
      }

      .calc__net {
        font-size: 12px;
      }

      .calc__occupancy {
        font-size: 11px;
        font-weight: 700;
        color: var(--lemax-action);
      }

      .calc__cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 26px;
        border: 1px solid var(--lemax-border);
        border-radius: 2px;
        background: #f4f5f7;
        font-size: 12px;
        color: var(--lemax-text);
      }
    `
  ]
})
export class SubgroupEditorWindowComponent implements OnChanges {
  @Input({ required: true }) entityId = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly activeTab = signal<SubgroupEditorTab>('general');
  protected readonly statuses = SUBGROUP_STATUSES;

  protected readonly tabs: { id: SubgroupEditorTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'partners', label: 'Partners' },
    { id: 'calculation', label: 'Calculation' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'travelSegments', label: 'Travel segments' },
    { id: 'operationsReport', label: 'Operations report' },
    { id: 'availability', label: 'Availability' },
    { id: 'description', label: 'Description' },
    { id: 'payments', label: 'Payments' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'documents', label: 'Documents' },
    { id: 'servicesUsage', label: 'Services usage' }
  ];

  protected readonly calculation = SUBGROUP_CALCULATION;
  protected readonly breakCount = signal(SUBGROUP_CALCULATION.payingPax.length);
  private readonly collapsed = signal<Record<string, boolean>>({});

  private groupCode = '';
  private existingSubgroup: PrototypeSubgroup | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    periodStart: '',
    periodEnd: '',
    name: '',
    code: '',
    status: SUBGROUP_STATUSES[0]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityId']) {
      this.loadSubgroup();
    }
  }

  protected tabLabel(id: SubgroupEditorTab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected openSettings(): void {
    this.windowManager.open('prototype-calculation-settings', 'global', 'Settings', 'edit');
  }

  protected visible<T>(values: T[]): T[] {
    return values.slice(0, this.breakCount());
  }

  protected setBreakCount(value: string): void {
    const parsed = Number.parseInt(value, 10);
    const max = this.calculation.payingPax.length;
    this.breakCount.set(Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), max) : max);
  }

  protected amount(value: number): string {
    return value.toFixed(2);
  }

  protected dayDate(dayIndex: number): string {
    const start = this.existingSubgroup?.periodStart ?? fromDateInputValue(this.form.getRawValue().periodStart);
    return addDaysToDate(start, dayIndex);
  }

  protected toggleSection(key: string): void {
    this.collapsed.update((state) => ({ ...state, [key]: !state[key] }));
  }

  protected isCollapsed(key: string): boolean {
    return Boolean(this.collapsed()[key]);
  }

  protected sectionIcon(key: string): string {
    return this.isCollapsed(key) ? 'unfold_more' : 'unfold_less';
  }

  protected packageRows(pkg: PrototypePackagePrice): { label: string; values: number[] }[] {
    return [
      { label: 'Net price per person', values: pkg.netPricePerPerson },
      { label: 'Margin %', values: pkg.marginPercent },
      { label: 'Margin amount per person', values: pkg.marginAmountPerPerson },
      { label: 'Gross price per person', values: pkg.grossPricePerPerson },
      { label: 'Net price', values: pkg.netPrice },
      { label: 'Gross price', values: pkg.grossPrice }
    ];
  }

  protected save(): void {
    const value = this.form.getRawValue();
    const periodStart = fromDateInputValue(value.periodStart);
    const periodEnd = fromDateInputValue(value.periodEnd);

    if (!this.existingSubgroup) {
      const created: PrototypeSubgroup = {
        id: this.prototypeData.generateSubgroupId(),
        groupCode: this.groupCode,
        code: value.code,
        name: value.name,
        periodStart,
        periodEnd,
        pax: 0,
        preparedForOperations: false,
        status: value.status,
        totalSelling: 0,
        totalNet: 0,
        paid: 0,
        currency: 'EUR'
      };

      this.prototypeData.createSubgroup(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypeSubgroup = {
      ...this.existingSubgroup,
      code: value.code,
      name: value.name,
      periodStart,
      periodEnd,
      status: value.status
    };

    this.prototypeData.saveSubgroup(updated);
    this.windowManager.close(this.windowId);
  }

  private loadSubgroup(): void {
    const [groupCode, subgroupId] = this.entityId.split(':');
    this.groupCode = groupCode;

    if (subgroupId === 'new') {
      this.existingSubgroup = null;
      this.form.reset({
        periodStart: '',
        periodEnd: '',
        name: '',
        code: '',
        status: SUBGROUP_STATUSES[0]
      });
      return;
    }

    const subgroup = this.prototypeData.getSubgroupById(subgroupId);
    if (!subgroup) {
      return;
    }

    this.existingSubgroup = subgroup;
    this.form.reset({
      periodStart: toDateInputValue(subgroup.periodStart),
      periodEnd: toDateInputValue(subgroup.periodEnd),
      name: subgroup.name,
      code: subgroup.code,
      status: subgroup.status
    });
  }
}
