import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './core/services/telegram.service';
import { AuthService } from './core/services/auth.service';
import { CardService } from './core/services/card.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Expense Tracker';
  version = environment.version;

  constructor(
    private telegramService: TelegramService,
    private authService: AuthService,
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    // Authenticate with Telegram if in bot environment
    this.authService.authenticateWithTelegram().subscribe();

    // Load cards after potential authentication
    setTimeout(() => {
      this.cardService.loadCardsFromAPI();
    }, 500);

    this.telegramService.isReady().subscribe(isReady => {
      if (isReady) {
        this.telegramService.getUserData().subscribe(user => {
          if (user) {
            console.log('Telegram user:', user);
          }
        });
      }
    });
  }
}
