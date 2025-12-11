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

  // Auto-rotation interval
  private autoRotateInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_ROTATE_DELAY = 10000; // 10 seconds

  ngOnInit(): void {
    // Start auto-rotation
    this.startAutoRotate();
  }

  ngOnDestroy(): void {
    // Stop auto-rotation on component destroy
    this.stopAutoRotate();
  }

  private startAutoRotate(): void {
    this.stopAutoRotate(); // Clear any existing interval
    this.autoRotateInterval = setInterval(() => {
      this.nextWithLoop();
    }, this.AUTO_ROTATE_DELAY);
  }

  private stopAutoRotate(): void {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  private resetAutoRotate(): void {
    // Reset the timer when user interacts
    this.startAutoRotate();
  }

  // Next with loop (for auto-rotation)
  private nextWithLoop(): void {
    if (this.banners.length === 0) return;

    if (this.currentIndex < this.banners.length - 1) {
      this.currentIndex++;
    } else {
      // Loop back to first banner
      this.currentIndex = 0;
    }
  }

  // Touch events (mobile)
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.stopAutoRotate(); // Pause on user interaction
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
    this.resetAutoRotate(); // Resume after interaction
  }

  // Mouse events (desktop)
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.mouseStartX = event.clientX;
    this.stopAutoRotate(); // Pause on user interaction
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
    this.resetAutoRotate(); // Resume after interaction
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
    this.resetAutoRotate(); // Reset timer on manual navigation
  }

  getTransformValue(): number {
    const bannerWidth = 283; // Banner width
    const bannerGap = 10; // Gap between banners
    return -this.currentIndex * (bannerWidth + bannerGap);
  }
}
