import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="placeholder">
      <header class="placeholder__header">
        <h1 class="lmx-page-title">{{ title }}</h1>
        <a routerLink="/reservations" class="lmx-btn lmx-btn--action-outline">Open reservations</a>
      </header>

      <article class="lmx-card placeholder__panel">
        <p>{{ description }}</p>
        <p class="placeholder__hint">
          This module is scaffolded for the prototype. The working v1 module is the reservations
          screen — open it to explore the data grid, filters, and reservation editor window.
        </p>
      </article>
    </section>
  `,
  styles: [
    `
      .placeholder {
        display: grid;
        gap: 12px;
        padding: 16px 24px 32px;
      }

      .placeholder__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .placeholder__panel {
        padding: 18px 20px;
      }

      .placeholder__panel p {
        margin: 0 0 8px;
        color: var(--lemax-text);
        max-width: 76ch;
      }

      .placeholder__hint {
        color: var(--lemax-muted);
      }
    `
  ]
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.data['title'] as string;
  protected readonly description = this.route.snapshot.data['description'] as string;
}
