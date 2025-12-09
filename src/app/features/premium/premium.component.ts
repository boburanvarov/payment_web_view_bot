import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionModalComponent, SubscriptionPlan } from '../../shared/components/subscription-modal/subscription-modal.component';

interface PlanFeature {
    text: string;
}

interface Plan {
    name: string;
    priceYearly: number;
    priceMonthly: number;
    description: string;
    features: PlanFeature[];
    isPremium: boolean;
    isCurrentPlan: boolean;
}

@Component({
    selector: 'app-premium',
    standalone: true,
    imports: [CommonModule, SubscriptionModalComponent],
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
            priceYearly: 60000,
            priceMonthly: 5000,
            description: 'Istalgan vaqtda obunani bekor qilish mumkin',
            features: [
                { text: '1 ta karta qo\'shish' },
                { text: '1 ta karta uchun balans bildirishnomasi' },
                { text: 'Oxirgi 5 ta tranzaksiya amaliyoti' },
                { text: '1 ta kategoriya bo\'yicha statistika' }
            ],
            isPremium: false,
            isCurrentPlan: true
        },
        {
            name: 'Premium',
            priceYearly: 108000,
            priceMonthly: 9000,
            description: 'Istalgan vaqtda obunani bekor qilish mumkin',
            features: [
                { text: '10 ta karta qo\'shish' },
                { text: 'Barcha kartalar uchun bildirishnomalar' },
                { text: 'Barcha tranzaksiyalar tarixini ko\'rish' }
            ],
            isPremium: true,
            isCurrentPlan: false
        }
    ];

    constructor(private router: Router) { }

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
        return this.isYearly ? 'Yillik' : 'Har oy';
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
                name: plan.name,
                price: this.getPrice(plan),
                period: this.getPeriodLabel(),
                description: plan.description
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
