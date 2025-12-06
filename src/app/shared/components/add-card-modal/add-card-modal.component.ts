import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankCardComponent } from '../bank-card/bank-card.component';
import { Card } from '../../../core/models';
import { CardService } from '../../../core/services/card.service';

export interface AddCardData {
    cardNumber: string;
    expiryDate: string;
    cardName: string;
}

@Component({
    selector: 'app-add-card-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, BankCardComponent],
    templateUrl: './add-card-modal.component.html',
    styleUrl: './add-card-modal.component.scss'
})
export class AddCardModalComponent implements OnInit {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() cardAdded = new EventEmitter<void>();

    newCard: Card = this.getEmptyCard();
    gradientIndex = 0;
    isSubmitting = false;

    constructor(private cardService: CardService) { }

    ngOnInit(): void {
        this.resetForm();
    }

    private getEmptyCard(): Card {
        return {
            id: 0,
            number: '',
            balance: 0,
            gradient: '',
            bankName: '',
            cardName: '',
            expiryDate: ''
        };
    }

    resetForm(): void {
        this.newCard = this.getEmptyCard();
        this.gradientIndex = Math.floor(Math.random() * 15);
    }

    onCardNameChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.substring(0, 25);
        input.value = value;
        this.newCard.bankName = value;
        this.newCard.cardName = value;
    }

    onCardNumberChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        this.newCard.number = value;
        input.value = this.formatCardNumberInput(value);
    }

    onExpiryDateChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 4);

        if (value.length === 0) {
            this.newCard.expiryDate = '';
            input.value = '';
            return;
        }

        if (value.length >= 2) {
            let month = parseInt(value.substring(0, 2), 10);
            if (month > 12) month = 12;
            if (month < 1) month = 1;
            value = month.toString().padStart(2, '0') + value.substring(2);
        }

        if (value.length >= 4) {
            const currentYear = new Date().getFullYear() % 100;
            let year = parseInt(value.substring(2, 4), 10);
            if (year < currentYear) year = currentYear;
            value = value.substring(0, 2) + year.toString().padStart(2, '0');
        }

        let formattedValue = value;
        if (value.length > 2) {
            formattedValue = value.substring(0, 2) + '/' + value.substring(2);
        }

        this.newCard.expiryDate = formattedValue;
        input.value = formattedValue;
    }

    formatCardNumberInput(cardNumber: string): string {
        if (!cardNumber) return '';
        return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    isFormValid(): boolean {
        if (!this.newCard.bankName || this.newCard.bankName.trim().length === 0) {
            return false;
        }
        if (!this.newCard.number || this.newCard.number.length < 16) {
            return false;
        }
        if (!this.newCard.expiryDate || this.newCard.expiryDate.length !== 5) {
            return false;
        }

        const parts = this.newCard.expiryDate.split('/');
        if (parts.length !== 2) return false;

        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10);
        const currentYear = new Date().getFullYear() % 100;

        if (month < 1 || month > 12) return false;
        if (year < currentYear) return false;

        return true;
    }

    submitNewCard(): void {
        if (this.isFormValid() && !this.isSubmitting) {
            this.isSubmitting = true;

            // Prepare data for API (remove slash from expiry date)
            const expiryWithoutSlash = this.newCard.expiryDate?.replace('/', '') || '';

            this.cardService.addCardToAPI({
                cardNumber: this.newCard.number,
                expiryDate: expiryWithoutSlash,
                cardName: this.newCard.cardName || this.newCard.bankName || ''
            }).subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.cardAdded.emit();
                    this.closeModal();
                },
                error: (err: unknown) => {
                    this.isSubmitting = false;
                    console.error('Error adding card:', err);
                    // Still close and emit for demo purposes
                    this.cardAdded.emit();
                    this.closeModal();
                }
            });
        }
    }

    closeModal(): void {
        this.resetForm();
        this.close.emit();
    }
}
