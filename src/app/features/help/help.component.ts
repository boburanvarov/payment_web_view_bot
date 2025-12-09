import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './help.component.html',
    styleUrl: './help.component.scss'
})
export class HelpComponent {
    constructor(private router: Router) { }

    goBack(): void {
        this.router.navigate(['/profile']);
    }

    openTelegram(): void {
        window.open('https://t.me/support', '_blank');
    }

    callSupport(): void {
        window.location.href = 'tel:+998712000000';
    }
}
