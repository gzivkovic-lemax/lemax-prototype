import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="tone">
      <span class="status-badge__label">{{ label }}</span>
      <span class="status-badge__icon material-icons" *ngIf="icon">{{ icon }}</span>
    </span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        min-width: 49px;
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        white-space: nowrap;
      }

      .status-badge__label {
        flex: 1;
        text-align: center;
      }

      .status-badge__icon.material-icons {
        font-size: 14px;
      }

      .confirmed {
        background: var(--status-confirmed-bg);
        color: var(--status-confirmed-fg);
      }

      .option {
        background: var(--status-option-bg);
        color: var(--status-option-fg);
      }

      .inquiry {
        background: var(--status-inquiry-bg);
        color: var(--status-inquiry-fg);
      }

      .finished {
        background: var(--status-finished-bg);
        color: var(--status-finished-fg);
      }

      .cancelled,
      .unrealized {
        background: var(--status-cancelled-bg);
        color: var(--status-cancelled-fg);
      }
    `
  ]
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) tone = '';
  @Input() icon: string | null = null;
}
