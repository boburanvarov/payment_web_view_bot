import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './core/services/telegram.service';
import { AuthService } from './core/services/auth.service';
import { CardService } from './core/services/card.service';
import { environment } from '../environments/environment';
import { timeout, catchError, of } from 'rxjs';

declare const Telegram: any;

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
    // Wait for Telegram WebApp to be ready, with 2-second timeout
    this.telegramService.isReady().pipe(
      timeout(2000),
      catchError(() => {
        console.warn('Telegram WebApp ready timeout, proceeding with initialization');
        return of(true); // Proceed anyway
      })
    ).subscribe(isReady => {
      console.log('Telegram WebApp ready status:', isReady);

      // Get user data
      this.telegramService.getUserData().subscribe(user => {
        if (user) {
          console.log('Telegram user:', user);
        }
      });

      // Only authenticate if we have initData
      if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
        console.log('Authenticating with Telegram...');
        this.authService.authenticateWithTelegram().subscribe(response => {
          if (response) {
            console.log('Authentication successful');
            this.cardService.loadCardsFromAPI();
          } else {
            console.warn('Authentication failed, using fallback token');
            this.cardService.loadCardsFromAPI();
          }
        });
      } else {
        console.log('No Telegram initData, using fallback token');
        this.cardService.loadCardsFromAPI();
      }
    });
  }
}
