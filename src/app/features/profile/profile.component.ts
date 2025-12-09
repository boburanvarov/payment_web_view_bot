import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';
import { TranslateService } from '../../core/services/translate.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    userName: string = 'User';
    userEmail: string = '@username';
    userPhotoUrl: string = '';
    isDarkMode: boolean = false;
    hasPremiumIcon: boolean = false;

    constructor(
        private router: Router,
        private telegramService: TelegramService
    ) { }

    ngOnInit(): void {
        this.forceLightMode();

        this.telegramService.getUserData().subscribe(user => {
            if (user) {
                this.userName = user.first_name || 'User';
                this.userEmail = user.username ? `@${user.username}` : '';
                this.userPhotoUrl = user.photo_url || '';
            }
        });
    }

    // Temporarily disable dark mode logic and always use light theme
    private forceLightMode(): void {
        this.isDarkMode = false;
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark-mode');
    }

    toggleTheme(): void {
        // Dark mode is disabled for now; keep light theme
        this.forceLightMode();
    }

    goToSettings(): void {
        this.router.navigate(['/settings']);
    }

    goToSecurity(): void {
        this.router.navigate(['/security']);
    }

    goToPremium(): void {
        this.router.navigate(['/premium']);
    }

    goToPersonalInfo(): void {
        this.router.navigate(['/personal-info']);
    }

    goToAutoPayment(): void {
        this.router.navigate(['/auto-payment']);
    }

    goToFaq(): void {
        this.router.navigate(['/faq']);
    }

    goToHelp(): void {
        this.router.navigate(['/help']);
    }

    logout(): void {
        this.router.navigate(['/onboarding']);
    }
}
