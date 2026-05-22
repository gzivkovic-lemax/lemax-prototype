import { Injectable, computed, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface PrototypeCustomer {
  code: string;
  name: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  telephone: string;
  type: string;
  email: string;
  mobilePhone: string;
  taxType: string;
  companyOrPerson?: 'company' | 'person';
  title?: string;
  surname?: string;
  middleName?: string;
  oib?: string;
  vatId?: string;
  birthDate?: string;
  birthplace?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  citizenship?: string;
  sex?: 'Male' | 'Female' | '';
  language?: string;
  currency?: string;
  isCustomer?: boolean;
  isSupplier?: boolean;
  isTravelAgent?: boolean;
  addressLine2?: string;
  stateProvince?: string;
  telephone2?: string;
  telefax?: string;
  bankName?: string;
  swift?: string;
  bankAccountNumber?: string;
  contractNumber?: string;
  accountingCode?: string;
  secAccountingCode?: string;
  dueDateDays?: string;
  supplierInvoiceCode?: string;
  defaultOptionPeriodDays?: string;
}

export interface PrototypeOffer {
  docNo: string;
  resNo: string;
  tone: string;
  customer: string;
  date: string;
  branchOffice: string;
  createdBy: string;
  vatType: string;
  amount: string;
}

export interface PrototypeAccommodation {
  code: string;
  name: string;
  country: string;
  region: string;
  destination: string;
  supplier: string;
  department: string;
  internalName: string;
}

export interface PrototypeOperation {
  opsNo: string;
  itemId: string;
  product: string;
  unit: string;
  destination: string;
  startDate: string;
  endDate: string;
  leadPassenger: string;
  pax: string;
  net: string;
  supplier: string;
}

export interface PrototypeData {
  customers: PrototypeCustomer[];
  offers: PrototypeOffer[];
  accommodations: PrototypeAccommodation[];
  operations: PrototypeOperation[];
}

const STORAGE_KEY = 'lemax-prototype.prototype-pages';
const SEED_VERSION_KEY = 'lemax-prototype.prototype-pages.seed-version';
const SEED_VERSION = 'v3';

const SEED: PrototypeData = {
  customers: [
    { code: '255', name: 'A Customer', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'customer@customer.com', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '241', name: 'Abbot Haydn', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'haydn.abbott@outlook.com', mobilePhone: '', taxType: 'Tax payer' },
    { code: '247', name: 'Airedale International', country: 'CROATIA', city: 'Leeds', address: 'Leeds Road Rawdon', zipCode: 'LS19 6JY', telephone: '', type: 'Customer', email: '', mobilePhone: '', taxType: 'Tax payer' },
    { code: '111', name: 'Albert Agency', country: 'ICELAND', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'albert@gjtravel.is', mobilePhone: '', taxType: 'Tax payer' },
    { code: '170', name: 'Alex Agency', country: 'RUSSIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'alexp@russobalt.tours', mobilePhone: '', taxType: 'Tax payer' },
    { code: '75', name: 'Aloschi Cruise Line', country: 'ITALY', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'adolfo@aloschibros.com', mobilePhone: '', taxType: 'Tax payer' },
    { code: '308', name: 'asd asdasd', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'dd@leo.com', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '623', name: 'Audley Travel', country: 'UNITED KINGDOM', city: 'London', address: 'This Road 123', zipCode: '', telephone: '+87844784784', type: 'Customer/Travel agent', email: 'audley@mailinator.com', mobilePhone: '', taxType: 'Tax payer' },
    { code: '73', name: 'b a', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: '', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '302', name: 'B B', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'v@v.com', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '221', name: 'b b', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'ivanmlinaric92@gmail.com', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '199', name: 'Baltic Travel Group', country: 'LATVIA', city: 'Riga', address: 'Riga Office - 31, Elizabets Street', zipCode: 'LV-1010', telephone: '', type: 'Customer', email: 'bernarda.vrbat@lemax.net', mobilePhone: '', taxType: 'Tax payer' },
    { code: '311', name: 'Banic Marija', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: '', mobilePhone: '', taxType: 'Tax payer' },
    { code: '624', name: 'Barrett Adam', country: 'UNITED KINGDOM', city: 'Chesterfield', address: '43 Whinfell Road', zipCode: '', telephone: '', type: 'Customer', email: '', mobilePhone: '', taxType: 'Tax payer' },
    { code: '201', name: 'Baudrexl Andreas', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'andreasb@designreisen.de', mobilePhone: '', taxType: 'Tax payer' },
    { code: '307', name: 'bb AA', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'ret@com.vo', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '222', name: 'bb bb', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'bb@bb.bb', mobilePhone: '', taxType: 'Not tax payer' }
  ],
  offers: [
    { docNo: '31/2026', resNo: '9898', tone: 'option', customer: 'Lemax', date: '01/04/2026', branchOffice: 'Central office', createdBy: 'Timko Antonio', vatType: 'On total price', amount: '360.00 EUR' },
    { docNo: '30/2026', resNo: '10620', tone: 'option', customer: 'Lemax', date: '01/04/2026', branchOffice: 'Central office', createdBy: 'Zivkovic Goran', vatType: 'On total price', amount: '260.00 EUR' },
    { docNo: '28/2026', resNo: '10664', tone: 'option', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '75,000.00 EUR' },
    { docNo: '27/2026', resNo: '10655', tone: 'confirmed', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '58,110.00 EUR' },
    { docNo: '26/2026', resNo: '10656', tone: 'option', customer: 'Partner 2', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '32,224.00 EUR' },
    { docNo: '29/2026', resNo: '10685', tone: 'confirmed', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '85,000.00 EUR' },
    { docNo: '25/2026', resNo: '10630', tone: 'confirmed', customer: 'Johnson Roy', date: '17/02/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On margin', amount: '5,581.66 USD' },
    { docNo: '24/2026', resNo: '10612', tone: 'confirmed', customer: 'Smith Annie', date: '28/01/2026', branchOffice: 'Central office', createdBy: 'Lambasa Gorana', vatType: 'On margin', amount: '12,988.00 GBP' },
    { docNo: '23/2026', resNo: '10277', tone: 'confirmed', customer: 'Bellows Clive', date: '28/01/2026', branchOffice: 'Central office', createdBy: 'Lambasa Gorana', vatType: 'On margin', amount: '5,428.00 EUR' },
    { docNo: '22/2026', resNo: '10237', tone: 'inquiry', customer: 'Audley Travel', date: '20/01/2026', branchOffice: 'Central office', createdBy: 'Lambasa Gorana', vatType: 'On margin', amount: '13,998.00 GBP' },
    { docNo: '20/2026', resNo: '9941', tone: 'confirmed', customer: 'Johnson Roy', date: '16/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '2,687.02 EUR' },
    { docNo: '21/2026', resNo: '9942', tone: 'confirmed', customer: 'Jet2', date: '16/01/2026', branchOffice: 'Central office', createdBy: 'Lambasa Gorana', vatType: 'On margin', amount: '2,124.00 GBP' },
    { docNo: '18/2026', resNo: '9938', tone: 'confirmed', customer: 'Johnson Roy', date: '16/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '3,311.04 EUR' },
    { docNo: '19/2026', resNo: '9939', tone: 'confirmed', customer: 'Jet2', date: '16/01/2026', branchOffice: 'Central office', createdBy: 'Lambasa Gorana', vatType: 'On margin', amount: '2,072.00 GBP' },
    { docNo: '12/2026', resNo: '9917', tone: 'confirmed', customer: 'Johnson Adam', date: '15/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '2,808.92 EUR' },
    { docNo: '15/2026', resNo: '9924', tone: 'confirmed', customer: 'Johnson Roy', date: '15/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '1,128.50 GBP' }
  ],
  accommodations: [
    { code: '8871', name: 'Hilton Parks', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '' },
    { code: '9972', name: 'Hilton Parks Hvar', country: 'Croatia', region: 'South Dalmatia', destination: 'Hvar', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '' },
    { code: '9524', name: 'PARK PIOLETS', country: 'Andorra', region: 'Andorra', destination: 'Andorra', supplier: 'Tripical', department: '', internalName: '' },
    { code: '12114', name: 'Sea Bed Rooms and Apartment | Guest House', country: 'Croatia', region: 'Middle Dalmatia', destination: 'Split', supplier: 'Aborda d.o.o.', department: '', internalName: '' },
    { code: '7704', name: '2nd driver', country: 'Worldwide', region: 'Worldwide', destination: 'Worldwide', supplier: 'Lucketts Travel Holidays', department: 'Default', internalName: '' },
    { code: '8977', name: '4 Star Innsbruck', country: 'Europe', region: 'Austria', destination: 'Innsbruck', supplier: 'Hotel Innsbruck', department: 'Default', internalName: '' },
    { code: '8971', name: '5 Star Hotel Vienna', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Activities Ltd', department: 'Default', internalName: '' },
    { code: '8974', name: '5 Star Salzburg Hotel', country: 'Europe', region: 'Austria', destination: 'Salzburg', supplier: 'Activities Ltd', department: 'Default', internalName: '' },
    { code: '1083', name: 'Aetas Lumpini', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: 'Lemax', department: '', internalName: '' },
    { code: '10322', name: 'Airport Assistance', country: 'Peru', region: 'Lima Province', destination: 'Lima', supplier: 'Peru Travel Company', department: '', internalName: '' },
    { code: '2982', name: 'All C. - Internal Guide - Spanish', country: 'United Arab Emirates', region: 'Dubai', destination: 'Dubai', supplier: 'Lemax Booking', department: '', internalName: '' },
    { code: '8201', name: 'All Inclusive (Adulty Only Resort 16yrs+)', country: 'Mauritius', region: 'Mauritius', destination: 'Mauritius', supplier: 'Sunlife', department: '', internalName: '' },
    { code: '6955', name: 'Amadria park', country: 'Croatia', region: 'North Dalmatia', destination: 'Sibenik', supplier: 'Hotel Andrija', department: 'Default', internalName: '' },
    { code: '11888', name: 'Ananea Madivaru Maldives', country: 'Maldives', region: 'Male', destination: 'Male Intl Arpt', supplier: 'Maldives DMC Supplier', department: '', internalName: '' },
    { code: '174', name: 'Anker Hotel', country: 'Norway', region: 'Oslo', destination: 'Oslo', supplier: 'Foreign Hotels Ltd.', department: 'Default', internalName: '' },
    { code: '8696', name: 'Another hotel from chain', country: 'Chile', region: 'Santiago', destination: 'Santiago', supplier: 'Activities Ltd', department: '', internalName: '' },
    { code: '37', name: 'Apartment Studio Guliver', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '' },
    { code: '34', name: 'Apartment Studio Sestan', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '' }
  ],
  operations: (() => {
    const hotelRows: PrototypeOperation[] = Array.from({ length: 10 }, (_, index) => ({
      opsNo: '10141',
      itemId: (536234 - index).toString(),
      product: 'Radisson Blu Resort',
      unit: 'Double room, Deluxe room Street view',
      destination: 'Split',
      startDate: '10/05/2026',
      endDate: '12/05/2026',
      leadPassenger: 'Name No',
      pax: '1',
      net: '694.29 EUR',
      supplier: 'Rezidor Hotel Group'
    }));
    return [
      {
        opsNo: '10390',
        itemId: '537048',
        product: 'Generic transfer',
        unit: 'Daily rate (Worldwide)',
        destination: 'Worldwide - Worldwide',
        startDate: '10/05/2026',
        endDate: '10/05/2026',
        leadPassenger: 'Name No',
        pax: '1',
        net: '530.00 EUR',
        supplier: 'Transfers Ltd.'
      },
      ...hotelRows,
      {
        opsNo: '10391',
        itemId: '537049',
        product: 'Generic transfer',
        unit: 'Daily rate (Worldwide)',
        destination: 'Worldwide - Worldwide',
        startDate: '11/05/2026',
        endDate: '11/05/2026',
        leadPassenger: 'Name No',
        pax: '1',
        net: '530.00 EUR',
        supplier: 'Transfers Ltd.'
      }
    ];
  })()
};

@Injectable({ providedIn: 'root' })
export class PrototypeDataRepository {
  private readonly state = signal<PrototypeData>(SEED);

  readonly customers = computed(() => this.state().customers);
  readonly offers = computed(() => this.state().offers);
  readonly accommodations = computed(() => this.state().accommodations);
  readonly operations = computed(() => this.state().operations);

  constructor(private readonly storage: StorageService) {
    this.hydrate();
  }

  hydrate(): void {
    const seedVersion = this.storage.get<string>(SEED_VERSION_KEY, '');
    if (seedVersion !== SEED_VERSION) {
      this.storage.set(STORAGE_KEY, SEED);
      this.storage.set(SEED_VERSION_KEY, SEED_VERSION);
      this.state.set(SEED);
      return;
    }

    this.state.set(this.storage.get<PrototypeData>(STORAGE_KEY, SEED));
  }

  reset(): void {
    this.storage.set(STORAGE_KEY, SEED);
    this.storage.set(SEED_VERSION_KEY, SEED_VERSION);
    this.state.set(SEED);
  }

  getCustomerByCode(code: string): PrototypeCustomer | undefined {
    return this.state().customers.find((customer) => customer.code === code);
  }

  saveCustomer(updated: PrototypeCustomer): void {
    const current = this.state();
    const customers = current.customers.map((customer) =>
      customer.code === updated.code ? updated : customer
    );
    const next: PrototypeData = { ...current, customers };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  createCustomer(customer: PrototypeCustomer): void {
    const current = this.state();
    const next: PrototypeData = { ...current, customers: [customer, ...current.customers] };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  generateCustomerCode(): string {
    const maxCode = this.state().customers.reduce((max, customer) => {
      const parsed = Number.parseInt(customer.code, 10);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return String(maxCode + 1);
  }

  static get storageKeys(): readonly string[] {
    return [STORAGE_KEY, SEED_VERSION_KEY];
  }
}
