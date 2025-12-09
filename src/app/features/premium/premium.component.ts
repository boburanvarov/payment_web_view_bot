import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionModalComponent } from '../../shared/components/subscription-modal/subscription-modal.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { SubscriptionPlan } from '../../core/models';

interface PlanFeature {
    key: string;
}

interface Plan {
    name: string;
    nameKey: string;
    priceYearly: number;
    priceMonthly: number;
    descriptionKey: string;
    features: PlanFeature[];
    isPremium: boolean;
    isCurrentPlan: boolean;
}

@Component({
    selector: 'app-premium',
    standalone: true,
    imports: [CommonModule, SubscriptionModalComponent, TranslatePipe],
    templateUrl: './premium.component.html',
    styleUrl: './premium.component.scss'
})
export class PremiumComponent {
    isYearly: boolean = true;
    showSubscriptionModal: boolean = false;
    selectedPlanForModal: SubscriptionPlan | null = null;

    // Current user's subscription - Freemium with yearly period
    currentPlanName: string = 'Freemium';
    currentPlanIsYearly: boolean = true;

    plans: Plan[] = [
        {
            name: 'Freemium',
            nameKey: 'premium.freemium',
            priceYearly: 60000,
            priceMonthly: 5000,
            descriptionKey: 'premium.description',
            features: [
                { key: 'premium.features.cards1' },
                { key: 'premium.features.notification1' },
                { key: 'premium.features.transactions5' },
                { key: 'premium.features.category1' }
            ],
            isPremium: false,
            isCurrentPlan: true
        },
        {
            name: 'Premium',
            nameKey: 'premium.premiumPlan',
            priceYearly: 108000,
            priceMonthly: 9000,
            descriptionKey: 'premium.description',
            features: [
                { key: 'premium.features.cards10' },
                { key: 'premium.features.notificationAll' },
                { key: 'premium.features.transactionsAll' }
            ],
            isPremium: true,
            isCurrentPlan: false
        }
    ];

    constructor(
        private router: Router,
        public translateService: TranslateService
    ) { }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    togglePeriod(yearly: boolean): void {
        this.isYearly = yearly;
    }

    getPrice(plan: Plan): number {
        return this.isYearly ? plan.priceYearly : plan.priceMonthly;
    }

    getPeriodLabel(): string {
        return this.translateService.get(this.isYearly ? 'premium.yearly' : 'premium.monthly');
    }

    formatPrice(price: number): string {
        return price.toLocaleString('uz-UZ').replace(/,/g, ' ');
    }

    // Check if this plan is current user's plan for the selected period
    isCurrentPlanForPeriod(plan: Plan): boolean {
        return plan.name === this.currentPlanName && this.isYearly === this.currentPlanIsYearly;
    }

    selectPlan(plan: Plan): void {
        if (!this.isCurrentPlanForPeriod(plan)) {
            this.selectedPlanForModal = {
                name: this.translateService.get(plan.nameKey),
                price: this.getPrice(plan),
                period: this.getPeriodLabel(),
                description: this.translateService.get(plan.descriptionKey)
            };
            this.showSubscriptionModal = true;
        }
    }

    onModalClose(): void {
        this.showSubscriptionModal = false;
        this.selectedPlanForModal = null;
    }

    onSubscriptionSuccess(): void {
        // Handle successful subscription
        console.log('Subscription successful!');
    }
}
