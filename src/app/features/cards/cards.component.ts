import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { AddCardModalComponent } from '../../shared/components/add-card-modal/add-card-modal.component';
import { ToastComponent, ToastType } from '../../shared/components/toast/toast.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PullToRefreshComponent } from '../../shared/components/pull-to-refresh/pull-to-refresh.component';
import { CardService } from '../../core/services/card.service';
import { Card } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MoneyPipe } from '../../shared/pipe/money.pipe';
import { TelegramService } from '../../core/services/telegram.service';

interface SwipeState {
  startX: number;
  currentX: number;
  translateX: number;
  isSwiping: boolean;
  showDelete: boolean;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, AddCardModalComponent, ToastComponent, LoadingStateComponent, PullToRefreshComponent, TranslatePipe, MoneyPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  cards;
  totalBalance;
  loading;

  swipeStates: SwipeState[] = [];
  // How far the card can be swiped left to fully reveal delete button (must match CSS width)
  private readonly SWIPE_THRESHOLD = 100;

  // Dialog states
  showDeleteDialog = false;
  deletingCard: Card | null = null;
  deletingIndex: number = -1;

  showToast = false;
  toastMessage = '';
  toastTitle = '';
  toastType: ToastType = 'success';
  private toastTimeout: any;

  // Add Card Modal state
  showAddCardModal = false;

