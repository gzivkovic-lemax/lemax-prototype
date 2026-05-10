import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PrototypeDataRepository } from './prototype-data-repository.service';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-offers-page',
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Offers</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action">
            Group actions <span class="caret material-icons">expand_more</span>
          </button>
        </div>
      </header>

      <section class="lmx-card lmx-filter-card lmx-filter-card--offers">
        <label class="lmx-field">
          <span>Reservation status</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Document date between</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field">
          <span>Department</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Customer:</span>
          <select class="lmx-select"><option>Start typing a name</option></select>
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Check in between</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field">
          <span>Branch office</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Company / Person</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Due date between</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
          <button type="button" class="lmx-link-btn">Advanced<span class="material-icons">expand_more</span></button>
        </div>
      </section>

      <section class="lmx-card lmx-grid-card">
        <div class="lmx-grid-scroll">
          <table class="lmx-data-grid offers-grid">
            <colgroup>
              <col style="width: 40px" />
              <col style="width: 130px" />
              <col style="width: 92px" />
              <col style="width: 285px" />
              <col style="width: 120px" />
              <col style="width: 160px" />
              <col style="width: 145px" />
              <col style="width: 150px" />
              <col style="width: 160px" />
              <col style="width: 92px" />
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all offers" /></th>
                <th>Doc. no.</th>
                <th>Res. no.</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Branch office</th>
                <th>Created by</th>
                <th>VAT type</th>
                <th class="align-right">Amount</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of offers()">
                <td><input type="checkbox" [attr.aria-label]="'Select offer ' + row.docNo" /></td>
                <td>{{ row.docNo }}</td>
                <td><app-status-badge [label]="row.resNo" [tone]="row.tone" /></td>
                <td><button type="button" class="lmx-grid-link">{{ row.customer }}</button></td>
                <td>{{ row.date }}</td>
                <td>{{ row.branchOffice }}</td>
                <td>{{ row.createdBy }}</td>
                <td>{{ row.vatType }}</td>
                <td class="align-right">{{ row.amount }}</td>
                <td>
                  <div class="lmx-row-actions">
                    <button type="button" class="lmx-icon-btn" aria-label="Email"><span class="material-icons">mail</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="PDF"><span class="material-icons">picture_as_pdf</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Cancel"><span class="material-icons">cancel</span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `
})
export class OffersPageComponent {
  private readonly repository = inject(PrototypeDataRepository);
  protected readonly offers = this.repository.offers;
}
