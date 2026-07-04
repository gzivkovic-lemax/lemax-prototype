import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { BUSINESS_ENTITIES } from './prototype-data-repository.service';

@Component({
  selector: 'app-business-entity-select',
  imports: [CommonModule],
  template: `
    <button type="button" class="lmx-select business-entities-combo" (click)="toggle()">
      <span class="business-entities-combo__label">{{ summaryLabel() }}</span>
      <span class="material-icons">{{ open() ? 'expand_less' : 'expand_more' }}</span>
    </button>

    <div class="business-entities-panel" *ngIf="open()">
      <label class="business-entities-panel__option">
        <input type="checkbox" [checked]="allSelected()" (change)="toggleSelectAll()" />
        Select all
      </label>
      <label class="business-entities-panel__option" *ngFor="let entity of options">
        <input type="checkbox" [checked]="isSelected(entity)" (change)="toggleEntity(entity)" />
        {{ entity }}
      </label>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
    }

    .business-entities-combo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      appearance: none;
      cursor: pointer;
      text-align: left;
    }

    .business-entities-combo__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--lemax-text);
    }

    .business-entities-combo .material-icons {
      font-size: 18px;
      color: var(--lemax-muted);
    }

    .business-entities-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      z-index: 20;
      background: #fff;
      border: 1px solid var(--lemax-border);
      border-radius: var(--radius-sm);
      box-shadow: 0 4px 12px rgba(10, 43, 69, 0.12);
      padding: 4px 0;
    }

    .business-entities-panel__option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 400;
      color: var(--lemax-text);
      cursor: pointer;
    }

    .business-entities-panel__option:hover {
      background: var(--lemax-blue-soft);
    }

    .business-entities-panel__option input {
      width: 14px;
      height: 14px;
      accent-color: var(--lemax-blue);
    }

    .business-entities-panel__option:first-child {
      border-bottom: 1px solid var(--lemax-border-soft);
      margin-bottom: 4px;
      padding-bottom: 8px;
      font-weight: 500;
    }
  `]
})
export class BusinessEntitySelectComponent {
  @Input() options: string[] = BUSINESS_ENTITIES;

  @Input()
  set selected(value: string[] | null | undefined) {
    this.selectedSet.set(new Set(value ?? []));
  }

  @Output() readonly selectedChange = new EventEmitter<string[]>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly open = signal(false);
  private readonly selectedSet = signal<Set<string>>(new Set());

  protected readonly allSelected = computed(
    () => this.options.length > 0 && this.selectedSet().size === this.options.length
  );

  protected readonly summaryLabel = computed(() => {
    const selected = this.selectedSet();
    if (selected.size === 0) {
      return 'Please select';
    }
    if (selected.size === this.options.length) {
      return 'All';
    }
    return this.options.filter((entity) => selected.has(entity)).join(', ');
  });

  isSelected(entity: string): boolean {
    return this.selectedSet().has(entity);
  }

  toggle(): void {
    this.open.update((isOpen) => !isOpen);
  }

  toggleSelectAll(): void {
    const next = this.allSelected() ? new Set<string>() : new Set(this.options);
    this.selectedSet.set(next);
    this.selectedChange.emit([...next]);
  }

  toggleEntity(entity: string): void {
    const next = new Set(this.selectedSet());
    if (next.has(entity)) {
      next.delete(entity);
    } else {
      next.add(entity);
    }
    this.selectedSet.set(next);
    this.selectedChange.emit([...next]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