  // Beautiful gradient colors for each card - copied from bank-card component
  private cardGradients: string[] = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple to violet
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink to red
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue to cyan
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green to teal
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink to yellow
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Cyan to dark purple
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Light teal to pink
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Coral to pink
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Peach to orange
    'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', // Pink to dark pink
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Lavender to pink
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', // Peach to light pink
    'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)', // Red to magenta
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Green to blue
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', // Purple to yellow
  ];

  constructor(
    public cardService: CardService,
    public router: Router,
    private telegramService: TelegramService
  ) {
    this.cards = this.cardService.cards;
    this.totalBalance = this.cardService.totalBalance;
    this.loading = this.cardService.loading;
  }

  ngOnInit(): void {
    this.initSwipeStates();
  }

  // Card gradient methods - copied from bank-card component
  getCardGradient(index: number): string {
    return this.cardGradients[index % this.cardGradients.length];
  }

  getCardBackgroundStyle(index: number): string {
    const gradient = this.getCardGradient(index);
    // Gradient as base layer, card vector overlays on top
    return `${gradient}, url('/assets/img/card-vector.png')`;
  }

  formatCardNumberWithMask(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 16) {
      return cardNumber;
    }
    const first4 = cardNumber.substring(0, 4);
    const next2 = cardNumber.substring(4, 6);
    const last4 = cardNumber.substring(12, 16);
    return `${first4} ${next2}** **** ${last4}`;
  }


  private initSwipeStates(): void {
    const cardCount = this.cards().length;
    this.swipeStates = Array(cardCount).fill(null).map(() => ({
      startX: 0,
      currentX: 0,
      translateX: 0,
      isSwiping: false,
      showDelete: false
    }));
  }

  // Touch events
  onTouchStart(event: TouchEvent, index: number): void {
    this.startSwipe(event.touches[0].clientX, index);
  }

  onTouchMove(event: TouchEvent, index: number): void {
    this.moveSwipe(event.touches[0].clientX, index);
  }

  onTouchEnd(event: TouchEvent, index: number): void {
    this.endSwipe(index);
  }

  // Mouse events
  onMouseDown(event: MouseEvent, index: number): void {
    this.startSwipe(event.clientX, index);
  }

  onMouseMove(event: MouseEvent, index: number): void {
    if (this.swipeStates[index]?.isSwiping) {
      this.moveSwipe(event.clientX, index);
    }
  }

  onMouseUp(event: MouseEvent, index: number): void {
    this.endSwipe(index);
  }

  private startSwipe(clientX: number, index: number): void {
    this.swipeStates.forEach((state, i) => {
      if (i !== index && state?.showDelete) {
        state.showDelete = false;
        state.translateX = 0;
      }
    });

    if (!this.swipeStates[index]) {
      this.swipeStates[index] = {
        startX: 0,
        currentX: 0,
        translateX: 0,
        isSwiping: false,
        showDelete: false
      };
    }

    this.swipeStates[index].startX = clientX;
    this.swipeStates[index].isSwiping = true;
  }

  private moveSwipe(clientX: number, index: number): void {
    if (!this.swipeStates[index]?.isSwiping) return;

    const deltaX = clientX - this.swipeStates[index].startX;

    if (deltaX < 0) {
      const translateX = Math.max(deltaX, -this.SWIPE_THRESHOLD);
      this.swipeStates[index].translateX = translateX;
      this.swipeStates[index].showDelete = Math.abs(translateX) > 20;
    } else if (deltaX > 0) {
      if (this.swipeStates[index].showDelete) {
        const newTranslateX = Math.min(-this.SWIPE_THRESHOLD + deltaX, 0);
        this.swipeStates[index].translateX = newTranslateX;
        if (newTranslateX >= -20) {
          this.swipeStates[index].showDelete = false;
        }
      } else {
        this.swipeStates[index].translateX = 0;
      }
    }
  }

  private endSwipe(index: number): void {
    if (!this.swipeStates[index]) return;

    this.swipeStates[index].isSwiping = false;

    if (this.swipeStates[index].translateX <= -this.SWIPE_THRESHOLD / 2) {
      this.swipeStates[index].translateX = -this.SWIPE_THRESHOLD;
      this.swipeStates[index].showDelete = true;
    } else {
      this.swipeStates[index].translateX = 0;
      this.swipeStates[index].showDelete = false;
    }
  }

  // Delete with custom dialog
  deleteCard(card: Card, index: number): void {
    this.deletingCard = card;
    this.deletingIndex = index;
    this.showDeleteDialog = true;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;

    if (this.deletingIndex >= 0 && this.swipeStates[this.deletingIndex]) {
      this.swipeStates[this.deletingIndex].translateX = 0;
      this.swipeStates[this.deletingIndex].showDelete = false;
    }

    this.deletingCard = null;
    this.deletingIndex = -1;
  }

  confirmDelete(): void {
    if (this.deletingCard && this.deletingIndex >= 0) {
      const cardId = this.deletingCard.cardId;
      if (!cardId) return;

      const cardName = this.deletingCard.bankName || 'Karta';
      const cardNumber = this.deletingCard.number || '';
      const deletingIndex = this.deletingIndex;

      this.showDeleteDialog = false;

      // Enable closing confirmation for Telegram WebApp
      this.telegramService.enableClosingConfirmation();

      this.cardService.deleteCardFromAPI(cardId).subscribe({
        next: () => {
          this.swipeStates.splice(deletingIndex, 1);
          this.showToastMessage('success', "Karta o'chirildi!", `${cardName} ${cardNumber} kartasi o'chirildi`);
          this.telegramService.disableClosingConfirmation();
        },
        error: (err: unknown) => {
          console.error('Error deleting card:', err);
          this.swipeStates.splice(deletingIndex, 1);
          this.showToastMessage('error', "Xatolik", "Kartani o'chirishda xatolik yuz berdi");
          this.telegramService.disableClosingConfirmation();
        }
      });

      this.deletingCard = null;
      this.deletingIndex = -1;
    }
  }

  private showToastMessage(type: ToastType, title: string, message: string): void {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }

  // Add Card Modal methods
  openAddCardModal(): void {
    this.showAddCardModal = true;
  }

  closeAddCardModal(): void {
    this.showAddCardModal = false;
  }

  onCardAdded(): void {
    this.initSwipeStates();
    this.showToastMessage('success', "Muvaffaqiyat", "Karta muvaffaqiyatli qo'shildi");
  }

  onRefresh(): void {
    this.cardService.loadCardsFromAPI();
  }
}
