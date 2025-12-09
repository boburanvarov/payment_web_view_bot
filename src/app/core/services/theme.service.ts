import { Injectable, signal, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private currentTheme = signal<ThemeMode>('light');

    // Public signal for current theme
    theme = computed(() => this.currentTheme());

    constructor() {
        this.initTheme();
    }

    private initTheme(): void {
        // Try to get saved theme from localStorage
        const savedTheme = localStorage.getItem('theme') as ThemeMode;
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('light');
        }
    }

    setTheme(theme: ThemeMode): void {
        this.currentTheme.set(theme);
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
    }

    private applyTheme(theme: ThemeMode): void {
        const body = document.body;

        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }

    toggleTheme(): void {
        const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    isDarkMode(): boolean {
        return this.currentTheme() === 'dark';
    }
}
