import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
