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

export interface PrototypePassenger {
  code: string;
  title?: string;
  name: string;
  surname?: string;
  middleName?: string;
  oib?: string;
  birthDate?: string;
  birthplace?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  citizenship?: string;
  sex?: 'Male' | 'Female' | '';
  language?: string;
  address?: string;
  addressLine2?: string;
  zipCode?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  email?: string;
  telephone?: string;
  telephone2?: string;
  mobilePhone?: string;
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
  type?: string;
  businessEntities?: string[];
  cashAdvance?: boolean;
  bookingCurrency?: string;
  contactPhoneReception?: string;
  contactEmail?: string;
  webPage?: string;
  contactPhone?: string;
  contactFax?: string;
  address?: string;
  numberOfStars?: string;
  searchPriority?: string;
  infantAge?: string;
  checkIn?: string;
  checkOut?: string;
  houseRateAllowed?: boolean;
  serviceName?: string;
  capacity?: number;
  units?: string;
  description?: string;
  priceTotal?: number;
  currency?: string;
}

export interface PrototypeContract {
  code: string;
  accommodationCode: string;
  businessEntity: string;
  name: string;
  type: string;
  validityStart: string;
  validityEnd: string;
  minPs: number;
  priority: number;
  status: string;
  dontCalculateDestinationServices?: boolean;
  specialOffer?: boolean;
}

export interface PrototypeSubgroup {
  id: string;
  groupCode: string;
  code: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  pax: number;
  preparedForOperations: boolean;
  status: string;
  totalSelling: number;
  totalNet: number;
  paid: number;
  currency: string;
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
  passengers: PrototypePassenger[];
  offers: PrototypeOffer[];
  accommodations: PrototypeAccommodation[];
  contracts: PrototypeContract[];
  subgroups: PrototypeSubgroup[];
  operations: PrototypeOperation[];
}

export const SUBGROUP_STATUSES = ['Published on web', 'Not published on web'];

export const BUSINESS_ENTITIES = ['Croatia', 'Austria', 'Germany'];

/** The prototype's current user belongs to a single business entity; filters default to it. */
export const CURRENT_USER_BUSINESS_ENTITY = 'Croatia';

const STORAGE_KEY = 'lemax-prototype.prototype-pages';
const SEED_VERSION_KEY = 'lemax-prototype.prototype-pages.seed-version';
const SEED_VERSION = 'v11';

