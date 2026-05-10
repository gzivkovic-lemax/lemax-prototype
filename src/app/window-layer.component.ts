import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CustomerDetailWindowComponent } from './customer-detail-window.component';
import { ProductDetailWindowComponent } from './product-detail-window.component';
import { ReservationEditorWindowComponent } from './reservation-editor-window.component';
import { WindowManagerService } from './window-manager.service';
import { FloatingWindowComponent } from './floating-window.component';

@Component({
  selector: 'app-window-layer',
  imports: [
    CommonModule,
    FloatingWindowComponent,
    ReservationEditorWindowComponent,
    ProductDetailWindowComponent,
    CustomerDetailWindowComponent
  ],
  template: `
    <div class="window-layer" *ngIf="windowManager.windows().length">
      <app-floating-window
        *ngFor="let windowState of windowManager.windows(); trackBy: trackByWindowId"
        [window]="windowState"
        (close)="windowManager.close($event)"
        (focus)="windowManager.focus($event)"
        (move)="windowManager.move($event.windowId, $event.x, $event.y)"
      >
        <app-reservation-editor-window
          *ngIf="windowState.kind === 'reservation'"
          [reservationId]="windowState.entityId"
          [windowId]="windowState.windowId"
        />

        <app-product-detail-window *ngIf="windowState.kind === 'product'" [productId]="windowState.entityId" />

        <app-customer-detail-window *ngIf="windowState.kind === 'customer'" [customerId]="windowState.entityId" />
      </app-floating-window>
    </div>
  `,
  styles: [
    `
      .window-layer {
        position: fixed;
        inset: 0;
        z-index: 15;
        pointer-events: none;
      }

      app-floating-window {
        pointer-events: auto;
      }
    `
  ]
})
export class WindowLayerComponent {
  protected readonly windowManager = inject(WindowManagerService);

  protected trackByWindowId = (_index: number, item: { windowId: string }) => item.windowId;
}
