import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { ProductRepository } from './product-repository.service';
import { ReservationRepository } from './reservation-repository.service';

@Component({
  selector: 'app-product-detail-window',
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="detail" *ngIf="product() as product">
      <article class="lmx-card detail__card">
        <h3 class="detail__title">{{ product.name }}</h3>
        <p class="detail__notes" *ngIf="product.description">{{ product.description }}</p>

        <dl class="detail__grid">
          <div>
            <dt>Unit</dt>
            <dd>{{ product.unitName }}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{{ product.category }}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>{{ product.region }}</dd>
          </div>
          <div>
            <dt>Supplier</dt>
            <dd>{{ product.supplier }}</dd>
          </div>
          <div>
            <dt>Preferred market</dt>
            <dd>{{ product.preferredMarket }}</dd>
          </div>
          <div>
            <dt>Base price</dt>
            <dd>{{ product.basePrice | currency: product.currency : 'symbol-narrow' : '1.2-2' }}</dd>
          </div>
          <div>
            <dt>Related reservations</dt>
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
export class ProductDetailWindowComponent {
  @Input({ required: true }) productId = '';

  private readonly productRepository = inject(ProductRepository);
  private readonly reservationRepository = inject(ReservationRepository);

  protected readonly product = computed(() => this.productRepository.getById(this.productId));
  protected readonly relatedReservationsCount = computed(
    () => this.reservationRepository.reservations().filter((reservation) => reservation.productId === this.productId).length
  );
}
