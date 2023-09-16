import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';



//Declaring the api url that will provide data for the client app
const apiUrl = 'https://flixapptime-44f9e1282e9e.herokuapp.com/'

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //User login
  public userLogin(credentials: any): Observable<any> {
    console.log(credentials);
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  //get all movies
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

  //get one movie
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

  //get one user
  // || {} is a fallback
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

  //get director
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


  //get genre
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


  //get user's favorite movies
  // get an array of a user's favorite movies by username
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

  //add a movie to user's favorites
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

  //delete a movie from user's favorites
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


  //edit user data 
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

  //delete user profile 
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

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred: ', error.error.message);
    } else {
      console.error(`Error status code ${error.status},` + `Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later');
  }
}








