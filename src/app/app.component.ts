import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './core/services/telegram.service';
import { UserService } from './core/services/user.service';
import { TransactionService } from './core/services/transaction.service';
import { CardService } from './core/services/card.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Expense Tracker';

  constructor(
    private telegramService: TelegramService,
    private userService: UserService,
    private transactionService: TransactionService,
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    // Load demo data immediately for testing
    this.userService.loadUserData(0);

    // Subscribe to user data to update transactions and cards
    this.userService.getCurrentUser().subscribe(userData => {
      if (userData) {
        this.transactionService.setTransactions(userData.transactions);
        this.cardService.setCards(userData.cards);
      }
    });

    // Initialize Telegram WebApp in background
    this.telegramService.isReady().subscribe(isReady => {
      if (isReady) {
        this.telegramService.getUserData().subscribe(user => {
          if (user) {
            // Reload with real Telegram user data
            this.userService.loadUserData(user.id);
          }
        });
      }
    });
  }
}
