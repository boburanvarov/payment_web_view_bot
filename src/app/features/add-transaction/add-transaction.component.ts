import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { UserService } from '../../core/services/user.service';
import { Transaction } from '../../core/models';
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

  recentTransactions: Transaction[] = [];

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.recentTransactions = transactions.slice(0, 4);
    });
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

    const userId = this.userService.getUserValue()?.userId || 0;

    await this.transactionService.addTransaction(userId, {
      type: this.transactionType,
      title: this.transactionTitle,
      amount: this.transactionAmount,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      icon: this.transactionType === 'income' ? '💵' : '💸',
      category: this.transactionCategory
    });

    // Update balance
    this.userService.updateBalance(this.transactionAmount, this.transactionType === 'income');

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
