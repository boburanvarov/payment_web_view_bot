import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface FaqItem {
    id: number;
    questionUz: string;
    questionRu: string;
    questionEn: string;
    answerUz: string;
    answerRu: string;
    answerEn: string;
    displayOrder: number;
    active: boolean;
    isOpen?: boolean; // For UI state
}

@Injectable({
    providedIn: 'root'
})
export class FaqService {
    constructor(private http: HttpClient) { }

    /**
     * Get active FAQ items sorted by display order
     */
    getActiveFaqs(): Observable<FaqItem[]> {
        return this.http.get<FaqItem[]>(`${environment.apiUrl}/api/faqs?activeOnly=true`).pipe(
            map(data => {
                // Sort by displayOrder and add isOpen property (first item open by default)
                return data
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((item, index) => ({ ...item, isOpen: index === 0 }));
            })
        );
    }
}
