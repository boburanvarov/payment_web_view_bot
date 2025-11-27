import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../core/models';

interface CarouselCard extends Card {
  type: 'total' | 'card';
  bankName?: string;
  expiryDate?: string;
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

  // Touch support
  touchStartX: number = 0;
  touchEndX: number = 0;

  // Mouse support
  mouseStartX: number = 0;
  mouseEndX: number = 0;
  isDragging: boolean = false;

  ngOnInit(): void {
    // First card is total balance
    this.allCards = [
      { id: 0, number: '', balance: this.totalBalance, gradient: '', type: 'total' } as any,
      ...this.cards.map(card => ({ 
        ...card, 
        type: 'card' as const,
        bankName: this.getBankName(card.number),
        expiryDate: '09/27' // You can make this dynamic based on card data
      }))
    ];
  }

  getBankName(cardNumber: string): string {
    if (cardNumber.startsWith('8600')) {
      return 'IPOTEKA BANK';
    } else if (cardNumber.startsWith('9860')) {
      return 'IPOTEKA BANK';
    }
    return 'BANK';
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

  formatCardNumberWithMask(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 16) {
      return cardNumber;
    }
    // Format: 9860 01** **** 0545
    const first4 = cardNumber.substring(0, 4);
    const next2 = cardNumber.substring(4, 6);
    const last4 = cardNumber.substring(12, 16);
    return `${first4} ${next2}** **** ${last4}`;
  }

  copyCardNumber(cardNumber: string): void {
    // Remove spaces for copying
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanNumber).then(() => {
        console.log('Card number copied to clipboard');
        // You can add a toast notification here
      }).catch(err => {
        console.error('Failed to copy card number:', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = cleanNumber;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        console.log('Card number copied to clipboard');
      } catch (err) {
        console.error('Failed to copy card number:', err);
      }
      
      document.body.removeChild(textArea);
    }
  }

  // Touch events (mobile)
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  // Mouse events (desktop)
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.mouseStartX = event.clientX;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.mouseEndX = event.clientX;
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.mouseEndX = event.clientX;
    this.handleMouseDrag();
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  handleMouseDrag() {
    const dragThreshold = 50;
    const diff = this.mouseStartX - this.mouseEndX;

    if (Math.abs(diff) > dragThreshold) {
      if (diff > 0) {
        this.next();
      } else {
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
