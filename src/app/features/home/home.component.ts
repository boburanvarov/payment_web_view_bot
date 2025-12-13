import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardService } from '../../core/services/card.service';
import { TransactionService } from '../../core/services/transaction.service';
import { TelegramService } from '../../core/services/telegram.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { BalanceCardCarouselComponent } from '../../shared/components/balance-card-carousel/balance-card-carousel.component';
import { ReportCardComponent } from '../../shared/components/report-card/report-card.component';
import { BannerCarouselComponent, Banner } from '../../shared/components/banner-carousel/banner-carousel.component';
import { ExchangeRateComponent } from '../../shared/components/exchange-rate/exchange-rate.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PullToRefreshComponent } from '../../shared/components/pull-to-refresh/pull-to-refresh.component';
import { Card } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MoneyPipe } from '../../shared/pipe/money.pipe';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, BalanceCardCarouselComponent, ReportCardComponent, BannerCarouselComponent, ExchangeRateComponent, EmptyStateComponent, LoadingStateComponent, PullToRefreshComponent, TranslatePipe, MoneyPipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
    // Access signals from CardService
    cards;
    totalBalance;
    loading;

    // User profile data
    userProfile = {
        name: 'User',
        username: '@username',
        photoUrl: ''
    };

    // Income/Expenses data from reference
    income = 17856144;
    expenses = 4020100;

    // Access signals from TransactionService (will be initialized in constructor)
    cardReport;
    cardReportLoading;


    // Advertising banners
    banners: Banner[] = [
        {
            id: 1,
            title: 'Valyuta kurslarini',
            subtitle: 'oson hisoblang',
            image: '/assets/img/calculate.png',
            gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
        },
        {
            id: 2,
            title: 'Xarajatlar',
            subtitle: 'monitoringi',
            image: '/assets/img/expense-monitoring.png',
            gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)'
        }
    ];

    constructor(
        private router: Router,
        public cardService: CardService,
        public transactionService: TransactionService,
        private telegramService: TelegramService
    ) {
        // Initialize signal accessors
        this.cards = this.cardService.cards;
        this.totalBalance = this.cardService.totalBalance;
        this.loading = this.cardService.loading;
        this.cardReport = this.transactionService.cardReport;
        this.cardReportLoading = this.transactionService.cardReportLoading;
    }

    @ViewChild('scrollRevealSection', { static: false }) scrollRevealSection?: ElementRef;

    ngOnInit(): void {
        // Load Telegram user data
        this.telegramService.getUserData().subscribe(user => {
            if (user) {
                this.userProfile.name = user.first_name || 'User';
                this.userProfile.username = user.username ? `@${user.username}` : '';
                this.userProfile.photoUrl = user.photo_url || '';
            }
        });
    }

    ngAfterViewInit(): void {
        // Set up intersection observer for scroll reveal
        if (this.scrollRevealSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            observer.observe(this.scrollRevealSection.nativeElement);
        }
    }

    navigateToAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    navigateToOverview(): void {
        this.router.navigate(['/overview']);
    }

    navigateToTransactions(): void {
        // Navigate to all transactions page
        console.log('Navigate to transactions');
    }


    getUserInitials(): string {
        return this.userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    onCardSelected(card: Card | null): void {
        if (card && card.cardId) {
            this.transactionService.loadCardTransactions(card.cardId, 0, 10, 'ALL');
        } else {
            // Clear card report when total balance card is selected
            this.transactionService.clearCardReport();
        }
    }

    onRefresh(): void {
        // Reload cards data
        this.cardService.loadCardsFromAPI();
    }

    getSelectedCardId(): string | undefined {
        return this.transactionService.selectedCardId() || undefined;
    }
}
