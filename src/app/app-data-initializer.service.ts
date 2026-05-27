import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { STORAGE_KEYS, StorageService } from './storage.service';

interface SeedResource {
  storageKey: string;
  url: string;
}

const SEED_DATA_VERSION = 'expanded-reservations-v4';

@Injectable({ providedIn: 'root' })
export class AppDataInitializerService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  async initialize(): Promise<void> {
    const resources: SeedResource[] = [
      { storageKey: STORAGE_KEYS.statuses, url: '/reservation-statuses.json' },
      { storageKey: STORAGE_KEYS.customers, url: '/customers.json' },
      { storageKey: STORAGE_KEYS.products, url: '/products.json' },
      { storageKey: STORAGE_KEYS.reservations, url: '/reservations.json' },
      { storageKey: STORAGE_KEYS.filterOptions, url: '/filter-options.json' }
    ];

    const shouldRefreshSeedData =
      this.storage.get<string>(STORAGE_KEYS.seedVersion, '') !== SEED_DATA_VERSION;

    for (const resource of resources) {
      if (!shouldRefreshSeedData && this.storage.has(resource.storageKey)) {
        continue;
      }

      const payload = await firstValueFrom(this.http.get(resource.url));
      this.storage.set(resource.storageKey, payload);
    }

    if (shouldRefreshSeedData) {
      this.storage.set(STORAGE_KEYS.seedVersion, SEED_DATA_VERSION);
    }

    if (!this.storage.has(STORAGE_KEYS.windows)) {
      this.storage.set(STORAGE_KEYS.windows, []);
    }
  }
}
