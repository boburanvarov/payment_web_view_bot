import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    Transaction,
    TransactionGroup,
    BinInfo,
    HomePageTransaction,
    HomePageReportResponse,
    OverviewTransaction,
    OverviewReportResponse
} from '../../../core/models';
import { MoneyPipe } from '../../pipe/money.pipe';

@Component({
    selector: 'app-report-card',
    standalone: true,
    imports: [CommonModule, MoneyPipe],
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

    processedTransactions: Transaction[] = [];
    processedIncome: number = 0;
    processedExpenses: number = 0;

    constructor(private router: Router) { }

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
            description: tx.merchantName || tx.category || tx.description,
            processingLogoMini: tx.bin?.processingLogoMini
        };
    }

    private mapOverviewTransactionToTransaction(tx: OverviewTransaction): Transaction {
        const date = new Date(tx.transactedAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        // Format time as HH:mm (e.g., "12:52")
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        return {
            date: formattedDate,
            time: formattedTime,
            type: tx.tranType === '+' ? 'income' : 'expense',
            cardNumber: tx.maskPan,
            amount: tx.tranType === '+' ? tx.amount : -tx.amount,
            description: tx.merchantName || tx.category || tx.categoryDescription,
            processingLogoMini: tx.bin?.processingLogoMini
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
