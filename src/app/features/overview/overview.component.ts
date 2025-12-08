import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ReportCardComponent } from '../../shared/components/report-card/report-card.component';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionFilterType } from '../../core/models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, ReportCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
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
    this.transactionService.loadOverviewTransactions(TransactionFilterType.ALL, 0, 20);
  }

  ngOnDestroy(): void {
    // Reset filter state without triggering API call
    this.transactionService.selectedFilterType.set(TransactionFilterType.ALL);
    this.transactionService.selectedStartDate.set(null);
    this.transactionService.selectedEndDate.set(null);
    this.transactionService.selectedCardId.set(null);
    this.transactionService.currentPage.set(0);
    this.transactionService.hasMore.set(true);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
