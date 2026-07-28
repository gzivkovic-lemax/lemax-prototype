export interface ReservationStatus {
  id: string;
  key: string;
  label: string;
  tone: string;
}

export interface Customer {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  branchOffice: string;
  accountManager: string;
  market: string;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  unitName: string;
  category: string;
  region: string;
  supplier: string;
  preferredMarket: string;
  basePrice: number;
  currency: string;
  description: string;
}

export interface ReservationCustomFields {
  preferredMarket: string;
  tariffLevel: string;
  commission: string;
}

export interface Reservation {
  id: string;
  reservationNumber: number;
  statusId: string;
  productId: string;
  customerId: string;
  passengerName: string;
  periodStart: string;
  periodEnd: string;
  optionDate: string;
  cancellationDeadline: string;
  price: number;
  paid: number;
  currency: string;
  branchOffice: string;
  createdBy: string;
  notes: string;
  customFields: ReservationCustomFields;
}

export interface FilterOptions {
  branchOffices: string[];
  createdBy: string[];
  markets: string[];
}

export type LemaxWindowKind =
  | 'reservation'
  | 'product'
  | 'customer'
  | 'prototype-customer'
  | 'prototype-passenger'
  | 'prototype-accommodation'
  | 'prototype-contract'
  | 'prototype-group'
  | 'prototype-subgroup';

export interface LemaxWindowPosition {
  x: number;
  y: number;
}

export interface LemaxWindowSize {
  width: number;
  height: number;
}

export interface LemaxWindowState {
  windowId: string;
  kind: LemaxWindowKind;
  entityId: string;
  title: string;
  mode: 'edit' | 'read';
  position: LemaxWindowPosition;
  size: LemaxWindowSize;
  zIndex: number;
  active: boolean;
}

export interface ReservationFilters {
  search: string;
  statusIds: string[];
  branchOffice: string;
  onlyOutstanding: boolean;
  createdBy: string;
}

export interface SortState {
  column:
    | 'reservationNumber'
    | 'product'
    | 'customer'
    | 'period'
    | 'optionDate'
    | 'passengerName'
    | 'price'
    | 'paid'
    | 'remaining'
    | 'cancellationDeadline';
  direction: 'asc' | 'desc';
}
