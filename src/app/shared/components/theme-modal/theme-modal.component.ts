import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

@Component({
    selector: 'app-theme-modal',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './theme-modal.component.html',
    styleUrl: './theme-modal.component.scss'
})
export class ThemeModalComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() themeChange = new EventEmitter<ThemeMode>();

    private themeService = inject(ThemeService);

    selectedTheme: ThemeMode = 'light';

    themes = [
        { code: 'light' as ThemeMode, nameKey: 'theme.light', image: 'assets/img/light-mode.png' },
        { code: 'dark' as ThemeMode, nameKey: 'theme.dark', image: 'assets/img/dark-mode.png' }
    ];

    ngOnChanges(): void {
        if (this.isOpen) {
            this.selectedTheme = this.themeService.theme();
        }
    }

    selectTheme(theme: ThemeMode): void {
        this.selectedTheme = theme;
    }

    onSave(): void {
        this.themeService.setTheme(this.selectedTheme);
        this.themeChange.emit(this.selectedTheme);
        this.close.emit();
    }

    onClose(): void {
        this.close.emit();
    }

    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
