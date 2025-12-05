import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../core/models';
import { MoneyPipe } from '../../pipe/money.pipe';

@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [CommonModule, MoneyPipe],
  templateUrl: './bank-card.component.html',
  styleUrl: './bank-card.component.scss'
})
export class BankCardComponent {
  @Input() card!: Card;
  @Input() gradientIndex: number = 0;

  // Beautiful gradient colors for each card
  private cardGradients: string[] = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple to violet
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink to red
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue to cyan
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green to teal
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink to yellow
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Cyan to dark purple
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Light teal to pink
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Coral to pink
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Peach to orange
    'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', // Pink to dark pink
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Lavender to pink
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', // Peach to light pink
    'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)', // Red to magenta
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Green to blue
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', // Purple to yellow
  ];

  getCardGradient(): string {
    return this.cardGradients[this.gradientIndex % this.cardGradients.length];
  }

  getCardBackgroundStyle(): string {
    const gradient = this.getCardGradient();
    // Gradient as base layer, card vector overlays on top
    return `${gradient}, url('/assets/img/card-vector.png')`;
  }

  formatCardNumberWithMask(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 16) {
      return cardNumber;
    }
    const first4 = cardNumber.substring(0, 4);
    const next2 = cardNumber.substring(4, 6);
    const last4 = cardNumber.substring(12, 16);
    return `${first4} ${next2}** **** ${last4}`;
  }
}





