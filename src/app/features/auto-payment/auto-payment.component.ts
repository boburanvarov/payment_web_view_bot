import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auto-payment',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './auto-payment.component.html',
    styleUrl: './auto-payment.component.scss'
})
export class AutoPaymentComponent {
    constructor(private router: Router) { }

    goBack(): void {
        this.router.navigate(['/profile']);
    }
}
