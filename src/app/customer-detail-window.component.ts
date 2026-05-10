import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { CustomerRepository } from './customer-repository.service';
import { ReservationRepository } from './reservation-repository.service';

@Component({
  selector: 'app-customer-detail-window',
  imports: [CommonModule],
  template: `
    <section class="detail" *ngIf="customer() as customer">
      <article class="lmx-card detail__card">
        <h3 class="detail__title">Customer details</h3>
        <p class="detail__notes" *ngIf="customer.notes">{{ customer.notes }}</p>

        <dl class="detail__grid">
          <div>
            <dt>Name</dt>
            <dd>{{ customer.name }}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{{ customer.type }}</dd>
          </div>
          <div>
            <dt>Branch office</dt>
            <dd>{{ customer.branchOffice }}</dd>
          </div>
          <div>
            <dt>Account manager</dt>
            <dd>{{ customer.accountManager }}</dd>
          </div>
          <div>
            <dt>Market</dt>
            <dd>{{ customer.market }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ customer.email }}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{{ customer.phone }}</dd>
          </div>
          <div>
            <dt>Open reservations</dt>
            <dd>{{ relatedReservationsCount() }}</dd>
          </div>
        </dl>
      </article>
    </section>
  `,
  styles: [
    `
      .detail {
        padding: 16px;
      }

      .detail__card {
        padding: 16px 18px;
      }

      .detail__title {
        margin: 0 0 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .detail__notes {
        margin: 0 0 14px;
        color: var(--lemax-muted);
      }

      .detail__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px 24px;
        margin: 0;
      }

      dt {
        color: var(--lemax-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      dd {
        margin: 2px 0 0;
        color: var(--lemax-text);
        font-weight: 500;
      }
    `
  ]
})
export class CustomerDetailWindowComponent {
  @Input({ required: true }) customerId = '';

  private readonly customerRepository = inject(CustomerRepository);
  private readonly reservationRepository = inject(ReservationRepository);

  protected readonly customer = computed(() => this.customerRepository.getById(this.customerId));
  protected readonly relatedReservationsCount = computed(
    () => this.reservationRepository.reservations().filter((reservation) => reservation.customerId === this.customerId).length
  );
}
