import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    TransactionFilterType,
    getTransactionFilterOptions
} from '../../../core/models';

@Component({
    selector: 'app-transaction-type-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './transaction-type-modal.component.html',
    styleUrl: './transaction-type-modal.component.scss'
})
export class TransactionTypeModalComponent implements OnInit {
    @Input() isOpen: boolean = false;
    @Input() selectedType: TransactionFilterType = TransactionFilterType.ALL;

    @Output() close = new EventEmitter<void>();
    @Output() apply = new EventEmitter<TransactionFilterType>();

    // Temporary selection for radio buttons
    tempSelectedType: TransactionFilterType = TransactionFilterType.ALL;

    // Filter options for radio buttons
    filterOptions = getTransactionFilterOptions();

    ngOnInit(): void {
        this.tempSelectedType = this.selectedType;
    }

    /**
     * Called when modal opens - sync temp selection with current selection
     */
    ngOnChanges(): void {
        if (this.isOpen) {
            this.tempSelectedType = this.selectedType;
        }
    }

    /**
     * Close modal without applying changes
     */
    onClose(): void {
        this.close.emit();
    }

    /**
     * Apply selected filter and close modal
     */
    onApply(): void {
        this.apply.emit(this.tempSelectedType);
    }

    /**
     * Prevent click propagation from modal content
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
