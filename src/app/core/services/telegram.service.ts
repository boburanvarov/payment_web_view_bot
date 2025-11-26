import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare const Telegram: any;

// Telegram WebApp User Interface
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

// Telegram WebApp Chat Interface
export interface TelegramChat {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
}

// Telegram WebApp InitDataUnsafe Interface
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

    constructor() {
        this.initializeTelegram();
    }

    private initializeTelegram(): void {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            this.tg.ready();
            this.tg.expand();

            // Log Telegram WebApp data for debugging
            console.group(' Telegram WebApp Data');
            console.log(' initData (raw string):', this.tg.initData);
            console.log(' initDataUnsafe (parsed object):', this.tg.initDataUnsafe);
            console.log(' User:', this.tg.initDataUnsafe?.user);
            console.log(' Chat:', this.tg.initDataUnsafe?.chat);
            console.log(' Query ID:', this.tg.initDataUnsafe?.query_id);
            console.log(' Start Param:', this.tg.initDataUnsafe?.start_param);
            console.log(' Platform:', this.tg.platform);
            console.log(' Version:', this.tg.version);
            console.groupEnd();

            // Get user data from Telegram
            const user = this.tg.initDataUnsafe?.user;

            if (user) {
                this.userData$.next(user);
            }

            this.telegramReady$.next(true);

            // Set theme colors
            this.tg.setHeaderColor('#8B5CF6');
            this.tg.setBackgroundColor('#F8F9FA');
        } else {
            // For testing outside Telegram
            console.log('Telegram WebApp not available - running in demo mode');
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