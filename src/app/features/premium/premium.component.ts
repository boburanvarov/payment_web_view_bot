import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionModalComponent } from '../../shared/components/subscription-modal/subscription-modal.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SubscriptionPlan, SubscriptionPlansResponse, SubscriptionPlanDetailed, BillingCycle } from '../../core/models';

@Component({
    selector: 'app-premium',
    standalone: true,
    imports: [CommonModule, SubscriptionModalComponent, LoadingStateComponent, EmptyStateComponent, TranslatePipe],
    templateUrl: './premium.component.html',
    styleUrl: './premium.component.scss'
})
export class PremiumComponent implements OnInit {
    showSubscriptionModal: boolean = false;
    selectedPlanForModal: SubscriptionPlan | null = null;

    // API response data
    plansResponse = signal<SubscriptionPlansResponse | null>(null);
    isLoading = signal<boolean>(true);

    // Current billing cycle from API
    get currentBillingCycle(): 'MONTHLY' | 'YEARLY' {
        return this.plansResponse()?.billingCycle || 'MONTHLY';
    }

    // Plans from API
    get plans(): SubscriptionPlanDetailed[] {
        return this.plansResponse()?.plans || [];
    }

    // Billing cycles from API
    get cycles(): BillingCycle[] {
        return this.plansResponse()?.cycles || [];
    }

    constructor(
        private router: Router,
        public translateService: TranslateService,
        private subscriptionService: SubscriptionService
    ) { }

    ngOnInit(): void {
        this.loadPlans(this.currentBillingCycle);
    }

    loadPlans(billingCycle: 'MONTHLY' | 'YEARLY'): void {
        this.isLoading.set(true);
        this.subscriptionService.getPlans(billingCycle).subscribe({
            next: (response) => {

                response.cycles.forEach((cycle, index) => {
                    console.log(`Cycle ${index + 1}:`, {
                        cycle: cycle.cycle,
                        label: cycle.label,
                        discountLabel: cycle.discountLabel,
                        selected: cycle.selected
                    });
                });


                this.plansResponse.set(response);
                this.subscriptionService.setPlansData(response);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading subscription plans:', error);
                this.isLoading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    togglePeriod(cycle: 'MONTHLY' | 'YEARLY'): void {
        if (cycle !== this.currentBillingCycle) {
            this.loadPlans(cycle);
        }
    }

    selectPlan(plan: SubscriptionPlanDetailed): void {
        if (!plan.current) {
            this.selectedPlanForModal = {
                name: plan.name,
                price: plan.price,
                period: plan.cycleLabel,
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
        // Handle successful subscription - reload plans to get updated current status
        this.loadPlans(this.currentBillingCycle);
        console.log('Subscription successful!');
    }
}
