import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './help.component.html',
    styleUrl: './help.component.scss'
})
export class HelpComponent {
    private router = inject(Router);

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    openChannel(): void {
        window.open('https://t.me/kartaxabar', '_blank');
    }

    openTelegramBot(): void {
        window.open('https://t.me/kartaxabar_bot', '_blank');
    }

    callSupport(): void {
        window.location.href = 'tel:+998500010034';
    }
}
