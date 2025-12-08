import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OverviewReportResponse, HomePageReportResponse, TransactionFilterType } from '../models';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    // Overview report data
    overviewReport = signal<OverviewReportResponse | null>(null);
    overviewLoading = signal<boolean>(false);

    // Selected transaction filter type
    selectedFilterType = signal<TransactionFilterType>(TransactionFilterType.ALL);

    // Date range filter
    selectedStartDate = signal<Date | null>(null);
    selectedEndDate = signal<Date | null>(null);

    // Home page card report data
    cardReport = signal<HomePageReportResponse | null>(null);
    cardReportLoading = signal<boolean>(false);
    selectedCardId = signal<string | null>(null);

    constructor(private http: HttpClient) { }

    /**
     * Format date to YYYY-MM-DD string for API
     */
    private formatDateForApi(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Set date range and reload transactions
     */
    setDateRange(startDate: Date | null, endDate: Date | null): void {
        this.selectedStartDate.set(startDate);
        this.selectedEndDate.set(endDate);
        this.loadOverviewTransactions();
    }

    /**
     * Clear date range filter
     */
    clearDateRange(): void {
        this.selectedStartDate.set(null);
        this.selectedEndDate.set(null);
        this.loadOverviewTransactions();
    }

    /**
     * Clear all filters (filter type and date range)
     */
    clearAllFilters(): void {
        this.selectedFilterType.set(TransactionFilterType.ALL);
        this.selectedStartDate.set(null);
        this.selectedEndDate.set(null);
        this.loadOverviewTransactions();
    }

    /**
     * Set the filter type and reload transactions
     */
    setFilterType(type: TransactionFilterType): void {
        this.selectedFilterType.set(type);
        this.loadOverviewTransactions();
    }

    /**
     * Load overview transactions
     * API: /api/history/transactions?type=ALL&page=0&size=20&start=YYYY-MM-DD&end=YYYY-MM-DD
     */
    loadOverviewTransactions(
        type?: TransactionFilterType,
        page: number = 0,
        size: number = 20
    ): void {
        this.overviewLoading.set(true);

        // Use provided type or current selected type
        const filterType = type ?? this.selectedFilterType();

        // Build URL with query params
        let url = `${environment.apiUrl}/api/history/transactions?type=${filterType}&page=${page}&size=${size}`;

        // Add date range if set
        const startDate = this.selectedStartDate();
        const endDate = this.selectedEndDate();
        if (startDate) {
            url += `&start=${this.formatDateForApi(startDate)}`;
        }
        if (endDate) {
            url += `&end=${this.formatDateForApi(endDate)}`;
        }

        this.http.get<OverviewReportResponse>(url).pipe(
            tap(data => {
                this.overviewReport.set(data);
                this.overviewLoading.set(false);
            }),
            catchError(error => {
                console.error('Error loading overview transactions:', error);
                this.overviewReport.set(null);
                this.overviewLoading.set(false);
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Load transactions for a specific card
     * API: /api/cards/transactions/{cardId}?page=0&size=10&period=ALL
     */
    loadCardTransactions(cardId: string, page: number = 0, size: number = 10, period: string = 'ALL'): void {
        this.cardReportLoading.set(true);
        this.selectedCardId.set(cardId);
        const url = `${environment.apiUrl}/api/cards/transactions/${cardId}?page=${page}&size=${size}&period=${period}`;

        this.http.get<HomePageReportResponse>(url).pipe(
            tap(data => {
                this.cardReport.set(data);
                this.cardReportLoading.set(false);
            }),
            catchError(error => {
                console.error('Error loading card transactions:', error);
                this.cardReport.set(null);
                this.cardReportLoading.set(false);
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Clear card report data
     */
    clearCardReport(): void {
        this.cardReport.set(null);
        this.selectedCardId.set(null);
    }
}

