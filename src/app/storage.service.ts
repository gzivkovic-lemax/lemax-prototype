import { Injectable } from '@angular/core';

export const STORAGE_KEYS = {
  statuses: 'lemax-prototype.statuses',
  customers: 'lemax-prototype.customers',
  products: 'lemax-prototype.products',
  reservations: 'lemax-prototype.reservations',
  filterOptions: 'lemax-prototype.filter-options',
  windows: 'lemax-prototype.windows',
  seedVersion: 'lemax-prototype.seed-version'
} as const;

@Injectable({ providedIn: 'root' })
export class StorageService {
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  get<T>(key: string, fallback: T): T {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
