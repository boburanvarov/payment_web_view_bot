import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { UserService } from '../../core/services/user.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserData, WeeklyStat } from '../../core/models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  userData: UserData | null = null;
  activeTab: string = 'expense';

  weeklyStats: WeeklyStat[] = [
    { week: 'Week 1', income: 800, expenses: 600 },
    { week: 'Week 2', income: 950, expenses: 800 },
    { week: 'Week 3', income: 1100, expenses: 750 },
    { week: 'Week 4', income: 1050, expenses: 900 }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.userData = user;
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getMaxStat(): number {
    let max = 0;
    this.weeklyStats.forEach(stat => {
      if (stat.income > max) max = stat.income;
      if (stat.expenses > max) max = stat.expenses;
    });
    return max;
  }

  getBarHeight(value: number): number {
    const max = this.getMaxStat();
    return (value / max) * 100;
  }
}
