import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SubscriptionPlansResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private plansData = signal<SubscriptionPlansResponse | null>(null);

    constructor(private http: HttpClient) { }

    getPlans(billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
        return this.http.get<SubscriptionPlansResponse>(
            `${environment.apiUrl}/api/subscriptions/plans`,
            { params: { billingCycle } }
        );
    }

    setPlansData(data: SubscriptionPlansResponse) {
        this.plansData.set(data);
    }

    getPlansData() {
        return this.plansData();
    }
}
