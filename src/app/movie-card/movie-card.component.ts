import { Component, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';

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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.movies = res;
      console.log(this.movies);
      return this.movies;
    });
  }
  // Fetch user info and set favorites
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.favorites = this.user.FavoriteMovies;
      return this.favorites;
    });
  }


  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '300px',
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: director.Name,
        Bio: director.Bio,
      },
      width: '300px',
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Name,
        Description: genre.Description,
      },
      width: '300px',
    });
  }

  // check if a movie is a user's favorite
  isFavorite(id: string): boolean {
    return !!(this.favorites.find(favMovie => favMovie._id === id));
  }

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
