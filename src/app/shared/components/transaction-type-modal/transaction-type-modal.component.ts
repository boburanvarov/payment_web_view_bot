import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionFilterType } from '../../../core/models';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../../core/services/translate.service';

interface FilterOption {
    value: TransactionFilterType;
    labelKey: string;
}

@Component({
    selector: 'app-transaction-type-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './transaction-type-modal.component.html',
    styleUrl: './transaction-type-modal.component.scss'
})
export class TransactionTypeModalComponent implements OnInit {
    @Input() isOpen: boolean = false;
    @Input() selectedType: TransactionFilterType = TransactionFilterType.ALL;

    @Output() close = new EventEmitter<void>();
    @Output() apply = new EventEmitter<TransactionFilterType>();

    private translateService = inject(TranslateService);

    // Temporary selection for radio buttons
    tempSelectedType: TransactionFilterType = TransactionFilterType.ALL;

    // Filter options for radio buttons with translation keys
    filterOptions: FilterOption[] = [
        { value: TransactionFilterType.ALL, labelKey: 'filters.all' },
        { value: TransactionFilterType.INCOME, labelKey: 'filters.income' },
        { value: TransactionFilterType.EXPENSE, labelKey: 'filters.expense' }
    ];

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
