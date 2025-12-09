import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

declare const Telegram: any;

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface TelegramChat {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
}

export interface TelegramInitDataUnsafe {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: TelegramChat;
    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
}

@Injectable({
    providedIn: 'root'
})
export class TelegramService {
    private tg: any;
    private telegramReady$ = new BehaviorSubject<boolean>(false);
    private userData$ = new BehaviorSubject<TelegramUser | null>(null);
    private authService = inject(AuthService);

    constructor() {
        this.initializeTelegram();
    }

    private initializeTelegram(): void {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            this.tg.ready();

            // Check if mobile platform
            const platform = this.tg.platform;
            const isMobile = platform === 'android' || platform === 'ios' || platform === 'android_x';

            // Only expand and fullscreen on mobile
            if (isMobile) {
                this.tg.expand();

                // Disable vertical swipes to prevent accidental closing (mobile only)
                try {
                    if (this.tg.disableVerticalSwipes) {
                        this.tg.disableVerticalSwipes();
                    }
                } catch (e) {
                    console.log('disableVerticalSwipes not supported');
                }

                // Request fullscreen mode (Bot API 8.0+, mobile only)
                try {
                    if (this.tg.requestFullscreen) {
                        this.tg.requestFullscreen();
                    }
                } catch (e) {
                    console.log('Fullscreen not supported in this WebApp version');
                }
            }

            const user = this.tg.initDataUnsafe?.user;

            if (user) {
                this.userData$.next(user);
            }

            const initData = this.tg.initData;
            if (initData) {
                this.authService.authenticateWithTelegram(initData).subscribe({
                    next: (response) => { },
                    error: (error) => { }
                });
            }

            this.telegramReady$.next(true);

            this.tg.setHeaderColor('#2E90FA');
            this.tg.setBackgroundColor('#F8F9FA');
        } else {
            this.telegramReady$.next(false);
        }
    }

    getTelegramInstance(): any {
        return this.tg;
    }

    isReady(): Observable<boolean> {
        return this.telegramReady$.asObservable();
    }

    getUserData(): Observable<any> {
        return this.userData$.asObservable();
    }

    close(): void {
        if (this.tg) {
            this.tg.close();
        }
    }

    showAlert(message: string): void {
        if (this.tg) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    showConfirm(message: string): Promise<boolean> {
        if (this.tg) {
            return new Promise((resolve) => {
                this.tg.showConfirm(message, (confirmed: boolean) => {
                    resolve(confirmed);
                });
            });
        } else {
            return Promise.resolve(confirm(message));
        }
    }

    sendData(data: any): void {
        if (this.tg) {
            this.tg.sendData(JSON.stringify(data));
        }
    }

    enableClosingConfirmation(): void {
        if (this.tg) {
            this.tg.enableClosingConfirmation();
        }
    }

    disableClosingConfirmation(): void {
        if (this.tg) {
            this.tg.disableClosingConfirmation();
        }
    }
}