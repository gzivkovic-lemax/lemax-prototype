import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject } from '@angular/core';
import { AccommodationEditorWindowComponent } from './accommodation-editor-window.component';
import { CalculationSettingsWindowComponent } from './calculation-settings-window.component';
import { ContractEditorWindowComponent } from './contract-editor-window.component';
import { CustomerDetailWindowComponent } from './customer-detail-window.component';
import { CustomerEditorWindowComponent } from './customer-editor-window.component';
import { GroupEditorWindowComponent } from './group-editor-window.component';
import { PassengerEditorWindowComponent } from './passenger-editor-window.component';
import { ProductDetailWindowComponent } from './product-detail-window.component';
import { ReservationEditorWindowComponent } from './reservation-editor-window.component';
import { SubgroupEditorWindowComponent } from './subgroup-editor-window.component';
import { WindowManagerService, isModalWindowKind } from './window-manager.service';
import { FloatingWindowComponent } from './floating-window.component';

@Component({
  selector: 'app-window-layer',
  imports: [
    CommonModule,
    FloatingWindowComponent,
    ReservationEditorWindowComponent,
    ProductDetailWindowComponent,
    CustomerDetailWindowComponent,
    CustomerEditorWindowComponent,
    PassengerEditorWindowComponent,
    AccommodationEditorWindowComponent,
    ContractEditorWindowComponent,
    GroupEditorWindowComponent,
    SubgroupEditorWindowComponent,
    CalculationSettingsWindowComponent
  ],
  template: `
    <ng-container *ngIf="hasWindows()">
      <div class="window-backdrop" (click)="closeTopmost()"></div>
      <div class="window-layer">
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

          <app-customer-editor-window
            *ngIf="windowState.kind === 'prototype-customer'"
            [customerCode]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-passenger-editor-window
            *ngIf="windowState.kind === 'prototype-passenger'"
            [passengerCode]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-accommodation-editor-window
            *ngIf="windowState.kind === 'prototype-accommodation'"
            [accommodationCode]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-contract-editor-window
            *ngIf="windowState.kind === 'prototype-contract'"
            [entityId]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-group-editor-window
            *ngIf="windowState.kind === 'prototype-group'"
            [groupCode]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-subgroup-editor-window
            *ngIf="windowState.kind === 'prototype-subgroup'"
            [entityId]="windowState.entityId"
            [windowId]="windowState.windowId"
          />

          <app-calculation-settings-window
            *ngIf="windowState.kind === 'prototype-calculation-settings'"
            [windowId]="windowState.windowId"
          />
        </app-floating-window>

        <div
          *ngIf="modalWindow() as modal"
          class="window-dim"
          [style.zIndex]="modal.zIndex - 1"
          (click)="windowManager.close(modal.windowId)"
        ></div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .window-backdrop {
        position: fixed;
        inset: 0;
        z-index: 14;
        background: rgba(10, 43, 69, 0.32);
        backdrop-filter: blur(1px);
      }

      .window-layer {
        position: fixed;
        inset: 0;
        z-index: 15;
        pointer-events: none;
      }

      .window-dim {
        position: fixed;
        inset: 0;
        background: rgba(10, 43, 69, 0.18);
        pointer-events: auto;
      }

      app-floating-window {
        pointer-events: auto;
      }
    `
  ]
})
export class WindowLayerComponent {
  protected readonly windowManager = inject(WindowManagerService);

  protected readonly hasWindows = computed(() => this.windowManager.windows().length > 0);

  /** Topmost modal dialog, if one is open — everything below it gets dimmed. */
  protected readonly modalWindow = computed(() =>
    this.windowManager
      .windows()
      .filter((windowState) => isModalWindowKind(windowState.kind))
      .sort((left, right) => right.zIndex - left.zIndex)[0]
  );

  protected trackByWindowId = (_index: number, item: { windowId: string }) => item.windowId;

  protected closeTopmost(): void {
    const top = [...this.windowManager.windows()].sort((a, b) => b.zIndex - a.zIndex)[0];
    if (top) {
      this.windowManager.close(top.windowId);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeTopmost();
  }
}
