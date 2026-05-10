import { Injectable, signal } from '@angular/core';
import { Reservation } from './models';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ReservationRepository {
  readonly reservations = signal<Reservation[]>([]);

  constructor(private readonly storage: StorageService) {
    this.reservations.set(this.storage.get<Reservation[]>(STORAGE_KEYS.reservations, []));
  }

  getById(reservationId: string): Reservation | undefined {
    return this.reservations().find((reservation) => reservation.id === reservationId);
  }

  save(updatedReservation: Reservation): void {
    const nextReservations = this.reservations().map((reservation) =>
      reservation.id === updatedReservation.id ? updatedReservation : reservation
    );

    this.persist(nextReservations);
  }

  private persist(reservations: Reservation[]): void {
    this.reservations.set(reservations);
    this.storage.set(STORAGE_KEYS.reservations, reservations);
  }
}
