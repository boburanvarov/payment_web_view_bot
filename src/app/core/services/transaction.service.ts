import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private transactions$ = new BehaviorSubject<Transaction[]>([]);
    private apiUrl = 'http://localhost:3000/api';

    constructor() { }

    getTransactions(): Observable<Transaction[]> {
        return this.transactions$.asObservable();
    }

    setTransactions(transactions: Transaction[]): void {
        this.transactions$.next(transactions);
    }

    async addTransaction(userId: number, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        try {
            const response = await fetch(`${this.apiUrl}/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    ...transaction
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user && data.user.transactions) {
                    this.transactions$.next(data.user.transactions);
                }
                return data.transaction;
            } else {
                throw new Error('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            // Add locally if API fails
            const newTransaction: Transaction = {
                ...transaction,
                id: this.transactions$.value.length + 1
            } as Transaction;

            const updatedTransactions = [newTransaction, ...this.transactions$.value];
            this.transactions$.next(updatedTransactions);
            return newTransaction;
        }
    }

    deleteTransaction(id: number): void {
        const updatedTransactions = this.transactions$.value.filter(t => t.id !== id);
        this.transactions$.next(updatedTransactions);
    }

    getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
        return this.transactions$.value.filter(t => t.type === type);
    }

    getRecentTransactions(limit: number = 5): Transaction[] {
        return this.transactions$.value.slice(0, limit);
    }

    getTotalIncome(): number {
        return this.transactions$.value
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getTotalExpenses(): number {
        return this.transactions$.value
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }
}
