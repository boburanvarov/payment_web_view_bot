import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
    selector: 'app-auto-payment',
    standalone: true,
    imports: [CommonModule, TranslatePipe, LoadingStateComponent],
    templateUrl: './auto-payment.component.html',
    styleUrl: './auto-payment.component.scss'
})
export class AutoPaymentComponent implements OnInit {
    autoPaymentEnabled: boolean = false;
    loading: boolean = false;
    updating: boolean = false;

    constructor(
        private router: Router,
        private profileService: ProfileService
    ) {
        // Use cached profile signal from ProfileService
        effect(() => {
            const profile = this.profileService.getProfileSignal()();
            if (profile) {
                this.autoPaymentEnabled = profile.autoPay;
                this.loading = false;
            }
        });
    }

    ngOnInit(): void {
        // Check if profile is already cached
        const cachedProfile = this.profileService.getProfileData();
        if (cachedProfile) {
            this.autoPaymentEnabled = cachedProfile.autoPay;
        } else {
            // Profile not loaded yet, show loading
            this.loading = true;
        }
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    onToggleChange(): void {
        if (this.updating) return; // Prevent double request

        const newValue = !this.autoPaymentEnabled;
        this.updating = true;

        // Use ProfileService to update autoPay
        this.profileService.updateAutoPay(newValue).subscribe({
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
