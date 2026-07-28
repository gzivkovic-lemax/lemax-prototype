import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { fromDateInputValue, toDateInputValue } from './date-utils';
import {
  PrototypeDataRepository,
  PrototypeSubgroup,
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

        <ng-container *ngIf="activeTab() !== 'general'">
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

      .sub-editor__link {
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

      .sub-editor__link .material-icons {
        font-size: 16px;
      }

      .sub-editor__link:hover {
        color: var(--lemax-blue-dark);
        text-decoration: underline;
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
