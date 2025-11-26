import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../core/models';

interface CarouselCard extends Card {
  type: 'total' | 'card';
}

@Component({
  selector: 'app-balance-card-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-card-carousel.component.html',
  styleUrl: './balance-card-carousel.component.scss'
})
export class BalanceCardCarouselComponent implements OnInit {
  @Input() cards: Card[] = [];
  @Input() totalBalance: number = 0;
  @Input() income: number = 0;
  @Input() expenses: number = 0;

  allCards: CarouselCard[] = [];
  currentIndex: number = 0;
  touchStartX: number = 0;
  touchEndX: number = 0;

  ngOnInit(): void {
    // First card is total balance
    this.allCards = [
      { id: 0, number: '', balance: this.totalBalance, gradient: '', type: 'total' } as any,
      ...this.cards.map(card => ({ ...card, type: 'card' as const }))
    ];
  }

  getCardType(cardNumber: string): 'uzcard' | 'humo' | 'unknown' {
    if (cardNumber.startsWith('8600')) {
      return 'uzcard';
    } else if (cardNumber.startsWith('9860')) {
      return 'humo';
    }
    return 'unknown';
  }

  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next card
        this.next();
      } else {
        // Swipe right - previous card
        this.prev();
      }
    }
  }

  next() {
    if (this.currentIndex < this.allCards.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToCard(index: number) {
    this.currentIndex = index;
  }
}
