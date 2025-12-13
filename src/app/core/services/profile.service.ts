import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    // Signal to store profile data
    private profileData = signal<ProfileResponse | null>(null);

    constructor(private http: HttpClient) { }

    /**
     * Get user profile from API
     */
    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${environment.apiUrl}/api/profile`).pipe(
            tap(profile => {
                this.profileData.set(profile);
                console.log('Profile loaded:', profile);
            })
        );
    }

    /**
     * Update user language preference
     */
    updateLanguage(language: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/api/profile/language`, {
            language: language.toUpperCase() // EN, RU, UZ
        });
    }

    /**
     * Update auto-payment setting
     */
    updateAutoPay(enabled: boolean): Observable<ProfileResponse> {
        return this.http.put<ProfileResponse>(`${environment.apiUrl}/api/profile/autopay`, {
            enabled
        }).pipe(
            tap(response => {
                // Update cached profile data with new autoPay value
                const currentProfile = this.profileData();
                if (currentProfile) {
                    this.profileData.set({ ...currentProfile, autoPay: response.autoPay });
                }
            })
        );
    }

    /**
     * Get cached profile data
     */
    getProfileData() {
        return this.profileData();
    }

    /**
     * Get profile signal
     */
    getProfileSignal() {
        return this.profileData.asReadonly();
    }
}
