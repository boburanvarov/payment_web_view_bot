import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { OverviewComponent } from './features/overview/overview.component';
import { AddTransactionComponent } from './features/add-transaction/add-transaction.component';
import { CardsComponent } from './features/cards/cards.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
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
    }
];
