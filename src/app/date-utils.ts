/** Prototype rows store dates as DD/MM/YYYY; `<input type="date">` needs YYYY-MM-DD. */
export function toDateInputValue(value: string): string {
  const [day, month, year] = (value ?? '').split('/');
  return day && month && year ? `${year}-${month}-${day}` : '';
}

export function fromDateInputValue(value: string): string {
  const [year, month, day] = (value ?? '').split('-');
  return day && month && year ? `${day}/${month}/${year}` : '';
}
