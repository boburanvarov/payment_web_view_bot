import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface PlanFeature {
    text: string;
}

interface SubscriptionPlan {
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
    imports: [CommonModule],
    templateUrl: './premium.component.html',
    styleUrl: './premium.component.scss'
})
export class PremiumComponent {
    isYearly: boolean = true;

    plans: SubscriptionPlan[] = [
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

    getPrice(plan: SubscriptionPlan): number {
        return this.isYearly ? plan.priceYearly : plan.priceMonthly;
    }

    getPeriodLabel(): string {
        return this.isYearly ? 'Yillik' : 'Har oy';
    }

    formatPrice(price: number): string {
        return price.toLocaleString('uz-UZ').replace(/,/g, ' ');
    }

    selectPlan(plan: SubscriptionPlan): void {
        if (!plan.isCurrentPlan) {
            console.log('Selected plan:', plan.name);
            // Handle plan selection/purchase
        }
    }
}
