import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface FaqItem {
    question: string;
    answer: string;
    isOpen: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent {
    faqItems: FaqItem[] = [
        {
            question: 'Qanday qilib kartani qo\'shish mumkin?',
            answer: 'Kartalarni qo\'shish uchun "Kartalar" bo\'limiga o\'ting va "+ Karta qo\'shish" tugmasini bosing.',
            isOpen: false
        },
        {
            question: 'Avto to\'lov qanday ishlaydi?',
            answer: 'Avto to\'lov sizning belgilagan muddatingizda avtomatik ravishda to\'lovlarni amalga oshiradi.',
            isOpen: false
        },
        {
            question: 'Premium obuna nima imkoniyatlar beradi?',
            answer: 'Premium obuna bilan siz kengaytirilgan statistika, cheklanmagan tranzaksiyalar tarixi va maxsus takliflardan foydalanishingiz mumkin.',
            isOpen: false
        },
        {
            question: 'Xavfsizlik kodi nima uchun kerak?',
            answer: 'Xavfsizlik kodi sizning hisobingizni himoya qiladi va ruxsatsiz kirishlardan saqlaydi.',
            isOpen: false
        }
    ];

    constructor(private router: Router) { }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    toggleFaq(index: number): void {
        this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
    }
}
