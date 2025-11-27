import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit {
  transactionType: 'income' | 'expense' = 'income';
  transactionTitle: string = '';
  transactionAmount: number = 0;
  transactionCategory: string = 'Salary';

  recentTransactions: any[] = []; // Temporary any type

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // No transactions service
    this.recentTransactions = [];
  }

  setTransactionType(type: 'income' | 'expense'): void {
    this.transactionType = type;
    this.transactionCategory = type === 'income' ? 'Salary' : 'Food';
  }

  get categories(): string[] {
    return this.transactionType === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  async addTransaction(): Promise<void> {
    if (!this.transactionTitle || this.transactionAmount <= 0) {
      return;
    }

    // TODO: Implement transaction API
    console.log('Transaction:', {
      type: this.transactionType,
      title: this.transactionTitle,
      amount: this.transactionAmount,
      category: this.transactionCategory
    });

    // Reset form
    this.transactionTitle = '';
    this.transactionAmount = 0;

    // Navigate back
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
