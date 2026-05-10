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

  duplicate(reservationId: string): Reservation | undefined {
    const original = this.getById(reservationId);
    if (!original) return undefined;

    const nextNumber =
      this.reservations().reduce(
        (max, reservation) => Math.max(max, reservation.reservationNumber),
        0
      ) + 1;

    const copy: Reservation = {
      ...original,
      id: `${original.id}-copy-${Date.now()}`,
      reservationNumber: nextNumber,
      paid: 0
    };

    this.persist([copy, ...this.reservations()]);
    return copy;
  }

  refresh(): void {
    this.reservations.set(this.storage.get<Reservation[]>(STORAGE_KEYS.reservations, []));
  }

  private persist(reservations: Reservation[]): void {
    this.reservations.set(reservations);
    this.storage.set(STORAGE_KEYS.reservations, reservations);
  }
}
