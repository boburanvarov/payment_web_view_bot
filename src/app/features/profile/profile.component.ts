import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { UserService } from '../../core/services/user.service';
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
        private userService: UserService,
        private telegramService: TelegramService
    ) { }

    ngOnInit(): void {
        // Get user data
        this.userService.getCurrentUser().subscribe(user => {
            if (user) {
                this.userName = user.firstName;
            }
        });

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

    logout(): void {
        this.router.navigate(['/onboarding']);
    }
}
