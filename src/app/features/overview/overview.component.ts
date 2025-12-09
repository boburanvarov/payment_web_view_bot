import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ReportCardComponent } from '../../shared/components/report-card/report-card.component';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionFilterType, OverviewReportResponse } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, ReportCardComponent, TranslatePipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
  // Local data for template
  overviewData: OverviewReportResponse | null = null;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    // Clear any card filter from home page
    this.transactionService.selectedCardId.set(null);

    // Subscribe to service signals and load data
    this.isLoading = true;
    this.transactionService.loadOverviewTransactions(TransactionFilterType.ALL, 0, 20);

    // Watch for data changes
    this.checkDataLoaded();
  }

  private checkDataLoaded(): void {
    const interval = setInterval(() => {
      const report = this.transactionService.overviewReport();
      const loading = this.transactionService.overviewLoading();

      if (report) {
        this.overviewData = report;
        this.isLoading = false;
        clearInterval(interval);
      } else if (!loading && !report) {
        this.isLoading = false;
        clearInterval(interval);
      }
    }, 50);

    // Clear after 10 seconds max
    setTimeout(() => clearInterval(interval), 10000);
  }

  // Getter for template to access current report
  get overviewReport() {
    return this.transactionService.overviewReport;
  }

  get loading() {
    return this.transactionService.overviewLoading;
  }

  ngOnDestroy(): void {
    // Reset filter state only (no API call)
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

  navigateToChart(): void {
    this.router.navigate(['/chart']);
  }
}
