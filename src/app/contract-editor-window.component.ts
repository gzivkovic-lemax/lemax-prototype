import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  CONTRACT_TYPES,
  CURRENT_USER_BUSINESS_ENTITY,
  PrototypeContract,
  PrototypeDataRepository
} from './prototype-data-repository.service';
import { fromDateInputValue, toDateInputValue } from './date-utils';
import { WindowManagerService } from './window-manager.service';

type ContractEditorTab =
  | 'general'
  | 'partners'
  | 'basicServices'
  | 'additionalServices'
  | 'discounts'
  | 'specialOffers'
  | 'priceListSchedules'
  | 'availability'
  | 'cancellationPolicy'
  | 'supplierPaymentTerms'
  | 'focRules'
  | 'notes';

@Component({
  selector: 'app-contract-editor-window',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="con-editor" [formGroup]="form" (ngSubmit)="save()">
      <nav class="con-editor__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="con-editor__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="con-editor__body">
        <ng-container *ngIf="activeTab() === 'general'">
          <article class="lmx-card con-editor__card">
            <h3 class="con-editor__card-title">General</h3>

            <div class="con-editor__form">
              <div class="con-editor__row">
                <label class="con-editor__label" for="con-name">Contract name</label>
                <input id="con-name" class="lmx-input" type="text" formControlName="name" />
                <button type="button" class="lmx-icon-btn" aria-label="Translate"><span class="material-icons">translate</span></button>
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label">Contract validity period</label>
                <div class="con-editor__date-pair">
                  <input type="date" class="lmx-input" formControlName="validityStart" />
                  <input type="date" class="lmx-input" formControlName="validityEnd" />
                </div>
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label" for="con-type">Contract type</label>
                <select id="con-type" class="lmx-select" formControlName="type">
                  <option *ngFor="let type of contractTypes" [value]="type">{{ type }}</option>
                </select>
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label">Don't calculate destination's services</label>
                <label class="lmx-checkbox">
                  <input type="checkbox" formControlName="dontCalculateDestinationServices" />
                </label>
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label">Active</label>
                <label class="lmx-checkbox">
                  <input type="checkbox" formControlName="active" />
                </label>
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label" for="con-priority">Priority</label>
                <input id="con-priority" class="lmx-input con-editor__input--tiny" type="text" formControlName="priority" />
              </div>

              <div class="con-editor__row">
                <label class="con-editor__label">Special offer</label>
                <label class="lmx-checkbox">
                  <input type="checkbox" formControlName="specialOffer" />
                </label>
              </div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() !== 'general'">
          <article class="lmx-card con-editor__card">
            <h3 class="con-editor__card-title">{{ tabLabel(activeTab()) }}</h3>
            <p class="con-editor__placeholder">This section is scaffolded for the prototype.</p>
          </article>
        </ng-container>
      </div>

      <footer class="con-editor__footer">
        <span class="con-editor__spacer"></span>
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

      .con-editor {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .con-editor__tabs {
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

      .con-editor__tab {
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

      .con-editor__tab:hover {
        color: var(--lemax-text);
      }

      .con-editor__tab.active {
        color: var(--lemax-blue);
      }

      .con-editor__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .con-editor__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 16px 24px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .con-editor__card {
        padding: 16px 20px 20px;
      }

      .con-editor__card-title {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .con-editor__form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 640px;
      }

      .con-editor__row {
        display: grid;
        grid-template-columns: 220px 230px auto;
        align-items: center;
        column-gap: 10px;
        min-height: 30px;
      }

      .con-editor__label {
        font-size: 12px;
        color: var(--lemax-text);
      }

      .con-editor__row .lmx-input,
      .con-editor__row .lmx-select {
        width: 100%;
        min-width: 0;
      }

      .con-editor__input--tiny {
        width: 80px !important;
      }

      .con-editor__date-pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .con-editor__date-pair .lmx-input {
        width: 100%;
        min-width: 0;
      }

      .con-editor__placeholder {
        margin: 0;
        color: var(--lemax-muted);
      }

      .con-editor__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .con-editor__spacer {
        flex: 1;
      }
    `
  ]
})
export class ContractEditorWindowComponent implements OnChanges {
  @Input({ required: true }) entityId = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly activeTab = signal<ContractEditorTab>('general');
  protected readonly contractTypes = CONTRACT_TYPES;

  protected readonly tabs: { id: ContractEditorTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'partners', label: 'Partners' },
    { id: 'basicServices', label: 'Basic services' },
    { id: 'additionalServices', label: 'Additional services' },
    { id: 'discounts', label: 'Discounts' },
    { id: 'specialOffers', label: 'Special offers' },
    { id: 'priceListSchedules', label: 'Price list schedules' },
    { id: 'availability', label: 'Availability' },
    { id: 'cancellationPolicy', label: 'Cancellation policy' },
    { id: 'supplierPaymentTerms', label: 'Supplier payment terms' },
    { id: 'focRules', label: 'FOC rules' },
    { id: 'notes', label: 'Notes' }
  ];

  private accommodationCode = '';
  private existingContract: PrototypeContract | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    name: '',
    validityStart: '',
    validityEnd: '',
    type: CONTRACT_TYPES[0],
    dontCalculateDestinationServices: false,
    active: true,
    priority: '1',
    specialOffer: false
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityId']) {
      this.loadContract();
    }
  }

  protected tabLabel(id: ContractEditorTab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected save(): void {
    const value = this.form.getRawValue();
    const priority = Number.parseInt(value.priority, 10) || 1;
    const validityStart = fromDateInputValue(value.validityStart);
    const validityEnd = fromDateInputValue(value.validityEnd);
    const status = value.active ? 'Active' : 'Inactive';

    if (!this.existingContract) {
      const created: PrototypeContract = {
        code: this.prototypeData.generateContractCode(),
        accommodationCode: this.accommodationCode,
        businessEntity: CURRENT_USER_BUSINESS_ENTITY,
        name: value.name,
        type: value.type,
        validityStart,
        validityEnd,
        minPs: 1,
        priority,
        status,
        dontCalculateDestinationServices: value.dontCalculateDestinationServices,
        specialOffer: value.specialOffer
      };

      this.prototypeData.createContract(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypeContract = {
      ...this.existingContract,
      name: value.name,
      type: value.type,
      validityStart,
      validityEnd,
      priority,
      status,
      dontCalculateDestinationServices: value.dontCalculateDestinationServices,
      specialOffer: value.specialOffer
    };

    this.prototypeData.saveContract(updated);
    this.windowManager.close(this.windowId);
  }

  private loadContract(): void {
    const [accommodationCode, contractCode] = this.entityId.split(':');
    this.accommodationCode = accommodationCode;

    if (contractCode === 'new') {
      this.existingContract = null;
      this.form.reset({
        name: '',
        validityStart: '',
        validityEnd: '',
        type: CONTRACT_TYPES[0],
        dontCalculateDestinationServices: false,
        active: true,
        priority: '1',
        specialOffer: false
      });
      return;
    }

    const contract = this.prototypeData.getContractByCode(contractCode);
    if (!contract) {
      return;
    }

    this.existingContract = contract;
    this.form.reset({
      name: contract.name,
      validityStart: toDateInputValue(contract.validityStart),
      validityEnd: toDateInputValue(contract.validityEnd),
      type: contract.type,
      dontCalculateDestinationServices: contract.dontCalculateDestinationServices ?? false,
      active: contract.status === 'Active',
      priority: String(contract.priority),
      specialOffer: contract.specialOffer ?? false
    });
  }
}
