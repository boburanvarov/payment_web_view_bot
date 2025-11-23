import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './onboarding.component.html',
    styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {

    constructor(private router: Router) { }

    startApp(): void {
        this.router.navigate(['/home']);
    }
}
