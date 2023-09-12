import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mFlixApp-Angular-client';
  constructor(public dialog: MatDialog) { }
  // This is the function that will open the dialog when the signup button is clicked  

  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '600px'
    });
  }
}
