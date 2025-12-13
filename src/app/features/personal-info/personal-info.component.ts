import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-personal-info',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './personal-info.component.html',
    styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent implements OnInit {
    userName: string = 'User';
    userEmail: string = '';
    userPhone: string = '+998 XX XXX XX XX';
    hasUsername = signal<boolean>(false); // Control username visibility

    constructor(
        private router: Router,
        private telegramService: TelegramService,
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        // Load profile from API
        this.profileService.getProfile().subscribe({
            next: (profile) => {
                this.userName = profile.name || 'User';
                this.userEmail = profile.username || '';
                this.userPhone = profile.phoneNumber || '';

                // Show username only if it exists and is not empty
                this.hasUsername.set(!!profile.username && profile.username.trim() !== '');
            },
            error: (error) => {
                console.error('Error loading profile:', error);
                // Fallback to Telegram data
                this.loadTelegramData();
            }
        });
    }

    private loadTelegramData(): void {
        this.telegramService.getUserData().subscribe(user => {
            if (user) {
                this.userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
                this.userEmail = user.username || '';
                this.hasUsername.set(!!user.username);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }
}
