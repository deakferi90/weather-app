import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  sunImg: string = 'assets/sun.svg';
  units: string = 'assets/units.png';
  arrowDown: string = 'assets/arrow-down.png';
}
