import { Component, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';

/**
 * Component responsible for displaying movie cards and managing user interactions with them.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

//implement OnInit more convention and declaring to Angular that ngOnInit will occur. 
export class MovieCardComponent {
  user: any = {};
  movies: any[] = [];
  favorites: any[] = [];

  constructor(public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  /**
  * Retrieves a list of all movies and stores them in the 'movies' array.
  */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.movies = res;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Fetches user information and sets the 'favorites' array.
   */
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.favorites = this.user.FavoriteMovies;
      return this.favorites;
    });
  }

  /**
   * Opens a dialog displaying movie synopsis.
   * @param title - The movie's title.
   * @param description - The movie's description.
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '300px',
    });
  }

  /**
 * Opens a dialog displaying director information.
 * @param director - The director's data.
 */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: director.Name,
        Bio: director.Bio,
      },
      width: '300px',
    });
  }

  /**
   * Opens a dialog displaying genre information.
   * @param genre - The genre's data.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Name,
        Description: genre.Description,
      },
      width: '300px',
    });
  }

  /**
  * Checks if a movie is in the user's favorites.
  * @param id - The ID of the movie to check.
  * @returns True if the movie is a favorite, false otherwise.
  */
  isFavorite(id: string): boolean {
    return !!(this.favorites.find(favMovie => favMovie._id === id));
  }

  /**
     * Toggles a movie's favorite status for the current user.
     * @param id - The ID of the movie to toggle.
     */
  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      // Remove the movie from favorites
      this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
        this.ngOnInit(); // You may want to update the UI after removal
      });
    } else {
      // Add the movie to favorites
      this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        this.ngOnInit(); // You may want to update the UI after addition
      });
    }
  }

}
