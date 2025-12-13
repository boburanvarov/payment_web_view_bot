import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TelegramAuthRequest, TelegramAuthResponse } from '../models';

declare const Telegram: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth/telegram`;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

    constructor(private http: HttpClient) { }

    /**
     * Authenticate with Telegram initData
     */
    authenticateWithTelegram(): Observable<TelegramAuthResponse | null> {
        // Get Telegram initData
        if (typeof Telegram === 'undefined' || !Telegram.WebApp || !Telegram.WebApp.initData) {
            console.warn('Telegram WebApp not available or no initData');
            return of(null);
        }

        const initData = Telegram.WebApp.initData;
        const body: TelegramAuthRequest = { initData };

        return this.http.post<TelegramAuthResponse>(this.apiUrl, body).pipe(
            tap(response => {
                if (response.success && response.token) {
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                    localStorage.setItem(this.TOKEN_EXPIRY_KEY, response.expiresAt);
                    console.log('Telegram authentication successful:', response.user);
                }
            }),
            catchError(error => {
                console.error('Telegram authentication failed:', error);
                return of(null);
            })
        );
    }

    getAuthToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken() && !this.isTokenExpired();
    }

    isTokenExpired(): boolean {
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
        if (!expiry) return false; // If no expiry, assume valid (fallback token)

        return new Date(expiry) < new Date();
    }
}
