import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PrototypeDataRepository, PrototypePassenger } from './prototype-data-repository.service';
import { WindowManagerService } from './window-manager.service';

const COUNTRIES = [
  'CROATIA',
  'AUSTRIA',
  'GERMANY',
  'ITALY',
  'FRANCE',
  'UNITED KINGDOM',
  'UNITED STATES',
  'SLOVENIA',
  'SERBIA',
  'BOSNIA AND HERZEGOVINA',
  'HUNGARY',
  'POLAND',
  'NETHERLANDS',
  'SPAIN'
];

const LANGUAGES = ['English', 'Croatian', 'German', 'Italian', 'French', 'Spanish'];
const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];

@Component({
  selector: 'app-passenger-editor-window',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="pax" [formGroup]="form" (ngSubmit)="save()">
      <div class="pax__body">
        <article class="lmx-card pax__card">
          <h3 class="pax__card-title">General</h3>
          <div class="pax__form">
            <div class="pax__row">
              <label class="pax__label" for="pax-title">Title</label>
              <select id="pax-title" class="lmx-select" formControlName="title">
                <option value="">Please select</option>
                <option *ngFor="let title of titles" [value]="title">{{ title }}</option>
              </select>
            </div>
            <div class="pax__row pax__row--blank"></div>

            <div class="pax__row">
              <label class="pax__label" for="pax-name">Name</label>
              <input id="pax-name" class="lmx-input" type="text" formControlName="name" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-surname">Surname</label>
              <input id="pax-surname" class="lmx-input" type="text" formControlName="surname" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-middle">Middle name</label>
              <input id="pax-middle" class="lmx-input" type="text" formControlName="middleName" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-oib">OIB</label>
              <input id="pax-oib" class="lmx-input" type="text" formControlName="oib" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-birthdate">Birth date</label>
              <input id="pax-birthdate" class="lmx-input" type="date" formControlName="birthDate" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-birthplace">Birthplace</label>
              <input id="pax-birthplace" class="lmx-input" type="text" formControlName="birthplace" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-passport">Passport number</label>
              <input id="pax-passport" class="lmx-input" type="text" formControlName="passportNumber" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-citizenship">Citizenship</label>
              <select id="pax-citizenship" class="lmx-select" formControlName="citizenship">
                <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
              </select>
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-pp-issue">Passport issue date</label>
              <input id="pax-pp-issue" class="lmx-input" type="date" formControlName="passportIssueDate" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-pp-expiry">Passport expiry date</label>
              <input id="pax-pp-expiry" class="lmx-input" type="date" formControlName="passportExpiryDate" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-pp-country">Passport issuing country</label>
              <select id="pax-pp-country" class="lmx-select" formControlName="passportIssuingCountry">
                <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
              </select>
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-sex">Sex</label>
              <select id="pax-sex" class="lmx-select" formControlName="sex">
                <option value="">Please select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-language">Language</label>
              <select id="pax-language" class="lmx-select" formControlName="language">
                <option *ngFor="let language of languages" [value]="language">{{ language }}</option>
              </select>
            </div>
            <div class="pax__row pax__row--blank"></div>
          </div>
        </article>

        <article class="lmx-card pax__card">
          <h3 class="pax__card-title">Contact data</h3>
          <div class="pax__form">
            <div class="pax__row">
              <label class="pax__label" for="pax-address">Address</label>
              <input id="pax-address" class="lmx-input" type="text" formControlName="address" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-city">City</label>
              <input id="pax-city" class="lmx-input" type="text" formControlName="city" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-address2">Address line 2</label>
              <input id="pax-address2" class="lmx-input" type="text" formControlName="addressLine2" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-state">State/Province</label>
              <input id="pax-state" class="lmx-input" type="text" formControlName="stateProvince" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-zip">ZIP code</label>
              <input id="pax-zip" class="lmx-input" type="text" formControlName="zipCode" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-country">Country</label>
              <select id="pax-country" class="lmx-select" formControlName="country">
                <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
              </select>
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-email">Email</label>
              <input id="pax-email" class="lmx-input" type="email" formControlName="email" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-telephone">Telephone</label>
              <input id="pax-telephone" class="lmx-input" type="text" formControlName="telephone" />
            </div>

            <div class="pax__row">
              <label class="pax__label" for="pax-telephone2">Telephone 2</label>
              <input id="pax-telephone2" class="lmx-input" type="text" formControlName="telephone2" />
            </div>
            <div class="pax__row">
              <label class="pax__label" for="pax-mobile">Mobile phone</label>
              <input id="pax-mobile" class="lmx-input" type="text" formControlName="mobilePhone" />
            </div>
          </div>
        </article>
      </div>

      <footer class="pax__footer">
        <span class="pax__spacer"></span>
        <button type="submit" class="lmx-btn lmx-btn--action">OK</button>
      </footer>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .pax {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lemax-bg);
      }

      .pax__body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 12px 16px;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .pax__card {
        padding: 14px 18px 18px;
      }

      .pax__card-title {
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lemax-text);
      }

      .pax__form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 48px;
        row-gap: 10px;
      }

      .pax__row {
        display: grid;
        grid-template-columns: 160px 280px 1fr;
        align-items: center;
        gap: 12px;
        min-height: 30px;
      }

      .pax__row--blank {
        visibility: hidden;
      }

      .pax__label {
        color: var(--lemax-text);
        font-size: 12px;
        font-weight: 400;
      }

      .pax__row .lmx-input,
      .pax__row .lmx-select {
        width: 100%;
        min-width: 0;
      }

      .pax__footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border-top: 1px solid var(--lemax-border-soft);
        flex-shrink: 0;
      }

      .pax__spacer {
        flex: 1;
      }

      @media (max-width: 920px) {
        .pax__form {
          grid-template-columns: 1fr;
          column-gap: 0;
        }
      }
    `
  ]
})
export class PassengerEditorWindowComponent implements OnChanges {
  @Input({ required: true }) passengerCode = '';
  @Input({ required: true }) windowId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly prototypeData = inject(PrototypeDataRepository);
  private readonly windowManager = inject(WindowManagerService);

  protected readonly current = signal<PrototypePassenger | null>(null);
  protected readonly countries = COUNTRIES;
  protected readonly languages = LANGUAGES;
  protected readonly titles = TITLES;

  protected readonly form = this.formBuilder.nonNullable.group({
    title: '',
    name: '',
    surname: '',
    middleName: '',
    oib: '',
    birthDate: '',
    birthplace: '',
    passportNumber: '',
    citizenship: 'CROATIA',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuingCountry: 'CROATIA',
    sex: '' as 'Male' | 'Female' | '',
    language: 'English',
    address: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    stateProvince: '',
    country: 'CROATIA',
    email: '',
    telephone: '',
    telephone2: '',
    mobilePhone: ''
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passengerCode']) {
      this.load();
    }
  }

  protected save(): void {
    const value = this.form.getRawValue();
    const existing = this.current();

    if (!existing) {
      const created: PrototypePassenger = {
        ...value,
        code: this.prototypeData.generatePassengerCode()
      };
      this.prototypeData.createPassenger(created);
      this.windowManager.close(this.windowId);
      return;
    }

    const updated: PrototypePassenger = { ...existing, ...value };
    this.prototypeData.savePassenger(updated);
    this.windowManager.close(this.windowId);
  }

  private load(): void {
    if (this.passengerCode === 'new') {
      this.current.set(null);
      this.form.reset();
      return;
    }

    const passenger = this.prototypeData.getPassengerByCode(this.passengerCode);
    if (!passenger) {
      return;
    }

    this.current.set(passenger);
    this.form.reset({
      title: passenger.title ?? '',
      name: passenger.name ?? '',
      surname: passenger.surname ?? '',
      middleName: passenger.middleName ?? '',
      oib: passenger.oib ?? '',
      birthDate: passenger.birthDate ?? '',
      birthplace: passenger.birthplace ?? '',
      passportNumber: passenger.passportNumber ?? '',
      citizenship: passenger.citizenship ?? passenger.country ?? 'CROATIA',
      passportIssueDate: passenger.passportIssueDate ?? '',
      passportExpiryDate: passenger.passportExpiryDate ?? '',
      passportIssuingCountry: passenger.passportIssuingCountry ?? passenger.country ?? 'CROATIA',
      sex: passenger.sex ?? '',
      language: passenger.language ?? 'English',
      address: passenger.address ?? '',
      addressLine2: passenger.addressLine2 ?? '',
      zipCode: passenger.zipCode ?? '',
      city: passenger.city ?? '',
      stateProvince: passenger.stateProvince ?? '',
      country: passenger.country ?? 'CROATIA',
      email: passenger.email ?? '',
      telephone: passenger.telephone ?? '',
      telephone2: passenger.telephone2 ?? '',
      mobilePhone: passenger.mobilePhone ?? ''
    });
  }
}
