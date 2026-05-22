import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PrototypeCustomer, PrototypeDataRepository } from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

type CustomerEditorTab =
  | 'general'
  | 'contractTypes'
  | 'users'
  | 'customFields'
  | 'reservations'
  | 'documents'
  | 'finances'
  | 'communication'
  | 'passengers'
  | 'paymentTerms';

const COUNTRIES = [
  'CROATIA',
  'AUSTRIA',
  'GERMANY',
  'ITALY',
  'FRANCE',
  'UNITED KINGDOM',
  'UNITED STATES',
  'SLOVENIA',
  'SERBIA',
  'BOSNIA AND HERZEGOVINA',
  'HUNGARY',
  'POLAND',
  'NETHERLANDS',
  'SPAIN'
];

const LANGUAGES = ['English', 'Croatian', 'German', 'Italian', 'French', 'Spanish'];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'HRK'];

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];

@Component({
  selector: 'app-customer-editor-window',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="cust" [formGroup]="form" (ngSubmit)="save()">
      <nav class="cust__tabs">
        <button
          type="button"
          *ngFor="let tab of tabs"
          class="cust__tab"
          [class.active]="activeTab() === tab.id"
          (click)="activeTab.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="cust__body">
        <ng-container *ngIf="activeTab() === 'general'">
          <article class="lmx-card cust__card">
            <h3 class="cust__card-title">General</h3>
            <div class="cust__form">
              <!-- Row 1: Company/Person + Type -->
              <div class="cust__row cust__row--start">
                <span class="cust__label">Company / Person</span>
                <div class="cust__radios">
                  <label class="cust__radio">
                    <input type="radio" value="company" formControlName="companyOrPerson" />
                    Company
                  </label>
                  <label class="cust__radio">
                    <input type="radio" value="person" formControlName="companyOrPerson" />
                    Person
                  </label>
                </div>
              </div>
              <div class="cust__row cust__row--start">
                <span class="cust__label">Type</span>
                <div class="cust__checks">
                  <label class="cust__check">
                    <input type="checkbox" formControlName="isCustomer" />
                    Customer
                  </label>
                  <label class="cust__check">
                    <input type="checkbox" formControlName="isSupplier" />
                    Supplier
                  </label>
                  <label class="cust__check">
                    <input type="checkbox" formControlName="isTravelAgent" />
                    Travel agent
                  </label>
                </div>
              </div>

              <ng-container *ngIf="mode() === 'company'">
                <!-- Name + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-name-co">Name</label>
                  <input id="cust-name-co" class="lmx-input" type="text" formControlName="name" />
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- OIB + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-oib-co">OIB</label>
                  <input id="cust-oib-co" class="lmx-input" type="text" formControlName="oib" />
                </div>
                <div class="cust__row cust__row--blank"></div>
              </ng-container>

              <ng-container *ngIf="mode() === 'person'">
                <!-- Title + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-title">Title</label>
                  <select id="cust-title" class="lmx-select" formControlName="title">
                    <option value="">Please select</option>
                    <option *ngFor="let title of titles" [value]="title">{{ title }}</option>
                  </select>
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- Name + Surname -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-name">Name</label>
                  <input id="cust-name" class="lmx-input" type="text" formControlName="name" />
                </div>
                <div class="cust__row">
                  <label class="cust__label" for="cust-surname">Surname</label>
                  <input id="cust-surname" class="lmx-input" type="text" formControlName="surname" />
                </div>

                <!-- OIB + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-oib">OIB</label>
                  <input id="cust-oib" class="lmx-input" type="text" formControlName="oib" />
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- VAT ID + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-vatid">VAT ID</label>
                  <input id="cust-vatid" class="lmx-input" type="text" formControlName="vatId" />
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- Birth date + Birthplace -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-birthdate">Birth date</label>
                  <input id="cust-birthdate" class="lmx-input" type="date" formControlName="birthDate" />
                </div>
                <div class="cust__row">
                  <label class="cust__label" for="cust-birthplace">Birthplace</label>
                  <input id="cust-birthplace" class="lmx-input" type="text" formControlName="birthplace" />
                </div>

                <!-- Passport number + Citizenship -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-passport">Passport number</label>
                  <input id="cust-passport" class="lmx-input" type="text" formControlName="passportNumber" />
                </div>
                <div class="cust__row">
                  <label class="cust__label" for="cust-citizenship">Citizenship</label>
                  <select id="cust-citizenship" class="lmx-select" formControlName="citizenship">
                    <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                  </select>
                </div>

                <!-- Passport issue date + Passport expiry date -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-pp-issue">Passport issue date</label>
                  <input id="cust-pp-issue" class="lmx-input" type="date" formControlName="passportIssueDate" />
                </div>
                <div class="cust__row">
                  <label class="cust__label" for="cust-pp-expiry">Passport expiry date</label>
                  <input id="cust-pp-expiry" class="lmx-input" type="date" formControlName="passportExpiryDate" />
                </div>

                <!-- Passport issuing country + Sex -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-pp-country">Passport issuing country</label>
                  <select id="cust-pp-country" class="lmx-select" formControlName="passportIssuingCountry">
                    <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                  </select>
                </div>
                <div class="cust__row">
                  <label class="cust__label" for="cust-sex">Sex</label>
                  <select id="cust-sex" class="lmx-select" formControlName="sex">
                    <option value="">Please select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <!-- Middle name + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-middle">Middle name</label>
                  <input id="cust-middle" class="lmx-input" type="text" formControlName="middleName" />
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- Language + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-language">Language</label>
                  <select id="cust-language" class="lmx-select" formControlName="language">
                    <option *ngFor="let language of languages" [value]="language">{{ language }}</option>
                  </select>
                </div>
                <div class="cust__row cust__row--blank"></div>

                <!-- Currency (narrow) + (empty) -->
                <div class="cust__row">
                  <label class="cust__label" for="cust-currency">Currency</label>
                  <select id="cust-currency" class="lmx-select cust__select--narrow" formControlName="currency">
                    <option value="">Please select</option>
                    <option *ngFor="let currency of currencies" [value]="currency">{{ currency }}</option>
                  </select>
                </div>
                <div class="cust__row cust__row--blank"></div>
              </ng-container>
            </div>
          </article>

          <article class="lmx-card cust__card">
            <h3 class="cust__card-title">Contact data</h3>
            <div class="cust__form">
              <!-- Address + City -->
              <div class="cust__row">
                <label class="cust__label" for="cust-address">Address</label>
                <input id="cust-address" class="lmx-input" type="text" formControlName="address" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-city">City</label>
                <input id="cust-city" class="lmx-input" type="text" formControlName="city" />
              </div>

              <!-- Address line 2 + State/Province -->
              <div class="cust__row">
                <label class="cust__label" for="cust-address2">Address line 2</label>
                <input id="cust-address2" class="lmx-input" type="text" formControlName="addressLine2" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-state">State/Province</label>
                <input id="cust-state" class="lmx-input" type="text" formControlName="stateProvince" />
              </div>

              <!-- ZIP code + Country -->
              <div class="cust__row">
                <label class="cust__label" for="cust-zip">ZIP code</label>
                <input id="cust-zip" class="lmx-input" type="text" formControlName="zipCode" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-country">Country</label>
                <select id="cust-country" class="lmx-select" formControlName="country">
                  <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                </select>
              </div>

              <!-- Email + Telephone -->
              <div class="cust__row">
                <label class="cust__label" for="cust-email">Email</label>
                <input id="cust-email" class="lmx-input" type="email" formControlName="email" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-telephone">Telephone</label>
                <input id="cust-telephone" class="lmx-input" type="text" formControlName="telephone" />
              </div>

              <!-- Telephone 2 + Mobile phone -->
              <div class="cust__row">
                <label class="cust__label" for="cust-telephone2">Telephone 2</label>
                <input id="cust-telephone2" class="lmx-input" type="text" formControlName="telephone2" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-mobile">Mobile phone</label>
                <input id="cust-mobile" class="lmx-input" type="text" formControlName="mobilePhone" />
              </div>

              <!-- Telefax + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-telefax">Telefax</label>
                <input id="cust-telefax" class="lmx-input" type="text" formControlName="telefax" />
              </div>
              <div class="cust__row cust__row--blank"></div>
            </div>
          </article>

          <article class="lmx-card cust__card">
            <h3 class="cust__card-title">Bank</h3>
            <div class="cust__form">
              <!-- Name + Bank account number -->
              <div class="cust__row">
                <label class="cust__label" for="cust-bank-name">Name</label>
                <input id="cust-bank-name" class="lmx-input" type="text" formControlName="bankName" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-bank-acc">Bank account number</label>
                <input id="cust-bank-acc" class="lmx-input" type="text" formControlName="bankAccountNumber" />
              </div>

              <!-- SWIFT + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-swift">SWIFT</label>
                <input id="cust-swift" class="lmx-input" type="text" formControlName="swift" />
              </div>
              <div class="cust__row cust__row--blank"></div>
            </div>
          </article>

          <article class="lmx-card cust__card">
            <h3 class="cust__card-title">Other details</h3>
            <div class="cust__form">
              <!-- Contract nr. + Default option period (days) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-contract">Contract nr.</label>
                <input id="cust-contract" class="lmx-input" type="text" formControlName="contractNumber" />
              </div>
              <div class="cust__row">
                <label class="cust__label" for="cust-default-opt">Default option period (days)</label>
                <input
                  id="cust-default-opt"
                  class="lmx-input cust__input--tiny"
                  type="text"
                  formControlName="defaultOptionPeriodDays"
                />
              </div>

              <!-- Accounting code + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-acc-code">Accounting code</label>
                <input id="cust-acc-code" class="lmx-input" type="text" formControlName="accountingCode" />
              </div>
              <div class="cust__row cust__row--blank"></div>

              <!-- Sec. accounting code + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-sec-acc">Sec. accounting code</label>
                <input id="cust-sec-acc" class="lmx-input" type="text" formControlName="secAccountingCode" />
              </div>
              <div class="cust__row cust__row--blank"></div>

              <!-- Due date (days) + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-due-days">Due date (days)</label>
                <input id="cust-due-days" class="lmx-input" type="text" formControlName="dueDateDays" />
              </div>
              <div class="cust__row cust__row--blank"></div>

              <!-- Supplier invoice code + (empty) -->
              <div class="cust__row">
                <label class="cust__label" for="cust-sup-inv">Supplier invoice code</label>
                <input id="cust-sup-inv" class="lmx-input" type="text" formControlName="supplierInvoiceCode" />
              </div>
              <div class="cust__row cust__row--blank"></div>
            </div>
          </article>
        </ng-container>

        <ng-container *ngIf="activeTab() !== 'general'">
          <article class="lmx-card cust__card">
            <h3 class="cust__card-title">{{ tabLabel(activeTab()) }}</h3>
            <p class="cust__placeholder">This section is scaffolded for the prototype.</p>
          </article>
        </ng-container>
      </div>

      <footer class="cust__footer">
        <span class="cust__spacer"></span>
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

      .cust {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .cust__tabs {
        display: flex;
        align-items: stretch;
        gap: 0;
        background: #fff;
        border-bottom: 1px solid var(--lemax-border-soft);
        padding: 0 16px;
        flex-shrink: 0;
        overflow-x: auto;
      }

      .cust__tab {
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

      .cust__tab:hover {
        color: var(--lemax-text);
      }

      .cust__tab.active {
        color: var(--lemax-blue);
      }

      .cust__tab.active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        background: var(--lemax-blue);
      }

      .cust__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 12px 16px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .cust__card {
        padding: 14px 18px 18px;
      }

      .cust__card-title {
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .cust__form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 48px;
        row-gap: 10px;
      }

      .cust__row {
        display: grid;
        grid-template-columns: 140px 280px 1fr;
        align-items: center;
        gap: 12px;
        min-height: 30px;
      }

      .cust__row--start {
        align-items: flex-start;
      }

      .cust__row--start .cust__label {
        padding-top: 4px;
      }

      .cust__row--blank {
        visibility: hidden;
      }

      .cust__label {
        color: var(--lemax-text);
        font-size: 12px;
        font-weight: 400;
      }

      .cust__row .lmx-input,
      .cust__row .lmx-select {
        width: 100%;
        min-width: 0;
      }

      .cust__select--narrow {
        width: 120px !important;
      }

      .cust__input--tiny {
        width: 70px !important;
      }

      .cust__radios,
      .cust__checks {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .cust__radio,
      .cust__check {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--lemax-text);
        cursor: pointer;
      }

      .cust__radio input,
      .cust__check input {
        width: 14px;
        height: 14px;
        accent-color: var(--lemax-blue);
        margin: 0;
      }

      .cust__placeholder {
        margin: 0;
        color: var(--lemax-muted);
      }

      .cust__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .cust__spacer {
        flex: 1;
      }

      @media (max-width: 920px) {
        .cust__form {
          grid-template-columns: 1fr;
          column-gap: 0;
        }
      }
    `
  ]
})
export class CustomerEditorWindowComponent implements OnChanges {
  @Input({ required: true }) customerCode = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly currentCustomer = signal<PrototypeCustomer | null>(null);
  protected readonly activeTab = signal<CustomerEditorTab>('general');
  protected readonly mode = signal<'company' | 'person'>('person');

  protected readonly tabs: { id: CustomerEditorTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'contractTypes', label: 'Contract types' },
    { id: 'users', label: 'Users' },
    { id: 'customFields', label: 'Custom fields' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'documents', label: 'Documents' },
    { id: 'finances', label: 'Finances' },
    { id: 'communication', label: 'Communication' },
    { id: 'passengers', label: 'Passengers' },
    { id: 'paymentTerms', label: 'Payment terms' }
  ];

  protected readonly countries = COUNTRIES;
  protected readonly languages = LANGUAGES;
  protected readonly currencies = CURRENCIES;
  protected readonly titles = TITLES;

  protected readonly form = this.formBuilder.nonNullable.group({
    companyOrPerson: 'person' as 'company' | 'person',
    isCustomer: true,
    isSupplier: false,
    isTravelAgent: false,
    title: '',
    name: '',
    surname: '',
    oib: '',
    vatId: '',
    birthDate: '',
    birthplace: '',
    passportNumber: '',
    citizenship: 'CROATIA',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuingCountry: 'CROATIA',
    sex: '' as 'Male' | 'Female' | '',
    middleName: '',
    language: 'English',
    currency: '',
    address: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    stateProvince: '',
    country: 'CROATIA',
    email: '',
    telephone: '',
    telephone2: '',
    telefax: '',
    mobilePhone: '',
    bankName: '',
    swift: '',
    bankAccountNumber: '',
    contractNumber: '',
    accountingCode: '',
    secAccountingCode: '',
    dueDateDays: '',
    supplierInvoiceCode: '',
    defaultOptionPeriodDays: ''
  });

  protected readonly windowTitle = computed(() => {
    const customer = this.currentCustomer();
    if (!customer) return '';
    const surname = (customer.surname ?? '').trim();
    const name = (customer.name ?? '').trim();
    return [surname, name].filter(Boolean).join(' ') || customer.name;
  });

  constructor() {
    this.form.controls.companyOrPerson.valueChanges.subscribe((value) => {
      this.mode.set(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerCode']) {
      this.loadCustomer();
    }
  }

  protected tabLabel(id: CustomerEditorTab): string {
    return this.tabs.find((tab) => tab.id === id)?.label ?? '';
  }

  protected save(): void {
    const value = this.form.getRawValue();
    const types: string[] = [];
    if (value.isCustomer) types.push('Customer');
    if (value.isSupplier) types.push('Supplier');
    if (value.isTravelAgent) types.push('Travel agent');

    const existing = this.currentCustomer();

    if (!existing) {
      const created: PrototypeCustomer = {
        ...value,
        code: this.prototypeData.generateCustomerCode(),
        type: types.join('/') || 'Customer',
        taxType: ''
      };
      this.prototypeData.createCustomer(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypeCustomer = {
      ...existing,
      ...value,
      type: types.join('/') || existing.type
    };

    this.prototypeData.saveCustomer(updated);
    this.windowManager.close(this.windowId);
  }

  private loadCustomer(): void {
    if (this.customerCode === 'new') {
      this.currentCustomer.set(null);
      this.mode.set('person');
      this.form.reset();
      return;
    }

    const customer = this.prototypeData.getCustomerByCode(this.customerCode);
    if (!customer) {
      return;
    }

    this.currentCustomer.set(customer);
    this.mode.set(customer.companyOrPerson ?? 'person');

    const tokens = (customer.type ?? '').split('/').map((token) => token.trim().toLowerCase());

    this.form.reset({
      companyOrPerson: customer.companyOrPerson ?? 'person',
      isCustomer: customer.isCustomer ?? tokens.includes('customer'),
      isSupplier: customer.isSupplier ?? tokens.includes('supplier'),
      isTravelAgent: customer.isTravelAgent ?? tokens.includes('travel agent'),
      title: customer.title ?? '',
      name: customer.name ?? '',
      surname: customer.surname ?? '',
      oib: customer.oib ?? '',
      vatId: customer.vatId ?? '',
      birthDate: customer.birthDate ?? '',
      birthplace: customer.birthplace ?? '',
      passportNumber: customer.passportNumber ?? '',
      citizenship: customer.citizenship ?? customer.country ?? 'CROATIA',
      passportIssueDate: customer.passportIssueDate ?? '',
      passportExpiryDate: customer.passportExpiryDate ?? '',
      passportIssuingCountry: customer.passportIssuingCountry ?? customer.country ?? 'CROATIA',
      sex: customer.sex ?? '',
      middleName: customer.middleName ?? '',
      language: customer.language ?? 'English',
      currency: customer.currency ?? '',
      address: customer.address ?? '',
      addressLine2: customer.addressLine2 ?? '',
      zipCode: customer.zipCode ?? '',
      city: customer.city ?? '',
      stateProvince: customer.stateProvince ?? '',
      country: customer.country ?? 'CROATIA',
      email: customer.email ?? '',
      telephone: customer.telephone ?? '',
      telephone2: customer.telephone2 ?? '',
      telefax: customer.telefax ?? '',
      mobilePhone: customer.mobilePhone ?? '',
      bankName: customer.bankName ?? '',
      swift: customer.swift ?? '',
      bankAccountNumber: customer.bankAccountNumber ?? '',
      contractNumber: customer.contractNumber ?? '',
      accountingCode: customer.accountingCode ?? '',
      secAccountingCode: customer.secAccountingCode ?? '',
      dueDateDays: customer.dueDateDays ?? '',
      supplierInvoiceCode: customer.supplierInvoiceCode ?? '',
      defaultOptionPeriodDays: customer.defaultOptionPeriodDays ?? ''
    });
  }
}
