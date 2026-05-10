import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';

interface OfferRow {
  docNo: string;
  resNo: string;
  tone: string;
  customer: string;
  date: string;
  branchOffice: string;
  createdBy: string;
  vatType: string;
  amount: string;
}

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
              <tr *ngFor="let row of offers">
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
  protected readonly offers: OfferRow[] = [
    { docNo: '31/2026', resNo: '9898', tone: 'option', customer: 'Lemax', date: '01/04/2026', branchOffice: 'Central office', createdBy: 'Timko Antonio', vatType: 'On total price', amount: '360.00 EUR' },
    { docNo: '30/2026', resNo: '10620', tone: 'option', customer: 'Lemax', date: '01/04/2026', branchOffice: 'Central office', createdBy: 'Živković Goran', vatType: 'On total price', amount: '260.00 EUR' },
    { docNo: '28/2026', resNo: '10664', tone: 'option', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '75,000.00 EUR' },
    { docNo: '27/2026', resNo: '10655', tone: 'confirmed', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '58,110.00 EUR' },
    { docNo: '26/2026', resNo: '10656', tone: 'option', customer: 'Partner 2', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '32,224.00 EUR' },
    { docNo: '29/2026', resNo: '10685', tone: 'confirmed', customer: 'Partner 1', date: '04/03/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On total price', amount: '85,000.00 EUR' },
    { docNo: '25/2026', resNo: '10630', tone: 'confirmed', customer: 'Johnson Roy', date: '17/02/2026', branchOffice: 'Central office', createdBy: 'Baljak Milenka', vatType: 'On margin', amount: '5,581.66 USD' },
    { docNo: '24/2026', resNo: '10612', tone: 'confirmed', customer: 'Smith Annie', date: '28/01/2026', branchOffice: 'Central office', createdBy: 'Lambaša Gorana', vatType: 'On margin', amount: '12,988.00 GBP' },
    { docNo: '23/2026', resNo: '10277', tone: 'confirmed', customer: 'Bellows Clive', date: '28/01/2026', branchOffice: 'Central office', createdBy: 'Lambaša Gorana', vatType: 'On margin', amount: '5,428.00 EUR' },
    { docNo: '22/2026', resNo: '10237', tone: 'inquiry', customer: 'Audley Travel', date: '20/01/2026', branchOffice: 'Central office', createdBy: 'Lambaša Gorana', vatType: 'On margin', amount: '13,998.00 GBP' },
    { docNo: '20/2026', resNo: '9941', tone: 'confirmed', customer: 'Johnson Roy', date: '16/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '2,687.02 EUR' },
    { docNo: '21/2026', resNo: '9942', tone: 'confirmed', customer: 'Jet2', date: '16/01/2026', branchOffice: 'Central office', createdBy: 'Lambaša Gorana', vatType: 'On margin', amount: '2,124.00 GBP' },
    { docNo: '18/2026', resNo: '9938', tone: 'confirmed', customer: 'Johnson Roy', date: '16/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '3,311.04 EUR' },
    { docNo: '19/2026', resNo: '9939', tone: 'confirmed', customer: 'Jet2', date: '16/01/2026', branchOffice: 'Central office', createdBy: 'Lambaša Gorana', vatType: 'On margin', amount: '2,072.00 GBP' },
    { docNo: '12/2026', resNo: '9917', tone: 'confirmed', customer: 'Johnson Adam', date: '15/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '2,808.92 EUR' },
    { docNo: '15/2026', resNo: '9924', tone: 'confirmed', customer: 'Johnson Roy', date: '15/01/2026', branchOffice: 'Online booking (B2C)', createdBy: 'Johnson Roy', vatType: 'On margin', amount: '1,128.50 GBP' }
  ];
}
