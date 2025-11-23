import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
    activeRoute: string = '';

    constructor(private router: Router) {
        this.activeRoute = this.router.url;
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
        this.activeRoute = route;
    }

    openAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    isActive(route: string): boolean {
        return this.activeRoute === route || this.router.url === route;
    }
}
