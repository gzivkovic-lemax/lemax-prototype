import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface OperationRow {
  opsNo: string;
  itemId: string;
  product: string;
  unit: string;
  destination: string;
  startDate: string;
  endDate: string;
  leadPassenger: string;
  pax: string;
  net: string;
  supplier: string;
}

@Component({
  selector: 'app-operations-report-page',
  imports: [CommonModule],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Operations report</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action">
            Group actions <span class="caret material-icons">expand_more</span>
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">check_circle</span>Assign vehicle
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">check_circle</span>Assign guide
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">check_circle</span>New cash advance
          </button>
        </div>
      </header>

      <section class="ops-saved-filter">
        <label class="lmx-field">
          <span>Select custom filter configuration</span>
          <select class="lmx-select"><option>Default</option></select>
        </label>
        <label class="lmx-field">
          <span>Filter name</span>
          <input class="lmx-input" />
        </label>
        <button type="button" class="lmx-btn ops-saved-filter__disabled">Save</button>
        <button type="button" class="lmx-btn lmx-btn--blue">Save as</button>
        <button type="button" class="lmx-btn ops-saved-filter__disabled">Delete</button>
      </section>

      <section class="lmx-card lmx-filter-card lmx-filter-card--operations">
        <label class="lmx-field">
          <span>Customer reservation status</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Operational booking status</span>
          <select class="lmx-select"><option>Inquiry, Option, Confirmed, Fini...</option></select>
        </label>
        <label class="lmx-field">
          <span>Supplier status</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Item creation date</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Start date between</span>
          <input class="lmx-input" value="10/05/2026" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input class="lmx-input" value="17/05/2026" />
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>End date between</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Cancellation deadline <span class="material-icons ops-help">help</span></span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
          <button type="button" class="lmx-link-btn">Advanced<span class="material-icons">expand_more</span></button>
          <div class="ops-filter-links">
            <button type="button">Flight/bus list</button>
            <button type="button">Rooming list</button>
          </div>
        </div>
      </section>

      <div class="ops-group-bar">Drag a column header and drop it here to group by that column</div>

      <section class="lmx-card lmx-grid-card">
        <div class="lmx-grid-scroll">
          <table class="lmx-data-grid operations-grid">
            <colgroup>
              <col style="width: 38px" />
              <col style="width: 74px" />
              <col style="width: 78px" />
              <col style="width: 270px" />
              <col style="width: 130px" />
              <col style="width: 110px" />
              <col style="width: 100px" />
              <col style="width: 110px" />
              <col style="width: 42px" />
              <col style="width: 95px" />
              <col style="width: 190px" />
              <col style="width: 130px" />
              <col style="width: 95px" />
              <col style="width: 105px" />
              <col style="width: 72px" />
              <col style="width: 80px" />
              <col style="width: 48px" />
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all operations" /></th>
                <th>Ops no.</th>
                <th>Item ID</th>
                <th>Product</th>
                <th>Destination</th>
                <th class="operations-grid__sorted">Start date <span class="material-icons">arrow_downward</span></th>
                <th>End date</th>
                <th>Lead passenger</th>
                <th>Pax</th>
                <th>Net</th>
                <th>Supplier</th>
                <th>Supplier status</th>
                <th>Commission</th>
                <th>Cash advance</th>
                <th>Res. no.</th>
                <th>Custom...</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of operations">
                <td><input type="checkbox" [attr.aria-label]="'Select operation ' + row.opsNo" /></td>
                <td><span class="ops-badge">{{ row.opsNo }}</span></td>
                <td><button type="button" class="lmx-grid-link">{{ row.itemId }}</button></td>
                <td>
                  <button type="button" class="lmx-grid-link">{{ row.product }}</button>
                  <span class="lmx-grid-subtext">{{ row.unit }}</span>
                </td>
                <td>{{ row.destination }}</td>
                <td>{{ row.startDate }}</td>
                <td>{{ row.endDate }}</td>
                <td>{{ row.leadPassenger }}</td>
                <td>{{ row.pax }}</td>
                <td>{{ row.net }}</td>
                <td><button type="button" class="lmx-grid-link">{{ row.supplier }}</button></td>
                <td><button type="button" class="ops-status">Initial state <span class="material-icons">expand_more</span></button></td>
                <td>0.00 EUR</td>
                <td><input type="checkbox" aria-label="Cash advance" /></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `
})
export class OperationsReportPageComponent {
  private readonly hotelRows = Array.from({ length: 10 }, (_, index): OperationRow => ({
    opsNo: '10141',
    itemId: (536234 - index).toString(),
    product: 'Radisson Blu Resort',
    unit: 'Double room, Deluxe room Street view',
    destination: 'Split',
    startDate: '10/05/2026',
    endDate: '12/05/2026',
    leadPassenger: 'Name No',
    pax: '1',
    net: '694.29 EUR',
    supplier: 'Rezidor Hotel Group'
  }));

  protected readonly operations: OperationRow[] = [
    {
      opsNo: '10390',
      itemId: '537048',
      product: 'Generic transfer',
      unit: 'Daily rate (Worldwide)',
      destination: 'Worldwide - Worldwide',
      startDate: '10/05/2026',
      endDate: '10/05/2026',
      leadPassenger: 'Name No',
      pax: '1',
      net: '530.00 EUR',
      supplier: 'Transfers Ltd.'
    },
    ...this.hotelRows,
    {
      opsNo: '10391',
      itemId: '537049',
      product: 'Generic transfer',
      unit: 'Daily rate (Worldwide)',
      destination: 'Worldwide - Worldwide',
      startDate: '11/05/2026',
      endDate: '11/05/2026',
      leadPassenger: 'Name No',
      pax: '1',
      net: '530.00 EUR',
      supplier: 'Transfers Ltd.'
    }
  ];
}
