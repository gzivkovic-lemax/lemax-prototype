import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppDataResetService } from './app-data-reset.service';
import { WindowLayerComponent } from './window-layer.component';

@Component({
  selector: 'app-lemax-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, WindowLayerComponent],
  template: `
    <div class="shell">
      <header class="shell__topbar">
        <a class="shell__logo" routerLink="/reservations" aria-label="Lemax">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <rect x="1" y="1" width="30" height="30" rx="4" fill="#55c7ee" />
            <path
              d="M8 8 H11 V20 H22 V23 H8 Z M13 8 H16 V16 H13 Z M18 8 H21 V14 H18 Z"
              fill="#ffffff"
            />
            <circle cx="23" cy="19" r="2" fill="#ffffff" />
          </svg>
        </a>

        <nav class="shell__nav">
          <a
            routerLink="/reservations"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
            >Reservations</a
          >
          <a routerLink="/operations" routerLinkActive="active">Operations</a>
          <a routerLink="/documents" routerLinkActive="active">Documents</a>
          <a routerLink="/finances" routerLinkActive="active">Finances</a>
          <a routerLink="/products" routerLinkActive="active">Products</a>

          <div
            class="shell__menu"
            (mouseenter)="openPartners($event)"
            (mouseleave)="partnersOpen.set(false)"
          >
            <button
              #partnersTrigger
              type="button"
              class="shell__menu-trigger"
              [class.active]="isPartnersActive()"
              [class.open]="partnersOpen()"
              (click)="togglePartners($event, partnersTrigger)"
              aria-haspopup="true"
              [attr.aria-expanded]="partnersOpen()"
            >
              Partners
              <span class="material-icons shell__menu-caret">expand_more</span>
            </button>
          </div>

          <a routerLink="/reports" routerLinkActive="active">Reports</a>
          <a routerLink="/options" routerLinkActive="active">Options</a>
          <button
            type="button"
            class="shell__reset"
            title="Reset all prototype data back to defaults"
            (click)="resetAllData()"
          >
            <span class="material-icons">refresh</span>
            Reset all data
          </button>
        </nav>

        <div class="shell__topbar-right">
          <label class="shell__search">
            <input type="text" placeholder="Search (Ctrl+G)" aria-label="Search" />
          </label>
          <button type="button" class="shell__user" aria-label="User menu">
            <span class="material-icons">person</span>
          </button>
        </div>
      </header>

      <main class="shell__content">
        <router-outlet />
      </main>

      <div
        *ngIf="partnersOpen()"
        class="shell__menu-panel"
        role="menu"
        [style.left.px]="partnersAnchor().left"
        [style.top.px]="partnersAnchor().top"
        (mouseenter)="partnersOpen.set(true)"
        (mouseleave)="partnersOpen.set(false)"
      >
        <a
          routerLink="/partners/customers"
          routerLinkActive="active"
          class="shell__menu-item"
          role="menuitem"
          (click)="partnersOpen.set(false)"
        >Customers</a>
        <a
          routerLink="/partners/travel-agents"
          routerLinkActive="active"
          class="shell__menu-item"
          role="menuitem"
          (click)="partnersOpen.set(false)"
        >Travel agents</a>
        <a
          routerLink="/partners/suppliers"
          routerLinkActive="active"
          class="shell__menu-item"
          role="menuitem"
          (click)="partnersOpen.set(false)"
        >Suppliers</a>
        <a
          routerLink="/partners/passengers"
          routerLinkActive="active"
          class="shell__menu-item"
          role="menuitem"
          (click)="partnersOpen.set(false)"
        >Passengers</a>
      </div>

      <app-window-layer />
    </div>
  `,
  styleUrl: './lemax-shell.component.css'
})
export class LemaxShellComponent {
  private readonly resetService = inject(AppDataResetService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly partnersOpen = signal(false);
  protected readonly partnersAnchor = signal<{ left: number; top: number }>({ left: 0, top: 56 });

  protected async resetAllData(): Promise<void> {
    const ok = window.confirm(
      'Reset all prototype data?\n\nThis clears every change you have made in this browser (reservations, customers, products, page edits, open windows) and reloads the original seed data.'
    );
    if (!ok) return;
    await this.resetService.resetAll();
  }

  protected openPartners(event: MouseEvent): void {
    const trigger = (event.currentTarget as HTMLElement)?.querySelector(
      '.shell__menu-trigger'
    ) as HTMLElement | null;
    if (trigger) this.anchorTo(trigger);
    this.partnersOpen.set(true);
  }

  protected togglePartners(event: MouseEvent, trigger: HTMLElement): void {
    event.stopPropagation();
    this.anchorTo(trigger);
    this.partnersOpen.update((open) => !open);
  }

  protected isPartnersActive(): boolean {
    return this.router.url.startsWith('/partners');
  }

  private anchorTo(trigger: HTMLElement): void {
    const rect = trigger.getBoundingClientRect();
    this.partnersAnchor.set({ left: Math.round(rect.left), top: Math.round(rect.bottom) });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.partnersOpen()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.partnersOpen.set(false);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.partnersOpen()) this.partnersOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.partnersOpen.set(false);
  }
}
