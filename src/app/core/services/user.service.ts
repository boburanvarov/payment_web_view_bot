import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private currentUser$ = new BehaviorSubject<UserData | null>(null);
    private apiUrl = 'http://localhost:3000/api';

    constructor() { }

    getCurrentUser(): Observable<UserData | null> {
        return this.currentUser$.asObservable();
    }

    async loadUserData(userId: number): Promise<void> {
        try {
            const response = await fetch(`${this.apiUrl}/user/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                this.currentUser$.next(userData);
            } else {
                // Load demo data if API fails
                this.loadDemoData(userId);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.loadDemoData(userId);
        }
    }

    private loadDemoData(userId: number): void {
        const demoData: UserData = {
            userId: userId,
            firstName: 'Demo User',
            balance: 3257.00,
            income: 2350.00,
            expenses: 950.00,
            transactions: [
                { id: 1, type: 'expense' as any, title: 'Money Transfer', amount: 450, time: '12:35 PM', icon: '👤' },
                { id: 2, type: 'income' as any, title: 'Paypal', amount: 1200, time: '10:20 AM', icon: '💳' },
                { id: 3, type: 'expense' as any, title: 'Uber', amount: 150, time: '08:40 AM', icon: '🚗' },
                { id: 4, type: 'expense' as any, title: 'Bata Store', amount: 200, time: 'Yesterday', icon: '👟' },
                { id: 5, type: 'expense' as any, title: 'Bank Transfer', amount: 600, time: 'Yesterday', icon: '🏦' }
            ],
            cards: [
                { id: 1, number: '4836 7489 4562 1258', balance: 2310.00, gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
                { id: 2, number: '5247 5687 3025 5697', balance: 3257.00, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { id: 3, number: '8475 2358 2259 2053', balance: 1962.00, gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }
            ]
        };
        this.currentUser$.next(demoData);
    }

    updateBalance(amount: number, isIncome: boolean): void {
        const currentUser = this.currentUser$.value;
        if (currentUser) {
            if (isIncome) {
                currentUser.income += amount;
                currentUser.balance += amount;
            } else {
                currentUser.expenses += amount;
                currentUser.balance -= amount;
            }
            this.currentUser$.next({ ...currentUser });
        }
    }

    getUserValue(): UserData | null {
        return this.currentUser$.value;
    }
}
