import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyOverviewResponse } from '../models/currency.interfaces';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    currencyData = signal<CurrencyOverviewResponse | null>(null);
    loading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    /**
     * Load currency overview
     * API: /api/currency/overview?amount=1
     */
    loadCurrencyOverview(amount: number = 1): void {
        this.loading.set(true);
        const baseUrl = environment.apiUrl || 'https://swagger.kartaxabar.uz';
        const url = `${baseUrl}/api/currency/overview?amount=${amount}`;

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
}

