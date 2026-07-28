import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { BusinessEntitySelectComponent } from './business-entity-select.component';
import {
  PrototypeCalculationSettings,
  PrototypeDataRepository,
  ROOM_OCCUPANCIES
} from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

@Component({
  selector: 'app-calculation-settings-window',
  imports: [CommonModule, BusinessEntitySelectComponent],
  template: `
    <div class="settings">
      <div class="settings__body">
        <article class="lmx-card settings__card">
          <h3 class="settings__card-title">General</h3>

          <div class="settings__row">
            <label class="settings__label" for="settings-individual-prices">Enable setting individual prices</label>
            <select
              id="settings-individual-prices"
              class="lmx-select"
              [value]="individualPrices()"
              (change)="individualPrices.set($any($event.target).value)"
            >
              <option value="None">None</option>
            </select>
          </div>

          <div class="settings__row">
            <span class="settings__label">Keep selling price</span>
            <label class="lmx-checkbox">
              <input type="checkbox" [checked]="keepSellingPrice()" (change)="keepSellingPrice.set($any($event.target).checked)" />
            </label>
          </div>

          <div class="settings__row">
            <span class="settings__label">Calculate group price on reservation level</span>
            <label class="lmx-checkbox">
              <input
                type="checkbox"
                [checked]="calculateOnReservationLevel()"
                (change)="calculateOnReservationLevel.set($any($event.target).checked)"
              />
            </label>
          </div>

          <div class="settings__row">
            <label class="settings__label" for="settings-pricing-policy">Pricing policy</label>
            <select
              id="settings-pricing-policy"
              class="lmx-select"
              [value]="pricingPolicy()"
              (change)="pricingPolicy.set($any($event.target).value)"
            >
              <option value="Apply pricing policy">Apply pricing policy</option>
              <option value="Do not apply pricing policy">Do not apply pricing policy</option>
            </select>
          </div>

          <div class="settings__row">
            <span class="settings__label">Set different price for different room occupancy</span>
            <app-business-entity-select
              [options]="roomOccupancyOptions"
              [selected]="roomOccupancies()"
              (selectedChange)="roomOccupancies.set($event)"
            />
          </div>

          <div class="settings__row">
            <span class="settings__label">Occupancy (min-max)</span>
            <div class="settings__occupancy">
              <input
                class="lmx-input"
                type="text"
                aria-label="Occupancy minimum"
                [value]="occupancyMin()"
                (change)="occupancyMin.set($any($event.target).value)"
              />
              <input
                class="lmx-input"
                type="text"
                aria-label="Occupancy maximum"
                [value]="occupancyMax()"
                (change)="occupancyMax.set($any($event.target).value)"
              />
            </div>
          </div>
        </article>
      </div>

      <footer class="settings__footer">
        <button type="button" class="lmx-btn lmx-btn--action settings__ok" (click)="save()">OK</button>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .settings {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .settings__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 12px;
      }

      .settings__card {
        padding: 14px 18px 18px;
      }

      .settings__card-title {
        margin: 0 0 14px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .settings__row {
        display: grid;
        grid-template-columns: 168px 240px;
        align-items: center;
        column-gap: 24px;
        min-height: 40px;
      }

      .settings__label {
        font-size: 12px;
        color: var(--lemax-text);
        line-height: 18px;
      }

      .settings__row .lmx-select,
      .settings__row app-business-entity-select {
        width: 100%;
        min-width: 0;
      }

      .settings__occupancy {
        display: flex;
        gap: 12px;
      }

      .settings__occupancy .lmx-input {
        width: 56px;
        text-align: center;
      }

      .settings__footer {
        display: flex;
        justify-content: flex-end;
        padding: 12px 16px;
        flex-shrink: 0;
      }

      .settings__ok {
        min-width: 76px;
        justify-content: center;
      }
    `
  ]
})
export class CalculationSettingsWindowComponent implements OnInit {
  @Input({ required: true }) windowId = '';

  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly roomOccupancyOptions = ROOM_OCCUPANCIES;

  protected readonly individualPrices = signal('None');
  protected readonly keepSellingPrice = signal(false);
  protected readonly calculateOnReservationLevel = signal(false);
  protected readonly pricingPolicy = signal('Apply pricing policy');
  protected readonly roomOccupancies = signal<string[]>([]);
  protected readonly occupancyMin = signal('1');
  protected readonly occupancyMax = signal('2');

  ngOnInit(): void {
    const settings = this.prototypeData.getCalculationSettings();
    this.individualPrices.set(settings.individualPrices);
    this.keepSellingPrice.set(settings.keepSellingPrice);
    this.calculateOnReservationLevel.set(settings.calculateGroupPriceOnReservationLevel);
    this.pricingPolicy.set(settings.pricingPolicy);
    this.roomOccupancies.set(settings.roomOccupancies);
    this.occupancyMin.set(settings.occupancyMin);
    this.occupancyMax.set(settings.occupancyMax);
  }

  protected save(): void {
    const settings: PrototypeCalculationSettings = {
      individualPrices: this.individualPrices(),
      keepSellingPrice: this.keepSellingPrice(),
      calculateGroupPriceOnReservationLevel: this.calculateOnReservationLevel(),
      pricingPolicy: this.pricingPolicy(),
      roomOccupancies: this.roomOccupancies(),
      occupancyMin: this.occupancyMin(),
      occupancyMax: this.occupancyMax()
    };

    this.prototypeData.saveCalculationSettings(settings);
    this.windowManager.close(this.windowId);
  }
}
