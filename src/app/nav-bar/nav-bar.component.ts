import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(
    public router: Router
  ) { }
  ngOnInit(): void { }

  toProfile(): void {
    this.router.navigate(['profile']);
  }

  toMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
  }
}
