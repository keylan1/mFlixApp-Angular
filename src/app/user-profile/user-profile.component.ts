import { Component, Input } from '@angular/core';
// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent {
  user: any = {};
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''/*, FavoriteMovies: [''] */ };

  constructor(
    public fetchApiData: FetchApiDataService,
    //public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.getUserProfile();
  }
  // This is the function responsible for sending the form inputs to the backend
  getUserProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      // Logic for a successful user registration goes here! (To be implemented)
      this.user = result;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday;

      this.fetchApiData.getFavoriteMovies(this.userData.Username).subscribe((res) => {
        this.favoriteMovies = res;
      })
    });
  }

  openEditUserProfileDialog(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '280px',
      data: { userData: this.userData } // Pass user data to the EditUserComponent
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle any data returned from the dialog if needed
      console.log('Dialog closed with result:', result);
    });
  }

}
