import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';

@Component({
    selector: 'app-personal-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './personal-info.component.html',
    styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent {
    userName: string = 'User';
    userEmail: string = '@username';
    userPhone: string = '+998 XX XXX XX XX';

    constructor(
        private router: Router,
        private telegramService: TelegramService
    ) {
        this.telegramService.getUserData().subscribe(user => {
            if (user) {
                this.userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
                this.userEmail = user.username ? `@${user.username}` : '';
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }
}
