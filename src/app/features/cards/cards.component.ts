import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  // Access signals from CardService
  cards;
  totalBalance;
  loading;

  constructor(
    public cardService: CardService
  ) {
    // Initialize signal accessors in constructor
    this.cards = this.cardService.cards;
    this.totalBalance = this.cardService.totalBalance;
    this.loading = this.cardService.loading;
  }

  ngOnInit(): void {
    // Cards are already loaded in AppComponent
  }
}
