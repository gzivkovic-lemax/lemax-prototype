import { Injectable, signal } from '@angular/core';
import { Customer } from './models';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  readonly customers = signal<Customer[]>([]);

  constructor(private readonly storage: StorageService) {
    this.customers.set(this.storage.get<Customer[]>(STORAGE_KEYS.customers, []));
  }

  getById(customerId: string): Customer | undefined {
    return this.customers().find((customer) => customer.id === customerId);
  }
}
