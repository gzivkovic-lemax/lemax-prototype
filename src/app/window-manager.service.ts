import { Injectable, signal } from '@angular/core';
import { CustomerRepository } from './customer-repository.service';
import { LemaxWindowKind, LemaxWindowState } from './models';
import { ProductRepository } from './product-repository.service';
import { PrototypeDataRepository } from './prototype-data-repository.service';
import { ReservationRepository } from './reservation-repository.service';
import { STORAGE_KEYS, StorageService } from './storage.service';

const BASE_Z_INDEX = 20;

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  readonly windows = signal<LemaxWindowState[]>([]);

  constructor(
    private readonly storage: StorageService,
    private readonly reservationRepository: ReservationRepository,
    private readonly productRepository: ProductRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly prototypeData: PrototypeDataRepository
  ) {
    this.restore();
  }

  open(kind: LemaxWindowKind, entityId: string, title: string, mode: 'edit' | 'read'): void {
    const existingWindow = this.windows().find(
      (windowState) => windowState.kind === kind && windowState.entityId === entityId
    );

    if (existingWindow) {
      this.focus(existingWindow.windowId);
      return;
    }

    const windowCount = this.windows().length;
    const size = this.computeSize(kind);
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
    const nextWindow: LemaxWindowState = {
      windowId: `${kind}-${entityId}`,
      kind,
      entityId,
      title,
      mode,
      position:
        kind === 'reservation' ||
        kind === 'prototype-customer' ||
        kind === 'prototype-passenger' ||
        kind === 'prototype-accommodation' ||
        kind === 'prototype-contract'
          ? {
              x: Math.max(16, Math.round((viewportWidth - size.width) / 2)),
              y: Math.max(16, Math.round((viewportHeight - size.height) / 2))
            }
          : {
              x: 96 + (windowCount % 5) * 28,
              y: 88 + (windowCount % 4) * 24
            },
      size,
      zIndex: this.getNextZIndex(),
      active: true
    };

    this.persist([...this.deactivateAll(this.windows()), nextWindow]);
  }

  focus(windowId: string): void {
    const nextZIndex = this.getNextZIndex();
    const nextWindows = this.windows().map((windowState) => ({
      ...windowState,
      active: windowState.windowId === windowId,
      zIndex: windowState.windowId === windowId ? nextZIndex : windowState.zIndex
    }));

    this.persist(nextWindows);
  }

  close(windowId: string): void {
    const remainingWindows = this.windows().filter((windowState) => windowState.windowId !== windowId);
    const sorted = [...remainingWindows].sort((left, right) => right.zIndex - left.zIndex);
    const activeWindowId = sorted[0]?.windowId;

    this.persist(
      remainingWindows.map((windowState) => ({
        ...windowState,
        active: windowState.windowId === activeWindowId
      }))
    );
  }

  move(windowId: string, x: number, y: number): void {
    this.persist(
      this.windows().map((windowState) =>
        windowState.windowId === windowId
          ? {
              ...windowState,
              position: {
                x: Math.max(24, x),
                y: Math.max(24, y)
              }
            }
          : windowState
      )
    );
  }

  updateTitle(windowId: string, title: string): void {
    this.persist(
      this.windows().map((windowState) =>
        windowState.windowId === windowId ? { ...windowState, title } : windowState
      )
    );
  }

  restore(): void {
    const restoredWindows = this.storage
      .get<LemaxWindowState[]>(STORAGE_KEYS.windows, [])
      .filter((windowState) => this.entityExists(windowState.kind, windowState.entityId))
      .map((windowState, index, items) => ({
        ...windowState,
        size: this.resizeIfStale(windowState),
        active: index === items.length - 1
      }));

    this.windows.set(restoredWindows);
  }

  private computeSize(kind: LemaxWindowKind): { width: number; height: number } {
    if (
      kind !== 'reservation' &&
      kind !== 'prototype-customer' &&
      kind !== 'prototype-passenger' &&
      kind !== 'prototype-accommodation' &&
      kind !== 'prototype-contract'
    ) {
      return { width: 520, height: 440 };
    }

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;

    if (kind === 'prototype-customer') {
      return {
        width: Math.min(1480, Math.max(1040, Math.round(viewportWidth * 0.9))),
        height: Math.min(960, Math.max(680, Math.round(viewportHeight * 0.88)))
      };
    }

    if (kind === 'prototype-passenger') {
      return {
        width: Math.min(1280, Math.max(900, Math.round(viewportWidth * 0.78))),
        height: Math.min(880, Math.max(620, Math.round(viewportHeight * 0.82)))
      };
    }

    return {
      width: Math.min(1600, Math.max(1100, Math.round(viewportWidth * 0.95))),
      height: Math.min(1100, Math.max(720, Math.round(viewportHeight * 0.92)))
    };
  }

  private resizeIfStale(windowState: LemaxWindowState): { width: number; height: number } {
    if (
      windowState.kind !== 'reservation' &&
      windowState.kind !== 'prototype-customer' &&
      windowState.kind !== 'prototype-passenger' &&
      windowState.kind !== 'prototype-accommodation' &&
      windowState.kind !== 'prototype-contract'
    ) {
      return windowState.size;
    }
    const target = this.computeSize(windowState.kind);
    if (windowState.size.width >= target.width - 100) {
      return windowState.size;
    }
    return target;
  }

  private entityExists(kind: LemaxWindowKind, entityId: string): boolean {
    if (kind === 'reservation') {
      return Boolean(this.reservationRepository.getById(entityId));
    }

    if (kind === 'product') {
      return Boolean(this.productRepository.getById(entityId));
    }

    if (kind === 'prototype-customer') {
      return (
        entityId === 'new' ||
        entityId.startsWith('new-') ||
        Boolean(this.prototypeData.getCustomerByCode(entityId))
      );
    }

    if (kind === 'prototype-passenger') {
      return entityId === 'new' || Boolean(this.prototypeData.getPassengerByCode(entityId));
    }

    if (kind === 'prototype-accommodation') {
      return entityId === 'new' || Boolean(this.prototypeData.getAccommodationByCode(entityId));
    }

    if (kind === 'prototype-contract') {
      const [accommodationCode, contractCode] = entityId.split(':');
      return contractCode === 'new'
        ? Boolean(this.prototypeData.getAccommodationByCode(accommodationCode))
        : Boolean(this.prototypeData.getContractByCode(contractCode));
    }

    return Boolean(this.customerRepository.getById(entityId));
  }

  private deactivateAll(windows: LemaxWindowState[]): LemaxWindowState[] {
    return windows.map((windowState) => ({ ...windowState, active: false }));
  }

  private getNextZIndex(): number {
    return this.windows().reduce((maxZIndex, windowState) => Math.max(maxZIndex, windowState.zIndex), BASE_Z_INDEX) + 1;
  }

  private persist(windows: LemaxWindowState[]): void {
    this.windows.set(windows);
    this.storage.set(STORAGE_KEYS.windows, windows);
  }
}
