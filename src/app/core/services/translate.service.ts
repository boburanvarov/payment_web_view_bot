import { Injectable, signal, computed, inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PrimeNG } from 'primeng/config';

export type LanguageCode = 'uz' | 'ru' | 'en';

@Injectable({
    providedIn: 'root'
})
export class TranslateService {
    private translations = signal<Record<string, any>>({});
    private currentLang = signal<LanguageCode>('uz');
    private primeNG = inject(PrimeNG);

    // Public signal for current language
    currentLanguage = computed(() => this.currentLang());

    constructor(private http: HttpClient) {
        this.initLanguage();
    }

    private initLanguage(): void {
        // Try to get saved language from localStorage
        const savedLang = localStorage.getItem('language') as LanguageCode;
        if (savedLang && ['uz', 'ru', 'en'].includes(savedLang)) {
            this.loadTranslations(savedLang);
        } else {
            this.loadTranslations('uz');
        }
    }

    async loadTranslations(lang: LanguageCode): Promise<void> {
        try {
            const translations = await firstValueFrom(
                this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`)
            );
            this.translations.set(translations);
            this.currentLang.set(lang);
            localStorage.setItem('language', lang);

            // Update PrimeNG locale for DatePicker
            this.updatePrimeNGLocale(lang, translations);
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    private updatePrimeNGLocale(lang: LanguageCode, translations: Record<string, any>): void {
        const months = translations['months'];
        const days = translations['days'];

        if (months && days) {
            this.primeNG.setTranslation({
                dayNames: [
                    days.sunday,
                    days.monday,
                    days.tuesday,
                    days.wednesday,
                    days.thursday,
                    days.friday,
                    days.saturday
                ],
                dayNamesShort: [
                    days.short.sun,
                    days.short.mon,
                    days.short.tue,
                    days.short.wed,
                    days.short.thu,
                    days.short.fri,
                    days.short.sat
                ],
                dayNamesMin: [
                    days.short.sun,
                    days.short.mon,
                    days.short.tue,
                    days.short.wed,
                    days.short.thu,
                    days.short.fri,
                    days.short.sat
                ],
                monthNames: [
                    months.january,
                    months.february,
                    months.march,
                    months.april,
                    months.may,
                    months.june,
                    months.july,
                    months.august,
                    months.september,
                    months.october,
                    months.november,
                    months.december
                ],
                monthNamesShort: [
                    months.short.jan,
                    months.short.feb,
                    months.short.mar,
                    months.short.apr,
                    months.short.may,
                    months.short.jun,
                    months.short.jul,
                    months.short.aug,
                    months.short.sep,
                    months.short.oct,
                    months.short.nov,
                    months.short.dec
                ],
                today: translations['common']?.['today'] || 'Today',
                clear: translations['common']?.['reset'] || 'Clear',
                apply: translations['common']?.['apply'] || 'Apply'
            });
        }
    }

    setLanguage(lang: LanguageCode): void {
        this.loadTranslations(lang);
    }

    /**
     * Get translation by key path (e.g., 'common.save', 'profile.title')
     */
    get(key: string): string {
        const keys = key.split('.');
        let result: any = this.translations();

        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return typeof result === 'string' ? result : key;
    }

    /**
     * Get translation as signal for reactive updates
     */
    getSignal(key: string) {
        return computed(() => this.get(key));
    }

    /**
     * Get current language display name
     */
    getLanguageName(): string {
        switch (this.currentLang()) {
            case 'uz': return 'O\'zbek';
            case 'ru': return 'Русский';
            case 'en': return 'English';
            default: return 'O\'zbek';
        }
    }
}
