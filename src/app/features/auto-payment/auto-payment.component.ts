import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProfileResponse } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-auto-payment',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './auto-payment.component.html',
    styleUrl: './auto-payment.component.scss'
})
export class AutoPaymentComponent implements OnInit {
    autoPaymentEnabled: boolean = true;
    loading: boolean = false;
    updating: boolean = false;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.loading = true;
        // PUT request to get current autoPay status
        this.http.put<ProfileResponse>(`${environment.apiUrl}/api/profile/autopay`, {
            enabled: this.autoPaymentEnabled
        }).subscribe({
            next: (response) => {
                this.autoPaymentEnabled = response.autoPay;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Failed to load profile:', error);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    onToggleChange(): void {
        if (this.updating) return; // Prevent double request

        const newValue = !this.autoPaymentEnabled;
        this.updating = true;

        this.http.put<ProfileResponse>(`${environment.apiUrl}/api/profile/autopay`, {
            enabled: newValue
        }).subscribe({
            next: (response) => {
                this.autoPaymentEnabled = response.autoPay;
                this.updating = false;
                console.log('Auto payment updated:', response.autoPay);
            },
            error: (error) => {
                this.updating = false;
                console.error('Failed to update auto payment:', error);
            }
        });
    }
}
