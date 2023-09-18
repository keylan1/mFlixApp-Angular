import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


/** The API URL providing data for the client app. */
const apiUrl = 'https://flixapptime-44f9e1282e9e.herokuapp.com/'

/**
 * Service for fetching data from the API.
 */
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  /**
   * Constructor to inject the HttpClient module.
   * @param http - The HttpClient module.
   * Will provide HttpClient to the entire class, making it available via this.http
   */
  constructor(private http: HttpClient) {
  }

  /**
  * Registers a new user.
  * @param userDetails - The user details to register.
  * @returns An observable of the registration result.
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param credentials - The user credentials for login.
   * @returns An observable of the login result.
   */
  public userLogin(credentials: any): Observable<any> {
    console.log(credentials);
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets all movies.
   * @returns An observable of all movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
   * Gets a movie by its title.
   * @param title - The title of the movie.
   * @returns An observable of the movie data.
   */
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets the current user's data.
   * @returns An observable of the user's data.
   * || {} is a fallback
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Gets a director's data by name.
 * @param name - The name of the director.
 * @returns An observable of the director's data.
 */
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + name, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
   * Gets genre data by name.
   * @param name - The name of the genre.
   * @returns An observable of the genre data.
   */
  getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + name, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
  * Gets the user's favorite movies by username
  * @returns An observable of the user's favorite movies.
  */
  getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
  * Adds a movie to the user's favorites.
  * @param movieId - The ID of the movie to add.
  * @returns An observable of the updated user data.
  */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const apiEndpoint = `${apiUrl}users/${user.Username}/FavoriteMovies/${movieId}`

    return this.http.post(apiEndpoint, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
     * Deletes a movie from the user's favorites.
     * @param movieId - The ID of the movie to delete.
     * @returns An observable of the updated user data.
     */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // Use the filter method to create a new array without the movieID
    user.FavoriteMovies = user.FavoriteMovies.filter((id: string) => id !== movieId);
    // Update the user object in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/FavoriteMovies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
  * Edits user data.
  * @param userInfo - The updated user information.
  * @returns An observable of the updated user data.
  */
  editUser(userInfo: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.Username;
    const token = localStorage.getItem('token');
    console.log(userInfo);
    return this.http.put(apiUrl + 'users/' + username, userInfo, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes the user profile.
   * @returns An observable of the result of profile deletion.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.Username
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response data (non-typed).
   * @param res - The response data.
   * @returns The extracted response data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
  * Handles HTTP error responses.
  * @param error - The HTTP error response.
  * @returns An error message or an observable error.
  */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred: ', error.error.message);
    } else {
      console.error(`Error status code ${error.status},` + `Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later');
  }
}








