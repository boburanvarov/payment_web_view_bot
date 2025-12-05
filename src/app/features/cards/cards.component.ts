import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { BankCardComponent } from '../../shared/components/bank-card/bank-card.component';
import { CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, BankCardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  // Access signals from CardService
  cards;
  totalBalance;
  loading;

  constructor(
    public cardService: CardService,
    public router: Router
  ) {
    // Initialize signal accessors in constructor
    this.cards = this.cardService.cards;
    this.totalBalance = this.cardService.totalBalance;
    this.loading = this.cardService.loading;
  }

  ngOnInit(): void {
    // Cards are already loaded in AppComponent
  }

  addCard(): void {
    // Navigate to add card page or show add card modal
    this.router.navigate(['/add-transaction']);
  }
}
