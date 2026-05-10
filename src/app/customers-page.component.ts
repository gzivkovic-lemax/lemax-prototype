import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PrototypeDataRepository } from './prototype-data-repository.service';

@Component({
  selector: 'app-customers-page',
  imports: [CommonModule],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Customers</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action">
            <span class="material-icons">add</span>
            New customer
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">Import</button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            Group actions <span class="caret material-icons">expand_more</span>
          </button>
        </div>
      </header>

      <section class="lmx-card lmx-filter-card lmx-filter-card--single-row">
        <label class="lmx-field">
          <span>Do not contact</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>VIP client</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field lmx-field--narrow">
          <span>Birth date</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field lmx-field--narrow lmx-field--blank-label">
          <span>&nbsp;</span>
          <input type="date" class="lmx-input" />
        </label>
        <label class="lmx-field">
          <span>Member of a group</span>
          <input class="lmx-input" />
        </label>
        <label class="lmx-field">
          <span>Vegetarian</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Loyalty</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Minimum margin</span>
          <input class="lmx-input" />
        </label>
        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
        </div>
      </section>

      <section class="lmx-card lmx-grid-card">
        <div class="lmx-grid-scroll">
          <table class="lmx-data-grid customers-grid">
            <colgroup>
              <col style="width: 40px" />
              <col style="width: 72px" />
              <col style="width: 225px" />
              <col style="width: 82px" />
              <col style="width: 82px" />
              <col style="width: 110px" />
              <col style="width: 90px" />
              <col style="width: 105px" />
              <col style="width: 145px" />
              <col style="width: 150px" />
              <col style="width: 120px" />
              <col style="width: 95px" />
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all customers" /></th>
                <th>Code</th>
                <th>Name</th>
                <th>Country</th>
                <th>City</th>
                <th>Address</th>
                <th>Zip code</th>
                <th>Telephone</th>
                <th>Type</th>
                <th>Email</th>
                <th>Mobile phone</th>
                <th>Tax type</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of customers()">
                <td><input type="checkbox" [attr.aria-label]="'Select ' + row.name" /></td>
                <td>{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.country }}</td>
                <td>{{ row.city }}</td>
                <td>{{ row.address }}</td>
                <td>{{ row.zipCode }}</td>
                <td>{{ row.telephone }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.mobilePhone }}</td>
                <td>{{ row.taxType }}</td>
                <td>
                  <div class="lmx-row-actions">
                    <button type="button" class="lmx-icon-btn" aria-label="Edit"><span class="material-icons">edit</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Add"><span class="material-icons">add</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Delete"><span class="material-icons">delete</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Finance"><span class="material-icons">paid</span></button>
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
export class CustomersPageComponent {
  private readonly repository = inject(PrototypeDataRepository);
  protected readonly customers = this.repository.customers;
}
