/** Prototype rows store dates as DD/MM/YYYY; `<input type="date">` needs YYYY-MM-DD. */
export function toDateInputValue(value: string): string {
  const [day, month, year] = (value ?? '').split('/');
  return day && month && year ? `${year}-${month}-${day}` : '';
}

export function fromDateInputValue(value: string): string {
  const [year, month, day] = (value ?? '').split('-');
  return day && month && year ? `${day}/${month}/${year}` : '';
}

export function addDaysToDate(value: string, days: number): string {
  const [day, month, year] = (value ?? '').split('/').map(Number);
  if (!day || !month || !year) {
    return '';
  }
  const shifted = new Date(year, month - 1, day + days);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${pad(shifted.getDate())}/${pad(shifted.getMonth() + 1)}/${shifted.getFullYear()}`;
}
