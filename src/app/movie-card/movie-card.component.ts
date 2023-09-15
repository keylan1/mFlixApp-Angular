import { Component, OnInit } from '@angular/core';
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

  movies: any[] = [];


  constructor(public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.movies = res;
      console.log(this.movies);
      return this.movies;
    });
  }

  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '400px',
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: director.Name,
        Bio: director.Bio,
      },
      width: '400px',
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Name,
        Description: genre.Description,
      },
      width: '400px',
    });
  }

  /*getFavorites(): void {
    this.fetchApiData.getUser().subscribe(
      (res: any) => {
        if (res.user && res.user.FavoriteMovies) {
          this.favorites = res.user.FavoriteMovies;
        } else {
          this.favorites = []; // Set an empty array if data is not available
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favorites = []; // Set an empty array on error as well
      }
    );
  }*/


  // Function to check if a movie is in favorites
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies && user.FavoriteMovies.includes(movieId);
  }


  // Function to add/remove movie to/from favorites
  toggleFavorite(movieId: string): void {

    // Check if the movie is already a favorite
    const isFavorite = this.isFavoriteMovie(movieId);

    // Toggle the favorite status of the movie
    if (isFavorite) {
      /*
      // Remove the movie from favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = user.FavoriteMovies.filter((id: string) => id !== movie._id);
      localStorage.setItem('user', JSON.stringify(user));
*/
      // Remove the movie from favorites on the backend server
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(
        () => {
          this.snackBar.open('Movie removed from favorites', 'OK', {
            duration: 2000,
          });
          // Update the local movies array to reflect the change
          const movie = this.movies.find((m) => m._id === movieId);
          if (movie) {
            movie.isFavorite = false;
          }
          /*
          // Update the local movies array to reflect the change
          movieId.isFavorite = false;*/
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
        }
      );
    } else {
      /*
      // Add the movie to favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies.push(movie);
      localStorage.setItem('user', JSON.stringify(user));
*/
      // Add the movie to favorites on the backend server
      this.fetchApiData.addFavoriteMovie(movieId).subscribe(
        () => {
          this.snackBar.open('Movie added to favorites', 'OK', {
            duration: 2000,
          });
          // Update the local movies array to reflect the change
          const movie = this.movies.find((m) => m._id === movieId);
          if (movie) {
            movie.isFavorite = true;
          }
          /*
          // Update the local movies array to reflect the change
          movieId.isFavorite = true;*/
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }


    // Update the local 'isFavorite' property to reflect the change
    //movie.isFavorite = !this.isFavoriteMovie(movie);
  }


  /*
  isFavorite(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.includes(movieId);
  }

  addFavorite(movieId: string): void {
    console.log(this.favorites)
    if (this.isFavorite(movieId)) {
       this.removeFavorite(movieId);
     }
     else {
    // Movie is not a favorite, so add it
    this.fetchApiData.addFavoriteMovie(movieId).subscribe(() => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.getFavorites();
    });

  }

  removeFavorite(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.Username;
      if (username !== null) {
        // Fetch the updated favorite movies data
        this.fetchApiData.getFavoriteMovies(username).subscribe((favorites: any) => {
          this.favorites = favorites;
        });
      }
    });
  }

  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFavorite(movieId);
    } else {
      this.addFavorite(movieId);
    }*/
}
