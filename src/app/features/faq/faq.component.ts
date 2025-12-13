import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FaqService, FaqItem } from '../../core/services/faq.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, TranslatePipe, EmptyStateComponent, LoadingStateComponent],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
    private router = inject(Router);
    private faqService = inject(FaqService);
    private translateService = inject(TranslateService);

    faqItems = signal<FaqItem[]>([]);
    loading = signal(true);

    ngOnInit(): void {
        this.loadFaqs();
    }

    loadFaqs(): void {
        this.loading.set(true);
        this.faqService.getActiveFaqs().subscribe({
            next: (data) => {
                this.faqItems.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading FAQs:', err);
                this.loading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    toggleFaq(index: number): void {
        const items = this.faqItems();
        const updated = items.map((item, i) => ({
            ...item,
            isOpen: i === index ? !item.isOpen : false
        }));
        this.faqItems.set(updated);
    }

    getQuestion(item: FaqItem): string {
        const lang = this.translateService.currentLanguage();
        switch (lang) {
            case 'ru':
                return item.questionRu;
            case 'en':
                return item.questionEn;
            default:
                return item.questionUz;
        }
    }

    getAnswer(item: FaqItem): string {
        const lang = this.translateService.currentLanguage();
        switch (lang) {
            case 'ru':
                return item.answerRu;
            case 'en':
                return item.answerEn;
            default:
                return item.answerUz;
        }
    }
}
