import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageModalComponent, Language } from '../../shared/components/language-modal/language-modal.component';
import { ThemeModalComponent } from '../../shared/components/theme-modal/theme-modal.component';
import { TranslateService, LanguageCode } from '../../core/services/translate.service';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LanguageModalComponent, ThemeModalComponent, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  showLanguageModal: boolean = false;
  showThemeModal: boolean = false;

  private themeService = inject(ThemeService);

  constructor(
    private router: Router,
    public translateService: TranslateService
  ) { }

  get currentLanguage(): string {
    return this.translateService.getLanguageName();
  }

  get currentLanguageCode(): LanguageCode {
    return this.translateService.currentLanguage();
  }

  get currentTheme(): string {
    const theme = this.themeService.theme();
    return this.translateService.get(theme === 'dark' ? 'theme.dark' : 'theme.light');
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  openLanguageSettings(): void {
    this.showLanguageModal = true;
  }

  onLanguageModalClose(): void {
    this.showLanguageModal = false;
  }

  onLanguageChange(language: Language): void {
    this.translateService.setLanguage(language.code as LanguageCode);
    console.log('Language changed to:', language);
  }

  openThemeSettings(): void {
    this.showThemeModal = true;
  }

  onThemeModalClose(): void {
    this.showThemeModal = false;
  }

  onThemeChange(theme: ThemeMode): void {
    console.log('Theme changed to:', theme);
  }
}
