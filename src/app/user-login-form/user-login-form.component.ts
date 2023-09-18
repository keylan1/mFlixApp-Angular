import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for the user login form.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  /**
   * Input property for user data, including Username and Password.
   */
  @Input() userData = { Username: '', Password: '' };

  /**
  * Constructor for UserLoginFormComponent.
  *
  * @param fetchApiData - Service for fetching data from the API.
  * @param dialogRef - Reference to the MatDialog for managing the dialog.
  * @param snackBar - Service for displaying snack bar notifications.
  * @param router - Angular router for navigation.
  */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router) { }

  /**
* Lifecycle hook called after component initialization.
*/
  ngOnInit(): void {
  }

  /**
   * Function to send form inputs to the backend for user login.
   */
  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      localStorage.setItem('Username', result.user.Username);

      this.dialogRef.close(); //Will close modal on success
      console.log(result);
      this.snackBar.open('Successfully logged in', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (result) => {
      console.log(result);
      this.snackBar.open(`Sorry, user doesn't exist or you made a mistake`, 'OK', {
        duration: 2000
      });
    });

  }
}
