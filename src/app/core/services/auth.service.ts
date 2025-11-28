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

    authenticateWithTelegram(initData: string): Observable<TelegramAuthResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            initData: initData
        };

        return this.http.post<TelegramAuthResponse>(this.apiUrl, body, { headers }).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                }
            }),
            catchError(error => {
                throw error;
            })
        );
    }

    getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    logout(): void {
        localStorage.removeItem('auth_token');
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}
