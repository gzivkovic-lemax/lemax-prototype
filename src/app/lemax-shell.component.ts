import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
          <a routerLink="/partners" routerLinkActive="active">Partners</a>
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

      <app-window-layer />
    </div>
  `,
  styleUrl: './lemax-shell.component.css'
})
export class LemaxShellComponent {
  private readonly resetService = inject(AppDataResetService);

  protected async resetAllData(): Promise<void> {
    const ok = window.confirm(
      'Reset all prototype data?\n\nThis clears every change you have made in this browser (reservations, customers, products, page edits, open windows) and reloads the original seed data.'
    );
    if (!ok) return;
    await this.resetService.resetAll();
  }
}
