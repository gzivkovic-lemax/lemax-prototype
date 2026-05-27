import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PrototypeDataRepository, PrototypePassenger } from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

@Component({
  selector: 'app-passengers-page',
  imports: [CommonModule],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Passengers</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action" (click)="openNew()">
            <span class="material-icons">add</span>
            New passenger
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">Import</button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            Group actions <span class="caret material-icons">expand_more</span>
          </button>
        </div>
      </header>

      <section class="lmx-card lmx-filter-card lmx-filter-card--single-row">
        <label class="lmx-field">
          <span>Name / Surname</span>
          <input class="lmx-input" placeholder="Search..." />
        </label>
        <label class="lmx-field">
          <span>Country</span>
          <select class="lmx-select"><option>Please select</option></select>
        </label>
        <label class="lmx-field">
          <span>Citizenship</span>
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
          <span>Passport expires before</span>
          <input type="date" class="lmx-input" />
        </label>
        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue">Filter</button>
        </div>
      </section>

      <section class="lmx-card lmx-grid-card">
        <div class="lmx-grid-scroll">
          <table class="lmx-data-grid passengers-grid">
            <colgroup>
              <col style="width: 40px" />
              <col style="width: 78px" />
              <col style="width: 80px" />
              <col style="width: 180px" />
              <col style="width: 180px" />
              <col style="width: 110px" />
              <col style="width: 110px" />
              <col style="width: 110px" />
              <col style="width: 95px" />
              <col style="width: 200px" />
              <col style="width: 145px" />
              <col style="width: 95px" />
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all passengers" /></th>
                <th>Code</th>
                <th>Title</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Birth date</th>
                <th>Citizenship</th>
                <th>Passport no.</th>
                <th>Sex</th>
                <th>Email</th>
                <th>Mobile phone</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let row of passengers()"
                class="passengers-grid__row"
                (dblclick)="openEditor(row)"
              >
                <td><input type="checkbox" [attr.aria-label]="'Select ' + row.name" (click)="$event.stopPropagation()" /></td>
                <td>{{ row.code }}</td>
                <td>{{ row.title }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.surname }}</td>
                <td>{{ formatDate(row.birthDate) }}</td>
                <td>{{ row.citizenship }}</td>
                <td>{{ row.passportNumber }}</td>
                <td>{{ row.sex }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.mobilePhone }}</td>
                <td>
                  <div class="lmx-row-actions">
                    <button
                      type="button"
                      class="lmx-icon-btn"
                      aria-label="Edit"
                      (click)="$event.stopPropagation(); openEditor(row)"
                    >
                      <span class="material-icons">edit</span>
                    </button>
                    <button type="button" class="lmx-icon-btn" aria-label="Add"><span class="material-icons">add</span></button>
                    <button type="button" class="lmx-icon-btn" aria-label="Delete"><span class="material-icons">delete</span></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="passengers().length === 0">
                <td colspan="12" class="passengers-grid__empty">No passengers yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .passengers-grid__row {
        cursor: default;
      }

      .passengers-grid__row:hover {
        cursor: pointer;
      }

      .passengers-grid__empty {
        text-align: center;
        color: var(--lemax-muted);
        padding: 24px 8px;
      }
    `
  ]
})
export class PassengersPageComponent {
  private readonly repository = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);
  protected readonly passengers = this.repository.passengers;

  protected openEditor(passenger: PrototypePassenger): void {
    const title = [passenger.surname, passenger.name].filter((part) => part && part.trim()).join(' ') || passenger.name;
    this.windowManager.open('prototype-passenger', passenger.code, title, 'edit');
  }

  protected openNew(): void {
    this.windowManager.open('prototype-passenger', 'new', 'New passenger', 'edit');
  }

  protected formatDate(value: string | undefined): string {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return value;
  }
}
