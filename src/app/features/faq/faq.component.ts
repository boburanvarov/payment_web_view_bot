import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { environment } from '../../../environments/environment';

interface FaqItem {
    id: number;
    questionUz: string;
    questionRu: string;
    questionEn: string;
    answerUz: string;
    answerRu: string;
    answerEn: string;
    displayOrder: number;
    active: boolean;
    isOpen?: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
    private router = inject(Router);
    private http = inject(HttpClient);
    private translateService = inject(TranslateService);

    faqItems = signal<FaqItem[]>([]);
    loading = signal(true);

    ngOnInit(): void {
        this.loadFaqs();
    }

    loadFaqs(): void {
        this.loading.set(true);
        this.http.get<FaqItem[]>(`${environment.apiUrl}/api/faqs?activeOnly=true`)
            .subscribe({
                next: (data) => {
                    // Sort by displayOrder and add isOpen property
                    const sorted = data
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((item, index) => ({ ...item, isOpen: index === 0 }));
                    this.faqItems.set(sorted);
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
