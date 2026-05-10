import { Injectable, signal } from '@angular/core';
import { ReservationStatus } from './models';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ReservationStatusRepository {
  readonly statuses = signal<ReservationStatus[]>([]);

  constructor(private readonly storage: StorageService) {
    this.statuses.set(this.storage.get<ReservationStatus[]>(STORAGE_KEYS.statuses, []));
  }

  getById(statusId: string): ReservationStatus | undefined {
    return this.statuses().find((status) => status.id === statusId);
  }
}
