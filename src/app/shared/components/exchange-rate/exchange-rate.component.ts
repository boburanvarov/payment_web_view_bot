import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../core/services/currency.service';
import { CurrencyPair } from '../../../core/models/currency.interfaces';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent implements OnInit {
  // Access signals from CurrencyService
  currencyData;
  currencyPairs;
  loading;
  pairsLoading;

  // Selected currency pair
  selectedPair = signal<CurrencyPair | null>(null);

  // Dropdown states
  showBaseDropdown = signal(false);
  showQuoteDropdown = signal(false);

  // Dropdown position (true = open downward, false = open upward)
  baseDropdownDown = signal(true);
  quoteDropdownDown = signal(true);

  // Input amounts
  baseAmount = signal<number>(1);
  quoteAmount = signal<number>(0);

  // Debounce subject for amount input
  private amountSubject = new Subject<{ value: number; type: 'base' | 'quote' }>();

  // Computed base currencies - depends on selected quote currency
  // If quote is UZS, show all non-UZS currencies
  // If quote is not UZS, show only UZS
  availableBaseCurrencies = computed(() => {
    const pairs = this.currencyPairs();
    const selectedQuote = this.selectedQuoteCurrency();
    const seen = new Set<string>();

    // If quote is UZS, show all non-UZS currencies
    if (selectedQuote === 'UZS') {
      return pairs.filter(pair => {
        if (pair.baseCurrency === 'UZS') return false;
        const key = pair.baseCurrency;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // If quote is not UZS, base can only be UZS (return one UZS entry)
    const uzsPair = pairs.find(pair => pair.baseCurrency === 'UZS');
    return uzsPair ? [uzsPair] : [];
  });

  // Computed quote currencies - depends on selected base currency
  // If base is UZS, show all non-UZS currencies
  // If base is not UZS, show only UZS (single entry)
  availableQuoteCurrencies = computed(() => {
    const pairs = this.currencyPairs();
    const selectedBase = this.selectedBaseCurrency();
    const seen = new Set<string>();

    // If base is UZS, show all non-UZS currencies
    if (selectedBase === 'UZS') {
      return pairs.filter(pair => {
        if (pair.baseCurrency === 'UZS') return false;
        const key = pair.baseCurrency;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // If base is not UZS, quote can only be UZS (return one UZS entry)
    const uzsPair = pairs.find(pair => pair.baseCurrency === 'UZS');
    return uzsPair ? [uzsPair] : [];
  });

  // Selected base currency code
  selectedBaseCurrency = signal<string>('USD');
  selectedQuoteCurrency = signal<string>('UZS');

  // Current offers from selected pair
  currentOffers = computed(() => {
    const pair = this.selectedPair();
    if (!pair) return [];
    return pair.offers || [];
  });

  constructor(public currencyService: CurrencyService) {
    this.currencyData = this.currencyService.currencyData;
    this.currencyPairs = this.currencyService.currencyPairs;
    this.loading = this.currencyService.loading;
    this.pairsLoading = this.currencyService.pairsLoading;

    // Setup debounce for amount changes
    this.amountSubject.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => prev.value === curr.value && prev.type === curr.type)
    ).subscribe(({ value, type }) => {
      this.calculateRate(value, type);
    });
  }

  ngOnInit(): void {
    // Load currency pairs from API
    this.currencyService.loadCurrencyPairs();

    // Load initial currency overview
    this.currencyService.loadCurrencyOverview('USD', 'UZS', 1);
  }

  formatNumber(value: number): string {
    if (value < 1) {
      return value.toFixed(6);
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  swapCurrencies(): void {
    // Swap selected currencies
    const tempBase = this.selectedBaseCurrency();
    const tempQuote = this.selectedQuoteCurrency();
    this.selectedBaseCurrency.set(tempQuote);
    this.selectedQuoteCurrency.set(tempBase);

    // Swap amounts
    const tempBaseAmount = this.baseAmount();
    const tempQuoteAmount = this.quoteAmount();
    this.baseAmount.set(tempQuoteAmount);
    this.quoteAmount.set(tempBaseAmount);

    // Update the pair and reload data
    this.updateSelectedPair();
    this.currencyService.loadCurrencyOverview(
      this.selectedBaseCurrency(),
      this.selectedQuoteCurrency(),
      this.baseAmount()
    );
  }

  onAmountChange(event: Event, type: 'base' | 'quote'): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value.replace(/\s/g, '')) || 0;

    if (type === 'base') {
      this.baseAmount.set(value);
    } else {
      this.quoteAmount.set(value);
    }

    this.amountSubject.next({ value, type });
  }

  calculateRate(amount: number, type: 'base' | 'quote'): void {
    const base = this.selectedBaseCurrency();
    const quote = this.selectedQuoteCurrency();

    if (type === 'base') {
      this.currencyService.loadCurrencyOverview(base, quote, amount);
    } else {
      // For quote input, we need to calculate base amount
      this.currencyService.getCurrencyOverview(quote, base, amount).subscribe(data => {
        if (data) {
          this.currencyService.currencyData.set({
            base: data.quote,
            quote: data.base,
            rate: 1 / data.rate,
            updatedAt: data.updatedAt,
            bestOffers: data.bestOffers
          });
        }
      });
    }
  }

  toggleBaseDropdown(event?: MouseEvent): void {
    if (!this.showBaseDropdown()) {
      // Calculate if should open down or up based on available space
      if (event) {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 240; // max-height of dropdown
        this.baseDropdownDown.set(spaceBelow >= dropdownHeight);
      }
    }
    this.showBaseDropdown.set(!this.showBaseDropdown());
    this.showQuoteDropdown.set(false);
  }

  toggleQuoteDropdown(event?: MouseEvent): void {
    if (!this.showQuoteDropdown()) {
      // Calculate if should open down or up based on available space
      if (event) {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 240; // max-height of dropdown
        this.quoteDropdownDown.set(spaceBelow >= dropdownHeight);
      }
    }
    this.showQuoteDropdown.set(!this.showQuoteDropdown());
    this.showBaseDropdown.set(false);
  }

  selectBaseCurrency(pair: CurrencyPair): void {
    this.selectedBaseCurrency.set(pair.baseCurrency);
    this.showBaseDropdown.set(false);

    // Only UZS <-> other currencies allowed
    // If selected base is not UZS, quote must be UZS
    if (pair.baseCurrency !== 'UZS') {
      this.selectedQuoteCurrency.set('UZS');
    } else {
      // If base is UZS, check if current quote is still valid (not UZS)
      if (this.selectedQuoteCurrency() === 'UZS') {
        // Set to first available non-UZS currency
        const availableCurrencies = this.availableQuoteCurrencies();
        if (availableCurrencies.length > 0) {
          this.selectedQuoteCurrency.set(availableCurrencies[0].baseCurrency);
        }
      }
    }

    this.updateSelectedPair();
    this.currencyService.loadCurrencyOverview(
      this.selectedBaseCurrency(),
      this.selectedQuoteCurrency(),
      this.baseAmount()
    );
  }

  selectQuoteCurrency(pair: CurrencyPair): void {
    this.selectedQuoteCurrency.set(pair.baseCurrency);
    this.selectedPair.set(pair);
    this.showQuoteDropdown.set(false);

    // Only UZS <-> other currencies allowed
    // If selected quote is not UZS, base must be UZS
    if (pair.baseCurrency !== 'UZS') {
      this.selectedBaseCurrency.set('UZS');
    } else {
      // If quote is UZS, check if current base is still valid (not UZS)
      if (this.selectedBaseCurrency() === 'UZS') {
        // Set to first available non-UZS currency
        const availableCurrencies = this.availableBaseCurrencies();
        if (availableCurrencies.length > 0) {
          this.selectedBaseCurrency.set(availableCurrencies[0].baseCurrency);
        }
      }
    }

    this.currencyService.loadCurrencyOverview(
      this.selectedBaseCurrency(),
      this.selectedQuoteCurrency(),
      this.baseAmount()
    );
  }

  updateSelectedPair(): void {
    const pairs = this.currencyPairs();
    const pair = pairs.find(
      p => p.baseCurrency === this.selectedBaseCurrency() && p.quoteCurrency === this.selectedQuoteCurrency()
    );
    this.selectedPair.set(pair || null);
  }

  closeDropdowns(): void {
    this.showBaseDropdown.set(false);
    this.showQuoteDropdown.set(false);
  }

  navigateToAll(): void {
    // Navigate to all currency rates page
    console.log('Navigate to all rates');
  }

  // Get current base flag and currency
  get currentBaseFlagUrl(): string {
    const data = this.currencyData();
    if (data) {
      return data.base.flagUrl;
    }
    return '';
  }

  get currentBaseCurrency(): string {
    const data = this.currencyData();
    if (data) {
      return data.base.currency;
    }
    return this.selectedBaseCurrency();
  }

  get currentQuoteFlagUrl(): string {
    const data = this.currencyData();
    if (data) {
      return data.quote.flagUrl;
    }
    return '';
  }

  get currentQuoteCurrency(): string {
    const data = this.currencyData();
    if (data) {
      return data.quote.currency;
    }
    return this.selectedQuoteCurrency();
  }

  get currentBaseAmount(): number | string {
    const data = this.currencyData();
    if (data) {
      return data.base.amount;
    }
    return this.baseAmount();
  }

  get currentQuoteAmount(): string {
    const data = this.currencyData();
    if (data) {
      return this.formatNumber(data.quote.amount);
    }
    return this.quoteAmount().toString();
  }
}

