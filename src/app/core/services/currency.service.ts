import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, of, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyOverviewResponse, CurrencyPair } from '../models/currency.interfaces';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    currencyData = signal<CurrencyOverviewResponse | null>(null);
    currencyPairs = signal<CurrencyPair[]>([]);
    loading = signal<boolean>(false);
    pairsLoading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    /**
     * Load currency pairs
     * API: /api/currency/pairs
     */
    loadCurrencyPairs(): void {
        this.pairsLoading.set(true);
        const url = `${environment.apiUrl}/api/currency/pairs`;

        this.http.get<CurrencyPair[]>(url).pipe(
            tap(data => {
                this.currencyPairs.set(data);
                this.pairsLoading.set(false);
            }),
            catchError(error => {
                console.error('Error loading currency pairs:', error);
                this.currencyPairs.set([]);
                this.pairsLoading.set(false);
                return of([]);
            })
        ).subscribe();
    }

    /**
     * Load currency overview with base, quote, and amount
     * API: /api/currency/overview?base=USD&quote=UZS&amount=1
     */
    loadCurrencyOverview(base: string = 'USD', quote: string = 'UZS', amount: number = 1): void {
        this.loading.set(true);
        const url = `${environment.apiUrl}/api/currency/overview?base=${base}&quote=${quote}&amount=${amount}`;

        this.http.get<CurrencyOverviewResponse>(url).pipe(
            tap(data => {
                this.currencyData.set(data);
                this.loading.set(false);
            }),
            catchError(error => {
                console.error('Error loading currency data:', error);
                this.currencyData.set(null);
                this.loading.set(false);
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Get currency overview as Observable
     * API: /api/currency/overview?base=USD&quote=UZS&amount=1
     */
    getCurrencyOverview(base: string, quote: string, amount: number): Observable<CurrencyOverviewResponse | null> {
        const url = `${environment.apiUrl}/api/currency/overview?base=${base}&quote=${quote}&amount=${amount}`;
        return this.http.get<CurrencyOverviewResponse>(url).pipe(
            catchError(error => {
                console.error('Error loading currency data:', error);
                return of(null);
            })
        );
    }
}


