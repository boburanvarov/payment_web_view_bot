import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
    selector: 'app-date-range-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePickerModule, TranslatePipe],
    templateUrl: './date-range-modal.component.html',
    styleUrl: './date-range-modal.component.scss'
})
export class DateRangeModalComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Input() startDate: Date | null = null;
    @Input() endDate: Date | null = null;

    @Output() close = new EventEmitter<void>();
    @Output() apply = new EventEmitter<{ startDate: Date | null; endDate: Date | null }>();

    private cdr = inject(ChangeDetectorRef);

    // Temporary date range for selection
    tempDateRange: Date[] = [];

    // Today's date for max date restriction
    maxDate: Date = new Date();

    // Uzbek locale settings
    locale: string = 'uz';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            // When modal opens, set temp dates from input
            if (this.startDate && this.endDate) {
                this.tempDateRange = [this.startDate, this.endDate];
            } else if (this.startDate) {
                this.tempDateRange = [this.startDate];
            } else {
                this.tempDateRange = [];
            }
            this.cdr.detectChanges();
        }
    }

    /**
     * iOS/Android optimized button click handler
     */
    handleButtonClick(event: Event, action: string): void {
        event.preventDefault();
        event.stopPropagation();

        // Force change detection for iOS
        this.cdr.detectChanges();

        // Execute action based on string parameter
        switch (action) {
            case 'onClose':
                this.onClose();
                break;
            case 'onApply':
                this.onApply();
                break;
        }

        // Additional iOS Safari fix - slight delay
        requestAnimationFrame(() => {
            this.cdr.detectChanges();
        });
    }

    /**
     * Close modal without applying changes
     */
    onClose(): void {
        this.close.emit();
    }

    /**
     * Apply selected date range and close modal
     */
    onApply(): void {
        const startDate = this.tempDateRange[0] || null;
        const endDate = this.tempDateRange[1] || null;
        this.apply.emit({ startDate, endDate });
    }

    /**
     * Prevent click propagation from modal content
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }

    /**
     * Check if apply button should be enabled
     */
    isApplyEnabled(): boolean {
        return this.tempDateRange.length === 2 &&
            this.tempDateRange[0] != null &&
            this.tempDateRange[1] != null;
    }
}
