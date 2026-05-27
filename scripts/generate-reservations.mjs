// One-off generator for public/reservations.json.
// Run with: node scripts/generate-reservations.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [products, customers, filters, statuses] = await Promise.all([
  readFile(path.join(repoRoot, 'public/products.json'), 'utf8').then(JSON.parse),
  readFile(path.join(repoRoot, 'public/customers.json'), 'utf8').then(JSON.parse),
  readFile(path.join(repoRoot, 'public/filter-options.json'), 'utf8').then(JSON.parse),
  readFile(path.join(repoRoot, 'public/reservation-statuses.json'), 'utf8').then(JSON.parse)
]);

let seed = 1337;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function pickWeighted(entries) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function round2(value) {
  return Math.round(value * 100) / 100;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

const PASSENGER_NAMES = [
  '',
  'Smith John',
  'Smith Annie',
  'Müller Klaus',
  'Müller Sophie',
  'Bianchi Luca',
  'Russo Chiara',
  'Horvat Marko',
  'Kovač Ivana',
  'Johnson Roy',
  'Johnson Adam',
  'Bellows Clive',
  'Banic Marija',
  'Baudrexl Andreas',
  'Abbot Haydn',
  'Barrett Adam',
  'Garcia Maria',
  'Tanaka Yuki',
  'Williams Sarah',
  'Chen Wei',
  'Group - 14 pax',
  'Group - 8 pax',
  'Name No'
];

const TARIFFS = ['Standard', 'Silver', 'Golden', 'Platinum'];
const COMMISSIONS = ['0%', '5%', '10%', '12%', '13%', '15%'];
const MARKETS = ['Preferred Market', 'HD Market', 'Not Preferred market'];

const NOTE_TEMPLATES = [
  '',
  'Customer requested early check-in.',
  'Awaiting passenger names.',
  'Allergy noted - shellfish.',
  'Honeymoon - flowers + sparkling on arrival.',
  'Group of returning guests.',
  'Vegetarian meals throughout.',
  'Wheelchair accessibility required.',
  'Late arrival flight, hold room.',
  'Add airport meet & greet.',
  'Tour leader booking - bill to agency.',
  'Confirmed via email, awaiting deposit.',
  'Pending revised quote from supplier.'
];

const STATUS_WEIGHTS = [
  ['confirmed', 6],
  ['option', 3],
  ['inquiry', 4],
  ['finished', 3],
  ['cancelled', 1.5],
  ['unrealized', 0.8]
];

const PERIOD_DAY_WEIGHTS = [
  [1, 4],
  [2, 6],
  [3, 7],
  [5, 5],
  [7, 4],
  [10, 2],
  [14, 1]
];

const PAX_WEIGHTS = [
  [1, 4],
  [2, 7],
  [3, 3],
  [4, 2],
  [6, 1],
  [8, 1]
];

const COUNT = 420;
const START_NUMBER = 9700;
const today = new Date('2026-05-27T00:00:00Z');

const validStatusIds = new Set(statuses.map((status) => status.id));
const filteredStatusWeights = STATUS_WEIGHTS.filter(([id]) => validStatusIds.has(id));

const reservations = [];

for (let i = 0; i < COUNT; i += 1) {
  const product = pick(products);
  const customer = pick(customers);
  const statusId = pickWeighted(filteredStatusWeights);

  const pax = pickWeighted(PAX_WEIGHTS);
  const nights = pickWeighted(PERIOD_DAY_WEIGHTS);

  // Spread periodStart between -200d and +540d from today (skewed slightly future)
  const offset = randInt(-200, 540);
  const periodStart = addDays(today, offset);
  const periodEnd = addDays(periodStart, nights);

  const variance = 0.75 + rand() * 0.6;
  const unitPrice = product.basePrice * variance;
  const price = round2(unitPrice * pax);

  let paid = 0;
  if (statusId === 'confirmed') {
    paid = rand() > 0.4 ? price : round2(price * (0.2 + rand() * 0.6));
  } else if (statusId === 'finished') {
    paid = price;
  } else if (statusId === 'option' && rand() > 0.7) {
    paid = round2(price * 0.1);
  }

  let optionDate = '';
  if (statusId === 'option') {
    const optionOffset = randInt(-30, 60);
    optionDate = isoDate(addDays(today, optionOffset));
  }

  const cancellationDeadline = isoDate(addDays(periodStart, -randInt(7, 45)));

  const reservationNumber = START_NUMBER + i;

  reservations.push({
    id: `res-${reservationNumber}`,
    reservationNumber,
    statusId,
    productId: product.id,
    customerId: customer.id,
    passengerName: pick(PASSENGER_NAMES),
    periodStart: isoDate(periodStart),
    periodEnd: isoDate(periodEnd),
    optionDate,
    cancellationDeadline,
    price,
    paid,
    currency: product.currency,
    branchOffice: pick(filters.branchOffices),
    createdBy: pick(filters.createdBy),
    notes: pick(NOTE_TEMPLATES),
    customFields: {
      preferredMarket: pick(MARKETS),
      tariffLevel: pick(TARIFFS),
      commission: pick(COMMISSIONS)
    }
  });
}

// Most-recent reservations first (sorted by reservationNumber desc)
reservations.sort((left, right) => right.reservationNumber - left.reservationNumber);

await writeFile(
  path.join(repoRoot, 'public/reservations.json'),
  JSON.stringify(reservations, null, 2) + '\n'
);

console.log(`Wrote ${reservations.length} reservations to public/reservations.json`);
