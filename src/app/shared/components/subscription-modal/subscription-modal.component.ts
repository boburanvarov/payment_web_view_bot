import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../core/services/card.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Card, SubscriptionPlan } from '../../../core/models';
import { TranslatePipe } from '../../pipes/translate.pipe';

// Re-export for backward compatibility
export type { SubscriptionPlan } from '../../../core/models';

@Component({
    selector: 'app-subscription-modal',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './subscription-modal.component.html',
    styleUrl: './subscription-modal.component.scss'
})
export class SubscriptionModalComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Input() plan: SubscriptionPlan | null = null;
    @Input() planCode: string = ''; // From API response
    @Input() billingCycle: string = 'MONTHLY'; // From API response
    @Output() close = new EventEmitter<void>();
    @Output() success = new EventEmitter<void>();

    // Steps: 1 = Card Selection, 2 = Confirmation, 3 = Success
    currentStep: number = 1;

    cards: Card[] = [];
    selectedCard: Card | null = null;
    loading: boolean = false;
    processing: boolean = false;
    errorMessage: string = '';
    paymentInfo: {
        amount: number;
        currency: string;
        cycleLabel: string;
    } | null = null;

    constructor(
        public cardService: CardService,
        private subscriptionService: SubscriptionService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        // When modal opens, load cards and reset state
        if (changes['isOpen'] && this.isOpen) {
            this.loadCards();
            this.currentStep = 1;
            this.selectedCard = null;
            this.errorMessage = '';
            this.paymentInfo = null;
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
        if (!this.selectedCard || !this.planCode) {
            this.errorMessage = 'Please select a card and plan';
            return;
        }

        if (!this.selectedCard.cardId) {
            this.errorMessage = 'Card ID is missing';
            return;
        }

        this.processing = true;
        this.errorMessage = '';

        // Call API with planCode, billingCycle, and cardId
        this.subscriptionService.changePlan(
            this.planCode,
            this.billingCycle,
            this.selectedCard.cardId
        ).subscribe({
            next: (response) => {
                console.log('Subscription changed successfully:', response);

                // Store payment info from response
                if (response.payment) {
                    this.paymentInfo = {
                        amount: response.payment.amount,
                        currency: response.payment.currency,
                        cycleLabel: response.payment.cycleLabel
                    };
                }

                this.processing = false;
                this.currentStep = 3;
            },
            error: (error) => {
                console.error('Error changing subscription:', error);
                this.processing = false;
                this.errorMessage = error.error?.message || 'Failed to change subscription';
            }
        });
    }

    closeModal(): void {
        this.currentStep = 1;
        this.selectedCard = null;
        this.errorMessage = '';
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
