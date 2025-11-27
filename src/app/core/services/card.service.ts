import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';
import { Card, CardApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    // Signals
    cards = signal<Card[]>([]);
    loading = signal<boolean>(false);

    // Computed signals
    totalBalance = computed(() =>
        this.cards().reduce((sum, card) => sum + card.balance, 0)
    );

    constructor(private http: HttpClient) { }

    loadCardsFromAPI(): void {
        const url = `${environment.apiUrl}/api/cards?phoneNumber=998916637744`;

        console.log('🃏 Loading cards from API:', url);
        this.loading.set(true);

        this.http.get<CardApiResponse[]>(url).pipe(
            tap(apiCards => {
                console.log('✅ Cards loaded from API:', apiCards);
                const cards = apiCards.map(apiCard => this.mapApiCardToCard(apiCard));
                this.cards.set(cards);
                this.loading.set(false);
            }),
            catchError(error => {
                console.error('❌ Failed to load cards from API:', error);
                this.cards.set([]);
                this.loading.set(false);
                return of([]);
            })
        ).subscribe();
    }

    private mapApiCardToCard(apiCard: CardApiResponse): Card {
        // Clean bank name - remove 'AO ' prefix
        const bankName = (apiCard.cardDesignInfo?.bankName || 'BANK').replace(/^AO\s+/i, '');

        return {
            id: apiCard.id,
            userId: apiCard.userId,
            phoneNumber: apiCard.phoneNumber,
            cardId: apiCard.cardId,
            number: apiCard.maskPan,
            cardType: apiCard.cardType,
            balance: apiCard.balance,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bankName: bankName,
            active: apiCard.active,
            // Rangli logolar
            bankLogo: apiCard.cardDesignInfo?.bankLogo,
            bankLogoMini: apiCard.cardDesignInfo?.bankLogoMini,
            processingLogo: apiCard.cardDesignInfo?.processingLogo,
            processingLogoMini: apiCard.cardDesignInfo?.processingLogoMini
        };
    }

    addCard(card: Omit<Card, 'id'>): void {
        const newCard: Card = {
            ...card,
            id: this.cards().length + 1
        };
        this.cards.set([...this.cards(), newCard]);
    }

    updateCard(id: number, updates: Partial<Card>): void {
        const updatedCards = this.cards().map(card =>
            card.id === id ? { ...card, ...updates } : card
        );
        this.cards.set(updatedCards);
    }

    deleteCard(id: number): void {
        const updatedCards = this.cards().filter(card => card.id !== id);
        this.cards.set(updatedCards);
    }

    getCardById(id: number): Card | undefined {
        return this.cards().find(card => card.id === id);
    }
}
