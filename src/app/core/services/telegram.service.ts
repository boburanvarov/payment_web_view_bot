import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare const Telegram: any;

@Injectable({
    providedIn: 'root'
})
export class TelegramService {
    private tg: any;
    private telegramReady$ = new BehaviorSubject<boolean>(false);
    private userData$ = new BehaviorSubject<any>(null);

    constructor() {
        this.initializeTelegram();
    }

    private initializeTelegram(): void {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            this.tg.ready();
            this.tg.expand();

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
