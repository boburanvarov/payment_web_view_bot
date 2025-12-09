import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../../core/models';
import { CardService } from '../../../core/services/card.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-card-filter-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './card-filter-modal.component.html',
    styleUrl: './card-filter-modal.component.scss'
})
export class CardFilterModalComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Input() selectedCardId: string | null = null;

    @Output() close = new EventEmitter<void>();
    @Output() apply = new EventEmitter<string | null>();

    private cardService = inject(CardService);

    // Temporary selection
    tempSelectedCardId: string | null = null;

    // Cards from service
    get cards(): Card[] {
        return this.cardService.cards();
    }

    ngOnChanges(): void {
        if (this.isOpen) {
            this.tempSelectedCardId = this.selectedCardId;
            // Load cards if not loaded
            if (this.cards.length === 0) {
                this.cardService.loadCardsFromAPI();
            }
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onApply(): void {
        this.apply.emit(this.tempSelectedCardId);
    }

    selectCard(cardId: string): void {
        this.tempSelectedCardId = this.tempSelectedCardId === cardId ? null : cardId;
    }

    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
