import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { BankCardComponent } from '../../shared/components/bank-card/bank-card.component';
import { AddCardModalComponent } from '../../shared/components/add-card-modal/add-card-modal.component';
import { CardService } from '../../core/services/card.service';
import { Card } from '../../core/models';

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
  imports: [CommonModule, BottomNavComponent, BankCardComponent, AddCardModalComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  cards;
  totalBalance;
  loading;

  swipeStates: SwipeState[] = [];
  private readonly SWIPE_THRESHOLD = 80;

  // Dialog states
  showDeleteDialog = false;
  deletingCard: Card | null = null;
  deletingIndex: number = -1;

  // Toast states
  showToast = false;
  toastMessage = '';
  private toastTimeout: any;

  // Add Card Modal state
  showAddCardModal = false;

  constructor(
    public cardService: CardService,
    public router: Router
  ) {
    this.cards = this.cardService.cards;
    this.totalBalance = this.cardService.totalBalance;
    this.loading = this.cardService.loading;
  }

  ngOnInit(): void {
    this.initSwipeStates();
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
      const cardName = this.deletingCard.bankName || 'Karta';
      const cardNumber = this.deletingCard.number || '';

      this.cardService.deleteCard(this.deletingCard.id);
      this.swipeStates.splice(this.deletingIndex, 1);

      this.showDeleteDialog = false;
      this.deletingCard = null;
      this.deletingIndex = -1;

      this.showSuccessToast(`${cardName} ${cardNumber} kartasi o'chirildi`);
    }
  }

  private showSuccessToast(message: string): void {
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
    this.showSuccessToast("Karta muvaffaqiyatli qo'shildi");
  }
}
