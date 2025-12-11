import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../core/models';
import { BankCardComponent } from '../bank-card/bank-card.component';

interface CarouselCard extends Card {
    type: 'card';
    bankName?: string;
    expiryDate?: string;
}

@Component({
    selector: 'app-balance-card-carousel',
    standalone: true,
    imports: [CommonModule, BankCardComponent],
    templateUrl: './balance-card-carousel.component.html',
    styleUrl: './balance-card-carousel.component.scss'
})
export class BalanceCardCarouselComponent implements OnInit, OnDestroy {
    @Input() cards: Card[] = [];
    @Input() totalBalance: number = 0;
    @Input() income: number = 0;
    @Input() expenses: number = 0;
    @Output() cardSelected = new EventEmitter<Card | null>();

    allCards: CarouselCard[] = [];
    currentIndex: number = 0;
    isDarkMode: boolean = false;

    touchStartX: number = 0;
    touchEndX: number = 0;

    mouseStartX: number = 0;
    mouseEndX: number = 0;
    isDragging: boolean = false;

    private themeChangeListener: () => void;

    constructor() {
        this.themeChangeListener = () => this.checkDarkMode();
    }

    ngOnInit(): void {
        this.checkDarkMode();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.themeChangeListener);

        // Listen for manual theme toggle from ProfileComponent
        window.addEventListener('theme-changed', this.themeChangeListener);

        this.allCards = this.cards.map(card => ({
            ...card,
            type: 'card' as const,
            bankName: card.bankName,
            expiryDate: card.expiryDate,
        }));
        // Initial active card: always start from the first card
        this.currentIndex = 0;

        if (this.allCards.length > 0) {
            this.emitCardSelection();
        }
    }

    ngOnDestroy(): void {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.themeChangeListener);
        window.removeEventListener('theme-changed', this.themeChangeListener);
    }

    private checkDarkMode(): void {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        } else {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    getBankLogo(card: Card): string | undefined {
        if (this.isDarkMode && card.bankWhiteLogoMini) {
            return card.bankWhiteLogoMini;
        }
        return card.bankLogoMini;
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
            this.emitCardSelection();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.emitCardSelection();
        }
    }

    goToCard(index: number) {
        this.currentIndex = index;
        this.emitCardSelection();
    }

    private emitCardSelection(): void {
        const currentCard = this.allCards[this.currentIndex];
        if (currentCard) {
            this.cardSelected.emit(currentCard as Card);
        } else {
            this.cardSelected.emit(null);
        }
    }

  getTransformValue(): number {
    const vw = window.innerWidth;

    let cardWidth = 320;
    // gap: 15px on mobile/tablet, 20px on larger screens (matches SCSS)
    const gap = vw < 768 ? 15 : 20;
    const offset = 20; // SCSS $offset: 20px, prev/next peek around 20px

    if (vw < 375) {
      // < 375px -> $w-xs (280px)
      cardWidth = 280;
    } else if (vw < 768) {
      // 375–767px -> $w-m (320px) so 375–420 va 425–767 bir xil bo'ladi
      cardWidth = 320;
    } else {
      // 768+ -> $w-l (360px)
      cardWidth = 360;
    }

    const cardSize = cardWidth + gap;

    if (this.currentIndex === 0) {
      return 0;
    }

    const currentCenter = offset + this.currentIndex * cardSize + cardWidth / 2;

    const viewportCenter = vw / 2;

    const shift = viewportCenter - currentCenter;

    return shift;
  }





  getCardGradientIndex(index: number): number {
        // Return gradient index based on card position
        return index;
    }
}
