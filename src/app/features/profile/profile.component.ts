import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TelegramService } from '../../core/services/telegram.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    userName: string = 'User';
    userEmail: string = 'user@example.com';

    constructor(
        private router: Router,
        private telegramService: TelegramService
    ) { }

    ngOnInit(): void {

        // Get Telegram user data
        this.telegramService.getUserData().subscribe(user => {
            if (user) {
                this.userName = user.first_name || 'User';
                this.userEmail = user.username ? `@${user.username}` : 'user@example.com';
            }
        });
    }

    goToSettings(): void {
        this.router.navigate(['/settings']);
    }

    goToSecurity(): void {
        this.router.navigate(['/security']);
    }

    logout(): void {
        this.router.navigate(['/onboarding']);
    }
}
