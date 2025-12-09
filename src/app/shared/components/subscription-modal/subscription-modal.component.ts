import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../core/services/card.service';
import { Card, SubscriptionPlan } from '../../../core/models';

// Re-export for backward compatibility
export type { SubscriptionPlan } from '../../../core/models';

@Component({
    selector: 'app-subscription-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './subscription-modal.component.html',
    styleUrl: './subscription-modal.component.scss'
})
export class SubscriptionModalComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Input() plan: SubscriptionPlan | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() success = new EventEmitter<void>();

    // Steps: 1 = Card Selection, 2 = Confirmation, 3 = Success
    currentStep: number = 1;

    cards: Card[] = [];
    selectedCard: Card | null = null;
    loading: boolean = false;
    processing: boolean = false;

    constructor(public cardService: CardService) { }

    ngOnChanges(changes: SimpleChanges): void {
        // When modal opens, load cards and reset state
        if (changes['isOpen'] && this.isOpen) {
            this.loadCards();
            this.currentStep = 1;
            this.selectedCard = null;
        }
    }

    loadCards(): void {
        // Get cards from CardService signal
        this.cards = this.cardService.cards();
        console.log('Loaded cards:', this.cards);
    }

    selectCard(card: Card): void {
        this.selectedCard = card;
    }

    goToConfirmation(): void {
        if (this.selectedCard) {
            this.currentStep = 2;
        }
    }

    confirmPayment(): void {
        this.processing = true;
        // Simulate payment processing
        setTimeout(() => {
            this.processing = false;
            this.currentStep = 3;
        }, 1500);
    }

    closeModal(): void {
        this.currentStep = 1;
        this.selectedCard = null;
        this.close.emit();
    }

    onSuccess(): void {
        this.success.emit();
        this.closeModal();
    }

    formatCardNumber(number: string): string {
        if (!number) return '****';
        return '**** ' + number.slice(-4);
    }

    formatPrice(price: number): string {
        return price.toLocaleString('uz-UZ').replace(/,/g, ' ');
    }

    onBackdropClick(event: Event): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.closeModal();
        }
    }
}
