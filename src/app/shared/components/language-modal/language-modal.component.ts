import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface Language {
    code: string;
    nameKey: string;
    flag: string;
}

@Component({
    selector: 'app-language-modal',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './language-modal.component.html',
    styleUrl: './language-modal.component.scss'
})
export class LanguageModalComponent {
    @Input() isOpen: boolean = false;
    @Input() currentLanguage: string = 'uz';
    @Output() close = new EventEmitter<void>();
    @Output() languageChange = new EventEmitter<Language>();

    selectedLanguage: string = 'uz';

    languages: Language[] = [
        { code: 'uz', nameKey: 'language.uzbek', flag: 'assets/img/uz.png' },
        { code: 'ru', nameKey: 'language.russian', flag: 'assets/img/ru.png' },
        { code: 'en', nameKey: 'language.english', flag: 'assets/img/en.png' }
    ];

    ngOnChanges(): void {
        this.selectedLanguage = this.currentLanguage;
    }

    selectLanguage(code: string): void {
        this.selectedLanguage = code;
    }

    saveLanguage(): void {
        const selected = this.languages.find(l => l.code === this.selectedLanguage);
        if (selected) {
            this.languageChange.emit(selected);
        }
        this.closeModal();
    }

    closeModal(): void {
        this.close.emit();
    }

    onBackdropClick(event: Event): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.closeModal();
        }
    }
}
