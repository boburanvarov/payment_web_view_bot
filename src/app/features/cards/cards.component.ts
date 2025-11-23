import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { CardService } from '../../core/services/card.service';
import { UserService } from '../../core/services/user.service';
import { Card } from '../../core/models';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];
  userName: string = 'User';

  constructor(
    private cardService: CardService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.cardService.getCards().subscribe(cards => {
      this.cards = cards;
    });

    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userName = user.firstName;
      }
    });
  }
}
