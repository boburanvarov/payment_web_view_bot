import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private cards$ = new BehaviorSubject<Card[]>([]);

    constructor() { }

    getCards(): Observable<Card[]> {
        return this.cards$.asObservable();
    }

    setCards(cards: Card[]): void {
        this.cards$.next(cards);
    }

    addCard(card: Omit<Card, 'id'>): void {
        const newCard: Card = {
            ...card,
            id: this.cards$.value.length + 1
        };
        this.cards$.next([...this.cards$.value, newCard]);
    }

    updateCard(id: number, updates: Partial<Card>): void {
        const updatedCards = this.cards$.value.map(card =>
            card.id === id ? { ...card, ...updates } : card
        );
        this.cards$.next(updatedCards);
    }

    deleteCard(id: number): void {
        const updatedCards = this.cards$.value.filter(card => card.id !== id);
        this.cards$.next(updatedCards);
    }

    getCardById(id: number): Card | undefined {
        return this.cards$.value.find(card => card.id === id);
    }

    getTotalBalance(): number {
        return this.cards$.value.reduce((sum, card) => sum + card.balance, 0);
    }
}
