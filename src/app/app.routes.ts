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
            }
        ]
    }
];
