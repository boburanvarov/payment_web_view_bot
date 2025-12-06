import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../core/services/currency.service';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent implements OnInit {
  // Access signals from CurrencyService (will be initialized in constructor)
  currencyData;
  loading;

  constructor(public currencyService: CurrencyService) {
    this.currencyData = this.currencyService.currencyData;
    this.loading = this.currencyService.loading;
  }

  ngOnInit(): void {
    this.currencyService.loadCurrencyOverview(1);
  }

  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  swapCurrencies(): void {
    // Swap logic can be implemented here if needed
    console.log('Swap currencies');
  }

  navigateToAll(): void {
    // Navigate to all currency rates page
    console.log('Navigate to all rates');
  }
}

