import { Injectable, inject } from '@angular/core';
import { AppDataInitializerService } from './app-data-initializer.service';
import { CustomerRepository } from './customer-repository.service';
import { FilterOptionsRepository } from './filter-options-repository.service';
import { ProductRepository } from './product-repository.service';
import { PrototypeDataRepository } from './prototype-data-repository.service';
import { ReservationRepository } from './reservation-repository.service';
import { ReservationStatusRepository } from './reservation-status-repository.service';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { WindowManagerService } from './window-manager.service';

@Injectable({ providedIn: 'root' })
export class AppDataResetService {
  private readonly storage = inject(StorageService);
  private readonly initializer = inject(AppDataInitializerService);
  private readonly prototypeRepository = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);
  private readonly reservations = inject(ReservationRepository);
  private readonly customers = inject(CustomerRepository);
  private readonly products = inject(ProductRepository);
  private readonly statuses = inject(ReservationStatusRepository);
  private readonly filters = inject(FilterOptionsRepository);

  async resetAll(): Promise<void> {
    const allKeys = [
      ...Object.values(STORAGE_KEYS),
      ...PrototypeDataRepository.storageKeys
    ];
    for (const key of allKeys) {
      this.storage.set(key, null);
      localStorage.removeItem(key);
    }

    await this.initializer.initialize();
    this.prototypeRepository.hydrate();
    this.reservations.refresh();
    this.customers.refresh();
    this.products.refresh();
    this.statuses.refresh();
    this.filters.refresh();
    this.windowManager.restore();
  }
}
