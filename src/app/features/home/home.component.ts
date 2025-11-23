import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserData, Transaction } from '../../core/models';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    userData: UserData | null = null;
    recentTransactions: Transaction[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private transactionService: TransactionService
    ) { }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.userData = user;
        });

        this.transactionService.getTransactions().subscribe(transactions => {
            this.recentTransactions = transactions.slice(0, 5);
        });
    }

    navigateToAddTransaction(): void {
        this.router.navigate(['/add-transaction']);
    }

    navigateToOverview(): void {
        this.router.navigate(['/overview']);
    }
}
