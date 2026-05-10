import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AccommodationRow {
  code: string;
  name: string;
  country: string;
  region: string;
  destination: string;
  supplier: string;
  department: string;
  internalName: string;
}

@Component({
  selector: 'app-accommodation-page',
  imports: [CommonModule],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Accommodation</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action">
            <span class="material-icons">add</span>
            Add accommodation
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">open_in_new</span>
            Export price list
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">open_in_new</span>
            Export stop booking
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">sync</span>
            Sync all
          </button>
        </div>
      </header>

      <section class="lmx-card lmx-filter-card lmx-filter-card--compact">
        <label class="lmx-field">
          <span>Category</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
        </div>
      </section>

      <section class="lmx-card lmx-grid-card">
        <div class="lmx-grid-scroll">
          <table class="lmx-data-grid accommodation-grid">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 300px" />
              <col style="width: 145px" />
              <col style="width: 170px" />
              <col style="width: 160px" />
              <col style="width: 290px" />
              <col style="width: 100px" />
              <col style="width: 130px" />
              <col style="width: 130px" />
            </colgroup>
            <thead>
              <tr>
                <th>Unit code</th>
                <th>Name</th>
                <th>Country</th>
                <th>Region</th>
                <th>Destination</th>
                <th>Supplier</th>
                <th>Department</th>
                <th>Internal name</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of accommodations">
                <td>{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.country }}</td>
                <td>{{ row.region }}</td>
                <td>{{ row.destination }}</td>
                <td><button type="button" class="lmx-grid-link">{{ row.supplier }}</button></td>
                <td>{{ row.department }}</td>
                <td>{{ row.internalName }}</td>
                <td>
                  <div class="lmx-row-actions">
                    <button type="button" class="lmx-icon-btn" aria-label="Edit"><span class="material-icons">edit</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="View"><span class="material-icons">visibility</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Delete"><span class="material-icons">delete</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Copy"><span class="material-icons">content_copy</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="PDF"><span class="material-icons">picture_as_pdf</span></button>
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
export class AccommodationPageComponent {
  protected readonly accommodations: AccommodationRow[] = [
    { code: '8871', name: 'Hilton Parks', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '' },
    { code: '9972', name: 'Hilton Parks Hvar', country: 'Croatia', region: 'South Dalmatia', destination: 'Hvar', supplier: 'Hilton Hotels & Resorts, Wien, Am Stadtpark 1', department: 'Default', internalName: '' },
    { code: '9524', name: 'PARK PIOLETS', country: 'Andorra', region: 'Andorra', destination: 'Andorra', supplier: 'Tripical', department: '', internalName: '' },
    { code: '12114', name: 'Sea Bed Rooms and Apartment | Guest House', country: 'Croatia', region: 'Middle Dalmatia', destination: 'Split', supplier: 'Aborda d.o.o.', department: '', internalName: '' },
    { code: '7704', name: '2nd driver', country: 'Worldwide', region: 'Worldwide', destination: 'Worldwide', supplier: 'Lucketts Travel Holidays', department: 'Default', internalName: '' },
    { code: '8977', name: '4 Star Innsbruck', country: 'Europe', region: 'Austria', destination: 'Innsbruck', supplier: 'Hotel Innsbruck', department: 'Default', internalName: '' },
    { code: '8971', name: '5 Star Hotel Vienna', country: 'Europe', region: 'Austria', destination: 'Vienna', supplier: 'Activities Ltd', department: 'Default', internalName: '' },
    { code: '8974', name: '5 Star Salzburg Hotel', country: 'Europe', region: 'Austria', destination: 'Salzburg', supplier: 'Activities Ltd', department: 'Default', internalName: '' },
    { code: '1083', name: 'Aetas Lumpini', country: 'Thailand', region: 'Bangkok Area', destination: 'Bangkok', supplier: 'Lemax', department: '', internalName: '' },
    { code: '10322', name: 'Airport Assistance', country: 'Peru', region: 'Lima Province', destination: 'Lima', supplier: 'Peru Travel Company', department: '', internalName: '' },
    { code: '2982', name: 'All C. - Internal Guide - Spanish', country: 'United Arab Emirates', region: 'Dubai', destination: 'Dubai', supplier: 'Lemax Booking', department: '', internalName: '' },
    { code: '8201', name: 'All Inclusive (Adulty Only Resort 16yrs+)', country: 'Mauritius', region: 'Mauritius', destination: 'Mauritius', supplier: 'Sunlife', department: '', internalName: '' },
    { code: '6955', name: 'Amadria park', country: 'Croatia', region: 'North Dalmatia', destination: 'Šibenik', supplier: 'Hotel Andrija', department: 'Default', internalName: '' },
    { code: '11888', name: 'Ananea Madivaru Maldives', country: 'Maldives', region: 'Male', destination: 'Male Intl Arpt', supplier: 'Maldives DMC Supplier', department: '', internalName: '' },
    { code: '174', name: 'Anker Hotel', country: 'Norway', region: 'Oslo', destination: 'Oslo', supplier: 'Foreign Hotels Ltd.', department: 'Default', internalName: '' },
    { code: '8696', name: 'Another hotel from chain', country: 'Chile', region: 'Santiago', destination: 'Santiago', supplier: 'Activities Ltd', department: '', internalName: '' },
    { code: '37', name: 'Apartment Studio Guliver', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '' },
    { code: '34', name: 'Apartment Studio Šestan', country: 'Croatia', region: 'Istria', destination: 'Pula x', supplier: 'Lemax', department: 'Default', internalName: '' }
  ];
}
