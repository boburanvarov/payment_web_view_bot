import { Component, OnInit, NgZone, inject } from '@angular/core';
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
    activeRoute: string = '/home';
    private ngZone = inject(NgZone);

    constructor(private router: Router) { }

    ngOnInit(): void {
        // Get initial route with fallback to /home
        this.updateActiveRoute(this.router.url);

        // Subscribe to router events to update active route
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.ngZone.run(() => {
                this.updateActiveRoute(event.url);
            });
        });
    }

    private updateActiveRoute(url: string): void {
        if (!url || url === '/' || url === '') {
            this.activeRoute = '/home';
        } else {
            this.activeRoute = url;
        }
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    openAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    isActive(route: string): boolean {
        // Handle empty/root as home
        if (!this.activeRoute || this.activeRoute === '/' || this.activeRoute === '') {
            return route === '/home';
        }

        // For home, check if it's root or /home
        if (route === '/home') {
            return this.activeRoute === '/' || this.activeRoute === '/home' || this.activeRoute.startsWith('/home');
        }

        // For other routes, check startsWith to handle query params
        return this.activeRoute === route || this.activeRoute.startsWith(route);
    }
}
