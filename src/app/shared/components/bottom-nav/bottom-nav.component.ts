import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent implements OnInit {
    activeRoute: string = '';

    constructor(private router: Router) {
        this.activeRoute = this.router.url || '/home';
    }

    ngOnInit(): void {
        // Set default to home if route is empty or root
        if (!this.activeRoute || this.activeRoute === '/') {
            this.activeRoute = '/home';
        }

        // Subscribe to router events to update active route
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.activeRoute = event.url || '/home';
        });
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    openAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    isActive(route: string): boolean {
        // Handle empty/root as home
        const currentRoute = this.activeRoute || '/home';

        // For home, check if it's root, /home or starts with /home
        if (route === '/home') {
            return currentRoute === '/' || currentRoute === '/home' || currentRoute.startsWith('/home');
        }

        // For other routes, check exact match or startsWith
        return currentRoute === route || currentRoute.startsWith(route);
    }
}
