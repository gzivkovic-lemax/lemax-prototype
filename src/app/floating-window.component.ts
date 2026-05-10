import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { LemaxWindowState } from './models';

@Component({
  selector: 'app-floating-window',
  imports: [CommonModule],
  template: `
    <section
      class="floating-window"
      [class.active]="window.active"
      [style.left.px]="window.position.x"
      [style.top.px]="window.position.y"
      [style.width.px]="window.size.width"
      [style.height.px]="window.size.height"
      [style.zIndex]="window.zIndex"
      (mousedown)="focus.emit(window.windowId)"
    >
      <header class="floating-window__header" (mousedown)="startDrag($event)">
        <div class="floating-window__title">{{ window.title }}</div>

        <div class="floating-window__controls">
          <button type="button" class="floating-window__icon" aria-label="Refresh">
            <span class="material-icons">refresh</span>
          </button>
          <button type="button" class="floating-window__icon" aria-label="Minimize">
            <span class="material-icons">remove</span>
          </button>
          <button type="button" class="floating-window__icon" aria-label="Maximize">
            <span class="material-icons">crop_square</span>
          </button>
          <button
            type="button"
            class="floating-window__icon floating-window__icon--close"
            aria-label="Close"
            (click)="close.emit(window.windowId)"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
      </header>

      <div class="floating-window__content">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .floating-window {
        position: absolute;
        overflow: hidden;
        border: 1px solid rgba(10, 43, 69, 0.18);
        border-radius: 6px;
        background: #fff;
        box-shadow: var(--shadow-window);
        display: flex;
        flex-direction: column;
      }

      .floating-window.active {
        box-shadow: 0 22px 60px rgba(10, 43, 69, 0.28);
      }

      .floating-window__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 4px 0 16px;
        background: var(--lemax-blue);
        color: #fff;
        cursor: move;
        flex-shrink: 0;
      }

      .floating-window__title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.005em;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 12px;
      }

      .floating-window__controls {
        display: flex;
        align-items: center;
        gap: 0;
        flex-shrink: 0;
      }

      .floating-window__icon {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border: 0;
        background: transparent;
        color: rgba(255, 255, 255, 0.92);
        border-radius: 4px;
        cursor: pointer;
      }

      .floating-window__icon:hover {
        background: rgba(0, 0, 0, 0.18);
        color: #fff;
      }

      .floating-window__icon .material-icons {
        font-size: 18px;
      }

      .floating-window__icon--close:hover {
        background: var(--lemax-action);
      }

      .floating-window__content {
        flex: 1;
        min-height: 0;
        overflow: auto;
        background: var(--lemax-bg);
      }
    `
  ]
})
export class FloatingWindowComponent implements OnDestroy {
  @Input({ required: true }) window!: LemaxWindowState;
  @Output() close = new EventEmitter<string>();
  @Output() focus = new EventEmitter<string>();
  @Output() move = new EventEmitter<{ windowId: string; x: number; y: number }>();

  private dragState:
    | {
        startX: number;
        startY: number;
        originX: number;
        originY: number;
      }
    | undefined;

  private readonly onMouseMove = (event: MouseEvent) => {
    if (!this.dragState) {
      return;
    }

    this.move.emit({
      windowId: this.window.windowId,
      x: this.dragState.originX + event.clientX - this.dragState.startX,
      y: this.dragState.originY + event.clientY - this.dragState.startY
    });
  };

  private readonly onMouseUp = () => {
    this.dragState = undefined;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  startDrag(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    this.focus.emit(this.window.windowId);

    this.dragState = {
      startX: event.clientX,
      startY: event.clientY,
      originX: this.window.position.x,
      originY: this.window.position.y
    };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy(): void {
    this.onMouseUp();
  }
}
