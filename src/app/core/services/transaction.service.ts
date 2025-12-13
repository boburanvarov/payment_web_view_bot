import { Injectable, signal, computed, NgZone, inject } from '@angular/core';
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

    // Pagination state for infinite scroll
    currentPage = signal<number>(0);
    hasMore = signal<boolean>(true);
    loadingMore = signal<boolean>(false);

    // Selected transaction filter type
    selectedFilterType = signal<TransactionFilterType>(TransactionFilterType.ALL);

    // Date range filter
    selectedStartDate = signal<Date | null>(null);
    selectedEndDate = signal<Date | null>(null);

    // Home page card report data
    cardReport = signal<HomePageReportResponse | null>(null);
    cardReportLoading = signal<boolean>(false);
    selectedCardId = signal<string | null>(null);

    private ngZone = inject(NgZone);

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
     * Clear all filters (filter type, date range, and card)
     */
    clearAllFilters(): void {
        this.selectedFilterType.set(TransactionFilterType.ALL);
        this.selectedStartDate.set(null);
        this.selectedEndDate.set(null);
        this.selectedCardId.set(null);
        this.currentPage.set(0);
        this.hasMore.set(true);
        this.loadOverviewTransactions();
    }

    /**
     * Set card filter and reload transactions
     */
    setCardFilter(cardId: string | null): void {
        this.selectedCardId.set(cardId);
        this.loadOverviewTransactions();
    }

    /**
     * Build transaction URL based on filters
     */
    private buildTransactionUrl(page: number, size: number): string {
        const cardId = this.selectedCardId();
        const filterType = this.selectedFilterType();

        if (cardId) {
            return `${environment.apiUrl}/api/history/transactions/${cardId}?page=${page}&size=${size}&period=ALL`;
        }

        let url = `${environment.apiUrl}/api/history/transactions?type=${filterType}&page=${page}&size=${size}`;

        const startDate = this.selectedStartDate();
        const endDate = this.selectedEndDate();
        if (startDate) {
            url += `&start=${this.formatDateForApi(startDate)}`;
        }
        if (endDate) {
            url += `&end=${this.formatDateForApi(endDate)}`;
        }

        return url;
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
     */
    loadOverviewTransactions(
        type?: TransactionFilterType,
        page: number = 0,
        size: number = 20
    ): void {
        this.overviewLoading.set(true);

        if (type !== undefined) {
            this.selectedFilterType.set(type);
        }

        const url = this.buildTransactionUrl(page, size);

        this.http.get<OverviewReportResponse>(url).pipe(
            tap(data => {
                this.ngZone.run(() => {
                    this.overviewReport.set(data);
                    this.currentPage.set(page);
                    this.hasMore.set(data.page.hasNext);
                    this.overviewLoading.set(false);
                });
            }),
            catchError(error => {
                console.error('Error loading overview transactions:', error);
                this.ngZone.run(() => {
                    this.overviewReport.set(null);
                    this.overviewLoading.set(false);
                });
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Load more transactions (next page)
     */
    loadMoreTransactions(): void {
        if (this.loadingMore() || !this.hasMore()) {
            return;
        }

        this.loadingMore.set(true);
        const nextPage = this.currentPage() + 1;
        const url = this.buildTransactionUrl(nextPage, 20);

        this.http.get<OverviewReportResponse>(url).pipe(
            tap(data => {
                this.ngZone.run(() => {
                    const currentReport = this.overviewReport();
                    if (currentReport) {
                        const mergedReport: OverviewReportResponse = {
                            ...data,
                            transactions: [...currentReport.transactions, ...data.transactions]
                        };
                        this.overviewReport.set(mergedReport);
                    } else {
                        this.overviewReport.set(data);
                    }
                    this.currentPage.set(nextPage);
                    this.hasMore.set(data.page.hasNext);
                    this.loadingMore.set(false);
                });
            }),
            catchError(error => {
                console.error('Error loading more transactions:', error);
                this.ngZone.run(() => {
                    this.loadingMore.set(false);
                });
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Load transactions for a specific card (home page)
     */
    loadCardTransactions(cardId: string, page: number = 0, size: number = 10, period: string = 'ALL'): void {
        this.cardReportLoading.set(true);
        this.selectedCardId.set(cardId);
        const url = `${environment.apiUrl}/api/history/transactions/${cardId}?page=${page}&size=${size}&period=${period}`;

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

