import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss'
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  @Input() banners: Banner[] = [];

  currentIndex: number = 0;

  touchStartX: number = 0;
  touchEndX: number = 0;

  mouseStartX: number = 0;
  mouseEndX: number = 0;
  isDragging: boolean = false;

  ngOnInit(): void {
    // Component initialized
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Touch events (mobile)
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  // Mouse events (desktop)
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.mouseStartX = event.clientX;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.mouseEndX = event.clientX;
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.mouseEndX = event.clientX;
    this.handleMouseDrag();
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  handleMouseDrag() {
    const dragThreshold = 50;
    const diff = this.mouseStartX - this.mouseEndX;

    if (Math.abs(diff) > dragThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  next() {
    if (this.currentIndex < this.banners.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToBanner(index: number) {
    this.currentIndex = index;
  }

  getTransformValue(): number {
    const bannerWidth = 295; // 283px width + 12px gap
    return -this.currentIndex * bannerWidth;
  }
}

