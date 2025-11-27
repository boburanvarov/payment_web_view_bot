import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TelegramAuthResponse {
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth/telegram`;

    constructor(private http: HttpClient) { }

    /**
     * Authenticate user with Telegram init data
     * @param initData The raw initData string from Telegram WebApp
     * @returns Observable with authentication response
     */
    authenticateWithTelegram(initData: string): Observable<TelegramAuthResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            initData: initData
        };

        console.log('🔐 Sending authentication request to:', this.apiUrl);
        console.log('📤 Init data:', initData);

        return this.http.post<TelegramAuthResponse>(this.apiUrl, body, { headers }).pipe(
            tap(response => {
                console.log('✅ Authentication successful:', response);

                // Store token if provided
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                }
            }),
            catchError(error => {
                console.error('❌ Authentication failed:', error);
                throw error;
            })
        );
    }

    /**
     * Get stored authentication token
     */
    getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Clear authentication token
     */
    logout(): void {
        localStorage.removeItem('auth_token');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}
