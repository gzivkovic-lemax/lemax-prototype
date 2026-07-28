import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BusinessEntitySelectComponent } from './business-entity-select.component';
import { PROTOTYPE_CONFIG } from './prototype-config';
import { CURRENT_USER_BUSINESS_ENTITY, PrototypeAccommodation, PrototypeDataRepository } from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

@Component({
  selector: 'app-groups-page',
  imports: [CommonModule, BusinessEntitySelectComponent],
  template: `
    <section class="lmx-list-page">
      <header class="lmx-list-page__header">
        <h1 class="lmx-page-title">Groups</h1>
        <div class="lmx-list-page__actions">
          <button type="button" class="lmx-btn lmx-btn--action" (click)="openNew()">
            <span class="material-icons">add</span>
            Add group
          </button>
          <button type="button" class="lmx-btn lmx-btn--action-outline">
            <span class="material-icons">open_in_new</span>
            Export price list
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

        <div class="lmx-field business-entities-field" *ngIf="enableBusinessEntities">
          <span>Business entities</span>
          <app-business-entity-select
            [selected]="selectedBusinessEntities()"
            (selectedChange)="selectedBusinessEntities.set($event)"
          />
        </div>

        <div class="lmx-filter-card__submit">
          <button type="button" class="lmx-btn lmx-btn--blue" (click)="applyFilter()">Filter</button>
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
              <col style="width: 100px" />
              <col style="width: 150px" />
              <col style="width: 150px" *ngIf="enableBusinessEntities" />
              <col style="width: 130px" />
            </colgroup>
            <thead>
              <tr>
                <th>Unit code</th>
                <th>Name</th>
                <th>Country</th>
                <th>Region</th>
                <th>Destination</th>
                <th>Department</th>
                <th>Internal name</th>
                <th *ngIf="enableBusinessEntities">Business entity</th>
                <th class="lmx-grid-actions-head">
                  <button type="button" class="lmx-icon-btn lmx-icon-btn--filter" aria-label="Column filters">
                    <span class="material-icons">filter_alt</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of filteredGroups()" (dblclick)="openEditor(row)">
                <td>{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.country }}</td>
                <td>{{ row.region }}</td>
                <td>{{ row.destination }}</td>
                <td>{{ row.department }}</td>
                <td>{{ row.internalName }}</td>
                <td *ngIf="enableBusinessEntities">{{ (row.businessEntities ?? []).join(', ') }}</td>
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
  `,
  styles: [`
    .business-entities-field {
      position: relative;
    }
  `]
})
export class GroupsPageComponent {
  private readonly repository = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly groups = this.repository.groupProducts;
  protected readonly enableBusinessEntities = PROTOTYPE_CONFIG.enableBusinessEntities;
  protected readonly selectedBusinessEntities = signal<string[]>([CURRENT_USER_BUSINESS_ENTITY]);
  protected readonly appliedBusinessEntities = signal<string[]>([CURRENT_USER_BUSINESS_ENTITY]);

  protected readonly filteredGroups = computed(() => {
    const selected = this.appliedBusinessEntities();
    if (selected.length === 0) {
      return this.groups();
    }
    return this.groups().filter((row) =>
      (row.businessEntities ?? []).some((entity) => selected.includes(entity))
    );
  });

  protected applyFilter(): void {
    this.appliedBusinessEntities.set(this.selectedBusinessEntities());
  }

  protected openEditor(row: PrototypeAccommodation): void {
    const title = row.destination ? `${row.name} (${row.destination})` : row.name;
    this.windowManager.open('prototype-group', row.code, title, 'edit');
  }

  protected openNew(): void {
    this.windowManager.open('prototype-group', 'new', 'New group', 'edit');
  }
}
