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
        this.activeRoute = this.router.url;
    }

    ngOnInit(): void {
        // Subscribe to router events to update active route
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.activeRoute = event.url;
        });
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    openAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    isActive(route: string): boolean {
        const active = this.activeRoute === route;
        return active;
    }
}