const ACCOMMODATIONS: PrototypeAccommodation[] = [
  { code: '8871', name: 'Hilton Parks', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '', businessEntities: ['Austria'], numberOfStars: '2', serviceName: 'Bed and breakfast', capacity: 3, units: 'On request', description: 'Double room, Standard Twin Balcony, Flat screen TV, Free toiletries, Shower / Bath, Bathroom/Toilet', priceTotal: 2723.28, currency: 'GBP' },
  { code: '9972', name: 'Hilton Parks Hvar', country: 'Croatia', region: 'South Dalmatia', destination: 'Hvar', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '', businessEntities: ['Croatia'], numberOfStars: '5', serviceName: 'Bed and breakfast', capacity: 3, units: 'On request', description: 'Double room, Superior Double Room', priceTotal: 3808.0, currency: 'GBP' },
  { code: '9524', name: 'PARK PIOLETS', country: 'Andorra', region: 'Andorra', destination: 'Andorra', supplier: 'Tripical', department: '', internalName: '', businessEntities: ['Austria'], numberOfStars: '3', serviceName: 'Half board', capacity: 2, units: 'On request', description: 'Double room, Mountain view', priceTotal: 1560.0, currency: 'EUR' },
  { code: '12114', name: 'Sea Bed Rooms and Apartment | Guest House', country: 'Croatia', region: 'Middle Dalmatia', destination: 'Split', supplier: 'Aborda d.o.o.', department: '', internalName: '', businessEntities: ['Croatia'], numberOfStars: '4', serviceName: 'Room only', capacity: 4, units: '2 available', description: 'Studio apartment, Sea view, Kitchenette', priceTotal: 890.0, currency: 'EUR' },
  { code: '7704', name: '2nd driver', country: 'Worldwide', region: 'Worldwide', destination: 'Worldwide', supplier: 'Lucketts Travel Holidays', department: 'Default', internalName: '', businessEntities: ['Croatia', 'Austria', 'Germany'], serviceName: 'Service', capacity: 1, units: 'On request', description: 'Additional driver service', priceTotal: 45.0, currency: 'GBP' },
  { code: '8977', name: '4 Star Innsbruck', country: 'Europe', region: 'Austria', destination: 'Innsbruck', supplier: 'Hotel Innsbruck', department: 'Default', internalName: '', businessEntities: ['Austria'], numberOfStars: '4', serviceName: 'Bed and breakfast', capacity: 2, units: 'On request', description: 'Double room, Standard Twin', priceTotal: 1980.0, currency: 'EUR' },
  { code: '8971', name: '5 Star Hotel Vienna', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Activities Ltd', department: 'Default', internalName: '', businessEntities: ['Austria', 'Germany'], numberOfStars: '5', serviceName: 'Bed and breakfast', capacity: 2, units: 'On request', description: 'Double room, Deluxe room, City view', priceTotal: 4760.0, currency: 'GBP' },
  { code: '8974', name: '5 Star Salzburg Hotel', country: 'Europe', region: 'Austria', destination: 'Salzburg', supplier: 'Activities Ltd', department: 'Default', internalName: '', businessEntities: ['Austria'], numberOfStars: '5', serviceName: 'Half board', capacity: 2, units: 'On request', description: 'Double room, Superior Double Room', priceTotal: 3210.0, currency: 'EUR' },
  { code: '1083', name: 'Aetas Lumpini', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: 'Lemax', department: '', internalName: '', businessEntities: ['Germany'], numberOfStars: '3', serviceName: 'Room only', capacity: 2, units: '5 available', description: 'Deluxe room, City view', priceTotal: 620.0, currency: 'GBP' },
  { code: '10322', name: 'Airport Assistance', country: 'Peru', region: 'Lima Province', destination: 'Lima', supplier: 'Peru Travel Company', department: '', internalName: '', businessEntities: ['Germany'], serviceName: 'Service', capacity: 1, units: 'On request', description: 'Meet and greet airport transfer', priceTotal: 35.0, currency: 'GBP' },
  { code: '2982', name: 'All C. - Internal Guide - Spanish', country: 'United Arab Emirates', region: 'Dubai', destination: 'Dubai', supplier: 'Lemax Booking', department: '', internalName: '', businessEntities: ['Croatia'], serviceName: 'Service', capacity: 1, units: 'On request', description: 'Spanish speaking guide, full day', priceTotal: 120.0, currency: 'GBP' },
  { code: '8201', name: 'All Inclusive (Adulty Only Resort 16yrs+)', country: 'Mauritius', region: 'Mauritius', destination: 'Mauritius', supplier: 'Sunlife', department: '', internalName: '', businessEntities: ['Austria', 'Germany'], numberOfStars: '5', serviceName: 'All inclusive', capacity: 2, units: 'On request', description: 'Double room, Adults only, Beachfront', priceTotal: 5400.0, currency: 'GBP' },
  { code: '6955', name: 'Amadria park', country: 'Croatia', region: 'North Dalmatia', destination: 'Sibenik', supplier: 'Hotel Andrija', department: 'Default', internalName: '', businessEntities: ['Croatia'], numberOfStars: '4', serviceName: 'Bed and breakfast', capacity: 3, units: 'On request', description: 'Double room, Standard Twin', priceTotal: 2150.0, currency: 'EUR' },
  { code: '11888', name: 'Ananea Madivaru Maldives', country: 'Maldives', region: 'Male', destination: 'Male Intl Arpt', supplier: 'Maldives DMC Supplier', department: '', internalName: '', businessEntities: ['Croatia'], numberOfStars: '5', serviceName: 'All inclusive', capacity: 2, units: 'On request', description: 'Water villa, Ocean view', priceTotal: 8900.0, currency: 'GBP' },
  { code: '174', name: 'Anker Hotel', country: 'Norway', region: 'Oslo', destination: 'Oslo', supplier: 'Foreign Hotels Ltd.', department: 'Default', internalName: '', businessEntities: ['Croatia', 'Germany'], numberOfStars: '3', serviceName: 'Bed and breakfast', capacity: 2, units: 'On request', description: 'Double room, Standard', priceTotal: 1780.0, currency: 'GBP' },
  { code: '8696', name: 'Another hotel from chain', country: 'Chile', region: 'Santiago', destination: 'Santiago', supplier: 'Activities Ltd', department: '', internalName: '', businessEntities: ['Germany'], numberOfStars: '4', serviceName: 'Room only', capacity: 2, units: 'On request', description: 'Double room, City view', priceTotal: 990.0, currency: 'GBP' },
  { code: '37', name: 'Apartment Studio Guliver', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '', businessEntities: ['Croatia', 'Austria'], serviceName: 'Self catering', capacity: 4, units: '3 available', description: 'Studio apartment, Air conditioning', priceTotal: 640.0, currency: 'EUR' },
  { code: '34', name: 'Apartment Studio Sestan', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '', businessEntities: ['Croatia'], serviceName: 'Self catering', capacity: 4, units: '2 available', description: 'Studio apartment, Balcony', priceTotal: 590.0, currency: 'EUR' }
];

const GROUP_PRODUCTS: PrototypeAccommodation[] = [
  { code: '1681', name: 'St. Gregory the Great & Fr. Michael Hall - 2026', country: 'France', region: 'Île-de-France', destination: 'Paris', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1520', name: 'St. Gregory the Great & Fr. Michael Hall', country: 'France', region: 'Île-de-France', destination: 'Paris', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1493', name: 'Dalmatia Package 7 days - Aliantour demo', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '1373', name: 'Austria & Switzerland Highlights', country: 'Switzerland', region: 'Zurich', destination: 'Zurich', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '1370', name: 'Zürich Signature 4 Days', country: 'Switzerland', region: 'Zurich', destination: 'Zurich', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '1343', name: 'Croatia Package 7 days (EU)', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '1120', name: 'Croatia Package 7 days - DMC TEST', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '1117', name: 'Croatia Package 7 days - TEMPLATE', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '1114', name: 'Austria Tour 14 days', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '1103', name: 'Thailand 10 days - WW package - demo version', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1094', name: 'Thailand package 10 days - WW market demo example 2', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1063', name: 'Thailand Package 10 days - WW market demo example 1', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1041', name: 'Thailand Package 10 days - UK Market', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '1022', name: 'Mirjam Vienna', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '910', name: 'Tosca 2026 - NEW', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '902', name: 'Test 1 - to delete', country: 'Switzerland', region: 'Aargau', destination: 'Aargau', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '656', name: 'Icelandic 7 Days', country: 'Iceland', region: 'Reykjavik', destination: 'Reykjavik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '591', name: 'Dalmatia Coastline - Demo T', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '580', name: 'Croatia Coastline - 3rd', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '569', name: 'Croatia Coastline - 2nd', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '558', name: 'Croatia Coastline - 1st', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '540', name: 'Tosca 2026 - Albatros', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '517', name: 'Tosca 2026', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '433', name: 'Tosca - Opera in the quarry TEMPLATE', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Austria'] },
  { code: '345', name: 'Croatia coastline - DEMO package', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '298', name: 'Croatia Package 7 days - UK Market', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '276', name: 'New Year on The Baltic Sea - Stockholm - Helsinki', country: 'Sweden', region: 'Stockholm', destination: 'Stockholm', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Germany'] },
  { code: '215', name: 'Best of Dalmatia Tour | Package 7 days', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '77', name: 'Best of Dalmatia | 7 days', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] },
  { code: '59', name: 'Best of Dalmatia | 7 days DMC', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: '', department: 'Default', internalName: '', type: 'Groups', businessEntities: ['Croatia'] }
];

export const CONTRACT_TYPES = ['FIT', 'Group', 'Allotment'];

const CONTRACT_TEMPLATES = [
  { type: 'FIT', name: 'FIT contract summer 2026', validityStart: '01/04/2026', validityEnd: '01/10/2026' },
  { type: 'Group', name: 'Group contract winter 2026/27', validityStart: '01/11/2026', validityEnd: '31/03/2027' },
  { type: 'Allotment', name: 'Allotment contract 2026/27', validityStart: '01/04/2026', validityEnd: '31/03/2027' }
];

function buildContractsForAccommodation(
  accommodation: PrototypeAccommodation,
  sequenceRef: { value: number }
): PrototypeContract[] {
  const entities = accommodation.businessEntities ?? [];
  const isMultiEntity = entities.length > 1;

  return entities.flatMap((entity, entityIndex) => {
    const contractCount = isMultiEntity ? (entityIndex === 0 ? 3 : 2) : 1;

    return Array.from({ length: contractCount }, (_, index) => {
      const template = CONTRACT_TEMPLATES[sequenceRef.value % CONTRACT_TEMPLATES.length];
      const contract: PrototypeContract = {
        code: String(4830 + sequenceRef.value),
        accommodationCode: accommodation.code,
        businessEntity: entity,
        name: template.name,
        type: template.type,
        validityStart: template.validityStart,
        validityEnd: template.validityEnd,
        minPs: 1,
        priority: index + 1,
        status: 'Active'
      };
      sequenceRef.value += 1;
      return contract;
    });
  });
}

const CONTRACTS: PrototypeContract[] = (() => {
  const sequenceRef = { value: 0 };
  return ACCOMMODATIONS.flatMap((accommodation) => buildContractsForAccommodation(accommodation, sequenceRef));
})();

/** Subgroups of group 1681 mirror the reference Lemax screenshot exactly, money included. */
const FEATURED_GROUP_SUBGROUPS: PrototypeSubgroup[] = [
  { id: '1688', groupCode: '1681', code: '', name: 'August 2026', periodStart: '31/08/2026', periodEnd: '09/09/2026', pax: 0, preparedForOperations: false, status: 'Published on web', totalSelling: 0, totalNet: 0, paid: 0, currency: 'EUR' },
  { id: '1687', groupCode: '1681', code: '', name: 'August 2026', periodStart: '24/08/2026', periodEnd: '02/09/2026', pax: 0, preparedForOperations: false, status: 'Published on web', totalSelling: 0, totalNet: 0, paid: 0, currency: 'EUR' },
  { id: '1686', groupCode: '1681', code: '', name: 'August 2026', periodStart: '17/08/2026', periodEnd: '26/08/2026', pax: 0, preparedForOperations: false, status: 'Published on web', totalSelling: 0, totalNet: 0, paid: 0, currency: 'EUR' },
  { id: '1685', groupCode: '1681', code: '', name: 'August 2026', periodStart: '10/08/2026', periodEnd: '19/08/2026', pax: 0, preparedForOperations: false, status: 'Published on web', totalSelling: 0, totalNet: 0, paid: 0, currency: 'EUR' },
  { id: '1684', groupCode: '1681', code: '', name: 'August 2026', periodStart: '03/08/2026', periodEnd: '12/08/2026', pax: 0, preparedForOperations: false, status: 'Published on web', totalSelling: 0, totalNet: 0, paid: 0, currency: 'EUR' },
  { id: '1682', groupCode: '1681', code: '', name: 'August 2026', periodStart: '01/08/2026', periodEnd: '10/08/2026', pax: 3, preparedForOperations: true, status: 'Published on web', totalSelling: 11185.0, totalNet: 4062.7, paid: 0, currency: 'EUR' }
];

const SUBGROUP_DEPARTURES = [
  { name: 'May 2026', periodStart: '04/05/2026', periodEnd: '11/05/2026' },
  { name: 'June 2026', periodStart: '08/06/2026', periodEnd: '15/06/2026' },
  { name: 'September 2026', periodStart: '07/09/2026', periodEnd: '14/09/2026' }
];

function buildSubgroupsForGroup(
  group: PrototypeAccommodation,
  sequenceRef: { value: number }
): PrototypeSubgroup[] {
  return SUBGROUP_DEPARTURES.slice(0, 2).map((departure, index) => {
    const subgroup: PrototypeSubgroup = {
      id: String(2100 + sequenceRef.value),
      groupCode: group.code,
      code: '',
      name: departure.name,
      periodStart: departure.periodStart,
      periodEnd: departure.periodEnd,
      pax: index === 0 ? 2 : 0,
      preparedForOperations: index === 0,
      status: 'Published on web',
      totalSelling: index === 0 ? 4320.0 : 0,
      totalNet: index === 0 ? 2680.5 : 0,
      paid: index === 0 ? 1200.0 : 0,
      currency: 'EUR'
    };
    sequenceRef.value += 1;
    return subgroup;
  });
}

const SUBGROUPS: PrototypeSubgroup[] = (() => {
  const sequenceRef = { value: 0 };
  return [
    ...FEATURED_GROUP_SUBGROUPS,
    ...GROUP_PRODUCTS.filter((group) => group.code !== '1681').flatMap((group) =>
      buildSubgroupsForGroup(group, sequenceRef)
    )
  ];
})();

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
    { code: '222', name: 'bb bb', country: 'CROATIA', city: '', address: '', zipCode: '', telephone: '', type: 'Customer', email: 'bb@bb.bb', mobilePhone: '', taxType: 'Not tax payer' },
    { code: '501', name: 'Hilton Hotels & Resorts', country: 'AUSTRIA', city: 'Vienna', address: 'Am Stadtpark 1', zipCode: '1030', telephone: '+43 1 71700', type: 'Supplier', email: 'reservations@hilton.at', mobilePhone: '', taxType: 'Tax payer' },
    { code: '502', name: 'Transfers Ltd.', country: 'UNITED KINGDOM', city: 'London', address: '12 Park Lane', zipCode: 'W1K 7TN', telephone: '+44 20 7946 0001', type: 'Supplier', email: 'ops@transfers.example', mobilePhone: '', taxType: 'Tax payer' },
    { code: '503', name: 'Activities Ltd', country: 'AUSTRIA', city: 'Salzburg', address: 'Getreidegasse 9', zipCode: '5020', telephone: '', type: 'Supplier', email: 'hello@activities.example', mobilePhone: '', taxType: 'Tax payer' },
    { code: '504', name: 'Foreign Hotels Ltd.', country: 'NORWAY', city: 'Oslo', address: 'Karl Johans gate 31', zipCode: '0159', telephone: '', type: 'Supplier', email: 'sales@foreignhotels.example', mobilePhone: '', taxType: 'Tax payer' },
    { code: '601', name: 'Audley Travel', country: 'UNITED KINGDOM', city: 'London', address: 'This Road 123', zipCode: '', telephone: '+87844784784', type: 'Travel agent', email: 'audley@mailinator.com', mobilePhone: '', taxType: 'Tax payer' },
    { code: '602', name: 'Russobalt Tours', country: 'RUSSIA', city: 'Moscow', address: 'Tverskaya 22', zipCode: '125009', telephone: '', type: 'Travel agent', email: 'alexp@russobalt.tours', mobilePhone: '', taxType: 'Tax payer' },
    { code: '603', name: 'Baltic Travel Group', country: 'LATVIA', city: 'Riga', address: 'Elizabetes 31', zipCode: 'LV-1010', telephone: '', type: 'Travel agent', email: 'info@baltictravelgroup.example', mobilePhone: '', taxType: 'Tax payer' }
  ],
  passengers: [
    { code: 'P-100', title: 'Mr.', name: 'John', surname: 'Smith', birthDate: '1985-06-12', country: 'UNITED KINGDOM', city: 'London', address: '12 Baker Street', zipCode: 'NW1 6XE', email: 'john.smith@example.com', mobilePhone: '+44 7700 900100', passportNumber: '503125834', passportIssuingCountry: 'UNITED KINGDOM', citizenship: 'UNITED KINGDOM', sex: 'Male', language: 'English' },
    { code: 'P-101', title: 'Mrs.', name: 'Anna', surname: 'Smith', birthDate: '1987-09-23', country: 'UNITED KINGDOM', city: 'London', address: '12 Baker Street', zipCode: 'NW1 6XE', email: 'anna.smith@example.com', mobilePhone: '+44 7700 900101', passportNumber: '503125901', passportIssuingCountry: 'UNITED KINGDOM', citizenship: 'UNITED KINGDOM', sex: 'Female', language: 'English' },
    { code: 'P-102', title: 'Mr.', name: 'Marko', surname: 'Horvat', birthDate: '1979-02-04', country: 'CROATIA', city: 'Zagreb', address: 'Ilica 5', zipCode: '10000', email: 'marko.horvat@example.hr', mobilePhone: '+385 91 111 2222', passportNumber: '123456789', passportIssuingCountry: 'CROATIA', citizenship: 'CROATIA', sex: 'Male', language: 'Croatian' },
    { code: 'P-103', title: 'Ms.', name: 'Ivana', surname: 'Kovač', birthDate: '1992-11-30', country: 'CROATIA', city: 'Split', address: 'Marmontova 12', zipCode: '21000', email: 'ivana.kovac@example.hr', mobilePhone: '+385 98 555 3344', passportNumber: '234567890', passportIssuingCountry: 'CROATIA', citizenship: 'CROATIA', sex: 'Female', language: 'Croatian' },
    { code: 'P-104', title: 'Dr.', name: 'Klaus', surname: 'Müller', birthDate: '1968-04-17', country: 'GERMANY', city: 'Munich', address: 'Marienplatz 8', zipCode: '80331', email: 'klaus.mueller@example.de', mobilePhone: '+49 151 1234 5678', passportNumber: 'C8H4K2P9', passportIssuingCountry: 'GERMANY', citizenship: 'GERMANY', sex: 'Male', language: 'German' },
    { code: 'P-105', title: 'Mrs.', name: 'Sophie', surname: 'Müller', birthDate: '1971-08-02', country: 'GERMANY', city: 'Munich', address: 'Marienplatz 8', zipCode: '80331', email: 'sophie.mueller@example.de', mobilePhone: '+49 151 9876 5432', passportNumber: 'C8H4K2P0', passportIssuingCountry: 'GERMANY', citizenship: 'GERMANY', sex: 'Female', language: 'German' },
    { code: 'P-106', title: 'Mr.', name: 'Luca', surname: 'Bianchi', birthDate: '1990-01-15', country: 'ITALY', city: 'Milan', address: 'Via Dante 14', zipCode: '20121', email: 'luca.bianchi@example.it', mobilePhone: '+39 333 222 1111', passportNumber: 'YA1234567', passportIssuingCountry: 'ITALY', citizenship: 'ITALY', sex: 'Male', language: 'Italian' },
    { code: 'P-107', title: 'Ms.', name: 'Chiara', surname: 'Russo', birthDate: '1995-05-26', country: 'ITALY', city: 'Rome', address: 'Via del Corso 200', zipCode: '00186', email: 'chiara.russo@example.it', mobilePhone: '+39 340 555 0011', passportNumber: 'YA2345678', passportIssuingCountry: 'ITALY', citizenship: 'ITALY', sex: 'Female', language: 'Italian' }
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
  accommodations: [...ACCOMMODATIONS, ...GROUP_PRODUCTS],
  contracts: CONTRACTS,
  subgroups: SUBGROUPS,
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
  readonly passengers = computed(() => this.state().passengers);
  readonly offers = computed(() => this.state().offers);
  readonly accommodations = computed(() => this.state().accommodations.filter((row) => row.type !== 'Groups'));
  readonly groupProducts = computed(() => this.state().accommodations.filter((row) => row.type === 'Groups'));
  readonly contracts = computed(() => this.state().contracts);
  readonly subgroups = computed(() => this.state().subgroups);
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

  getAccommodationByCode(code: string): PrototypeAccommodation | undefined {
    return this.state().accommodations.find((accommodation) => accommodation.code === code);
  }

  saveAccommodation(updated: PrototypeAccommodation): void {
    const current = this.state();
    const accommodations = current.accommodations.map((accommodation) =>
      accommodation.code === updated.code ? updated : accommodation
    );
    const next: PrototypeData = { ...current, accommodations };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  createAccommodation(accommodation: PrototypeAccommodation): void {
    const current = this.state();
    const next: PrototypeData = { ...current, accommodations: [accommodation, ...current.accommodations] };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  generateAccommodationCode(): string {
    const maxCode = this.state().accommodations.reduce((max, accommodation) => {
      const parsed = Number.parseInt(accommodation.code, 10);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return String(maxCode + 1);
  }

  getContractsForAccommodation(accommodationCode: string): PrototypeContract[] {
    return this.state().contracts.filter((contract) => contract.accommodationCode === accommodationCode);
  }

  getContractByCode(code: string): PrototypeContract | undefined {
    return this.state().contracts.find((contract) => contract.code === code);
  }

  saveContract(updated: PrototypeContract): void {
    const current = this.state();
    const contracts = current.contracts.map((contract) => (contract.code === updated.code ? updated : contract));
    const next: PrototypeData = { ...current, contracts };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  createContract(contract: PrototypeContract): void {
    const current = this.state();
    const next: PrototypeData = { ...current, contracts: [contract, ...current.contracts] };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  generateContractCode(): string {
    const maxCode = this.state().contracts.reduce((max, contract) => {
      const parsed = Number.parseInt(contract.code, 10);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return String(maxCode + 1);
  }

  getSubgroupsForGroup(groupCode: string): PrototypeSubgroup[] {
    return this.state().subgroups.filter((subgroup) => subgroup.groupCode === groupCode);
  }

  getSubgroupById(id: string): PrototypeSubgroup | undefined {
    return this.state().subgroups.find((subgroup) => subgroup.id === id);
  }

  saveSubgroup(updated: PrototypeSubgroup): void {
    const current = this.state();
    const subgroups = current.subgroups.map((subgroup) => (subgroup.id === updated.id ? updated : subgroup));
    const next: PrototypeData = { ...current, subgroups };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  createSubgroup(subgroup: PrototypeSubgroup): void {
    const current = this.state();
    const next: PrototypeData = { ...current, subgroups: [subgroup, ...current.subgroups] };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  generateSubgroupId(): string {
    const maxId = this.state().subgroups.reduce((max, subgroup) => {
      const parsed = Number.parseInt(subgroup.id, 10);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return String(maxId + 1);
  }

  getPassengerByCode(code: string): PrototypePassenger | undefined {
    return this.state().passengers.find((passenger) => passenger.code === code);
  }

  savePassenger(updated: PrototypePassenger): void {
    const current = this.state();
    const passengers = current.passengers.map((passenger) =>
      passenger.code === updated.code ? updated : passenger
    );
    const next: PrototypeData = { ...current, passengers };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  createPassenger(passenger: PrototypePassenger): void {
    const current = this.state();
    const next: PrototypeData = { ...current, passengers: [passenger, ...current.passengers] };
    this.state.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  generatePassengerCode(): string {
    const maxCode = this.state().passengers.reduce((max, passenger) => {
      const parsed = Number.parseInt((passenger.code ?? '').replace(/^P-/, ''), 10);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return `P-${maxCode + 1}`;
  }

  static get storageKeys(): readonly string[] {
    return [STORAGE_KEY, SEED_VERSION_KEY];
  }
}
