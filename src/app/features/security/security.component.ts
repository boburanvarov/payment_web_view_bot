import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TelegramService, TelegramInitDataUnsafe, TelegramUser } from '../../core/services/telegram.service';

@Component({
    selector: 'app-security',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './security.component.html',
    styleUrl: './security.component.scss'
})
export class SecurityComponent implements OnInit {
    telegramData: any = null;
    initData: string = '';
    initDataUnsafe: TelegramInitDataUnsafe | null = null;
    user: TelegramUser | null = null;
    platform: string = '';
    version: string = '';

    constructor(
        private router: Router,
        private telegramService: TelegramService
    ) { }

    ngOnInit(): void {
        const tg = this.telegramService.getTelegramInstance();

        if (tg) {
            this.initData = tg.initData || 'N/A';
            this.initDataUnsafe = tg.initDataUnsafe || null;
            this.user = tg.initDataUnsafe?.user || null;
            this.platform = tg.platform || 'N/A';
            this.version = tg.version || 'N/A';

            this.telegramData = {
                initData: this.initData,
                initDataUnsafe: this.initDataUnsafe,
                user: this.user,
                platform: this.platform,
                version: this.version
            };
        }
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            this.telegramService.showAlert('Copied to clipboard!');
        });
    }

    formatJson(obj: any): string {
        return JSON.stringify(obj, null, 2);
    }
}
