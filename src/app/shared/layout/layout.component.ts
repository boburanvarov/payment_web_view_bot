import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('contentArea') contentArea?: ElementRef<HTMLDivElement>;

  private routerSubscription?: Subscription;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // Scroll to top on every navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  ngAfterViewInit(): void {
    // Initial scroll to top
    this.scrollToTop();
  }

  private scrollToTop(): void {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      // Method 1: ViewportScroller
      this.viewportScroller.scrollToPosition([0, 0]);

      // Method 2: Window scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // Method 3: Document body/html
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // Method 4: Content area element
      if (this.contentArea?.nativeElement) {
        this.contentArea.nativeElement.scrollTop = 0;
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
