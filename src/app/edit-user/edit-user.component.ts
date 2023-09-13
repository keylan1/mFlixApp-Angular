import { Component, Inject, Input, OnInit } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  //@Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  userData: any; // Define userData without @Input

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userData = data.userData; // Assign the userData passed from UserProfileComponent
  }

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
}
