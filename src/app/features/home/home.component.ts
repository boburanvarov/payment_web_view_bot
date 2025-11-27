import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardService } from '../../core/services/card.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { BalanceCardCarouselComponent } from '../../shared/components/balance-card-carousel/balance-card-carousel.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, BalanceCardCarouselComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    // Access signals from CardService
    cards;
    totalBalance;
    loading;

    // Mock data for income/expenses
    income = 0;
    expenses = 0;
    recentTransactions: any[] = [];

    constructor(
        private router: Router,
        public cardService: CardService
    ) {
        // Initialize signal accessors
        this.cards = this.cardService.cards;
        this.totalBalance = this.cardService.totalBalance;
        this.loading = this.cardService.loading;
    }

    ngOnInit(): void {
        // Cards are already loaded in AppComponent
    }

    navigateToAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    navigateToOverview(): void {
        this.router.navigate(['/overview']);
    }
}
