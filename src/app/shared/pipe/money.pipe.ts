import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
  standalone: true
})
export class MoneyPipe implements PipeTransform {
  public transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }

    // Convert to number and divide by 100 (tiyin to so'm)
    const numeric = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numeric)) return '0.00';

    // Always show 2 decimal places
    const formatted = (numeric / 100).toFixed(2);

    // Add thousand separators (space)
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return parts.join('.');
  }
}
