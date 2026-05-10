import { Injectable, signal } from '@angular/core';
import { FilterOptions } from './models';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FilterOptionsRepository {
  readonly filterOptions = signal<FilterOptions>({
    branchOffices: [],
    createdBy: [],
    markets: []
  });

  constructor(private readonly storage: StorageService) {
    this.filterOptions.set(
      this.storage.get<FilterOptions>(STORAGE_KEYS.filterOptions, {
        branchOffices: [],
        createdBy: [],
        markets: []
      })
    );
  }
}
