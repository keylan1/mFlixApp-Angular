import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Represents the navigation bar component.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  /**
 * Constructs a new NavBarComponent.
 * @param router - The router service for navigation.
 */
  constructor(
    public router: Router
  ) { }

  ngOnInit(): void { }

  /**
  * Navigate to the user profile page.
  */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Navigate to the movies page.
   */
  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Logout and navigate to the welcome page.
   */
  logout(): void {
    this.router.navigate(['welcome']);
  }
}
