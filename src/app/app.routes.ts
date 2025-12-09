import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { OverviewComponent } from './features/overview/overview.component';
import { ChartComponent } from './features/chart/chart.component';
import { AddTransactionComponent } from './features/add-transaction/add-transaction.component';
import { CardsComponent } from './features/cards/cards.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { SecurityComponent } from './features/security/security.component';
import { PremiumComponent } from './features/premium/premium.component';
import { PersonalInfoComponent } from './features/personal-info/personal-info.component';
import { AutoPaymentComponent } from './features/auto-payment/auto-payment.component';
import { FaqComponent } from './features/faq/faq.component';
import { HelpComponent } from './features/help/help.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'overview',
                component: OverviewComponent
            },
            {
                path: 'chart',
                component: ChartComponent
            },
            {
                path: 'add-transaction',
                component: AddTransactionComponent
            },
            {
                path: 'cards',
                component: CardsComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'security',
                component: SecurityComponent
            },
            {
                path: 'premium',
                component: PremiumComponent
            },
            {
                path: 'personal-info',
                component: PersonalInfoComponent
            },
            {
                path: 'auto-payment',
                component: AutoPaymentComponent
            },
            {
                path: 'faq',
                component: FaqComponent
            },
            {
                path: 'help',
                component: HelpComponent
            }
        ]
    }
];

