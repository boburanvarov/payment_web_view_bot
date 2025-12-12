import { Component, Output, EventEmitter, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pull-to-refresh',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pull-to-refresh.component.html',
    styleUrl: './pull-to-refresh.component.scss'
})
export class PullToRefreshComponent {
    @Output() refresh = new EventEmitter<void>();

    isPulling = signal(false);
    isRefreshing = signal(false);
    pullDistance = signal(0);

    private startY = 0;
    private readonly THRESHOLD = 80; // pixels to trigger refresh

    onTouchStart(event: TouchEvent): void {
        if (window.scrollY === 0) {
            this.startY = event.touches[0].clientY;
            this.isPulling.set(true);
        }
    }

    onTouchMove(event: TouchEvent): void {
        if (!this.isPulling() || this.isRefreshing()) return;

        const currentY = event.touches[0].clientY;
        const distance = currentY - this.startY;

        if (distance > 0 && window.scrollY === 0) {
            // Limit pull distance with resistance
            const pullDistance = Math.min(distance * 0.5, this.THRESHOLD * 1.5);
            this.pullDistance.set(pullDistance);
        }
    }

    onTouchEnd(): void {
        if (!this.isPulling()) return;

        if (this.pullDistance() >= this.THRESHOLD) {
            this.triggerRefresh();
        } else {
            this.resetPull();
        }
    }

    private triggerRefresh(): void {
        this.isRefreshing.set(true);
        this.pullDistance.set(this.THRESHOLD);
        this.refresh.emit();

        // Auto reset after 2 seconds (parent should call completeRefresh sooner)
        setTimeout(() => {
            this.completeRefresh();
        }, 2000);
    }

    completeRefresh(): void {
        this.isRefreshing.set(false);
        this.resetPull();
    }

    private resetPull(): void {
        this.isPulling.set(false);
        this.pullDistance.set(0);
    }
}
