import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    Transaction,
    TransactionGroup,
    HomePageTransaction,
    HomePageReportResponse,
    OverviewTransaction,
    OverviewReportResponse,
    TransactionFilterType
} from '../../../core/models';
import { MoneyPipe } from '../../pipe/money.pipe';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionTypeModalComponent } from '../transaction-type-modal/transaction-type-modal.component';
import { DateRangeModalComponent } from '../date-range-modal/date-range-modal.component';

@Component({
    selector: 'app-report-card',
    standalone: true,
    imports: [CommonModule, MoneyPipe, TransactionTypeModalComponent, DateRangeModalComponent],
    templateUrl: './report-card.component.html',
    styleUrl: './report-card.component.scss'
})
export class ReportCardComponent implements OnChanges {
    @Input() income: number = 0;
    @Input() expenses: number = 0;
    @Input() transactions: Transaction[] = [];
    @Input() reportData?: HomePageReportResponse | OverviewReportResponse;
    @Input() showFilters: boolean = false;
    @Input() showSeeAll: boolean = true;
    @Input() maxTransactions?: number; // Limit number of transactions to show

    // Modal state
    showTransactionTypeModal: boolean = false;
    showDateRangeModal: boolean = false;
    selectedFilterType: TransactionFilterType = TransactionFilterType.ALL;
    selectedStartDate: Date | null = null;
    selectedEndDate: Date | null = null;

    // Processed data
    processedTransactions: Transaction[] = [];
    processedIncome: number = 0;
    processedExpenses: number = 0;

    // Inject services
    private transactionService = inject(TransactionService);

    constructor(private router: Router) {
        // Sync filter state from service (preserves state across navigation)
        this.selectedFilterType = this.transactionService.selectedFilterType();
        this.selectedStartDate = this.transactionService.selectedStartDate();
        this.selectedEndDate = this.transactionService.selectedEndDate();
    }

    /**
     * Open transaction type modal
     */
    openTransactionTypeModal(): void {
        this.showTransactionTypeModal = true;
    }

    /**
     * Close transaction type modal without saving
     */
    closeTransactionTypeModal(): void {
        this.showTransactionTypeModal = false;
    }

    /**
     * Handle filter apply from modal component
     */
    onFilterApply(filterType: TransactionFilterType): void {
        this.selectedFilterType = filterType;
        this.transactionService.setFilterType(filterType);
        this.showTransactionTypeModal = false;
    }

    /**
     * Check if a filter type is currently active
     */
    isFilterActive(): boolean {
        return this.selectedFilterType !== TransactionFilterType.ALL;
    }

    /**
     * Open date range modal
     */
    openDateRangeModal(): void {
        this.showDateRangeModal = true;
    }

    /**
     * Close date range modal without saving
     */
    closeDateRangeModal(): void {
        this.showDateRangeModal = false;
    }

    /**
     * Handle date range apply from modal component
     */
    onDateRangeApply(dateRange: { startDate: Date | null; endDate: Date | null }): void {
        this.selectedStartDate = dateRange.startDate;
        this.selectedEndDate = dateRange.endDate;
        this.transactionService.setDateRange(dateRange.startDate, dateRange.endDate);
        this.showDateRangeModal = false;
    }

    /**
     * Check if date range is currently active
     */
    isDateRangeActive(): boolean {
        return this.selectedStartDate !== null && this.selectedEndDate !== null;
    }

    /**
     * Clear all filters and reload data
     */
    clearAllFilters(): void {
        this.selectedFilterType = TransactionFilterType.ALL;
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.transactionService.clearAllFilters();
    }



    ngOnChanges(changes: SimpleChanges): void {
        if (changes['reportData'] && this.reportData) {
            this.processReportData();
        } else if (this.transactions.length > 0) {
            this.processedTransactions = this.transactions;
            this.processedIncome = this.income;
            this.processedExpenses = this.expenses;
        }
    }

    private processReportData(): void {
        if (!this.reportData) return;

        // Check if it's HomePageReportResponse or OverviewReportResponse
        if ('content' in this.reportData) {
            // HomePageReportResponse
            const homeData = this.reportData as HomePageReportResponse;
            this.processedIncome = homeData.incomeAmount;
            this.processedExpenses = homeData.expensesAmount;
            this.processedTransactions = homeData.content.map(tx => this.mapHomeTransactionToTransaction(tx));
        } else if ('transactions' in this.reportData) {
            // OverviewReportResponse
            const overviewData = this.reportData as OverviewReportResponse;
            this.processedIncome = overviewData.summary.income;
            this.processedExpenses = overviewData.summary.expenses;
            this.processedTransactions = overviewData.transactions.map(tx => this.mapOverviewTransactionToTransaction(tx));
        }
    }

    private mapHomeTransactionToTransaction(tx: HomePageTransaction): Transaction {
        // Use tranDateTime if available, otherwise fallback to createDate
        const dateString = tx.tranDateTime || tx.createDate;
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        // Format time as "6-Iyul, 12:52"
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        const monthName = months[date.getMonth()];
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${date.getDate()}-${monthName}, ${hours}:${minutes}`;

        return {
            date: formattedDate,
            time: formattedTime,
            type: tx.tranType === '+' ? 'income' : 'expense',
            cardNumber: tx.maskPan,
            amount: tx.tranType === '+' ? tx.tranAmount : -tx.tranAmount,
            merchantName: tx.merchantName || (tx.tranType === '+' ? 'Kirim' : 'Chiqim'),
            processingLogoMini: tx.bin?.processingLogoMini,
            bankLogoMini: tx.bin?.bankLogoMini
        };
    }

    private mapOverviewTransactionToTransaction(tx: OverviewTransaction): Transaction {
        const date = new Date(tx.transactedAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        // Format time as "6-Dekabr, 12:52" (matching home page format)
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        const monthName = months[date.getMonth()];
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${date.getDate()}-${monthName}, ${hours}:${minutes}`;

        return {
            date: formattedDate,
            time: formattedTime,
            type: tx.tranType === '+' ? 'income' : 'expense',
            cardNumber: tx.maskPan,
            amount: tx.tranType === '+' ? tx.amount : -tx.amount,
            merchantName: tx.merchantName || (tx.tranType === '+' ? 'Kirim' : 'Chiqim'),
            processingLogoMini: tx.bin?.processingLogoMini,
            bankLogoMini: tx.bin?.bankLogoMini
        };
    }

    get groupedTransactions(): TransactionGroup[] {
        const groups = new Map<string, Transaction[]>();

        // Group all transactions by date (no limit, just for display)
        this.processedTransactions.forEach(transaction => {
            if (!groups.has(transaction.date)) {
                groups.set(transaction.date, []);
            }
            groups.get(transaction.date)!.push(transaction);
        });

        return Array.from(groups.entries()).map(([date, transactions]) => ({
            date,
            transactions
        }));
    }


    onSeeAllClick(): void {
        console.log('See all clicked');
    }

    formatNumber(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    getAbsoluteValue(value: number): number {
        return Math.abs(value);
    }
}
