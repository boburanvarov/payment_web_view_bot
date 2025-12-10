import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyPipe } from '../../pipe/money.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-transaction-details-modal',
  standalone: true,
  imports: [CommonModule, MoneyPipe, TranslatePipe],
  templateUrl: './transaction-details-modal.component.html',
  styleUrl: './transaction-details-modal.component.scss'
})
export class TransactionDetailsModalComponent {
  @Input() isOpen = false;
  @Input() transaction: any | null = null;

  @Output() close = new EventEmitter<void>();

  get isIncome(): boolean {
    if (!this.transaction) return false;
    if ('tranType' in this.transaction) {
      return this.transaction.tranType === '+';
    }
    if ('type' in this.transaction) {
      return this.transaction.type === 'income';
    }
    return false;
  }

  get amountSign(): string {
    return this.isIncome ? '+' : '-';
  }

  get formattedDateTime(): string {
    if (!this.transaction) return '';

    const sourceDate: string | undefined =
      this.transaction.transactedAt ||
      this.transaction.tranDateTime ||
      this.transaction.dateTime ||
      null;

    if (!sourceDate) {
      return '';
    }

    const date = new Date(sourceDate);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}, ${year} ${hours}:${minutes}:${seconds}`;
  }

  onClose(): void {
    this.close.emit();
  }
}
