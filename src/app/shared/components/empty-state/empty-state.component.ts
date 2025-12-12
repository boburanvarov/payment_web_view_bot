import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
    @Input() imageSrc: string = 'assets/img/transaction-empty.png';
    @Input() imageAlt: string = 'No data';
    @Input() message: string = 'common.noData';
    @Input() useTranslate: boolean = true;
}
