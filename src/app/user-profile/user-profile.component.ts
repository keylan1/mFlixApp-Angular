import { Component, Input } from '@angular/core';
// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


/**
 * Component for user profile.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent {
  user: any = {};
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''/*, FavoriteMovies: [''] */ };


  /**
  * Constructor to inject dependencies.
  * @param fetchApiData - The service for API calls.
  * @param snackBar - The snackBar service for displaying notifications.
  * @param dialog - The dialog service for displaying dialogs.
  * @param router - The router for navigation.
  */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router) { }

  /**
 * Lifecycle hook called when the component is initialized.
 */
  ngOnInit(): void {
    this.getUserProfile();
  }

  /**
   * Retrieves user profile data from the backend.
   */
  getUserProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      // Logic for a successful user registration goes here! (To be implemented)
      this.user = result;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday;
      this.favoriteMovies = this.user.FavoriteMovies;
      return this.user;
    });
  }

  /**
   * Edits the user profile.
   */
  editUserProfile(): void {
    console.log(this.userData);
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('Username', result.Username);
      this.snackBar.open('Successfully edited', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      console.log(result);
      this.snackBar.open('Error', 'OK', {
        duration: 2000
      });
    });
  }

  /**
  * Deletes the user profile.
  */
  deleteUserProfile(): void {
    if (confirm('are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        )
      });
      this.fetchApiData.deleteUser().subscribe(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
    };
  }
}
