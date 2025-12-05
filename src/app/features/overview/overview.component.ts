import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ReportCardComponent } from '../../shared/components/report-card/report-card.component';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, ReportCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  // Access signals from TransactionService (will be initialized in constructor)
  overviewReport;
  loading;

  constructor(
    private router: Router,
    public transactionService: TransactionService
  ) {
    this.overviewReport = this.transactionService.overviewReport;
    this.loading = this.transactionService.overviewLoading;
  }

  ngOnInit(): void {
    this.transactionService.loadOverviewTransactions('ALL', 0, 20);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
